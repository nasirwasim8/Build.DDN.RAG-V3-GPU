#!/usr/bin/env bash
# =============================================================================
# github_push_setup.sh
# DDN Infinia RAG Demo — Create GitHub Repo & Push Clean Code
# =============================================================================
# Run this ON the Ubuntu server (nwasim@192.168.147.129) AFTER syncing
# files from Windows using sync_to_server.ps1
#
# Usage:
#   bash github_push_setup.sh
# =============================================================================

set -e

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'

log()    { echo -e "${CYAN}[INFO]${NC}  $1"; }
ok()     { echo -e "${GREEN}[OK]${NC}    $1"; }
warn()   { echo -e "${YELLOW}[WARN]${NC}  $1"; }
err()    { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }
banner() { echo -e "\n${BOLD}── $1 ──────────────────────────────────────────${NC}"; }

REPO_NAME="Build.DDN.RAG-V3-GPU"
GITHUB_USER="nasirwasim8"
PROJECT_DIR="/home/nwasim/projects/Build.DDN.Semantic_Search"

echo ""
echo -e "${BOLD}============================================================${NC}"
echo -e "${BOLD}   DDN RAG — GitHub Repo Setup: ${REPO_NAME}${NC}"
echo -e "${BOLD}============================================================${NC}"
echo ""

# =============================================================================
# PHASE 1 — Install GitHub CLI (gh)
# =============================================================================
banner "PHASE 1: Install GitHub CLI"

if command -v gh &>/dev/null; then
    ok "gh already installed: $(gh --version | head -1)"
else
    log "Installing gh CLI..."
    curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg \
        | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg 2>/dev/null
    sudo chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] \
https://cli.github.com/packages stable main" \
        | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
    sudo apt-get update -qq
    sudo apt-get install -y gh
    ok "gh installed: $(gh --version | head -1)"
fi

# =============================================================================
# PHASE 2 — GitHub Authentication
# =============================================================================
banner "PHASE 2: GitHub Authentication"

if gh auth status &>/dev/null; then
    ok "Already authenticated with GitHub."
else
    echo ""
    echo -e "${YELLOW}You need a GitHub Personal Access Token (classic) with scopes:${NC}"
    echo -e "  ${BOLD}repo${NC}  (full control of private repositories)"
    echo -e "  ${BOLD}read:org${NC} (optional)"
    echo ""
    echo -e "  Create one at: ${CYAN}https://github.com/settings/tokens/new${NC}"
    echo -e "  Token name: e.g. 'DDN-RAG-Deploy'"
    echo -e "  Expiration: 90 days"
    echo -e "  Scopes: check ✅ repo"
    echo ""
    log "Launching gh auth login (choose: GitHub.com → HTTPS → Paste token)..."
    echo ""
    gh auth login --hostname github.com --git-protocol https --web 2>/dev/null || \
    gh auth login --hostname github.com --git-protocol https
    ok "GitHub authentication complete."
fi

# =============================================================================
# PHASE 3 — Validate project directory
# =============================================================================
banner "PHASE 3: Validate Project Directory"

if [ ! -d "$PROJECT_DIR" ]; then
    err "Project directory not found: $PROJECT_DIR
    
Please run sync_to_server.ps1 from Windows first to sync the files, then re-run this script."
fi

if [ ! -f "$PROJECT_DIR/backend/requirements.txt" ]; then
    err "backend/requirements.txt not found — the project does not look complete in $PROJECT_DIR"
fi

ok "Project directory exists: $PROJECT_DIR"

# Verify no real credentials are present
if [ -f "$PROJECT_DIR/backend/data/storage_config.json" ]; then
    warn "REMOVING backend/data/storage_config.json — contains real credentials!"
    rm -f "$PROJECT_DIR/backend/data/storage_config.json"
    ok "Removed storage_config.json"
fi

if [ -f "$PROJECT_DIR/backend/.env" ]; then
    warn "REMOVING backend/.env — contains real API keys!"
    rm -f "$PROJECT_DIR/backend/.env"
    ok "Removed .env"
fi

# Remove any patch files that may contain hardcoded credentials
for f in apply_s3_toggle_patch.py apply_aws_sync_patch.py apply_aws_sync_patch.sh \
          diagnose_s3.py test_aws_upload.py push_to_server.ps1 \
          create_deployment_package.sh; do
    if [ -f "$PROJECT_DIR/$f" ]; then
        rm -f "$PROJECT_DIR/$f"
        warn "Removed $f (contains credentials or internal-only)"
    fi
done

# Remove backup files
find "$PROJECT_DIR" -name "*.backup" -delete 2>/dev/null && ok "Backup files removed."

# Remove PDFs
find "$PROJECT_DIR" -name "*.pdf" -delete 2>/dev/null && ok "PDF files removed."

ok "Credential scrub complete."

# =============================================================================
# PHASE 4 — Create GitHub Repository
# =============================================================================
banner "PHASE 4: Create GitHub Repository"

if gh repo view "${GITHUB_USER}/${REPO_NAME}" &>/dev/null; then
    warn "Repository ${GITHUB_USER}/${REPO_NAME} already exists — will push to it."
else
    log "Creating public repository: ${GITHUB_USER}/${REPO_NAME}..."
    gh repo create "${GITHUB_USER}/${REPO_NAME}" \
        --public \
        --description "DDN Infinia RAG Demo — GPU-accelerated document ingestion and retrieval pipeline with NVIDIA NIM" \
        --confirm 2>/dev/null || \
    gh repo create "${GITHUB_USER}/${REPO_NAME}" \
        --public \
        --description "DDN Infinia RAG Demo — GPU-accelerated document ingestion and retrieval pipeline with NVIDIA NIM"
    ok "Repository created: https://github.com/${GITHUB_USER}/${REPO_NAME}"
fi

# =============================================================================
# PHASE 5 — Git Init, Stage, Commit, Push
# =============================================================================
banner "PHASE 5: Git Init & Push"

cd "$PROJECT_DIR"

# Initialize git if not already
if [ ! -d ".git" ]; then
    git init -b main
    ok "Git repository initialized."
else
    log "Git already initialized — reinitializing for clean push..."
    git checkout -b main 2>/dev/null || git checkout main 2>/dev/null || true
fi

# Configure git identity (required for commit)
git config user.email "nasirwasim8@github.com" 2>/dev/null || true
git config user.name "nasirwasim8" 2>/dev/null || true

# Add remote
if git remote get-url origin &>/dev/null; then
    git remote set-url origin "https://github.com/${GITHUB_USER}/${REPO_NAME}.git"
    log "Updated remote origin URL."
else
    git remote add origin "https://github.com/${GITHUB_USER}/${REPO_NAME}.git"
    log "Added remote origin."
fi

# Stage all (respects .gitignore)
log "Staging files (respecting .gitignore)..."
git add -A

# Show what will be committed
echo ""
echo -e "${BOLD}Files staged for commit:${NC}"
git status --short
echo ""

# Final credential safety check before commit
log "Running credential safety check..."
CRED_CHECK=$(git diff --cached --unified=0 | grep -iE "(access_key|secret_key|nvapi-|ISW6U6J|dYeTZyb)" | grep "^+" || true)
if [ -n "$CRED_CHECK" ]; then
    err "CREDENTIAL DETECTED in staged content! Aborting.
    
Found: $CRED_CHECK

Please review and remove credentials before committing."
fi
ok "Credential check passed — no secrets in staged files."

# Commit
git commit -m "Initial commit: DDN Infinia RAG Demo v3 (GPU)

- FastAPI backend with NVIDIA NIM LLM integration
- React + TypeScript frontend with Vite
- DDN INFINIA / S3-compatible storage support
- GPU-accelerated document ingestion pipeline
- PM2 deployment with ecosystem.config.js
- Auto-deploy script: deploy.sh

Credentials: NOT included — see backend/data/storage_config.example.json and backend/.env.example"

# Push
log "Pushing to GitHub..."
git push -u origin main --force

echo ""
echo -e "${GREEN}${BOLD}============================================================${NC}"
echo -e "${GREEN}${BOLD}   🎉 Push Complete!${NC}"
echo -e "${GREEN}${BOLD}============================================================${NC}"
echo ""
echo -e "  ${BOLD}Repo:${NC}  https://github.com/${GITHUB_USER}/${REPO_NAME}"
echo ""
echo -e "  ${BOLD}Anyone can now deploy with:${NC}"
echo -e "  ${CYAN}bash <(curl -fsSL https://raw.githubusercontent.com/${GITHUB_USER}/${REPO_NAME}/main/deploy.sh)${NC}"
echo ""
