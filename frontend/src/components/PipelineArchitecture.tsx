import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Type Definitions ────────────────────────────────────────────────────────
interface StageNode {
    id: string
    label: string
    sublabel: string
    nvidia?: string
    infinia?: string
    icon: string
    details: {
        what: string
        how: string
        infinia_write?: string
        infinia_read?: string
        nvidia_lib?: string
        output?: string
        s3_headers?: string[]
    }
}

// ─── Ingestion Pipeline Stages ───────────────────────────────────────────────
const ingestionStages: StageNode[] = [
    {
        id: 'source',
        label: 'Video Source',
        sublabel: 'Raw Input',
        icon: '🎬',
        details: {
            what: 'Raw MP4/H.264 files or live RTSP camera streams enter the pipeline.',
            how: 'FastAPI S3-compatible PUT endpoint or RTSP stream webhook trigger.',
            infinia_write: 'raw/{asset_id}/video.mp4',
            s3_headers: ['x-amz-meta-status: ingested', 'x-amz-meta-source: upload'],
            output: 'Raw video object stored in INFINIA at wire speed.',
        },
    },
    {
        id: 'chunker',
        label: 'Demux + Chunker',
        sublabel: 'FFmpeg · NVIDIA DALI',
        nvidia: 'NVIDIA DALI',
        icon: '✂️',
        details: {
            what: 'Separates video and audio streams. Splits video into GOP-aligned chunks (10–30s).',
            how: 'FFmpeg demux → GOP boundary detection → MP4 container chunks. Audio isolated to WAV.',
            infinia_write: 'chunks/{asset_id}/chunk_N.mp4\naudio/{asset_id}/audio.wav',
            nvidia_lib: 'nvidia-dali (GPU-accelerated video decode)',
            s3_headers: ['x-amz-meta-parent-asset: {id}', 'x-amz-meta-chunk-index: N', 'x-amz-meta-duration-sec: 12.4'],
            output: 'N×MP4 chunks + 1×WAV — all written to INFINIA with parent-asset linkage.',
        },
    },
    {
        id: 'keyframes',
        label: 'Keyframe Selector',
        sublabel: 'Scene-change · SSIM',
        nvidia: 'NVIDIA DALI',
        icon: '🖼️',
        details: {
            what: 'Extracts the semantically richest frames per chunk — not every frame, the right frames.',
            how: 'GPU frame decode via DALI → SSIM drop detection + histogram delta → ~5–20 frames/chunk.',
            infinia_write: 'keyframes/{asset_id}/chunk_N_frame_M.jpg',
            nvidia_lib: 'nvidia-dali, torchvision (SSIM)',
            s3_headers: ['x-amz-meta-timestamp-ms: 4200', 'x-amz-meta-scene-change-score: 0.87'],
            output: 'JPEG keyframes in INFINIA with precise temporal pointers in S3 headers.',
        },
    },
    {
        id: 'inference',
        label: 'AI Inference',
        sublabel: 'CLIP · BLIP-2 · Riva ASR',
        nvidia: 'TensorRT + Riva NIM',
        icon: '🤖',
        details: {
            what: 'Parallel visual + audio inference. Visual: CLIP 512-dim embedding + BLIP-2 dense caption. Audio: Riva ASR transcript.',
            how: 'ViT-L/14 backbone (TensorRT INT8) → CLIP visual encoder → BLIP-2 captioner. Riva ASR NIM processes WAV in parallel.',
            nvidia_lib: 'OpenCLIP (ViT-L/14), BLIP-2 (TensorRT), NVIDIA Riva ASR NIM, FAISS',
            output: '512-dim CLIP vectors + scene captions + object tags + audio transcript per frame.',
        },
    },
    {
        id: 'infinia-write',
        label: 'Knowledge Write',
        sublabel: 'JSON Sidecar · S3 Metadata',
        nvidia: 'INFINIA Object API',
        icon: '💾',
        details: {
            what: 'All AI outputs assembled into a JSON sidecar and co-located with the raw video as native S3 metadata. No separate database.',
            how: 'JSON sidecar written to derived/embeddings/. Raw video S3 headers updated atomically via PUT-COPY to add intelligence pointers.',
            infinia_write: 'derived/embeddings/{asset_id}.json',
            s3_headers: ['x-amz-meta-status: indexed', 'x-amz-meta-primary-tags: rain,night,pedestrian', 'x-amz-meta-embedding-ref: derived/embeddings/{id}.json'],
            output: 'The Intelligence Object Layer — query-ready at wire speed.',
        },
    },
]

// ─── Retrieval Pipeline Stages ───────────────────────────────────────────────
const retrievalStages: StageNode[] = [
    {
        id: 'results',
        label: 'Ranked Results',
        sublabel: 'Sub-2s · S3 signed URLs',
        icon: '✅',
        details: {
            what: 'Top-K semantically ranked results with thumbnails, captions, timestamps, S3 metadata proof.',
            how: 'Pre-signed S3 URLs for keyframe + clip. BLIP captions, object tags, transcript pulled from JSON sidecar. S3 headers prove enterprise storage.',
            infinia_read: 'keyframes/, chunks/, derived/embeddings/',
            output: 'Result cards: thumbnail · clip URL · caption · confidence · timestamp · S3 metadata header proof.',
        },
    },
    {
        id: 'rerank',
        label: 'Cross-Modal Rerank',
        sublabel: 'BLIP caption · SBERT',
        nvidia: 'NeMo Retriever NIM',
        icon: '🔀',
        details: {
            what: 'Optional high-precision reranking: blends CLIP cosine similarity with BLIP text caption similarity.',
            how: 'Final score = 0.7 × CLIP_score + 0.3 × SBERT_cosine(query, blip_caption). NeMo Retriever NIM is a drop-in upgrade.',
            nvidia_lib: 'sentence-transformers (SBERT) · NVIDIA NeMo Retriever NIM (optional)',
            output: 'Precision-ranked result list. Filters visual false-positives caught by caption mismatch.',
        },
    },
    {
        id: 'faiss',
        label: 'FAISS ANN Search',
        sublabel: 'In-process · No vector DB',
        nvidia: 'FAISS (Meta)',
        icon: '🔍',
        details: {
            what: 'Approximate nearest-neighbor search over CLIP frame embeddings. Runs entirely in-process — no external vector database.',
            how: 'Load JSON sidecars for candidate pool → build FAISS IndexFlatIP → cosine similarity against query vector → Top-K.',
            infinia_read: 'derived/embeddings/*.json (candidate pool)',
            nvidia_lib: 'FAISS (CPU/GPU) — library, not a service',
            output: '[(asset_id, frame_key, similarity_score)] — millsecond-scale ANN retrieval.',
        },
    },
    {
        id: 'prefilter',
        label: 'Metadata Pre-filter',
        sublabel: 'INFINIA S3 Headers · Zero GPU',
        icon: '🗂️',
        details: {
            what: 'Before touching any embedding, sweep S3 object metadata headers to shrink the candidate pool. Pure INFINIA operation — no GPU, no compute.',
            how: 'ListObjectsV2 → HEAD per object → filter on x-amz-meta-status=indexed AND x-amz-meta-primary-tags CONTAINS query tokens.',
            infinia_read: 'S3 header sweep on raw/ prefix',
            output: 'Candidate pool: e.g. 10,000 assets → 94 candidates. Cost: metadata reads only.',
        },
    },
    {
        id: 'clip-text',
        label: 'CLIP Text Encoder',
        sublabel: 'ViT-L/14 · Same space',
        nvidia: 'OpenCLIP · TensorRT',
        icon: '🔤',
        details: {
            what: 'Encodes the natural language query into the same 512-dim embedding space as the stored video frame embeddings.',
            how: 'CLIP text encoder (ViT-L/14 backbone, TensorRT optimized). Output: 512-dim float32 vector aligned to visual embedding space.',
            nvidia_lib: 'OpenCLIP, TensorRT INT8',
            output: 'Query vector: [0.041, -0.392, ..., 0.078] — 512 dimensions. No translation needed.',
        },
    },
]

// ─── INFINIA Storage Buckets ─────────────────────────────────────────────────
const infiniaBuckets = [
    { label: 'raw/', sublabel: 'Original video + S3 headers', color: '#f59e0b' },
    { label: 'chunks/', sublabel: 'GOP-aligned segments', color: '#f97316' },
    { label: 'keyframes/', sublabel: 'JPEG frames + timestamps', color: '#10b981' },
    { label: 'derived/', sublabel: 'embeddings/*.json (CLIP·BLIP·tags)', color: '#3b82f6' },
]

// ─── Animated Particle ───────────────────────────────────────────────────────
function Particle({ color, delay, direction }: { color: string; delay: number; direction: 'right' | 'left' }) {
    return (
        <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full z-10"
            style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
            initial={{ x: direction === 'right' ? -4 : 'calc(100% + 4px)', opacity: 0 }}
            animate={{
                x: direction === 'right' ? 'calc(100% + 4px)' : -4,
                opacity: [0, 1, 1, 0],
            }}
            transition={{ duration: 1.8, delay, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
        />
    )
}

// ─── Connector with Particles ─────────────────────────────────────────────────
function Connector({ color, direction, active }: { color: string; direction: 'right' | 'left'; active: boolean }) {
    return (
        <div className="flex-1 relative h-px mx-1" style={{ backgroundColor: color + '33' }}>
            <div className="absolute inset-0" style={{ backgroundColor: active ? color + '66' : color + '22', transition: 'background-color 0.3s' }} />
            {[0, 0.6, 1.2].map((d, i) => (
                <Particle key={i} color={color} delay={d} direction={direction} />
            ))}
        </div>
    )
}

// ─── Stage Node Card ──────────────────────────────────────────────────────────
function StageCard({
    node,
    color,
    isActive,
    onClick,
    pipeline,
}: {
    node: StageNode
    color: string
    isActive: boolean
    onClick: () => void
    pipeline: 'ingestion' | 'retrieval'
}) {
    return (
        <motion.button
            onClick={onClick}
            className="flex flex-col items-center gap-2 min-w-[120px] max-w-[140px] group focus:outline-none"
            whileHover={{ y: pipeline === 'ingestion' ? -4 : 4 }}
            transition={{ duration: 0.2 }}
        >
            {/* Node circle */}
            <div
                className="relative w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all duration-300"
                style={{
                    background: isActive ? color + '30' : color + '15',
                    border: `1.5px solid ${isActive ? color : color + '55'}`,
                    boxShadow: isActive ? `0 0 20px ${color}55, 0 0 40px ${color}22` : 'none',
                }}
            >
                <span className="text-xl">{node.icon}</span>
                {node.nvidia && (
                    <div
                        className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-[7px] font-bold"
                        style={{ background: '#76b900', color: 'white', boxShadow: '0 0 6px #76b90066' }}
                    >
                        NV
                    </div>
                )}
            </div>
            {/* Label */}
            <div className="text-center">
                <div className="text-xs font-bold leading-tight" style={{ color }}>
                    {node.label}
                </div>
                <div className="text-[10px] leading-tight mt-0.5" style={{ color: color + 'aa' }}>
                    {node.sublabel}
                </div>
            </div>
        </motion.button>
    )
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────
function DetailPanel({ node, color, onClose }: { node: StageNode; color: string; onClose: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -8, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -8, scaleY: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-xl p-5 border mt-4"
            style={{
                background: color + '08',
                borderColor: color + '33',
                boxShadow: `0 0 30px ${color}18`,
            }}
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-xl">{node.icon}</span>
                    <div>
                        <h4 className="font-bold text-sm" style={{ color }}>{node.label}</h4>
                        <span className="text-[11px]" style={{ color: color + '99' }}>{node.sublabel}</span>
                    </div>
                </div>
                <button onClick={onClose} className="text-neutral-500 hover:text-white text-lg leading-none transition-colors">×</button>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-xs">
                <div>
                    <div className="font-bold uppercase tracking-wider mb-1" style={{ color: color + 'aa' }}>What</div>
                    <p className="text-neutral-400 leading-relaxed">{node.details.what}</p>
                </div>
                <div>
                    <div className="font-bold uppercase tracking-wider mb-1" style={{ color: color + 'aa' }}>How</div>
                    <p className="text-neutral-400 leading-relaxed">{node.details.how}</p>
                </div>
                {node.details.nvidia_lib && (
                    <div>
                        <div className="font-bold uppercase tracking-wider mb-1 text-[#76b900]">NVIDIA Library</div>
                        <p className="text-neutral-400 leading-relaxed">{node.details.nvidia_lib}</p>
                    </div>
                )}
                {(node.details.infinia_write || node.details.infinia_read) && (
                    <div>
                        <div className="font-bold uppercase tracking-wider mb-1 text-emerald-400">
                            {node.details.infinia_write ? '⬇ INFINIA Write' : '⬆ INFINIA Read'}
                        </div>
                        <code className="text-emerald-400 text-[11px] leading-relaxed block whitespace-pre-wrap">
                            {node.details.infinia_write || node.details.infinia_read}
                        </code>
                    </div>
                )}
                {node.details.s3_headers && (
                    <div className="md:col-span-2">
                        <div className="font-bold uppercase tracking-wider mb-1" style={{ color: '#60a5fa' }}>S3 Object Headers Written</div>
                        <div className="flex flex-wrap gap-1.5">
                            {node.details.s3_headers.map((h, i) => (
                                <code key={i} className="px-2 py-0.5 rounded text-[10px] bg-blue-500/10 border border-blue-500/20 text-blue-400">{h}</code>
                            ))}
                        </div>
                    </div>
                )}
                {node.details.output && (
                    <div className="md:col-span-2 pt-3 border-t border-neutral-800">
                        <div className="font-bold uppercase tracking-wider mb-1" style={{ color }}>Output</div>
                        <p className="text-neutral-300 leading-relaxed font-medium">{node.details.output}</p>
                    </div>
                )}
            </div>
        </motion.div>
    )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PipelineArchitecture() {
    const [activeIngestion, setActiveIngestion] = useState<string | null>(null)
    const [activeRetrieval, setActiveRetrieval] = useState<string | null>(null)
    const [infiniaPulse, setInfoniaPulse] = useState(false)

    useEffect(() => {
        const t = setInterval(() => setInfoniaPulse(p => !p), 2000)
        return () => clearInterval(t)
    }, [])

    const AMBER = '#f59e0b'
    const CYAN = '#22d3ee'
    const GREEN = '#4ade80'

    const activeIngestionNode = ingestionStages.find(n => n.id === activeIngestion)
    const activeRetrievalNode = retrievalStages.find(n => n.id === activeRetrieval)

    return (
        <section className="px-6 py-16" style={{ background: '#050508' }}>
            <div className="max-w-[1280px] mx-auto">

                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-green-500/30 bg-green-500/10 mb-4">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-green-400 text-xs font-bold tracking-widest uppercase">Architecture Blueprint</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-3">
                        DDN INFINIA × NVIDIA VSS — Pipeline Architecture
                    </h2>
                    <p className="text-neutral-400 max-w-2xl mx-auto text-sm leading-relaxed">
                        Two pipelines, one intelligence layer. Click any stage to explore the architecture.
                        INFINIA is not just storage — it is the <strong className="text-white">Intelligence Object Layer</strong> where
                        every AI artifact lives co-located with the data.
                    </p>
                    <div className="flex items-center justify-center gap-6 mt-5 text-xs text-neutral-500">
                        <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 inline-block" style={{ background: AMBER }} /> Ingestion flow</span>
                        <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 inline-block" style={{ background: CYAN }} /> Retrieval flow</span>
                        <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 inline-block" style={{ background: GREEN }} /> INFINIA storage</span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-4 h-4 rounded-full bg-[#76b900] text-[7px] font-bold text-white flex items-center justify-center">NV</span>
                            NVIDIA component
                        </span>
                    </div>
                </div>

                {/* ── INGESTION PIPELINE ────────────────────────────────────────────── */}
                <div className="mb-2">
                    <div className="flex items-center gap-2 mb-5">
                        <div className="h-px flex-1" style={{ background: `linear-gradient(to right, ${AMBER}55, transparent)` }} />
                        <span className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full border"
                            style={{ color: AMBER, borderColor: AMBER + '40', background: AMBER + '10' }}>
                            ① Ingestion Pipeline
                        </span>
                        <div className="h-px flex-1" style={{ background: `linear-gradient(to left, ${AMBER}55, transparent)` }} />
                    </div>

                    <div className="flex items-center justify-between">
                        {ingestionStages.map((node, i) => (
                            <div key={node.id} className="flex items-center flex-1 min-w-0">
                                <StageCard
                                    node={node}
                                    color={AMBER}
                                    isActive={activeIngestion === node.id}
                                    onClick={() => setActiveIngestion(activeIngestion === node.id ? null : node.id)}
                                    pipeline="ingestion"
                                />
                                {i < ingestionStages.length - 1 && (
                                    <Connector color={AMBER} direction="right" active={activeIngestion === node.id} />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Ingestion detail panel */}
                    <AnimatePresence>
                        {activeIngestionNode && (
                            <DetailPanel
                                node={activeIngestionNode}
                                color={AMBER}
                                onClose={() => setActiveIngestion(null)}
                            />
                        )}
                    </AnimatePresence>
                </div>

                {/* Write arrows from Ingestion → INFINIA */}
                <div className="flex justify-around px-16 my-1">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex flex-col items-center gap-0.5">
                            <motion.div
                                className="w-px h-8"
                                style={{ background: `linear-gradient(to bottom, ${AMBER}88, ${GREEN}88)` }}
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                            />
                            <motion.div
                                animate={{ y: [0, 3, 0], opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                                style={{ color: GREEN, fontSize: 10 }}
                            >▼</motion.div>
                        </div>
                    ))}
                </div>

                {/* ── DDN INFINIA INTELLIGENCE LAYER ──────────────────────────────── */}
                <motion.div
                    className="rounded-2xl border p-5 mb-1"
                    style={{
                        background: 'linear-gradient(135deg, rgba(74,222,128,0.06) 0%, rgba(59,130,246,0.06) 100%)',
                        borderColor: GREEN + '40',
                        boxShadow: infiniaPulse
                            ? `0 0 40px ${GREEN}22, inset 0 0 40px ${GREEN}08`
                            : `0 0 20px ${GREEN}11`,
                        transition: 'box-shadow 2s ease',
                    }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg" style={{ background: GREEN + '20', border: `1px solid ${GREEN}40` }}>
                                🗄️
                            </div>
                            <div>
                                <h3 className="font-bold text-sm text-white">DDN INFINIA — Intelligence Object Layer</h3>
                                <p className="text-[11px] text-neutral-500">S3-compatible · Flat namespace · Unlimited metadata · Wire-speed retrieval</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <motion.div
                                className="w-2 h-2 rounded-full"
                                style={{ background: GREEN }}
                                animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            />
                            <span className="text-[11px] font-semibold" style={{ color: GREEN }}>Live · Intelligence co-located</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                        {infiniaBuckets.map((bucket) => (
                            <div
                                key={bucket.label}
                                className="rounded-xl p-3 border text-center"
                                style={{ background: bucket.color + '08', borderColor: bucket.color + '30' }}
                            >
                                <div className="font-mono font-bold text-sm mb-1" style={{ color: bucket.color }}>
                                    {bucket.label}
                                </div>
                                <div className="text-[10px] text-neutral-500 leading-tight">{bucket.sublabel}</div>
                                <motion.div
                                    className="mt-2 h-1 rounded-full"
                                    style={{ background: bucket.color + '40' }}
                                    animate={{ scaleX: [0.3, 1, 0.3] }}
                                    transition={{ duration: 3, repeat: Infinity, delay: Math.random() * 2, ease: 'easeInOut' }}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="mt-3 pt-3 border-t border-neutral-800 text-[11px] text-neutral-500 flex flex-wrap gap-x-6 gap-y-1">
                        <span>📌 JSON sidecar = embedding + caption + tags + transcript</span>
                        <span>📌 S3 headers = lightweight graph edge index (zero external DB)</span>
                        <span>📌 FAISS reads directly from INFINIA — no sync, no lag, no vector DB cost</span>
                    </div>
                </motion.div>

                {/* Read arrows from INFINIA → Retrieval */}
                <div className="flex justify-around px-16 my-1">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex flex-col items-center gap-0.5">
                            <motion.div
                                animate={{ y: [0, -3, 0], opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 + 1 }}
                                style={{ color: CYAN, fontSize: 10 }}
                            >▲</motion.div>
                            <motion.div
                                className="w-px h-8"
                                style={{ background: `linear-gradient(to top, ${CYAN}88, ${GREEN}88)` }}
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 + 1 }}
                            />
                        </div>
                    ))}
                </div>

                {/* ── RETRIEVAL PIPELINE ────────────────────────────────────────────── */}
                <div className="mt-2">
                    <div className="flex items-center justify-between mb-5">
                        {/* Retrieval flows RIGHT→LEFT so render reversed order visually */}
                        {[...retrievalStages].reverse().map((node, i, arr) => (
                            <div key={node.id} className="flex items-center flex-1 min-w-0">
                                <StageCard
                                    node={node}
                                    color={CYAN}
                                    isActive={activeRetrieval === node.id}
                                    onClick={() => setActiveRetrieval(activeRetrieval === node.id ? null : node.id)}
                                    pipeline="retrieval"
                                />
                                {i < arr.length - 1 && (
                                    <Connector color={CYAN} direction="left" active={activeRetrieval === node.id} />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                        <div className="h-px flex-1" style={{ background: `linear-gradient(to left, ${CYAN}55, transparent)` }} />
                        <span className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full border"
                            style={{ color: CYAN, borderColor: CYAN + '40', background: CYAN + '10' }}>
                            ② Retrieval Pipeline
                        </span>
                        <div className="h-px flex-1" style={{ background: `linear-gradient(to right, ${CYAN}55, transparent)` }} />
                    </div>

                    {/* Retrieval detail panel */}
                    <AnimatePresence>
                        {activeRetrievalNode && (
                            <DetailPanel
                                node={activeRetrievalNode}
                                color={CYAN}
                                onClose={() => setActiveRetrieval(null)}
                            />
                        )}
                    </AnimatePresence>
                </div>

                {/* ── NVIDIA Stack Footer ────────────────────────────────────────────── */}
                <div className="mt-10 rounded-2xl border border-neutral-800 p-5 bg-neutral-900/40">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold bg-[#76b900] text-white">NV</div>
                        <span className="text-sm font-bold text-white">NVIDIA Library Stack</span>
                        <span className="text-xs text-neutral-500 ml-1">— All components in this pipeline</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                            { name: 'NVIDIA DALI', role: 'GPU video decode · frame extraction', color: '#76b900' },
                            { name: 'CLIP (ViT-L/14)', role: 'Visual-text joint embedding · TensorRT INT8', color: '#76b900' },
                            { name: 'BLIP-2', role: 'Dense scene captioning · TensorRT', color: '#76b900' },
                            { name: 'Riva ASR NIM', role: 'Speech-to-text · speaker diarization', color: '#76b900' },
                            { name: 'TensorRT', role: 'INT8/FP16 inference optimization', color: '#76b900' },
                            { name: 'FAISS', role: 'ANN vector search · in-process · no DB', color: '#76b900' },
                            { name: 'NeMo Retriever', role: 'Cross-modal reranking NIM (optional upgrade)', color: '#76b90066' },
                            { name: 'NeMo Guardrails', role: 'Query safety · production upgrade path', color: '#76b90066' },
                        ].map(lib => (
                            <div key={lib.name} className="rounded-xl p-3 border border-neutral-800 bg-neutral-900">
                                <div className="font-bold text-xs mb-1" style={{ color: lib.color }}>{lib.name}</div>
                                <div className="text-[10px] text-neutral-500 leading-tight">{lib.role}</div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    )
}
