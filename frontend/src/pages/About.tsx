import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Image, Video, FileText, Zap, Database, ArrowRight, DollarSign, TrendingUp, Trophy, ChevronDown } from 'lucide-react'
import PipelineArchitecture from '../components/PipelineArchitecture'

interface AboutPageProps {
  onStartDemo?: () => void
}

// ─── VSS Strategic Outcomes Section ──────────────────────────────────────────
function VssOutcomesSection({ onStartDemo }: { onStartDemo?: () => void }) {
  const [open, setOpen] = useState<number | null>(null)

  const columns = [
    {
      label: 'Business Outcome',
      accent: 'text-emerald-400',
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-500/5',
      iconColor: '#10b981',
      badge: 'Dark Data → Live Intelligence',
      badgeBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
      summary: (<>Enterprises sit on <strong>petabytes of dark, untagged video</strong> — AI teams burn weeks hunting edge cases for model fine-tuning. One NLP query replaces that entire search cycle. <strong>Results in under 2 seconds</strong>, across every petabyte in the archive.</>),
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
          <polyline points="16 7 22 7 22 13" />
        </svg>
      ),
      details: [
        { label: 'The dark data problem', value: 'Enterprise AI teams accumulate PBs of video — cameras, sensors, test fleets. Less than 5% is ever tagged or queried. The rest is dark data: a cost center with zero intelligence value.' },
        { label: 'Model fine-tuning bottleneck', value: 'Finding edge cases for model retraining — adverse weather, rare intersections, equipment anomalies — takes 2–6 weeks of manual tagging per dataset. With DDN + NVIDIA VSS, it is one NLP query: "wet road, low visibility, pedestrian crossing" — answered in 2 seconds.' },
        { label: 'Operational leverage', value: 'One data scientist with a natural language query replaces a 3–5 person annotation team. Every week of manual tagging compresses to minutes. AI iteration cycles shrink from months to days.' },
        { label: 'PB-scale readiness', value: "DDN INFINIA's flat namespace means a 1PB archive and a 100PB archive respond identically. Query latency stays flat as the data estate grows — no tiering, no cold-retrieval delays." },
        { label: 'C-suite headline', value: '"Our AI teams were burning weeks finding the edge cases models need most. With DDN, that search is a sentence — typed once, answered in seconds, across every petabyte we own."' },
      ]
    },
    {
      label: 'Financial Outcome',
      accent: 'text-orange-500',
      border: 'border-orange-500/30',
      bg: 'bg-orange-500/5',
      iconColor: '#f97316',
      badge: '$2M–$5M/yr Annotation + Search Stack Eliminated',
      badgeBg: 'bg-orange-500/10 border-orange-500/30 text-orange-500',
      summary: (<>Eliminates manual annotation tooling, Elasticsearch, cold-storage tiers, and S3 egress in one architecture decision. <strong>No separate vector database.</strong> CLIP embeddings stored natively in INFINIA — zero marginal cost on every query, every fine-tuning dataset pull.</>),
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
      details: [
        { label: 'Annotation cost eliminated', value: 'Manual video tagging for model fine-tuning runs $80–$200/hr per specialist. At enterprise scale — 10K+ hours of edge-case annotation per AI program per year — that is $2M–$5M in avoidable spend. NLP query replaces the entire workflow.' },
        { label: 'Vector DB deferred', value: '$500K–$2M purpose-built vector database (Pinecone, Weaviate, Milvus) avoided entirely. CLIP embeddings live natively as S3 object metadata in INFINIA — query directly, no integration, no sync.' },
        { label: 'Egress tax removed', value: 'Every inference retrieval over cloud S3 carries egress. INFINIA co-location removes this entirely — estimated $800K–$3M/yr at a 10PB estate running continuous model training workloads.' },
        { label: 'Embedding reuse = free retrieval', value: 'CLIP vectors written once at ingest. Every subsequent query — including every fine-tuning dataset pull — is a metadata read. No re-inference, no GPU spin-up. Compute paid once; retrieval approaches zero marginal cost.' },
        { label: 'C-suite headline', value: '"We eliminated the annotation budget, the vector database line item, and the egress bill — with one infrastructure decision. DDN INFINIA is the search stack and the data pipeline."' },
      ]
    },
    {
      label: 'AI Infra Implications',
      accent: 'text-red-400',
      border: 'border-red-500/30',
      bg: 'bg-red-500/5',
      iconColor: '#f87171',
      badge: 'GPU Utilization ~40% → >85%',
      badgeBg: 'bg-red-500/10 border-red-500/30 text-red-400',
      summary: (<>NVIDIA VSS inference runs <strong>co-located with PB-scale video</strong> on DDN INFINIA — no data movement, no prefetch latency. GPUs stop waiting on storage. Utilization climbs from ~40% to <strong>&gt;85% sustained</strong>. Fine-tuning dataset curation — once weeks of work — is now a query.</>),
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" />
          <line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" />
          <line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" />
          <line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" />
          <line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" />
        </svg>
      ),
      details: [
        { label: 'GPU starvation eliminated', value: 'Cloud storage forces GPUs to idle 30–40% of every inference cycle waiting on I/O. INFINIA co-location collapses that overhead — GPUs run at sustained >85% utilization. More throughput from the same fleet, zero additional capex.' },
        { label: 'Fine-tuning pipeline acceleration', value: 'Edge-case dataset curation for model retraining is now a query, not a project. AI teams issue NLP queries, retrieve curated clips in seconds, and feed directly into training pipelines — all without moving data off INFINIA.' },
        { label: 'NVIDIA VSS blueprint native', value: "Built on NVIDIA's Video Search and Summarization (VSS) reference architecture. CLIP and BLIP inference run where the data lives — co-located on INFINIA. No data pipeline to maintain, no cross-system latency, no storage ceiling as the video estate grows." },
        { label: 'Linear scale — no ceiling', value: "Adding 100TB of new video requires zero rebalancing, zero re-sharding, zero downtime. INFINIA's flat namespace scales with the GPU fleet — every new GPU gets full I/O bandwidth from day one." },
        { label: 'C-suite headline', value: '"Our GPU fleet now runs at the speed it was purchased to run. DDN INFINIA removed the storage bottleneck costing us 40% of AI compute — at every scale, every fleet size."' },
      ]
    },
  ]

  return (
    <section className="bg-surface-primary px-6 py-16">
      <div className="max-w-[1280px] mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/40 bg-orange-500/10 mb-4">
            <svg className="w-3.5 h-3.5 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span className="text-orange-500 text-xs font-bold tracking-widest uppercase">GTC 2026 Showcase</span>
          </div>
          <span className="eyebrow text-ddn-red block">Strategic Value Framework</span>
          <h2 className="heading-2 mt-2 mb-3">Video Semantic Search — Business Case</h2>
          <p className="body-text max-w-3xl mx-auto">
            Built on the <strong>NVIDIA Video Search &amp; Summarization (VSS) Blueprint</strong>,
            this demo proves that DDN INFINIA transforms <strong>petabytes of dark, untagged enterprise video</strong>{' '}
            into a real-time queryable intelligence layer — no re-indexing, no annotation pipeline, no vector database.
            The enterprise use case it solves:{' '}
            <strong>AI teams hunting edge cases for model fine-tuning</strong> — a process that costs weeks and millions today —
            reduced to a single NLP query, answered in seconds.
          </p>
        </div>

        {/* ── 3-Column Summary Row ─────────────────────────────────────────────── */}
        <div className="grid md:grid-cols-3 gap-5 mb-6">
          {columns.map((col, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`card p-6 border ${col.border} ${col.bg} cursor-pointer group`}
              onClick={() => setOpen(open === i ? null : i)}
            >
              {/* Icon + Label */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: col.iconColor + '18', color: col.iconColor }}>
                    {col.icon}
                  </div>
                  <span className={`text-lg font-bold leading-tight ${col.accent}`}>{col.label}</span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${col.accent} ${open === i ? 'rotate-180' : ''}`}
                />
              </div>

              {/* Badge */}
              <div className={`inline-block px-3 py-1 rounded-full border text-sm font-bold mb-3 ${col.badgeBg}`}>
                {col.badge}
              </div>

              {/* Summary */}
              <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{col.summary}</p>

              <p className={`text-sm mt-4 font-semibold ${col.accent}`}>
                {open === i ? '▲ Collapse detail' : '▼ See extrapolated numbers'}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ── Expandable Detail Panel ───────────────────────────────────────────── */}
        {open !== null && (
          <motion.div
            key={open}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={`card p-6 border ${columns[open].border} mb-6`}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: columns[open].iconColor + '18', color: columns[open].iconColor }}>
                {columns[open].icon}
              </div>
              <h3 className={`text-xl font-bold ${columns[open].accent}`}>{columns[open].label}</h3>
            </div>
            <div className="divide-y divide-neutral-100">
              {columns[open].details.map((d, j) => (
                <div key={j} className="py-4 grid md:grid-cols-[220px_1fr] gap-3">
                  <span className="text-sm font-bold uppercase tracking-wide text-neutral-500">{d.label}</span>
                  <span className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{d.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── One-Line Summary Row (the GTC table row) ─────────────────────────── */}
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 overflow-hidden">
          {/* Header row */}
          <div className="grid grid-cols-4 bg-neutral-100 border-b border-neutral-200 text-xs font-bold uppercase tracking-wider text-neutral-500">
            <div className="px-5 py-3 border-r border-neutral-200">Demo</div>
            <div className="px-5 py-3 border-r border-neutral-200">Business Outcome</div>
            <div className="px-5 py-3 border-r border-neutral-200">Financial Outcome</div>
            <div className="px-5 py-3">AI Infra Implications</div>
          </div>
          {/* Data row */}
          <div className="grid grid-cols-4 text-xs leading-relaxed text-neutral-600">
            <div className="px-5 py-4 border-r border-neutral-200 font-semibold text-neutral-800">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-ddn-red inline-block" />
                Build.DDN:VSS
              </div>
              <span className="text-neutral-400 font-normal">Semantic search across video</span>
            </div>
            <div className="px-5 py-4 border-r border-neutral-200">
              <strong className="text-neutral-800">1 analyst replaces a 3-person tagging team.</strong> Natural-language query across PB-scale media returns results in under 2 seconds. Dead-weight unstructured data becomes an active intelligence asset.
            </div>
            <div className="px-5 py-4 border-r border-neutral-200">
              Eliminates <strong className="text-neutral-800">$500K–$2M vector DB deployment</strong>, removes S3 egress costs on every inference pass, and defers annotation headcount ($800K–$3M/yr). CLIP embedding reuse = zero marginal cost on repeat queries.
            </div>
            <div className="px-5 py-4">
              GPU utilization: <strong className="text-neutral-800">~40% → &gt;85% sustained</strong> (co-located inference eliminates I/O starvation). Sub-2s TTFT. Adding 100TB of video requires zero rebalancing — DDN scales linearly with the data estate.
            </div>
          </div>
        </div>

        {/* ── CTA Button ────────────────────────────────────────────────────────── */}
        {onStartDemo && (
          <div className="text-center mt-8">
            <button
              onClick={onStartDemo}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #ED2738 0%, #76B900 100%)',
                color: 'white',
                boxShadow: '0 8px 30px rgba(237, 39, 56, 0.25)'
              }}
            >
              <span>See It In Action</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-sm text-neutral-400 mt-3">Live demonstration with AI-powered semantic search</p>
          </div>
        )}

      </div>
    </section>
  )
}

export default function AboutPage({ onStartDemo }: AboutPageProps) {
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      @keyframes pulse-ring {
        0% { transform: scale(0.8); opacity: 0.6; }
        50% { transform: scale(1); opacity: 0.3; }
        100% { transform: scale(0.8); opacity: 0.6; }
      }
      @media (prefers-reduced-motion: reduce) {
        @keyframes shimmer { 0%, 100% { background-position: 0 0; } }
        @keyframes pulse-ring { 0%, 100% { transform: scale(1); opacity: 0.4; } }
      }
    `
    document.head.appendChild(style)
    return () => { document.head.removeChild(style) }
  }, [])

  return (
    <div className="about-page">
      {/* Business Outcome Hero Section */}
      <section
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)'
        }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Subtle Grid Pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }}
          />
          {/* Gradient Spotlight Effect */}
          <div
            className="absolute"
            style={{
              width: '800px',
              height: '800px',
              background: 'radial-gradient(circle, rgba(252, 211, 77, 0.08) 0%, transparent 70%)',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              filter: 'blur(40px)'
            }}
          />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 py-24 md:py-32">
          {/* Executive Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-12"
          >
            <div className="inline-block mb-6">
              <span
                className="px-6 py-2.5 rounded-full text-sm font-bold tracking-wide uppercase"
                style={{
                  background: '#FFFFFF',
                  border: '2px solid rgba(252, 211, 77, 0.4)',
                  color: '#D97706',
                  boxShadow: '0 4px 20px rgba(252, 211, 77, 0.25)'
                }}
              >
                💼 Executive Business Impact
              </span>
            </div>

            <h1
              className="text-4xl md:text-6xl lg:text-7xl font-black mb-6"
              style={{
                letterSpacing: '-0.04em',
                lineHeight: 1.05,
                background: 'linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 80px rgba(252, 211, 77, 0.3)'
              }}
            >
              From Video Chaos<br />to Instant Intelligence
            </h1>

            <p
              className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-4xl mx-auto font-light"
              style={{ lineHeight: 1.5, letterSpacing: '-0.01em' }}
            >
              When semantic search meets high-performance infrastructure,{' '}
              <span className="font-semibold text-amber-300">every frame becomes searchable</span>,{' '}
              <span className="font-semibold text-amber-300">every dataset discoverable</span>,{' '}
              and <span className="font-semibold text-amber-300">every insight actionable</span>.
              <br />
              <span className="text-white/70">AI-powered video analytics and multimodal search that transforms your bottom line.</span>
            </p>
          </motion.div>

          {/* Three Value Pillars */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="grid md:grid-cols-3 gap-6 mb-16"
          >
            {/* Cost Reduction Pillar */}
            <div
              className="relative p-8 rounded-2xl overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.08) 100%)',
                border: '2px solid rgba(16, 185, 129, 0.3)',
                transition: 'all 300ms cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)'
                e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.6)'
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(16, 185, 129, 0.25)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div className="mb-4 flex items-center justify-center">
                <div className="p-4 rounded-2xl bg-emerald-500/20">
                  <DollarSign className="w-12 h-12 text-emerald-300" strokeWidth={2.5} />
                </div>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3 text-emerald-400">
                Cost Reduction
              </h3>
              <div className="space-y-3 text-white/80">
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-semibold text-emerald-300">Significant storage cost savings</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-semibold text-emerald-300">Improved GPU efficiency</span>
                </div>
                <p className="text-base text-white/60 pt-2 border-t border-white/10">
                  Eliminate cloud egress fees and reduce expensive GPU idle time
                </p>
              </div>
            </div>

            {/* Revenue Acceleration Pillar */}
            <div
              className="relative p-8 rounded-2xl overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, rgba(252, 211, 77, 0.12) 0%, rgba(245, 158, 11, 0.08) 100%)',
                border: '2px solid rgba(252, 211, 77, 0.3)',
                transition: 'all 300ms cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)'
                e.currentTarget.style.borderColor = 'rgba(252, 211, 77, 0.6)'
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(252, 211, 77, 0.25)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.borderColor = 'rgba(252, 211, 77, 0.3)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div className="mb-4 flex items-center justify-center">
                <div className="p-4 rounded-2xl bg-amber-500/20">
                  <TrendingUp className="w-12 h-12 text-amber-300" strokeWidth={2.5} />
                </div>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3 text-amber-400">
                Revenue Acceleration
              </h3>
              <div className="space-y-3 text-white/80">
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-semibold text-amber-300">Faster time-to-market</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-semibold text-amber-300">Significant productivity improvement</span>
                </div>
                <p className="text-base text-white/60 pt-2 border-t border-white/10">
                  Accelerate product launches with sub-100ms real-time AI experiences
                </p>
              </div>
            </div>

            {/* Competitive Advantage Pillar */}
            <div
              className="relative p-8 rounded-2xl overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, rgba(237, 39, 56, 0.12) 0%, rgba(220, 38, 38, 0.08) 100%)',
                border: '2px solid rgba(237, 39, 56, 0.3)',
                transition: 'all 300ms cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)'
                e.currentTarget.style.borderColor = 'rgba(237, 39, 56, 0.6)'
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(237, 39, 56, 0.25)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.borderColor = 'rgba(237, 39, 56, 0.3)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div className="mb-4 flex items-center justify-center">
                <div className="p-4 rounded-2xl bg-red-500/20">
                  <Trophy className="w-12 h-12 text-red-300" strokeWidth={2.5} />
                </div>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3 text-red-400">
                Competitive Edge
              </h3>
              <div className="space-y-3 text-white/80">
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-semibold text-red-300">Faster retrieval</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-semibold text-red-300">Infinite scalability</span>
                </div>
                <p className="text-base text-white/60 pt-2 border-t border-white/10">
                  Superior AI performance with model-agnostic flexibility
                </p>
              </div>
            </div>
          </motion.div>


        </div>
      </section>

      {/* Hero Section */}
      <section
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
        }}
      >
        {/* Geometric Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Diagonal Lines Pattern */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `repeating-linear-gradient(
                -45deg,
                transparent,
                transparent 40px,
                rgba(255,255,255,0.5) 40px,
                rgba(255,255,255,0.5) 41px
              )`
            }}
          />
          {/* Accent Ring - Top Right */}
          <div
            className="absolute"
            style={{
              width: '500px',
              height: '500px',
              border: '1px solid rgba(118, 185, 0, 0.15)',
              borderRadius: '50%',
              right: '-150px',
              top: '-150px',
              animation: 'pulse-ring 8s ease-in-out infinite'
            }}
          />
          <div
            className="absolute"
            style={{
              width: '400px',
              height: '400px',
              border: '1px solid rgba(118, 185, 0, 0.1)',
              borderRadius: '50%',
              right: '-100px',
              top: '-100px',
              animation: 'pulse-ring 8s ease-in-out infinite 0.5s'
            }}
          />
          {/* Accent Ring - Bottom Left */}
          <div
            className="absolute"
            style={{
              width: '400px',
              height: '400px',
              border: '1px solid rgba(237, 39, 56, 0.12)',
              borderRadius: '50%',
              left: '-120px',
              bottom: '-120px',
              animation: 'pulse-ring 8s ease-in-out infinite 1s'
            }}
          />
          {/* Subtle Gradient Overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at 30% 20%, rgba(237, 39, 56, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(118, 185, 0, 0.06) 0%, transparent 50%)'
            }}
          />
        </div>

        <div className="relative z-10 max-w-[1280px] mx-auto px-6 py-20 md:py-28">
          {/* Logo Cards */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center gap-6 md:gap-8 mb-12"
          >
            {/* DDN Card */}
            <div
              className="w-28 h-28 md:w-36 md:h-36 rounded-2xl flex flex-col items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(237, 39, 56, 0.15) 0%, rgba(237, 39, 56, 0.05) 100%)',
                border: '1px solid rgba(237, 39, 56, 0.2)',
                transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
                willChange: 'transform'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)'
                e.currentTarget.style.borderColor = 'rgba(237, 39, 56, 0.4)'
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(237, 39, 56, 0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)'
                e.currentTarget.style.borderColor = 'rgba(237, 39, 56, 0.2)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <img src="/ddn-logo-white.svg" alt="DDN" className="h-10 md:h-12 w-auto mb-2" />
              <span className="text-white/70 text-xs font-medium">INFINIA</span>
            </div>

            {/* Connection Line */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-px bg-gradient-to-r from-ddn-red/50 to-transparent" />
              <div className="w-2 h-2 rounded-full bg-white/30" />
              <div className="w-8 h-px bg-gradient-to-l from-nvidia-green/50 to-transparent" />
            </div>

            {/* NVIDIA Card */}
            <div
              className="w-28 h-28 md:w-36 md:h-36 rounded-2xl flex flex-col items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(118, 185, 0, 0.15) 0%, rgba(118, 185, 0, 0.05) 100%)',
                border: '1px solid rgba(118, 185, 0, 0.2)',
                transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
                willChange: 'transform'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)'
                e.currentTarget.style.borderColor = 'rgba(118, 185, 0, 0.4)'
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(118, 185, 0, 0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)'
                e.currentTarget.style.borderColor = 'rgba(118, 185, 0, 0.2)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <img src="/nvidia-icon.svg" alt="NVIDIA" className="h-12 md:h-14 w-auto" />
              <span className="text-white/70 text-xs font-medium mt-2">NVIDIA</span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-6"
          >
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2"
              style={{ letterSpacing: '-0.03em', lineHeight: 1.1 }}
            >
              <span
                style={{
                  background: 'linear-gradient(90deg, #fff 0%, rgba(255,255,255,0.8) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 3s linear infinite'
                }}
              >
                Multimodal
              </span>{' '}
              <span className="text-white/90">Semantic</span>
            </h1>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold"
              style={{
                letterSpacing: '-0.03em',
                background: 'linear-gradient(135deg, #ED2738 0%, #76B900 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Video Search
            </h2>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-center text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-8"
            style={{ lineHeight: 1.7 }}
          >
            GPU-accelerated AI semantic search across images, videos, and documents.
            <br />
            <span className="text-nvidia-green font-semibold">Powered by NVIDIA GPU</span> + DDN INFINIA Storage
          </motion.p>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8"
          >
            <StatCardWithIcon
              icon={<Zap className="w-10 h-10" />}
              value="GPU Acceleration"
              label="AI Models"
              description="CLIP, BLIP & ViT vision-language models"
            />
            <StatCardWithIcon
              icon={
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                </svg>
              }
              value="Multimodal"
              label="Semantic Understanding"
              description="Meaning, not keywords"
            />
            <StatCardWithIcon
              icon={
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              }
              value="S3 Native"
              label="Storage Integration"
              description="DDN INFINIA Backend"
            />
            <StatCardWithIcon
              icon={
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              }
              value="Vector Search"
              label="FAISS-powered"
              description="Real-time similarity matching"
            />
          </motion.div>

          {/* Competitive Intelligence Quote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center"
          >
            <p
              className="text-base md:text-lg text-white/50 italic max-w-3xl mx-auto"
              style={{ fontWeight: 300, lineHeight: 1.6 }}
            >
              "When you can search every video frame, discover every dataset, and surface insights in milliseconds
              <br />you don't just gain efficiency. You unlock competitive intelligence that others take weeks to find."
            </p>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════
           VSS Strategic Outcomes  (inserted before Problem Statement)
       ════════════════════════════════════════════════════════════════════════ */}
      <VssOutcomesSection onStartDemo={onStartDemo} />

      {/* ════════════════════════════════════════════════════════════════════════
           DDN INFINIA × NVIDIA VSS — Interactive Pipeline Architecture
       ════════════════════════════════════════════════════════════════════════ */}
      <PipelineArchitecture />

      {/* Problem Statement Section */}
      <section
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
        }}
      >
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `repeating-linear-gradient(
                -45deg,
                transparent,
                transparent 40px,
                rgba(255,255,255,0.5) 40px,
                rgba(255,255,255,0.5) 41px
              )`
            }}
          />
          <div
            className="absolute"
            style={{
              width: '600px',
              height: '600px',
              background: 'radial-gradient(circle, rgba(237, 39, 56, 0.08) 0%, transparent 70%)',
              right: '-200px',
              top: '50%',
              transform: 'translateY(-50%)',
              filter: 'blur(60px)'
            }}
          />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 py-12 md:py-16">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-block mb-4">
              <span
                className="px-5 py-2 rounded-full text-sm font-bold tracking-wide uppercase"
                style={{
                  background: 'rgba(237, 39, 56, 0.15)',
                  border: '2px solid rgba(237, 39, 56, 0.3)',
                  color: '#F87171',
                  boxShadow: '0 4px 20px rgba(237, 39, 56, 0.2)'
                }}
              >
                ⚠️ The Challenge
              </span>
            </div>

            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
              style={{
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              The Problem with Video Data
            </h2>

            <p className="text-lg md:text-xl text-white/80 max-w-4xl mx-auto mb-6" style={{ lineHeight: 1.5 }}>
              Training <span className="font-bold text-nvidia-green">autonomous vehicle AI models</span> requires finding
              critical moments in <span className="font-bold text-amber-300">petabytes of video data</span>
            </p>
          </motion.div>

          {/* Use Case Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-3xl mx-auto mb-12"
          >
            <div
              className="p-6 rounded-2xl"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <h3 className="text-xl font-bold text-white mb-3">Autonomous Vehicle AI Teams Face:</h3>
              <ul className="space-y-2 text-base text-white/70">
                <li className="flex items-start gap-3">
                  <span className="text-ddn-red text-2xl">•</span>
                  <span>Petabytes of dashcam and sensor footage from test vehicles</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-ddn-red text-2xl">•</span>
                  <span>Thousands of hours of edge-case scenarios: adverse weather, pedestrian interactions, construction zones</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-ddn-red text-2xl">•</span>
                  <span>Validation datasets for safety-critical situations</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-ddn-red text-2xl">•</span>
                  <span>Simulation and real-world comparison videos</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Problem Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {/* Stat 1: Data Volume */}
            <div
              className="p-6 rounded-2xl text-center"
              style={{
                background: 'linear-gradient(135deg, rgba(237, 39, 56, 0.1) 0%, rgba(237, 39, 56, 0.05) 100%)',
                border: '1px solid rgba(237, 39, 56, 0.2)',
                transition: 'all 200ms ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(237, 39, 56, 0.4)'
                e.currentTarget.style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(237, 39, 56, 0.2)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <Database className="w-10 h-10 mx-auto mb-2 text-ddn-red" />
              <div className="text-2xl font-bold text-ddn-red mb-1">Petabytes</div>
              <div className="text-white/70 text-sm">Video Data to Manage</div>
            </div>

            {/* Stat 2: Time Wasted */}
            <div
              className="p-6 rounded-2xl text-center"
              style={{
                background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(251, 191, 36, 0.05) 100%)',
                border: '1px solid rgba(251, 191, 36, 0.2)',
                transition: 'all 200ms ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(251, 191, 36, 0.4)'
                e.currentTarget.style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(251, 191, 36, 0.2)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <svg className="w-10 h-10 mx-auto mb-2 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-2xl font-bold text-amber-400 mb-1">20-30 hrs</div>
              <div className="text-white/70 text-sm">Per Week Searching</div>
            </div>

            {/* Stat 3: Edge Cases */}
            <div
              className="p-6 rounded-2xl text-center"
              style={{
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                transition: 'all 200ms ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)'
                e.currentTarget.style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <svg className="w-10 h-10 mx-auto mb-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="text-2xl font-bold text-red-400 mb-1">Missed</div>
              <div className="text-white/70 text-sm">Critical Edge Cases</div>
            </div>

            {/* Stat 4: Impact */}
            <div
              className="p-6 rounded-2xl text-center"
              style={{
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.08) 100%)',
                border: '2px solid rgba(239, 68, 68, 0.3)',
                transition: 'all 200ms ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)'
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 10px 40px rgba(239, 68, 68, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <svg className="w-10 h-10 mx-auto mb-2 text-red-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-4 0-7-3-7-7V8.3l7-3.12 7 3.12V13c0 4-3 7-7 7zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z" />
              </svg>
              <div className="text-2xl font-bold text-red-300 mb-1">Safety Liability</div>
              <div className="text-white/70 text-sm">Production Risk</div>
            </div>
          </motion.div>

          {/* Bottom Impact Statement */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center"
          >
            <div
              className="inline-block px-6 py-4 rounded-2xl max-w-4xl"
              style={{
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(237, 39, 56, 0.1) 100%)',
                border: '2px solid rgba(239, 68, 68, 0.3)',
                boxShadow: '0 8px 32px rgba(239, 68, 68, 0.2)'
              }}
            >
              <p className="text-xl md:text-2xl font-bold text-white mb-1">
                Missed edge cases = Model blind spots
              </p>
              <p className="text-base md:text-lg text-red-200">
                In autonomous vehicles, that's not just inefficiency — <span className="font-bold">it's a safety liability</span>
              </p>
            </div>
          </motion.div>
        </div>
      </section>


      {/* Features Section */}
      <section className="bg-surface-primary px-6 py-16">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-10">
            <span className="eyebrow text-nvidia-green">Capabilities</span>
            <h2 className="heading-2 mt-2 mb-3">
              Multimodal AI Search
            </h2>
            <p className="body-text max-w-2xl mx-auto">
              Search across different content types using natural language. Our AI understands the meaning behind your queries.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <FeatureCard
              icon={<Image className="w-8 h-8" />}
              title="Image Search"
              description="Upload images and search using natural language. CLIP embeddings enable semantic understanding of visual content."
              features={['Auto-captioning with BLIP', 'Object detection', 'Semantic embeddings']}
              color="ddn"
            />
            <FeatureCard
              icon={<Video className="w-8 h-8" />}
              title="Video Search"
              description="Process videos frame-by-frame for comprehensive understanding. Find moments based on visual or textual descriptions."
              features={['Frame extraction', 'Scene analysis', 'Motion detection']}
              color="nvidia"
            />
            <FeatureCard
              icon={<FileText className="w-8 h-8" />}
              title="Document Search"
              description="Semantic search across PDF and Word documents. AI summarization extracts key insights automatically."
              features={['Text extraction', 'Auto summarization', 'Key term identification']}
              color="blue"
            />
          </div>

          {/* How It Works */}
          <div className="mt-16">
            <h3 className="heading-3 mb-8 text-center">How It Works</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <StepCard number="01" title="Upload" description="Upload images, videos, or documents to DDN INFINIA storage" />
              <StepCard number="02" title="Analyze" description="AI models analyze and extract semantic meaning from content" />
              <StepCard number="03" title="Embed" description="Generate embeddings and export to JSON, stored in DDN INFINIA" />
              <StepCard number="04" title="Search" description="Query using natural language and find relevant content" />
            </div>
          </div>

          {/* Architecture Diagram - VSS Style */}
          <div className="mt-16">
            <h3 className="heading-3 mb-8 text-center">
              VSS Blueprint Architecture
            </h3>

            <div className="card p-8" style={{ background: 'var(--surface-card)' }}>
              {/* Pipeline Labels */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* INGESTION PIPELINE */}
                <div>
                  <div className="mb-6 pb-4 border-b-2" style={{ borderColor: 'rgba(118, 185, 0, 0.3)' }}>
                    <h4 className="text-lg font-bold text-nvidia-green flex items-center gap-2">
                      <Database className="w-5 h-5" />
                      DATA INGESTION PIPELINE
                    </h4>
                    <p className="text-xs mt-1" style={{ color: '#1F2937' }}>Video processing, chunking & embedding generation</p>
                  </div>

                  {/* Ingestion Flow */}
                  <div className="space-y-4">
                    {/* Input Sources */}
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-24 text-sm font-bold" style={{ color: '#1F2937' }}>Input</div>
                      <div className="flex gap-2">
                        <div className="px-3 py-2 rounded-lg border" style={{ background: 'rgba(16, 185, 129, 0.2)', borderColor: 'rgba(16, 185, 129, 0.5)' }}>
                          <Video className="w-5 h-5 mx-auto mb-1" style={{ color: '#10B981' }} />
                          <span className="text-sm font-bold" style={{ color: '#10B981' }}>Videos</span>
                        </div>
                        <div className="px-3 py-2 rounded-lg border" style={{ background: 'rgba(16, 185, 129, 0.2)', borderColor: 'rgba(16, 185, 129, 0.5)' }}>
                          <Image className="w-5 h-5 mx-auto mb-1" style={{ color: '#10B981' }} />
                          <span className="text-sm font-bold" style={{ color: '#10B981' }}>Images</span>
                        </div>
                      </div>
                    </div>

                    {/* Processing Steps */}
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-24 text-sm font-bold" style={{ color: '#1F2937' }}>Process</div>
                      <div className="flex-1 space-y-2">
                        <div className="px-3 py-2 rounded-lg border text-center" style={{ background: 'rgba(59, 130, 246, 0.2)', borderColor: 'rgba(59, 130, 246, 0.5)' }}>
                          <div className="text-sm font-bold" style={{ color: '#60A5FA' }}>Video Chunker</div>
                          <div className="text-xs" style={{ color: '#374151' }}>10s segments</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-24"></div>
                      <div className="flex-1">
                        <div className="px-3 py-2 rounded-lg border text-center" style={{ background: 'rgba(59, 130, 246, 0.2)', borderColor: 'rgba(59, 130, 246, 0.5)' }}>
                          <div className="text-sm font-bold" style={{ color: '#60A5FA' }}>Frame Extractor</div>
                          <div className="text-xs" style={{ color: '#374151' }}>OpenCV processing</div>
                        </div>
                      </div>
                    </div>

                    {/* AI Models */}
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-24 text-sm font-bold" style={{ color: '#1F2937' }}>AI Models</div>
                      <div className="flex-1 space-y-2">
                        <div className="px-3 py-2 rounded-lg border" style={{ background: 'rgba(16, 185, 129, 0.2)', borderColor: 'rgba(16, 185, 129, 0.5)' }}>
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <Zap className="w-4 h-4" style={{ color: '#10B981' }} />
                            <span className="text-sm font-bold" style={{ color: '#10B981' }}>CLIP Embeddings</span>
                          </div>
                          <div className="text-xs text-center" style={{ color: '#374151' }}>Visual-semantic encoding</div>
                        </div>
                        <div className="px-3 py-2 rounded-lg border" style={{ background: 'rgba(16, 185, 129, 0.2)', borderColor: 'rgba(16, 185, 129, 0.5)' }}>
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <Zap className="w-4 h-4" style={{ color: '#10B981' }} />
                            <span className="text-sm font-bold" style={{ color: '#10B981' }}>BLIP Captions</span>
                          </div>
                          <div className="text-xs text-center" style={{ color: '#374151' }}>Auto-captioning</div>
                        </div>
                      </div>
                    </div>

                    {/* Storage */}
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-24 text-sm font-bold" style={{ color: '#1F2937' }}>Store</div>
                      <div className="flex-1">
                        <div className="px-4 py-3 rounded-lg border text-center" style={{ background: 'rgba(239, 68, 68, 0.2)', borderColor: 'rgba(239, 68, 68, 0.5)' }}>
                          <div className="text-base font-bold mb-2" style={{ color: '#EF4444' }}>DDN INFINIA</div>
                          <div className="flex justify-center gap-2 flex-wrap">
                            <span className="text-xs px-2 py-1 rounded font-bold" style={{ background: 'rgba(255, 255, 255, 0.9)', color: '#DC2626', border: '1px solid rgba(220, 38, 38, 0.3)' }}>embeddings</span>
                            <span className="text-xs px-2 py-1 rounded font-bold" style={{ background: 'rgba(255, 255, 255, 0.9)', color: '#DC2626', border: '1px solid rgba(220, 38, 38, 0.3)' }}>manifest</span>
                            <span className="text-xs px-2 py-1 rounded font-bold" style={{ background: 'rgba(255, 255, 255, 0.9)', color: '#DC2626', border: '1px solid rgba(220, 38, 38, 0.3)' }}>metadata</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RETRIEVAL PIPELINE */}
                <div>
                  <div className="mb-6 pb-4 border-b-2" style={{ borderColor: 'rgba(0, 122, 255, 0.3)' }}>
                    <h4 className="text-lg font-bold flex items-center gap-2" style={{ color: '#007AFF' }}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      SEMANTIC RETRIEVAL PIPELINE
                    </h4>
                    <p className="text-xs mt-1" style={{ color: '#6B7280' }}>Query processing, matching & ranking</p>
                  </div>

                  {/* Retrieval Flow */}
                  <div className="space-y-4">
                    {/* User Query */}
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-20 text-xs font-semibold" style={{ color: '#6B7280' }}>Input</div>
                      <div className="flex-1">
                        <div className="px-3 py-2 rounded-lg border text-center" style={{ background: 'rgba(59, 130, 246, 0.15)', borderColor: 'rgba(59, 130, 246, 0.4)' }}>
                          <div className="text-xs font-bold" style={{ color: '#3B82F6' }}>User Query</div>
                          <div className="text-[10px]" style={{ color: '#6B7280' }}>Natural language search</div>
                        </div>
                      </div>
                    </div>

                    {/* Embedding */}
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-20 text-xs font-semibold" style={{ color: '#6B7280' }}>Encode</div>
                      <div className="flex-1">
                        <div className="px-3 py-2 rounded-lg border text-center" style={{ background: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.4)' }}>
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <Zap className="w-3 h-3" style={{ color: '#10B981' }} />
                            <span className="text-xs font-bold" style={{ color: '#10B981' }}>CLIP Encoder</span>
                          </div>
                          <div className="text-[10px]" style={{ color: '#6B7280' }}>Query → Embedding</div>
                        </div>
                      </div>
                    </div>

                    {/* Vector Search */}
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-20 text-xs font-semibold" style={{ color: '#6B7280' }}>Match</div>
                      <div className="flex-1 space-y-2">
                        <div className="px-3 py-2 rounded-lg border text-center" style={{ background: 'rgba(147, 51, 234, 0.15)', borderColor: 'rgba(147, 51, 234, 0.4)' }}>
                          <div className="text-xs font-bold" style={{ color: '#A78BFA' }}>FAISS Index</div>
                          <div className="text-[10px]" style={{ color: '#6B7280' }}>Cosine similarity</div>
                        </div>
                        <div className="px-3 py-2 rounded-lg border text-center" style={{ background: 'rgba(147, 51, 234, 0.15)', borderColor: 'rgba(147, 51, 234, 0.4)' }}>
                          <div className="text-xs font-bold" style={{ color: '#A78BFA' }}>Metadata Filter</div>
                          <div className="text-[10px]" style={{ color: '#6B7280' }}>Tags, captions, timestamps</div>
                        </div>
                      </div>
                    </div>

                    {/* Ranking */}
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-20 text-xs font-semibold" style={{ color: '#6B7280' }}>Rank</div>
                      <div className="flex-1">
                        <div className="px-3 py-2 rounded-lg border text-center" style={{ background: 'rgba(251, 146, 60, 0.15)', borderColor: 'rgba(251, 146, 60, 0.4)' }}>
                          <div className="text-xs font-bold" style={{ color: '#FB923C' }}>Semantic Ranking</div>
                          <div className="text-[10px]" style={{ color: '#6B7280' }}>Relevance scoring</div>
                        </div>
                      </div>
                    </div>

                    {/* Results */}
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-20 text-xs font-semibold" style={{ color: '#6B7280' }}>Return</div>
                      <div className="flex-1">
                        <div className="px-4 py-3 rounded-lg border text-center" style={{ background: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.4)' }}>
                          <div className="text-sm font-bold mb-1" style={{ color: '#EF4444' }}>Results</div>
                          <div className="flex justify-center gap-1 flex-wrap">
                            <span className="text-[10px] px-2 py-0.5 rounded font-semibold" style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#FCA5A5' }}>Presigned URLs</span>
                            <span className="text-[10px] px-2 py-0.5 rounded font-semibold" style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#FCA5A5' }}>Metadata</span>
                            <span className="text-[10px] px-2 py-0.5 rounded font-semibold" style={{ background: 'rgba(255, 255, 255, 0.15)', color: '#FCA5A5' }}>Scores</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Technology Stack Footer */}
              <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="flex flex-wrap justify-center gap-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.3)', border: '1px solid' }}>
                    <Zap className="w-3.5 h-3.5" style={{ color: '#10B981' }} />
                    <span className="text-xs font-bold" style={{ color: '#10B981' }}>NVIDIA GPU</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.3)', border: '1px solid' }}>
                    <Database className="w-3.5 h-3.5" style={{ color: '#EF4444' }} />
                    <span className="text-xs font-bold" style={{ color: '#EF4444' }}>DDN INFINIA</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(251, 146, 60, 0.15)', borderColor: 'rgba(251, 146, 60, 0.3)', border: '1px solid' }}>
                    <span className="text-xs font-bold" style={{ color: '#FB923C' }}>FastAPI</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(59, 130, 246, 0.15)', borderColor: 'rgba(59, 130, 246, 0.3)', border: '1px solid' }}>
                    <span className="text-xs font-bold" style={{ color: '#3B82F6' }}>React + TypeScript</span>
                  </div>
                </div>
                <p className="text-center text-xs mt-4" style={{ color: 'var(--text-muted)' }}>
                  Production-ready VSS Blueprint architecture powered by DDN INFINIA storage
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Technology Section */}
      < section className="bg-surface-base px-6 py-16" >
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-10">
            <span className="eyebrow text-ddn-red">Technology</span>
            <h2 className="heading-2 mt-2 mb-3">
              Powered By
            </h2>
            <p className="body-text max-w-2xl mx-auto mb-8">
              Built on enterprise-grade infrastructure with NVIDIA GPU-accelerated AI models for maximum performance.
            </p>

            {/* Logo Grid */}
            <div className="flex items-center justify-center gap-12 mb-12">
              <div className="flex flex-col items-center">
                <img src="/logo-ddn.svg" alt="DDN" className="h-12 w-auto" />
              </div>
              <div className="text-4xl text-text-muted">×</div>
              <div className="flex flex-col items-center">
                <img src="/nvidia-logo-light.png" alt="NVIDIA" className="h-12 w-auto" />
              </div>
            </div>
          </div>

          {/* GPU Acceleration Highlight */}
          <div className="card p-6 mb-8 border-2" style={{ borderColor: 'rgba(118, 185, 0, 0.3)', background: 'linear-gradient(135deg, rgba(118, 185, 0, 0.05) 0%, rgba(118, 185, 0, 0.02) 100%)' }}>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-nvidia-green/10">
                <Zap className="w-8 h-8 text-nvidia-green" />
              </div>
              <div>
                <h3 className="heading-3 mb-2 flex items-center gap-2">
                  <span>NVIDIA GPU Acceleration</span>
                  <span className="px-2 py-0.5 rounded-md bg-nvidia-green/10 text-nvidia-green text-xs font-bold">POWERED</span>
                </h3>
                <p className="body-text mb-4">
                  All AI models run on NVIDIA GPUs for blazing-fast inference. CUDA-optimized PyTorch delivers up to <strong>100x faster</strong> processing compared to CPU-only inference, enabling real-time semantic search across massive media libraries.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-start gap-2">
                    <Zap className="w-5 h-5 text-nvidia-green" />
                    <div>
                      <div className="text-sm font-semibold text-text-primary">Instant Embeddings</div>
                      <div className="text-xs text-text-muted">CLIP/BLIP on GPU</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-nvidia-green" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2L12 8H18L13 12L15 18L10 14L5 18L7 12L2 8H8L10 2Z" />
                    </svg>
                    <div>
                      <div className="text-sm font-semibold text-text-primary">Batch Processing</div>
                      <div className="text-xs text-text-muted">Parallel workloads</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-nvidia-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <div>
                      <div className="text-sm font-semibold text-text-primary">Auto Scaling</div>
                      <div className="text-xs text-text-muted">CPU fallback ready</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="card p-6">
              <h3 className="heading-3 mb-4 flex items-center gap-2">
                <Database className="w-5 h-5 text-ddn-red" />
                Storage & Infrastructure
              </h3>
              <ul className="space-y-3">
                {[
                  { name: 'DDN INFINIA', desc: 'High-performance S3-compatible storage with GPU-Direct capabilities' },
                  { name: 'FastAPI', desc: 'Modern async Python framework optimized for GPU workloads' },
                  { name: 'PyTorch', desc: 'CUDA-accelerated deep learning framework for GPU inference' },
                ].map((tech) => (
                  <li key={tech.name} className="flex items-start gap-3 text-sm">
                    <span className="w-1.5 h-1.5 bg-ddn-red rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{tech.name}</span>
                      <span style={{ color: 'var(--text-muted)' }}> — {tech.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-6">
              <h3 className="heading-3 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-nvidia-green" />
                GPU-Accelerated AI Models
              </h3>
              <ul className="space-y-3">
                {[
                  { name: 'CLIP', desc: 'Vision-language embeddings with NVIDIA tensor cores' },
                  { name: 'BLIP', desc: 'GPU-accelerated image captioning by Salesforce' },
                  { name: 'ViT', desc: 'Vision transformer for scene classification on GPU' },
                ].map((tech) => (
                  <li key={tech.name} className="flex items-start gap-3 text-sm">
                    <span className="w-1.5 h-1.5 bg-nvidia-green rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{tech.name}</span>
                      <span style={{ color: 'var(--text-muted)' }}> — {tech.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Use Cases */}
          <div className="mb-12">
            <h3 className="heading-3 mb-6 text-center">Use Cases</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                'Digital Asset Management',
                'Media Libraries',
                'Content Discovery',
                'Visual Search',
                'Document Intelligence',
                'Video Analysis',
                'E-commerce',
                'Brand Monitoring'
              ].map((useCase) => (
                <span
                  key={useCase}
                  className="bg-surface-secondary px-4 py-2 rounded-full text-sm font-medium border transition-colors"
                  style={{
                    color: 'var(--text-secondary)',
                    borderColor: 'var(--border-subtle)'
                  }}
                >
                  {useCase}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section >

      {/* CTA Section */}
      < section className="px-6 py-20" style={{ background: 'linear-gradient(135deg, var(--ddn-red) 0%, var(--ddn-red-hover) 100%)' }
      }>
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ letterSpacing: '-0.02em' }}>
              Ready to Try It?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              Configure your storage, upload content, and experience AI-powered multimodal search.
            </p>
            <button
              onClick={onStartDemo}
              className="inline-flex items-center gap-3 bg-white text-neutral-900 px-8 py-4 rounded-xl font-semibold text-lg"
              style={{
                transition: 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 200ms cubic-bezier(0.16, 1, 0.3, 1)',
                willChange: 'transform'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.03) translateZ(0)'
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) translateZ(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'scale(0.98) translateZ(0)'
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'scale(1.03) translateZ(0)'
              }}
            >
              Start the Demo
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section >

      {/* Footer */}
      < section className="bg-neutral-900 px-6 py-8" >
        <div className="max-w-[1280px] mx-auto text-center">
          <p className="text-white/40 text-sm">
            DDN INFINIA Multimodal Semantic Search Demo
          </p>
        </div>
      </section >
    </div >
  )
}



function StatCardWithIcon({
  icon,
  value,
  label,
  description
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  description: string
}) {
  return (
    <div
      className="p-5 rounded-xl text-center relative overflow-hidden group"
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'all 200ms ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
        e.currentTarget.style.borderColor = 'rgba(118, 185, 0, 0.3)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
      }}
    >
      <div className="flex justify-center mb-3 text-nvidia-green opacity-80">
        {icon}
      </div>
      <div className="text-xl md:text-2xl font-bold mb-1 text-white">
        {value}
      </div>
      <div className="text-white/80 font-medium text-sm">{label}</div>
      <div className="text-white/40 text-xs mt-1">{description}</div>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  features,
  color
}: {
  icon: React.ReactNode
  title: string
  description: string
  features: string[]
  color: 'ddn' | 'nvidia' | 'blue'
}) {
  const colors = {
    ddn: { hex: '#ED2738', bg: 'rgba(237, 39, 56, 0.08)' },
    nvidia: { hex: '#76B900', bg: 'rgba(118, 185, 0, 0.08)' },
    blue: { hex: '#1A81AF', bg: 'rgba(26, 129, 175, 0.08)' }
  }

  return (
    <div className="card p-6 relative overflow-hidden">
      <div
        className="absolute top-0 left-0 w-full h-1"
        style={{ backgroundColor: colors[color].hex }}
      />
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
        style={{ backgroundColor: colors[color].bg, color: colors[color].hex }}
      >
        {icon}
      </div>
      <h4 className="font-semibold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h4>
      <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{description}</p>
      <ul className="space-y-2">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: colors[color].hex }}
            />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  )
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="card p-5 text-center">
      <div
        className="inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold mb-3"
        style={{ backgroundColor: 'var(--ddn-red-light)', color: 'var(--ddn-red)' }}
      >
        {number}
      </div>
      <h4 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h4>
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{description}</p>
    </div>
  )
}
