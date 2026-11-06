import { useEffect, useRef, useState, useCallback } from 'react'
import anime from 'animejs'
import photo from './assets/photo.webp'
import './index.css'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*'
const TARGET = 'NITHISH'

function useScramble(ref) {
  const si = useRef(null)
  return useCallback(() => {
    let iter = 0
    clearInterval(si.current)
    si.current = setInterval(() => {
      if (!ref.current) return
      const textEl = ref.current.querySelector('.name-text')
      if (!textEl) return
      textEl.textContent = TARGET.split('').map((c, i) =>
        i < Math.floor(iter / 2) ? c : CHARS[Math.floor(Math.random() * CHARS.length)]
      ).join('')
      if (iter >= TARGET.length * 2) { textEl.textContent = TARGET; clearInterval(si.current) }
      iter++
    }, 40)
  }, [ref])
}

function Intro({ onDone }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    setTimeout(() => {
      anime({ targets: el.querySelector('.intro-name'), clipPath: ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'], duration: 800, easing: 'cubicBezier(0.77,0,0.18,1)' })
    }, 100)
    setTimeout(() => {
      anime({ targets: el, opacity: [1, 0], duration: 500, easing: 'easeOutQuad', complete: onDone })
    }, 1200)
  }, [onDone])
  return (
    <div ref={ref} id="intro">
      <div className="intro-name">NITHISH<span style={{ color: 'var(--ac)' }}>.</span></div>
    </div>
  )
}

function CursorGlow() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    const move = e => { el.style.left = e.clientX + 'px'; el.style.top = e.clientY + 'px' }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])
  return <div ref={ref} id="cursor-glow" />
}

function Header() {
  useEffect(() => {
    anime({ targets: 'header', translateY: ['-100%', '0%'], opacity: [0, 1], duration: 600, delay: 900, easing: 'easeOutCubic' })
  }, [])
  return (
    <header>
      <div className="wrap header-inner">
        <div className="logo"><span className="logo-init">NB</span>NITHISH.</div>
        <nav>
          <a href="#about">About</a><a href="#flagships">Flagships</a>
          <a href="#matrix">Matrix</a><a href="#contact">Contact</a>
        </nav>
        <div className="h-right">
          <div className="avail"><span className="avail-dot" />Available</div>
          <a href="#contact" className="btn-hdr">DISPATCH →</a>
        </div>
      </div>
    </header>
  )
}

function HeroStats() {
  const stats = [{ target: 12, suffix: '+', label: 'Production Apps' }, { target: 5, suffix: '', label: 'Core Stack Layers' }, { target: 100, suffix: '%', label: 'Type-Safe APIs' }]
  const ref = useRef(null); const animated = useRef(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || animated.current) return
      animated.current = true
      ref.current.querySelectorAll('.count').forEach(el => {
        const tgt = +el.dataset.target
        const obj = { val: 0 }
        anime({ targets: obj, val: tgt, round: 1, duration: 1200, easing: 'easeOutExpo', update: () => { el.textContent = Math.round(obj.val) } })
      })
    }, { threshold: 0.5 })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className="hero-stats anim-child">
      {stats.map(s => (
        <div key={s.label} className="stat">
          <span className="stat-n"><span className="count" data-target={s.target}>0</span><span className="a">{s.suffix}</span></span>
          <span className="stat-l">{s.label}</span>
        </div>
      ))}
    </div>
  )
}

function HeroRight() {
  useEffect(() => {
    anime({ targets: '.hero-right', opacity: [0, 1], translateX: [24, 0], delay: 1600, duration: 700, easing: 'easeOutCubic' })
  }, [])
  const cards = [
    { title: 'Multi-model orchestration engine', desc: 'Async task queuing, streaming inference, and provider routing — no cloud lock-in.' },
    { title: 'Multi-tenant full-stack product', desc: 'Auth, billing, RBAC, and RLS — deployed end-to-end with zero config drift.' },
    { title: 'Profiled, cached, production-grade', desc: 'Connection pooling, structured logs, p95 latency under 50ms.' },
  ]
  return (
    <div className="hero-right">
      <div className="hero-portrait">
        <img src={photo} alt="Nithish" loading="eager" />
        <div className="portrait-label">Nithish — Full-Stack & AI Engineer</div>
      </div>
      <div className="hero-status-badge">● FULL-STACK AI ACTIVE</div>
      {cards.map((c, i) => (
        <div key={i} className="h-card"
          onMouseEnter={e => anime({ targets: e.currentTarget, translateY: -3, duration: 200 })}
          onMouseLeave={e => anime({ targets: e.currentTarget, translateY: 0, duration: 200 })}>
          <div className="h-card-num">0{i + 1}. RUNTIME</div>
          <div className="h-card-title">{c.title}</div>
          <div className="h-card-desc">{c.desc}</div>
        </div>
      ))}
    </div>
  )
}

function Hero({ nameRef, scramble }) {
  useEffect(() => {
    const els = document.querySelectorAll('.anim-child')
    anime({ targets: [...els], opacity: [0, 1], translateY: [20, 0], delay: anime.stagger(100, { start: 1400 }), duration: 600, easing: 'easeOutCubic' })
    anime({ targets: '.eyebrow-line', width: ['0px', '32px'], delay: 1600, duration: 500, easing: 'easeOutCubic' })
    setTimeout(scramble, 1600)
    const gi = setInterval(() => {
      if (Math.random() > 0.7 && nameRef.current) {
        nameRef.current.style.textShadow = '2px 0 var(--ac),-2px 0 rgba(0,255,200,.4)'
        setTimeout(() => { if (nameRef.current) nameRef.current.style.textShadow = '' }, 80)
      }
    }, 3000)
    return () => clearInterval(gi)
  }, [nameRef, scramble])

  return (
    <section className="hero">
      <div className="wrap">
        <div className="hero-inner">
          <div>
            <div className="hero-eyebrow anim-child"><span className="eyebrow-line" />PORTFOLIO</div>
            <div className="anim-child" style={{ fontFamily: 'var(--ffm)', fontSize: 11, letterSpacing: '.18em', color: 'var(--fm)', textTransform: 'uppercase', marginBottom: 14 }}>Hello, I'm</div>
            <h1 ref={nameRef} className="hero-name anim-child" onMouseEnter={scramble}>
              <span className="name-text">NITHISH</span><span className="dot">.</span>
            </h1>
            <div className="hero-role anim-child">Full-Stack Engineer & AI Systems Architect</div>
            <p className="hero-tagline anim-child">Engineering production-grade AI pipelines, full-stack applications, and intelligent automation systems — from database schema to deployed inference, built from first principles.</p>
            <div className="hero-ctas anim-child">
              <a href="#contact" className="btn-primary">INITIATE DISPATCH</a>
              <a href="#flagships" className="btn-outline">EXPLORE ARCHITECTURE →</a>
            </div>
            <HeroStats />
            <div className="hero-tags anim-child">
              {['React', 'Next.js', 'Python', 'FastAPI', 'Node.js', 'PyTorch', 'Docker', 'PostgreSQL'].map(t => <span key={t} className="tag">{t}</span>)}
            </div>
          </div>
          <HeroRight />
        </div>
      </div>
    </section>
  )
}

function RevealSection({ children, delay = 0 }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    el.style.opacity = 0; el.style.transform = 'translateY(22px)'
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      anime({ targets: el, opacity: [0, 1], translateY: [22, 0], duration: 600, delay, easing: 'easeOutCubic' })
      io.disconnect()
    }, { threshold: 0.1 })
    io.observe(el)
    return () => io.disconnect()
  }, [delay])
  return <div ref={ref}>{children}</div>
}

function About() {
  return (
    <section className="section" id="about">
      <div className="wrap">
        <RevealSection><div className="sec-label">// 01.00 SEC_ABOUT INDEX <span className="sec-index">[01 / 05]</span></div></RevealSection>
        <div className="about-grid">
          <RevealSection>
            <div className="about-photo">
              <img src={photo} alt="Nithish" loading="lazy" />
              <div className="about-photo-label">NITHISH — Full-Stack & AI Engineer</div>
            </div>
          </RevealSection>
          <RevealSection delay={120}>
            <h2 className="about-h">Background &<br />Philosophy</h2>
            <p className="about-p">Full-stack engineer and AI systems architect working at the intersection of intelligent automation and scalable web infrastructure. I own the full vertical — data modelling, API design, real-time frontends, and ML model deployment — with the same rigour at every layer.</p>
            <p className="about-p">Self-taught in machine learning architectures, vector retrieval systems, and production backend engineering. I view software as composing layers of data flow, state management, and inference — not assembling frameworks.</p>
            <blockquote className="about-quote">Designing and deploying full-stack AI systems that run in production 24/7 — with observable performance, type-safe contracts, and zero unnecessary abstraction.</blockquote>
            <div className="principles">
              {[['Precision Architecture', 'Every abstraction earns its place. Shared utilities form after the third genuine repetition — never speculatively.'],
                ['AI-Native Engineering', 'LLMs, embeddings, and retrieval systems are first-class infrastructure with the same reliability contracts as any other service layer.'],
                ['Observable by Default', 'Systems emit structured logs, traces, and metrics from day one. Debugging a production incident should never be archaeology.']
              ].map(([name, body]) => (
                <div key={name} className="principle"
                  onMouseEnter={e => anime({ targets: e.currentTarget, translateX: 4, duration: 200 })}
                  onMouseLeave={e => anime({ targets: e.currentTarget, translateX: 0, duration: 200 })}>
                  <div className="principle-name">{name}</div>
                  <div className="principle-body">{body}</div>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </div>
    </section>
  )
}

function StackLayer({ num, name, tech, detail }) {
  const [open, setOpen] = useState(false)
  const detailRef = useRef(null)
  const toggle = () => {
    setOpen(o => {
      if (!o) setTimeout(() => { if (detailRef.current) anime({ targets: detailRef.current, opacity: [0, 1], translateY: [-6, 0], duration: 250, easing: 'easeOutCubic' }) }, 0)
      return !o
    })
  }
  return (
    <div className={`s-layer${open ? ' open' : ''}`} onClick={toggle}>
      <span className="s-num">{num}</span>
      <span className="s-name">{name}</span>
      <span className="s-tech">{tech}</span>
      {open && <div ref={detailRef} className="s-detail">{detail}</div>}
    </div>
  )
}

function Flagships() {
  const layers = [
    ['L1', 'Ingestion Pipeline', 'Python · Celery', 'Document parsing, chunking strategy (recursive character split), and async worker queue. Supports PDF, Markdown, and HTML sources.'],
    ['L2', 'Embedding Store', 'pgvector · Ada-002', '1536-dim vectors stored in Postgres with HNSW index. Batch embedding generation with retry logic and schema versioning.'],
    ['L3', 'Retrieval Engine', 'ANN · Re-ranking', 'Hybrid retrieval: cosine similarity ANN search + BM25 keyword fallback. Cross-encoder re-ranking on top-20 candidates.'],
    ['L4', 'LLM Gateway', 'Streaming · Context mgmt', 'FastAPI SSE endpoint with dynamic context assembly, token budgeting, and conversation memory compression. Provider-agnostic.'],
    ['L5', 'Chat UI', 'Next.js · React', 'Streaming markdown renderer with syntax highlighting, citation links, and optimistic message state. Workspace-scoped auth.'],
  ]
  const smCards = [
    { cat: 'Mobile · Commerce', title: 'Offline-First Retail App', desc: 'React Native inventory and invoicing system for retail SMBs. Offline SQLite mode syncs to Supabase on reconnect, with Bluetooth receipt printing.', bullets: ['SQLite WAL + conflict-free CRDT sync', 'ESC/POS Bluetooth thermal printing', 'Real-time P&L and inventory dashboard'], tags: ['React Native', 'SQLite', 'Supabase'] },
    { cat: 'AI Agent · Automation', title: 'Autonomous Data Analyst', desc: 'LLM-powered agent that accepts natural language queries against structured databases, generates SQL via tool use, validates results, and renders charts.', bullets: ['Tool-use driven SQL generation', 'Automatic schema reflection', 'Chart rendering via Vega-Lite'], tags: ['Python', 'Claude API', 'PostgreSQL'] },
    { cat: 'Platform · SaaS', title: 'Multi-Tenant SaaS Platform', desc: 'Production-ready Next.js + Node.js template with org-scoped workspaces, Stripe billing, role-based access control, and one-command deploy.', bullets: ['JWT + refresh token auth flow', 'Stripe webhooks + metered billing', 'Postgres RLS row-level security'], tags: ['Next.js', 'Node.js', 'Stripe'] },
  ]
  return (
    <section className="section" id="flagships">
      <div className="wrap">
        <RevealSection><div className="sec-label">// 02.00 FLAGSHIP DEPLOYMENTS <span className="sec-index">[02 / 05]</span></div></RevealSection>
        <RevealSection><h2 className="flagships-h">Production Deployments</h2></RevealSection>
        <RevealSection><p className="flagships-sub">End-to-end architectures built and shipped — from schema design to live traffic.</p></RevealSection>
        <div className="flagship-grid">
          <RevealSection>
            <div className="f-card featured">
              <div>
                <div className="f-cat">Core System · AI + Full-Stack</div>
                <div className="f-title large">RAG Knowledge<br />Platform</div>
                <p className="f-desc">A retrieval-augmented generation system layering a Next.js chat UI over a FastAPI backend with Postgres + pgvector. Documents are ingested, chunked, embedded, and queryable via streaming LLM responses with multi-tenant workspaces.</p>
                <div className="f-tags">{['Next.js', 'FastAPI', 'pgvector', 'Claude API', 'Docker'].map(t => <span key={t} className="tag">{t}</span>)}</div>
              </div>
              <div className="stack-wrap">
                <div className="stack-title">5-LAYER ARCHITECTURE (CLICK TO INSPECT)</div>
                {layers.map(([n, name, tech, detail]) => <StackLayer key={n} num={n} name={name} tech={tech} detail={detail} />)}
              </div>
            </div>
          </RevealSection>
          {smCards.map((c, i) => (
            <RevealSection key={i} delay={i * 80}>
              <div className="f-card">
                <div className="f-cat">{c.cat}</div>
                <div className="f-title">{c.title}</div>
                <p className="f-desc">{c.desc}</p>
                <div className="f-bullets">{c.bullets.map(b => <span key={b}>{b}</span>)}</div>
                <div className="f-tags">{c.tags.map(t => <span key={t} className="tag">{t}</span>)}</div>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  )
}

function Matrix() {
  const [filter, setFilter] = useState('all')
  const cards = [
    { id: 'SYS-01', cat: 'ai', title: 'Multi-Agent Workflow Engine', desc: 'Planner + specialist agent architecture for document processing — extractor, validator, and formatter agents share a working memory scratchpad via a Redis state bus.', tags: ['Multi-Agent', 'LangGraph', 'Redis'] },
    { id: 'SYS-02', cat: 'ai', title: 'Fine-Tuned Classifier API', desc: 'DistilBERT fine-tuned on domain labels, exported to ONNX, served via FastAPI with request batching and async handling. p95 latency under 20ms in production.', tags: ['PyTorch', 'ONNX', 'FastAPI'] },
    { id: 'SYS-03', cat: 'fs', title: 'Real-Time Collaboration Editor', desc: 'WebSocket-based collaborative document editor with operational transform conflict resolution, presence cursors, and persistent undo history via event sourcing.', tags: ['WebSocket', 'React', 'Redis'] },
    { id: 'SYS-04', cat: 'infra', title: 'GPU-Accelerated Embedding Pipeline', desc: 'CUDA-optimised batch embedding generation using sentence-transformers on GPU. Processes 50k documents per hour with automatic batch size tuning.', tags: ['CUDA', 'Python', 'PyTorch'] },
    { id: 'SYS-05', cat: 'ai', title: 'Semantic Search Engine', desc: 'End-to-end pipeline: chunking, embedding, pgvector indexing, and hybrid BM25 + cosine similarity retrieval with cross-encoder re-ranking across 1M+ documents.', tags: ['pgvector', 'Embeddings', 'Python'] },
    { id: 'SYS-06', cat: 'fs', title: 'Event-Driven Notification System', desc: 'Pub/sub architecture using Postgres LISTEN/NOTIFY for database-triggered events, fanning out to email, in-app, and webhook delivery with retry queues.', tags: ['Node.js', 'Postgres', 'Webhooks'] },
  ]
  const filters = [{ k: 'all', l: 'All Systems (6)' }, { k: 'ai', l: 'Autonomous AI' }, { k: 'fs', l: 'Full-Stack' }, { k: 'infra', l: 'Core Engineering' }]
  const visible = filter === 'all' ? cards : cards.filter(c => c.cat === filter)
  return (
    <section className="section" id="matrix">
      <div className="wrap">
        <RevealSection><div className="sec-label">// 03.00 SYSTEMS MATRIX <span className="sec-index">[03 / 05]</span></div></RevealSection>
        <RevealSection><h2 className="matrix-h">Systems Matrix</h2></RevealSection>
        <RevealSection><p className="matrix-sub">Architectures spanning full-stack applications, AI pipelines, and infrastructure engineering.</p></RevealSection>
        <RevealSection>
          <div className="filter-bar">
            {filters.map(f => <button key={f.k} className={`f-btn${filter === f.k ? ' active' : ''}`} onClick={() => setFilter(f.k)}>{f.l}</button>)}
          </div>
        </RevealSection>
        <div className="m-grid">
          {visible.map((c, i) => (
            <RevealSection key={c.id} delay={i * 50}>
              <div className="m-card"
                onMouseEnter={e => anime({ targets: e.currentTarget, translateY: -4, duration: 200 })}
                onMouseLeave={e => anime({ targets: e.currentTarget, translateY: 0, duration: 200 })}>
                <div className="m-id">{c.id}</div>
                <div className="m-title">{c.title}</div>
                <div className="m-desc">{c.desc}</div>
                <div className="m-tags">{c.tags.map(t => <span key={t} className="tag">{t}</span>)}</div>
              </div>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  const [copied, setCopied] = useState(false)
  const email = 'nithishbala1312@gmail.com'
  const doCopy = () => { navigator.clipboard?.writeText(email).then(() => { setCopied(true); setTimeout(() => setCopied(false), 3000) }) }
  return (
    <section id="contact">
      <div className="wrap contact-wrap">
        <RevealSection><div className="sec-label" style={{ justifyContent: 'center', marginBottom: 20 }}>// 04.00 CONTACT INDEX <span className="sec-index">[04 / 05]</span></div></RevealSection>
        <RevealSection><h2 className="contact-h">Let's Architect Something<br />Extraordinary.</h2></RevealSection>
        <RevealSection><p className="contact-desc">Available for production AI system design, full-stack product engineering, and technical advisory worldwide.</p></RevealSection>
        <RevealSection>
          <div className="contact-email-row">
            <span className="email-text">{email}</span>
            <button className={`btn-copy${copied ? ' ok' : ''}`} onClick={doCopy}>{copied ? '✓ Copied' : 'Copy Email Address'}</button>
          </div>
          {copied && <div className="copy-confirm">✓ Email copied: {email}</div>}
        </RevealSection>
        <RevealSection>
          <div className="socials">
            <a href="https://github.com/zoro-2001" target="_blank" rel="noopener" className="soc">GitHub ↗</a>
            <a href="https://linkedin.com/" target="_blank" rel="noopener" className="soc">LinkedIn ↗</a>
            <a href="https://twitter.com/" target="_blank" rel="noopener" className="soc">X / Twitter ↗</a>
          </div>
        </RevealSection>
      </div>
    </section>
  )
}

export default function App() {
  const [introDone, setIntroDone] = useState(false)
  const nameRef = useRef(null)
  const scramble = useScramble(nameRef)
  return (
    <>
      <CursorGlow />
      {!introDone && <Intro onDone={() => setIntroDone(true)} />}
      <Header />
      <Hero nameRef={nameRef} scramble={scramble} />
      <div className="divider" />
      <About />
      <div className="divider" />
      <Flagships />
      <div className="divider" />
      <Matrix />
      <div className="divider" />
      <Contact />
      <div className="divider" />
      <footer>
        <div className="wrap footer-inner">
          <span className="f-copy">© 2026 Nithish. All rights reserved.</span>
          <span className="f-credit">Noir & Crimson Op-Art · React + Anime.js</span>
          <span className="f-copy">Built from first principles. Zero corporate fluff.</span>
        </div>
      </footer>
    </>
  )
}
