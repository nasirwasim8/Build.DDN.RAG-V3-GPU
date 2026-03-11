#!/usr/bin/env bash
# =============================================================================
# deploy.sh — DDN Infinia RAG Demo · OCI Production Deploy
# =============================================================================
# Confirmed working on: OCI Ubuntu 22.04, ubuntu@159.54.182.181
# SSH key:              ~/.ssh/cluster1_key
# Deploy path:          /home/ubuntu/infinia-rag-demo-v2
# Backend port:         8000  (uvicorn, main:app)
# Frontend port:        5174  (vite dev server)
# PM2 approach:         bash wrapper (NOT direct uvicorn binary)
#
# Pinned dependency stack (resolves all version conflicts):
#   torch              2.1.2+cu118 (GPU) or 2.1.2+cpu
#   numpy              <2          (torch binary requires NumPy 1.x)
#   transformers       4.49.0      (compatible with torch 2.1.2)
#   huggingface-hub    0.36.2      (compatible with langchain-huggingface 0.1.x)
#   langchain          0.3.25
#   langchain-core     0.3.59
#   langchain-community 0.3.23
#   langchain-huggingface 0.1.2
#
# Usage (run directly on the server):
#   bash deploy.sh
# =============================================================================

set -e

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'

log()    { echo -e "${CYAN}[INFO]${NC}  $1"; }
ok()     { echo -e "${GREEN}[OK]${NC}    $1"; }
warn()   { echo -e "${YELLOW}[WARN]${NC}  $1"; }
err()    { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }
banner() { echo -e "\n${BOLD}── $1 ──────────────────────────────────────────${NC}"; }

# ── Config ────────────────────────────────────────────────────────────────────
REPO_URL="https://github.com/nasirwasim8/Build.DDN.RAG-V3-GPU.git"
APP_DIR="/home/ubuntu/infinia-rag-demo-v2"
BACKEND_DIR="$APP_DIR/backend"
FRONTEND_DIR="$APP_DIR/frontend"
LOGS_DIR="$APP_DIR/logs"
VENV="$BACKEND_DIR/venv"
BACKEND_PORT=8000
FRONTEND_PORT=5174
SERVER_IP=$(hostname -I | awk '{print $1}')

echo ""
echo -e "${BOLD}============================================================${NC}"
echo -e "${BOLD}   DDN Infinia RAG Demo — OCI Production Deploy${NC}"
echo -e "${BOLD}============================================================${NC}"
echo ""

# =============================================================================
# PHASE 1 — Wipe existing install
# =============================================================================
banner "PHASE 1: Clean Slate"

log "Stopping any running PM2 processes..."
pm2 stop all  2>/dev/null || true
pm2 delete all 2>/dev/null || true
pm2 flush     2>/dev/null || true
ok "PM2 cleared."

log "Removing existing application directory..."
rm -rf "$APP_DIR"
ok "Removed $APP_DIR"

# =============================================================================
# PHASE 2 — Prerequisites
# =============================================================================
banner "PHASE 2: Prerequisites"

# ── Node.js 20 ────────────────────────────────────────────────────────────────
# NOTE: libnode-dev (Ubuntu default) conflicts with nodesource Node 20.
# Must remove it first before upgrading.
if node --version 2>/dev/null | grep -qv "^v2[0-9]"; then
    log "Upgrading Node.js to v20 LTS..."
    sudo apt-get remove -y libnode-dev 2>/dev/null || true
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi
ok "node: $(node --version)  npm: $(npm --version)"

# ── PM2 ───────────────────────────────────────────────────────────────────────
if ! command -v pm2 &>/dev/null; then
    log "Installing PM2..."
    # Try without sudo first (nvm installs), fall back to sudo
    if npm install -g pm2 2>/dev/null; then
        ok "PM2 installed (no sudo)."
    else
        sudo npm install -g pm2
        ok "PM2 installed (via sudo)."
    fi
    export PATH="$HOME/.npm-global/bin:$(npm prefix -g)/bin:$PATH"
fi
ok "pm2: $(pm2 --version)"

# ── Python 3.10+ ──────────────────────────────────────────────────────────────
PYTHON_BIN=""
for candidate in python3.10 python3.11 python3.12 python3; do
    if command -v "$candidate" &>/dev/null; then
        PY_MAJ=$("$candidate" -c "import sys; print(sys.version_info.major)" 2>/dev/null || true)
        PY_MIN=$("$candidate" -c "import sys; print(sys.version_info.minor)" 2>/dev/null || true)
        if [ "$PY_MAJ" -eq 3 ] && [ "$PY_MIN" -ge 10 ]; then
            PYTHON_BIN="$candidate"; break
        fi
    fi
done
[ -z "$PYTHON_BIN" ] && err "Python 3.10+ not found. Run: sudo apt-get install -y python3.10 python3.10-venv"
ok "Python: $($PYTHON_BIN --version)"

# =============================================================================
# PHASE 3 — Clone repository
# =============================================================================
banner "PHASE 3: Clone Repository"

log "Cloning $REPO_URL ..."
git clone "$REPO_URL" "$APP_DIR"
ok "Repository cloned to $APP_DIR"

# =============================================================================
# PHASE 4 — Patch code (server-side fixes not yet in GitHub)
# =============================================================================
banner "PHASE 4: Code Patches"

# Fix: routes.py calls VectorStore(storage_ops_tracker=...) but older vector_store.py
# doesn't have that parameter. Patch it if missing.
VSTORE="$BACKEND_DIR/app/services/vector_store.py"
if grep -q "def __init__(self, embedding_model_name" "$VSTORE" && \
   ! grep -q "storage_ops_tracker" "$VSTORE"; then
    log "Patching vector_store.py — adding storage_ops_tracker param..."
    sed -i 's/def __init__(self, embedding_model_name: str = None, providers: List\[str\] = None):/def __init__(self, embedding_model_name: str = None, providers: List[str] = None, storage_ops_tracker=None):/' "$VSTORE"
    ok "vector_store.py patched."
else
    ok "vector_store.py already up to date."
fi

# =============================================================================
# PHASE 5 — Backend dependencies (pinned compatible stack)
# =============================================================================
banner "PHASE 5: Backend Dependencies"

cd "$BACKEND_DIR"
log "Creating Python virtual environment..."
$PYTHON_BIN -m venv venv
source venv/bin/activate
pip install --upgrade pip

# ── GPU detection ──────────────────────────────────────────────────────────────
if command -v nvidia-smi &>/dev/null && nvidia-smi &>/dev/null; then
    GPU=$(nvidia-smi --query-gpu=name --format=csv,noheader 2>/dev/null | head -1 || true)
    ok "GPU detected: $GPU — installing CUDA PyTorch (cu118)"
    TORCH_INDEX="--index-url https://download.pytorch.org/whl/cu118"
else
    warn "No GPU detected — installing CPU PyTorch"
    TORCH_INDEX=""
fi

# ── Step 1: PyTorch (pinned — anchors the entire dependency graph) ─────────────
log "Step 1/5 — PyTorch 2.1.2 (pinned)..."
pip install torch==2.1.2 torchvision torchaudio $TORCH_INDEX
ok "PyTorch: $(python -c 'import torch; print(torch.__version__)')"

# ── Step 2: NumPy 1.x (torch 2.1.2 binaries require NumPy<2) ─────────────────
log "Step 2/5 — NumPy <2 (required by torch 2.1.2 CUDA binaries)..."
pip install "numpy<2"
ok "NumPy: $(python -c 'import numpy; print(numpy.__version__)')"

# ── Step 3: sentence-transformers + faiss ─────────────────────────────────────
log "Step 3/5 — sentence-transformers + faiss-cpu..."
pip install sentence-transformers faiss-cpu
ok "sentence-transformers + faiss-cpu installed."

# ── Step 4: Pinned LangChain + HuggingFace stack ─────────────────────────────
# Pin the entire 0.3.x langchain ecosystem + transformers 4.49.0 + huggingface-hub<1.0
# These versions are all mutually compatible (validated on OCI Ubuntu 22.04)
log "Step 4/5 — LangChain + HuggingFace stack (pinned compatible versions)..."
pip install \
    "langchain==0.3.25" \
    "langchain-core==0.3.59" \
    "langchain-community==0.3.23" \
    "langchain-text-splitters==0.3.8" \
    "langchain-huggingface==0.1.2" \
    "transformers>=4.30.0,<4.50.0" \
    "huggingface-hub>=0.33.4,<1.0.0" \
    --use-deprecated=legacy-resolver
ok "LangChain + HuggingFace stack installed."

# ── Step 5: Remaining packages ────────────────────────────────────────────────
log "Step 5/5 — Remaining packages from requirements.txt..."
# Exclude torch (already pinned) and packages we've already installed
grep -vE "^(torch|numpy|sentence.transformers|faiss|langchain|transformers|huggingface)" \
    requirements.txt > /tmp/req_remaining.txt
pip install -r /tmp/req_remaining.txt --use-deprecated=legacy-resolver
rm /tmp/req_remaining.txt
ok "All backend dependencies installed."

# ── Verify import ─────────────────────────────────────────────────────────────
log "Verifying backend can load..."
python -c "import main; print('Entry point main.py: OK')" 2>/dev/null || \
    err "Backend import check failed — review errors above before continuing."
ok "Backend import verified."

deactivate

# =============================================================================
# PHASE 6 — Frontend
# =============================================================================
banner "PHASE 6: Frontend Dependencies"

cd "$FRONTEND_DIR"
log "npm install..."
npm install
ok "Frontend dependencies installed."

# Confirm vite is available
[ -f "$FRONTEND_DIR/node_modules/.bin/vite" ] || err "vite not found after npm install — check Node.js version (requires 18+)"
ok "vite found in node_modules."

# =============================================================================
# PHASE 7 — .env template
# =============================================================================
banner "PHASE 7: Environment File"

ENV_FILE="$BACKEND_DIR/.env"
if [ ! -f "$ENV_FILE" ]; then
    cat > "$ENV_FILE" <<'ENV'
# ── NVIDIA NIM API (required for LLM inference) ──────────────────────────────
NVIDIA_API_KEY=

# ── HuggingFace (optional — only for gated/private models) ───────────────────
HUGGINGFACE_TOKEN=

# ── Storage credentials are configured via the app UI, not here ──────────────
ENV
    ok ".env created at $ENV_FILE"
else
    warn ".env already exists — skipping."
fi

echo ""
echo -e "${YELLOW}┌──────────────────────────────────────────────────────┐${NC}"
echo -e "${YELLOW}│  ACTION REQUIRED: Add your NVIDIA API key to .env   │${NC}"
echo -e "${YELLOW}│  nano ${ENV_FILE}   │${NC}"
echo -e "${YELLOW}│  NVIDIA_API_KEY=nvapi-xxxxxxxxxxxxx                  │${NC}"
echo -e "${YELLOW}│  Get a free key at: https://build.nvidia.com         │${NC}"
echo -e "${YELLOW}└──────────────────────────────────────────────────────┘${NC}"
echo ""

# =============================================================================
# PHASE 8 — PM2 bash wrapper + ecosystem config
# =============================================================================
banner "PHASE 8: PM2 Configuration"

mkdir -p "$LOGS_DIR"

# IMPORTANT: PM2 must NOT run the uvicorn binary directly.
# PM2's ProcessContainerFork tries to execute it as Node.js and gets a Python
# SyntaxError. A bash wrapper hands off cleanly to uvicorn.
WRAPPER="$APP_DIR/start_backend.sh"
cat > "$WRAPPER" <<WRAPPER_EOF
#!/bin/bash
cd ${BACKEND_DIR}
exec ${VENV}/bin/uvicorn main:app --host 0.0.0.0 --port ${BACKEND_PORT}
WRAPPER_EOF
chmod +x "$WRAPPER"
ok "start_backend.sh created."

python3 -c "
cfg = open('${APP_DIR}/ecosystem.config.js', 'w')
cfg.write('''module.exports = {
    apps: [
        {
            name: \"infinia-rag-backend\",
            script: \"${WRAPPER}\",
            interpreter: \"/bin/bash\",
            exec_mode: \"fork\",
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: \"1G\",
            env: { NODE_ENV: \"production\", PYTHONUNBUFFERED: \"1\" },
            error_file: \"${LOGS_DIR}/backend-error.log\",
            out_file:   \"${LOGS_DIR}/backend-out.log\",
            log_date_format: \"YYYY-MM-DD HH:mm:ss Z\",
            merge_logs: true
        },
        {
            name: \"infinia-rag-frontend\",
            cwd: \"${FRONTEND_DIR}\",
            script: \"npm\",
            args: \"run dev -- --host 0.0.0.0 --port ${FRONTEND_PORT}\",
            exec_mode: \"fork\",
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: \"500M\",
            env: { NODE_ENV: \"production\" },
            error_file: \"${LOGS_DIR}/frontend-error.log\",
            out_file:   \"${LOGS_DIR}/frontend-out.log\",
            log_date_format: \"YYYY-MM-DD HH:mm:ss Z\",
            merge_logs: true
        }
    ]
};''')
cfg.close()
print('ecosystem.config.js written OK')
"

# =============================================================================
# PHASE 9 — Start PM2 + configure reboot survival
# =============================================================================
banner "PHASE 9: Starting PM2"

cd "$APP_DIR"
pm2 start ecosystem.config.js
pm2 save
sudo env PATH="$PATH:/usr/bin" pm2 startup systemd -u ubuntu --hp /home/ubuntu 2>/dev/null || \
    warn "PM2 startup config skipped — run 'pm2 startup' manually if needed."

# =============================================================================
# Done!
# =============================================================================
sleep 5

echo ""
echo -e "${GREEN}${BOLD}============================================================${NC}"
echo -e "${GREEN}${BOLD}   Deployment Complete!${NC}"
echo -e "${GREEN}${BOLD}============================================================${NC}"
echo ""
pm2 status
echo ""
echo -e "  ${BOLD}Frontend:${NC}   http://${SERVER_IP}:${FRONTEND_PORT}"
echo -e "  ${BOLD}Backend:${NC}    http://${SERVER_IP}:${BACKEND_PORT}/docs"
echo ""
echo -e "  ${YELLOW}${BOLD}⚠ OCI Firewall:${NC} Open ports ${FRONTEND_PORT} and ${BACKEND_PORT} in OCI Console"
echo -e "  Networking → VCN → Security Lists → Add Ingress Rules"
echo -e "  (CIDR 0.0.0.0/0, TCP, ports ${FRONTEND_PORT} and ${BACKEND_PORT})"
echo ""
echo -e "  ${YELLOW}${BOLD}⚠ NVIDIA API Key:${NC} Edit ${ENV_FILE}"
echo -e "  then run:  pm2 restart infinia-rag-backend"
echo ""
echo -e "  ${BOLD}PM2 commands:${NC}"
echo -e "  pm2 status                        — process overview"
echo -e "  pm2 logs infinia-rag-backend      — backend logs"
echo -e "  pm2 logs infinia-rag-frontend     — frontend logs"
echo -e "  pm2 monit                         — live monitor"
echo ""
