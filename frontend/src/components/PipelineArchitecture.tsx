import { useState } from 'react'

// ─── SVG Icon Components ──────────────────────────────────────────────────────
const Icons = {
    Video: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
            <rect x="2" y="5" width="15" height="14" rx="2" />
            <path d="m17 8 4-2v12l-4-2V8Z" />
        </svg>
    ),
    Scissors: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
            <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" />
            <line x1="20" y1="4" x2="8.12" y2="15.88" />
            <line x1="14.47" y1="14.48" x2="20" y2="20" />
            <line x1="8.12" y1="8.12" x2="12" y2="12" />
        </svg>
    ),
    Film: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
            <rect x="2" y="2" width="20" height="20" rx="2.18" />
            <line x1="7" y1="2" x2="7" y2="22" /><line x1="17" y1="2" x2="17" y2="22" />
            <line x1="2" y1="12" x2="22" y2="12" /><line x1="2" y1="7" x2="7" y2="7" />
            <line x1="2" y1="17" x2="7" y2="17" /><line x1="17" y1="17" x2="22" y2="17" />
            <line x1="17" y1="7" x2="22" y2="7" />
        </svg>
    ),
    Cpu: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
            <rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" />
            <line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" />
            <line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" />
            <line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" />
            <line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" />
        </svg>
    ),
    Database: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
            <ellipse cx="12" cy="5" rx="9" ry="3" />
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        </svg>
    ),
    Search: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    ),
    User: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    ),
    Filter: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
    ),
    GitBranch: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
            <line x1="6" y1="3" x2="6" y2="15" />
            <circle cx="18" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><circle cx="6" cy="6" r="3" />
            <path d="M18 9a9 9 0 0 1-9 9" />
        </svg>
    ),
    ArrowRight: () => (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
        </svg>
    ),
    ChevronDown: () => (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <polyline points="6 9 12 15 18 9" />
        </svg>
    ),
    ChevronUp: () => (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <polyline points="18 15 12 9 6 15" />
        </svg>
    ),
    LayoutGrid: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
        </svg>
    ),
    AlertTriangle: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
            <path d="m10.29 3.86-8.28 14.3A1 1 0 0 0 2.86 20h16.28a1 1 0 0 0 .86-1.5l-8.28-14.3a1 1 0 0 0-1.73.16Z" />
            <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
    ),
    Clock: () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    ),
}

// ─── NVIDIA Badge ─────────────────────────────────────────────────────────────
function NvidiaBadge({ label }: { label: string }) {
    return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold"
            style={{ background: '#76b90020', border: '1px solid #76b90040', color: '#76b900' }}>
            <span className="w-3 h-3 rounded-sm flex items-center justify-center text-[7px] font-black"
                style={{ background: '#76b900', color: 'white' }}>N</span>
            {label}
        </span>
    )
}

// ─── INGESTION STAGES ─────────────────────────────────────────────────────────
interface IngestStage {
    id: string
    label: string
    sublabel: string
    icon: React.ReactNode
    nvidia?: string
    details: {
        what: string
        infinia_write?: string
        s3_headers?: string[]
        libs: string
    }
}

const ingestionStages: IngestStage[] = [
    {
        id: 'source',
        label: 'Video Source',
        sublabel: 'Raw MP4 · RTSP stream',
        icon: <Icons.Video />,
        details: {
            what: 'Raw video files (MP4/H.264) or live RTSP camera streams. Accepted via S3-compatible PUT or stream webhook.',
            infinia_write: 'raw/{asset_id}/video.mp4',
            s3_headers: ['x-amz-meta-status: ingested'],
            libs: 'Python FastAPI · S3 boto3',
        },
    },
    {
        id: 'chunker',
        label: 'Demux + Chunker',
        sublabel: 'GOP-aligned segments',
        icon: <Icons.Scissors />,
        details: {
            what: 'Separates video and audio streams. Splits video at GOP (Group of Pictures) boundaries into 10–30s chunks for parallel processing. Audio isolated to WAV.',
            infinia_write: 'chunks/{asset_id}/chunk_N.mp4\naudio/{asset_id}/audio.wav',
            s3_headers: ['x-amz-meta-parent-asset: {id}', 'x-amz-meta-chunk-index: N', 'x-amz-meta-duration-sec: 12.4'],
            libs: 'FFmpeg · PyAV',
        },
    },
    {
        id: 'keyframes',
        label: 'Keyframe Selector',
        sublabel: 'Scene-change · SSIM · DALI',
        icon: <Icons.Film />,
        nvidia: 'DALI',
        details: {
            what: 'GPU-accelerated frame decode (NVIDIA DALI). Scene-change detection using pixel histogram delta and SSIM perceptual similarity. Extracts 5–20 representative frames per chunk — not every frame, the right frames.',
            infinia_write: 'keyframes/{asset_id}/chunk_N_frame_M.jpg',
            s3_headers: ['x-amz-meta-timestamp-ms: 4200', 'x-amz-meta-scene-score: 0.87'],
            libs: 'NVIDIA DALI · torchvision (SSIM) · OpenCV',
        },
    },
    {
        id: 'inference',
        label: 'AI Inference',
        sublabel: 'CLIP · BLIP-2 · Riva ASR',
        icon: <Icons.Cpu />,
        nvidia: 'TensorRT · Riva ASR NIM',
        details: {
            what: 'Parallel visual + audio tracks. Visual: CLIP (OpenAI ViT-L/14) produces a 512-dim embedding per keyframe; BLIP-2 (Salesforce) generates a dense scene caption. Audio: NVIDIA Riva ASR NIM transcribes speech and diarizes speakers. All models run with NVIDIA TensorRT INT8 optimization.',
            libs: 'OpenCLIP (ViT-L/14) · BLIP-2 · NVIDIA TensorRT (inference runtime) · NVIDIA Riva ASR NIM',
        },
    },
    {
        id: 'write',
        label: 'Knowledge Write',
        sublabel: 'JSON sidecar · S3 headers',
        icon: <Icons.Database />,
        details: {
            what: 'All inference outputs assembled into a JSON sidecar co-located with the video in INFINIA. Raw object S3 metadata headers updated atomically — no external database, no sync pipeline. The sidecar IS the vector store.',
            infinia_write: 'derived/embeddings/{asset_id}.json\n(contains CLIP vectors, BLIP captions, tags, transcript)',
            s3_headers: ['x-amz-meta-status: indexed', 'x-amz-meta-primary-tags: rain,night,pedestrian', 'x-amz-meta-embedding-ref: derived/embeddings/{id}.json'],
            libs: 'boto3 S3 API · Python json',
        },
    },
]

// ─── RETRIEVAL STEPS (nested, shown inside the engine panel) ─────────────────
const retrievalSteps = [
    {
        id: 'encode',
        step: '①',
        label: 'CLIP Text Encode',
        desc: 'The NLP query is encoded into a 512-dim vector using the same CLIP ViT-L/14 text encoder — identical embedding space as the stored frame vectors. No translation layer needed.',
        lib: 'OpenCLIP (ViT-L/14) · same model as ingestion',
    },
    {
        id: 'prefilter',
        step: '②',
        label: 'INFINIA Metadata Pre-filter',
        desc: "S3 header sweep on the raw/ prefix. Filters by x-amz-meta-status=indexed and x-amz-meta-primary-tags overlapping query tokens. Reduces candidate pool from thousands to tens — zero GPU, zero embedding load.",
        lib: 'INFINIA S3 LIST + HEAD · boto3',
    },
    {
        id: 'faiss',
        step: '③',
        label: 'FAISS ANN Search',
        desc: 'Load JSON sidecars for the candidate pool from INFINIA. Build a FAISS IndexFlatIP in-process. Compute cosine similarity between the query vector and all frame embeddings. Return Top-K matches.',
        lib: 'FAISS (Meta/Facebook AI Research) — a library, not a service. No Pinecone, no Weaviate.',
    },
    {
        id: 'rerank',
        step: '④',
        label: 'Cross-Modal Rerank',
        desc: 'Blend CLIP visual similarity with BLIP caption text similarity to filter visual false-positives. Final score = 0.7 × CLIP + 0.3 × text_sim. Optional upgrade: NVIDIA NeMo Retriever NIM.',
        lib: 'sentence-transformers (SBERT) · NVIDIA NeMo Retriever NIM (optional)',
        nvidia: 'NeMo Retriever NIM (optional)',
    },
    {
        id: 'results',
        step: '⑤',
        label: 'Result Assembly',
        desc: 'Generate pre-signed S3 URLs for the keyframe thumbnail and the matched video chunk. Pull BLIP caption, objects, transcript from JSON sidecar (already in memory). Read S3 metadata headers for enterprise proof. Return ranked cards.',
        lib: 'boto3 · INFINIA pre-signed URL · JSON sidecar read',
    },
]

// ─── Search Intent Scenarios ──────────────────────────────────────────────────
const searchScenarios = [
    {
        id: 'moment',
        persona: 'Archive Analyst',
        icon: <Icons.Clock />,
        query: '"Find the moment a car brakes on a wet road at night"',
        context: 'Searching through petabytes of dashcam footage for a specific scenario. Manual tagging would take weeks.',
        outcome: 'Exact frames returned in under 2 seconds across the full archive.',
        color: '#f59e0b',
    },
    {
        id: 'anomaly',
        persona: 'AI/ML Engineer',
        icon: <Icons.AlertTriangle />,
        query: '"Show all clips where equipment vibration is outside normal range"',
        context: 'Curating an edge-case training dataset for model fine-tuning — a process that normally costs 2–6 weeks and $150/hr annotation specialists.',
        outcome: 'NLP query replaces an annotation project. Clips feed directly into training pipeline from INFINIA.',
        color: '#3b82f6',
    },
]

// ─── Stage Card ───────────────────────────────────────────────────────────────
function IngestCard({ stage, isActive, onClick }: { stage: IngestStage; isActive: boolean; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="flex flex-col items-center gap-2.5 min-w-[110px] focus:outline-none group"
        >
            <div
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 relative"
                style={{
                    background: isActive ? '#f59e0b18' : '#f9fafb',
                    border: `1.5px solid ${isActive ? '#f59e0b' : '#e5e7eb'}`,
                    color: isActive ? '#f59e0b' : '#6b7280',
                    boxShadow: isActive ? '0 0 16px #f59e0b22' : 'none',
                }}
            >
                {stage.icon}
                {stage.nvidia && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black"
                        style={{ background: '#76b900', color: 'white' }}>N</span>
                )}
            </div>
            <div className="text-center">
                <div className="text-[11px] font-bold text-neutral-700 leading-tight">{stage.label}</div>
                <div className="text-[9px] text-neutral-400 mt-0.5 leading-tight">{stage.sublabel}</div>
            </div>
        </button>
    )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PipelineArchitecture() {
    const [activeStage, setActiveStage] = useState<string | null>(null)
    const [activeScenario, setActiveScenario] = useState<string>('moment')
    const [activeStep, setActiveStep] = useState<string | null>(null)

    const activeIngestStage = ingestionStages.find(s => s.id === activeStage)
    // activeScenario drives the UI directly via .find() in JSX

    return (
        <section style={{ background: '#ffffff', borderTop: '1px solid #f3f4f6' }} className="px-6 py-16">
            <div className="max-w-[1280px] mx-auto">

                {/* Header */}
                <div className="text-center mb-12">
                    <span className="inline-block text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-4"
                        style={{ background: '#f3f4f6', color: '#6b7280' }}>
                        Architecture Blueprint
                    </span>
                    <h2 className="text-2xl font-bold text-neutral-900 mb-3">
                        DDN INFINIA × NVIDIA VSS — Pipeline Architecture
                    </h2>
                    <p className="text-neutral-500 max-w-2xl mx-auto text-sm leading-relaxed">
                        Two pipelines, one intelligence layer. INFINIA is not just storage — it is the{' '}
                        <strong className="text-neutral-800">Intelligence Object Layer</strong> where every AI artifact
                        lives co-located with the raw video. Click any stage to explore the design.
                    </p>
                    <div className="flex items-center justify-center gap-6 mt-5 text-[11px] text-neutral-500">
                        <span className="flex items-center gap-1.5">
                            <span className="w-3 h-px inline-block bg-amber-400" /> Ingestion
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-3 h-px inline-block bg-blue-400" /> Retrieval
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-3 h-px inline-block bg-green-500" /> INFINIA storage
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black"
                                style={{ background: '#76b900', color: 'white' }}>N</span>
                            Genuinely NVIDIA
                        </span>
                    </div>
                </div>

                {/* ── INGESTION PIPELINE ──────────────────────────────────────────────── */}
                <div className="mb-2">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full"
                            style={{ background: '#fff7ed', border: '1px solid #fed7aa', color: '#f59e0b' }}>
                            ① Ingestion Pipeline
                        </span>
                        <div className="h-px flex-1 bg-amber-100" />
                        <span className="text-[10px] text-neutral-400">Video lands on INFINIA → AI enrichment → co-located intelligence</span>
                    </div>

                    {/* Stage nodes */}
                    <div className="flex items-start">
                        {ingestionStages.map((stage, i) => (
                            <div key={stage.id} className="flex items-center flex-1 min-w-0">
                                <IngestCard
                                    stage={stage}
                                    isActive={activeStage === stage.id}
                                    onClick={() => setActiveStage(activeStage === stage.id ? null : stage.id)}
                                />
                                {i < ingestionStages.length - 1 && (
                                    <div className="flex-1 flex items-center justify-center pb-6">
                                        <div className="flex-1 h-px bg-amber-200" />
                                        <div className="text-amber-300 mx-0.5 flex-shrink-0"><Icons.ArrowRight /></div>
                                        <div className="flex-1 h-px bg-amber-200" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Ingestion Detail Panel */}
                    {activeIngestStage && (
                        <div className="mt-5 rounded-xl p-5 border bg-amber-50 border-amber-200">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2 text-amber-700">
                                    {activeIngestStage.icon}
                                    <h4 className="font-bold text-sm">{activeIngestStage.label}</h4>
                                    {activeIngestStage.nvidia && <NvidiaBadge label={activeIngestStage.nvidia} />}
                                </div>
                                <button onClick={() => setActiveStage(null)} className="text-neutral-400 hover:text-neutral-600 text-lg leading-none">×</button>
                            </div>
                            <div className="grid md:grid-cols-2 gap-5 text-xs">
                                <div>
                                    <div className="font-semibold text-neutral-500 uppercase tracking-wide mb-1">What happens</div>
                                    <p className="text-neutral-700 leading-relaxed">{activeIngestStage.details.what}</p>
                                </div>
                                <div>
                                    <div className="font-semibold text-neutral-500 uppercase tracking-wide mb-1">Libraries</div>
                                    <p className="text-neutral-700 leading-relaxed">{activeIngestStage.details.libs}</p>
                                </div>
                                {activeIngestStage.details.infinia_write && (
                                    <div>
                                        <div className="font-semibold text-green-700 uppercase tracking-wide mb-1">↓ Writes to INFINIA</div>
                                        <code className="text-green-700 text-[11px] leading-relaxed whitespace-pre-wrap block">{activeIngestStage.details.infinia_write}</code>
                                    </div>
                                )}
                                {activeIngestStage.details.s3_headers && (
                                    <div>
                                        <div className="font-semibold text-blue-600 uppercase tracking-wide mb-2">S3 Object Headers</div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {activeIngestStage.details.s3_headers.map((h, i) => (
                                                <code key={i} className="px-2 py-0.5 rounded text-[10px] bg-blue-50 border border-blue-200 text-blue-700">{h}</code>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Write arrows (ingestion → INFINIA) */}
                <div className="flex justify-around px-20 my-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex flex-col items-center gap-0.5" style={{ color: '#FF8D28' }}>
                            <div className="w-px h-6" style={{ background: '#FF8D2840' }} />
                            <svg className="w-3 h-3" viewBox="0 0 12 8" fill="currentColor">
                                <path d="M6 8 L0 0 L12 0 Z" />
                            </svg>
                        </div>
                    ))}
                </div>

                {/* ── DDN INFINIA LAYER ──────────────────────────────────────────────── */}
                <div className="rounded-2xl p-5 mb-3"
                    style={{ background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)', border: '2px solid #FF8D2840' }}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Icons.Database />
                            <div>
                                <h3 className="font-bold text-sm text-neutral-800">DDN INFINIA — Intelligence Object Layer</h3>
                                <p className="text-[11px] text-neutral-500">S3-compatible · Flat namespace · Unlimited object metadata · Wire-speed retrieval</p>
                            </div>
                        </div>
                        <span className="text-[11px] font-semibold flex items-center gap-1.5" style={{ color: '#FF8D28' }}>
                            <span className="w-2 h-2 rounded-full" style={{ background: '#FF8D28' }} />
                            All AI intelligence co-located with raw data
                        </span>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                        {[
                            { label: 'raw/', desc: 'Original video + S3 index headers', color: '#f59e0b' },
                            { label: 'chunks/', desc: 'GOP segments · parent-asset linked', color: '#f97316' },
                            { label: 'keyframes/', desc: 'JPEG frames · timestamp pointers', color: '#10b981' },
                            { label: 'derived/embeddings/', desc: 'JSON sidecar: CLIP vectors, BLIP captions, tags, transcript', color: '#3b82f6' },
                        ].map(b => (
                            <div key={b.label} className="rounded-xl p-3 bg-white border text-center"
                                style={{ borderColor: b.color + '30' }}>
                                <div className="font-mono font-bold text-xs mb-1" style={{ color: b.color }}>{b.label}</div>
                                <div className="text-[10px] text-neutral-500 leading-tight">{b.desc}</div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-3 pt-3 border-t text-[11px] text-neutral-500 flex flex-wrap gap-x-6 gap-y-1" style={{ borderColor: '#FF8D2830' }}>
                        <span>📌 INFINIA stores embeddings persistently (JSON sidecar) — FAISS is a search algorithm library, not a database. At query time, vectors load from INFINIA into RAM; FAISS finds nearest neighbours in-process. No separate service.</span>
                        <span>📌 S3 object headers = lightweight graph edge index — no Neo4j, no graph DB</span>
                        <span>📌 No Pinecone. No Weaviate. No Milvus. INFINIA replaces their storage role; FAISS replaces their ANN algorithm — both for free.</span>
                    </div>
                </div>

                {/* Read arrows (INFINIA → retrieval) */}
                <div className="flex justify-around px-20 mb-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex flex-col items-center gap-0.5" style={{ color: '#FF8D28' }}>
                            <svg className="w-3 h-3" viewBox="0 0 12 8" fill="currentColor">
                                <path d="M6 0 L12 8 L0 8 Z" />
                            </svg>
                            <div className="w-px h-6" style={{ background: '#FF8D2840' }} />
                        </div>
                    ))}
                </div>

                {/* ── RETRIEVAL PIPELINE ──────────────────────────────────────────────── */}
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-[11px] font-bold tracking-widest uppercase px-3 py-1 rounded-full"
                            style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#3b82f6' }}>
                            ② Retrieval Pipeline
                        </span>
                        <div className="h-px flex-1 bg-blue-100" />
                        <span className="text-[10px] text-neutral-400">NLP query → INFINIA metadata read → ranked results in sub-2s</span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* LEFT: User Intent */}
                        <div>
                            <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide mb-3">
                                User searches for...
                            </div>
                            <div className="flex flex-col gap-3">
                                {searchScenarios.map(sc => (
                                    <button
                                        key={sc.id}
                                        onClick={() => setActiveScenario(sc.id)}
                                        className="text-left rounded-xl p-4 border-2 transition-all duration-200"
                                        style={{
                                            borderColor: activeScenario === sc.id ? sc.color : '#e5e7eb',
                                            background: activeScenario === sc.id ? sc.color + '08' : '#fafafa',
                                        }}
                                    >
                                        <div className="flex items-center gap-2 mb-2" style={{ color: sc.color }}>
                                            {sc.icon}
                                            <span className="font-bold text-xs">{sc.persona}</span>
                                        </div>
                                        <div className="font-mono text-xs text-neutral-700 bg-white border border-neutral-200 rounded-lg px-3 py-2 mb-2 leading-relaxed">
                                            {sc.query}
                                        </div>
                                        <p className="text-[11px] text-neutral-500 leading-relaxed">{sc.context}</p>
                                        {activeScenario === sc.id && (
                                            <div className="mt-2 pt-2 border-t border-neutral-200">
                                                <span className="text-[11px] font-semibold" style={{ color: sc.color }}>
                                                    ✓ {sc.outcome}
                                                </span>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT: Under the Hood steps */}
                        <div>
                            <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide mb-3">
                                Under the hood — Retrieval Engine
                            </div>
                            <div className="rounded-xl border border-blue-100 overflow-hidden bg-white">
                                {retrievalSteps.map((step, i) => (
                                    <div key={step.id}>
                                        <button
                                            onClick={() => setActiveStep(activeStep === step.id ? null : step.id)}
                                            className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-blue-50 transition-colors duration-150"
                                            style={{ borderBottom: i < retrievalSteps.length - 1 ? '1px solid #eff6ff' : 'none' }}
                                        >
                                            <span className="font-mono font-bold text-xs text-blue-400 w-5 flex-shrink-0">{step.step}</span>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-bold text-xs text-neutral-800 flex items-center gap-2">
                                                    {step.label}
                                                    {step.nvidia && <NvidiaBadge label={step.nvidia} />}
                                                </div>
                                            </div>
                                            <div className="text-neutral-400 flex-shrink-0">
                                                {activeStep === step.id ? <Icons.ChevronUp /> : <Icons.ChevronDown />}
                                            </div>
                                        </button>

                                        {activeStep === step.id && (
                                            <div className="px-4 pb-4 pt-2 bg-blue-50 border-t border-blue-100">
                                                <p className="text-[11px] text-neutral-600 leading-relaxed mb-2">{step.desc}</p>
                                                <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wide mb-1">Library</div>
                                                <p className="text-[11px] text-neutral-500 font-mono">{step.lib}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
                                <div className="text-[11px] font-bold text-blue-600 mb-1">⚡ End-to-end result</div>
                                <p className="text-[11px] text-neutral-600 leading-relaxed">
                                    Ranked result cards with keyframe thumbnail, video clip (pre-signed S3 URL), scene caption,
                                    detected objects, timestamp pointer, and S3 metadata headers — all returned from INFINIA in under 2 seconds.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Library Stack ──────────────────────────────────────────────────── */}
                <div className="mt-10 rounded-2xl border border-neutral-200 p-5 bg-neutral-50">
                    <h4 className="text-sm font-bold text-neutral-700 mb-4">Technology Stack</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                            { name: 'NVIDIA DALI', role: 'GPU video decode · frame extraction', nvidia: true },
                            { name: 'NVIDIA TensorRT', role: 'INT8/FP16 inference optimization for all models', nvidia: true },
                            { name: 'NVIDIA Riva ASR NIM', role: 'Speech-to-text · speaker diarization', nvidia: true },
                            { name: 'NVIDIA NeMo Retriever NIM', role: 'Cross-modal reranking (optional upgrade)', nvidia: true },
                            { name: 'CLIP (OpenAI/OpenCLIP)', role: 'Visual-text joint embedding · ViT-L/14 backbone', nvidia: false },
                            { name: 'BLIP-2 (Salesforce)', role: 'Dense scene captioning per keyframe', nvidia: false },
                            { name: 'FAISS (Meta AI)', role: 'In-process ANN search over frame embeddings', nvidia: false },
                            { name: 'FFmpeg · PyAV', role: 'Video demux and GOP-aligned chunking', nvidia: false },
                        ].map(lib => (
                            <div key={lib.name} className="rounded-xl p-3 border bg-white border-neutral-200">
                                <div className="flex items-center gap-1.5 mb-1">
                                    {lib.nvidia && (
                                        <span className="w-4 h-4 rounded-sm flex items-center justify-center text-[9px] font-black flex-shrink-0"
                                            style={{ background: '#76b900', color: 'white' }}>N</span>
                                    )}
                                    <div className="font-bold text-[11px] text-neutral-800">{lib.name}</div>
                                </div>
                                <div className="text-[10px] text-neutral-500 leading-tight">{lib.role}</div>
                            </div>
                        ))}
                    </div>
                    <p className="text-[10px] text-neutral-400 mt-3">
                        CLIP and BLIP-2 are not NVIDIA products — they are run with NVIDIA TensorRT optimization. Only components genuinely from NVIDIA are marked above.
                    </p>
                </div>

            </div>
        </section>
    )
}
