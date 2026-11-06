import { useEffect, useRef, useState, useCallback } from 'react'
import anime from 'animejs'
import photo from './assets/photo.webp'
import cricket1 from './assets/cricket1.jpg'
import cricket2 from './assets/cricket2.jpg'
import cricket3 from './assets/cricket3.jpg'
import cricketVid from './assets/cricket_vid.mov'
import './index.css'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*'
const SCRAMBLE_TARGET = 'NITHISH'
const FULL_NAME = 'Nithish Balasubramanian'

function useScramble(ref) {
  const si = useRef(null)
  return useCallback(() => {
    let iter = 0
    clearInterval(si.current)
    si.current = setInterval(() => {
      if (!ref.current) return
      const el = ref.current.querySelector('.name-text')
      if (!el) return
      el.textContent = SCRAMBLE_TARGET.split('').map((c, i) =>
        i < Math.floor(iter / 2) ? c : CHARS[Math.floor(Math.random() * CHARS.length)]
      ).join('')
      if (iter >= SCRAMBLE_TARGET.length * 2) { el.textContent = SCRAMBLE_TARGET; clearInterval(si.current) }
      iter++
    }, 40)
  }, [ref])
}

function Intro({ onDone }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    setTimeout(() => anime({
      targets: el.querySelector('.intro-name'),
      clipPath: ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'],
      duration: 900, easing: 'cubicBezier(0.77,0,0.18,1)'
    }), 100)
    setTimeout(() => anime({
      targets: el, opacity: [1, 0], duration: 500, easing: 'easeOutQuad', complete: onDone
    }), 1300)
  }, [onDone])
  return (
    <div ref={ref} id="intro">
      <div className="intro-name">{FULL_NAME.toUpperCase()}</div>
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

function useMagnetic(ref, strength = 0.25) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const enter = e => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left - r.width / 2) * strength
      const y = (e.clientY - r.top - r.height / 2) * strength
      anime({ targets: el, translateX: x, translateY: y, duration: 300, easing: 'easeOutCubic' })
    }
    const leave = () => anime({ targets: el, translateX: 0, translateY: 0, duration: 500, easing: 'easeOutElastic(1,.5)' })
    el.addEventListener('mousemove', enter)
    el.addEventListener('mouseleave', leave)
    return () => { el.removeEventListener('mousemove', enter); el.removeEventListener('mouseleave', leave) }
  }, [ref, strength])
}

function MagneticBtn({ children, className, href, onClick }) {
  const ref = useRef(null)
  useMagnetic(ref)
  if (href) return <a ref={ref} href={href} className={className}>{children}</a>
  return <button ref={ref} className={className} onClick={onClick}>{children}</button>
}

function Header() {
  return (
    <header>
      <div className="wrap header-inner">
        <div className="logo"><span className="logo-init">NB</span>NITHISH.</div>
        <nav>
          <a href="#about">About</a>
          <a href="#flagships">Flagships</a>
          <a href="#matrix">Matrix</a>
          <a href="#hobbies">Hobbies</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="h-right">
          <div className="avail"><span className="avail-dot" />Available</div>
          <MagneticBtn href="#contact" className="btn-hdr">DISPATCH →</MagneticBtn>
        </div>
      </div>
    </header>
  )
}

function HeroStats() {
  const stats = [
    { target: 12, suffix: '+', label: 'Projects Shipped' },
    { target: 3, suffix: '+', label: 'Years Experience' },
    { target: 8, suffix: '+', label: 'Tech Stacks' },
  ]
  const ref = useRef(null)
  const animated = useRef(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || animated.current) return
      animated.current = true
      ref.current.querySelectorAll('.stat').forEach((el, i) => {
        anime({ targets: el, opacity: [0, 1], translateY: [20, 0], delay: i * 120, duration: 600, easing: 'easeOutCubic' })
      })
      ref.current.querySelectorAll('.count').forEach(el => {
        const tgt = +el.dataset.target
        const obj = { val: 0 }
        anime({ targets: obj, val: tgt, round: 1, duration: 1400, easing: 'easeOutExpo', update: () => { el.textContent = Math.round(obj.val) } })
      })
    }, { threshold: 0.5 })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  return (
    <div ref={ref} className="hero-stats anim-child">
      {stats.map(s => (
        <div key={s.label} className="stat" style={{ opacity: 0 }}>
          <span className="stat-n"><span className="count" data-target={s.target}>0</span><span className="a">{s.suffix}</span></span>
          <span className="stat-l">{s.label}</span>
        </div>
      ))}
    </div>
  )
}

function HeroRight() {
  useEffect(() => {
    anime({ targets: '.hero-right', opacity: [0, 1], translateX: [32, 0], delay: 1600, duration: 800, easing: 'easeOutCubic' })
  }, [])
  const cards = [
    { num: '01', title: 'Full-Stack Web Apps', desc: 'React + Next.js frontends with Node.js/FastAPI backends, deployed end-to-end.' },
    { num: '02', title: 'AI-Powered Features', desc: 'Integrating Claude & OpenAI APIs into real products — chat, search, automation.' },
    { num: '03', title: 'Clean, Shipped Code', desc: 'Type-safe APIs, CI/CD pipelines, and PostgreSQL databases in production.' },
  ]
  return (
    <div className="hero-right">
      <div className="hero-portrait">
        <img src={photo} alt={FULL_NAME} loading="eager" />
        <div className="portrait-label">{FULL_NAME} — Full-Stack & AI Engineer</div>
      </div>
      <div className="hero-status-badge">● OPEN TO OPPORTUNITIES</div>
      {cards.map((c, i) => (
        <div key={i} className="h-card"
          onMouseEnter={e => anime({ targets: e.currentTarget, translateY: -4, borderColor: '#c8102e', boxShadow: '0 12px 32px rgba(200,16,46,.18)', duration: 220 })}
          onMouseLeave={e => anime({ targets: e.currentTarget, translateY: 0, borderColor: 'rgba(255,255,255,.05)', boxShadow: '0 0 0 rgba(0,0,0,0)', duration: 300 })}>
          <div className="h-card-num">{c.num}.</div>
          <div className="h-card-title">{c.title}</div>
          <div className="h-card-desc">{c.desc}</div>
        </div>
      ))}
    </div>
  )
}

function Hero({ nameRef, scramble }) {
  const btn1 = useRef(null); const btn2 = useRef(null)
  useMagnetic(btn1); useMagnetic(btn2)

  useEffect(() => {
    const els = document.querySelectorAll('.anim-child')
    anime({ targets: [...els], opacity: [0, 1], translateY: [24, 0], delay: anime.stagger(110, { start: 1400 }), duration: 700, easing: 'easeOutCubic' })
    anime({ targets: '.eyebrow-line', width: ['0px', '32px'], delay: 1650, duration: 500, easing: 'easeOutCubic' })
    setTimeout(scramble, 1700)
    const gi = setInterval(() => {
      if (Math.random() > 0.7 && nameRef.current) {
        nameRef.current.style.textShadow = '3px 0 #c8102e,-3px 0 rgba(0,255,200,.5),0 0 20px rgba(200,16,46,.3)'
        setTimeout(() => { if (nameRef.current) nameRef.current.style.textShadow = '' }, 100)
      }
    }, 2800)
    return () => clearInterval(gi)
  }, [nameRef, scramble])

  const tags = ['React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'FastAPI', 'PostgreSQL', 'Docker']

  return (
    <section className="hero">
      <div className="wrap">
        <div className="hero-inner">
          <div>
            <div className="hero-eyebrow anim-child"><span className="eyebrow-line" />PORTFOLIO · 2026</div>
            <div className="anim-child" style={{ fontFamily: 'var(--ffm)', fontSize: 11, letterSpacing: '.18em', color: 'var(--fm)', textTransform: 'uppercase', marginBottom: 12 }}>Hello, I'm</div>
            <h1 ref={nameRef} className="hero-name anim-child" onMouseEnter={scramble}>
              <span className="name-text">NITHISH</span><span className="dot">.</span>
            </h1>
            <div className="hero-surname anim-child">BALASUBRAMANIAN</div>
            <div className="hero-role anim-child">Full-Stack Engineer & AI Application Developer</div>
            <p className="hero-tagline anim-child">Building modern web applications powered by AI — clean React frontends, robust backend APIs, and smart integrations that actually ship to production.</p>
            <div className="hero-ctas anim-child">
              <a ref={btn1} href="#contact" className="btn-primary">GET IN TOUCH</a>
              <a ref={btn2} href="#flagships" className="btn-outline">VIEW PROJECTS →</a>
            </div>
            <HeroStats />
            <div className="hero-tags anim-child">
              {tags.map(t => (
                <span key={t} className="tag"
                  onMouseEnter={e => anime({ targets: e.currentTarget, scale: 1.08, backgroundColor: 'rgba(200,16,46,.18)', duration: 180 })}
                  onMouseLeave={e => anime({ targets: e.currentTarget, scale: 1, backgroundColor: 'rgba(200,16,46,.08)', duration: 200 })}>
                  {t}
                </span>
              ))}
            </div>
          </div>
          <HeroRight />
        </div>
      </div>
    </section>
  )
}

function RevealSection({ children, delay = 0, direction = 'up' }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    const isX = direction !== 'up'
    const fromVal = direction === 'left' ? -30 : direction === 'right' ? 30 : 24
    el.style.opacity = 0
    el.style.transform = isX ? `translateX(${fromVal}px)` : `translateY(${fromVal}px)`
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      anime({
        targets: el, opacity: [0, 1],
        ...(isX ? { translateX: [fromVal, 0] } : { translateY: [fromVal, 0] }),
        duration: 650, delay, easing: 'easeOutCubic'
      })
      io.disconnect()
    }, { threshold: 0.08 })
    io.observe(el)
    return () => io.disconnect()
  }, [delay, direction])
  return <div ref={ref}>{children}</div>
}

function About() {
  return (
    <section className="section" id="about">
      <div className="wrap">
        <RevealSection><div className="sec-label">// 01.00 SEC_ABOUT INDEX <span className="sec-index">[01 / 06]</span></div></RevealSection>
        <div className="about-grid">
          <RevealSection direction="left">
            <div className="about-photo">
              <img src={photo} alt={FULL_NAME} loading="lazy" />
              <div className="about-photo-label">{FULL_NAME}</div>
            </div>
          </RevealSection>
          <RevealSection delay={120} direction="right">
            <h2 className="about-h">Background &<br />Philosophy</h2>
            <p className="about-p">Full-stack developer with a focus on building AI-powered web applications. I work across the full stack — from designing database schemas and REST APIs to building responsive React UIs and deploying on cloud infrastructure.</p>
            <p className="about-p">Passionate about integrating AI into real products. I use LLM APIs (Claude, OpenAI) to build intelligent features like chat assistants, document Q&A, and automation workflows — shipping them into working, production apps.</p>
            <blockquote className="about-quote">I build things that work — clean code, real deployments, and AI features users actually find useful.</blockquote>
            <div className="principles">
              {[
                ['Ship First', 'A working product beats a perfect plan. I move fast, iterate based on feedback, and care deeply about what actually reaches users.'],
                ['AI as a Tool', 'LLMs are powerful utilities, not magic. I integrate them pragmatically — for the right problems, with real guardrails.'],
                ['Full Ownership', 'I own the whole feature — database, API, UI, and deployment. No handoffs, no gaps, no excuses.'],
              ].map(([name, body]) => (
                <div key={name} className="principle"
                  onMouseEnter={e => anime({ targets: e.currentTarget, translateX: 6, borderColor: '#c8102e', backgroundColor: 'rgba(200,16,46,.06)', duration: 220 })}
                  onMouseLeave={e => anime({ targets: e.currentTarget, translateX: 0, borderColor: 'rgba(255,255,255,.05)', backgroundColor: 'var(--bgc)', duration: 280 })}>
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
      if (!o) setTimeout(() => { if (detailRef.current) anime({ targets: detailRef.current, opacity: [0, 1], translateY: [-8, 0], duration: 280, easing: 'easeOutCubic' }) }, 0)
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
  const cardHover = e => anime({ targets: e.currentTarget, borderColor: '#c8102e', boxShadow: '0 0 48px rgba(200,16,46,.12),inset 0 0 0 1px rgba(200,16,46,.2)', duration: 220 })
  const cardLeave = e => anime({ targets: e.currentTarget, borderColor: 'rgba(255,255,255,.05)', boxShadow: '0 0 0 rgba(0,0,0,0)', duration: 300 })
  const layers = [
    ['L1', 'File Upload & Parsing', 'Next.js · API Routes', 'User uploads PDFs or text files via a drag-and-drop UI. Files are parsed server-side and split into chunks for processing.'],
    ['L2', 'Vector Storage', 'Postgres · pgvector', 'Text chunks are converted to embeddings using the OpenAI API and stored in a Postgres database with pgvector extension for similarity search.'],
    ['L3', 'Search & Retrieval', 'Similarity Search', 'When a user asks a question, the most relevant chunks are retrieved from the database using cosine similarity and passed to the LLM.'],
    ['L4', 'AI Response', 'Claude API · Streaming', 'Retrieved context + user question are sent to Claude. The response streams back to the UI in real time using server-sent events.'],
    ['L5', 'Chat Interface', 'React · TailwindCSS', 'Clean chat UI with streaming message rendering, conversation history, and per-document workspace scoping.'],
  ]
  const smCards = [
    {
      cat: 'Mobile · Commerce', title: 'Offline-First Retail App',
      desc: 'React Native inventory and invoicing app for small retail businesses. Works offline and syncs to the cloud when back online. Includes receipt printing via Bluetooth.',
      bullets: ['Works offline with local SQLite storage', 'Syncs to Supabase on reconnect', 'Bluetooth receipt printing support'],
      tags: ['React Native', 'SQLite', 'Supabase']
    },
    {
      cat: 'AI · Automation', title: 'AI Document Assistant',
      desc: 'Chat interface that lets users ask questions against their own documents. Upload a PDF, ask anything — the AI finds the answer. Built with Claude API and Next.js.',
      bullets: ['PDF parsing and text extraction', 'Semantic search over document content', 'Streaming chat responses via Claude API'],
      tags: ['Next.js', 'Claude API', 'PostgreSQL']
    },
    {
      cat: 'Platform · SaaS', title: 'Multi-Tenant SaaS Starter',
      desc: 'Full-stack SaaS template with authentication, billing, and team workspaces. Built with Next.js and Node.js, deployable in one command to Vercel + Railway.',
      bullets: ['Auth with NextAuth — email + OAuth', 'Stripe billing with webhook handling', 'Role-based access per workspace'],
      tags: ['Next.js', 'Node.js', 'Stripe']
    },
  ]
  return (
    <section className="section" id="flagships">
      <div className="wrap">
        <RevealSection><div className="sec-label">// 02.00 FLAGSHIP PROJECTS <span className="sec-index">[02 / 06]</span></div></RevealSection>
        <RevealSection><h2 className="flagships-h">Projects Shipped</h2></RevealSection>
        <RevealSection><p className="flagships-sub">Real applications built and deployed — from idea to production.</p></RevealSection>
        <div className="flagship-grid">
          <RevealSection>
            <div className="f-card featured" onMouseEnter={cardHover} onMouseLeave={cardLeave}>
              <div>
                <div className="f-cat">Featured · AI + Full-Stack</div>
                <div className="f-title large">Document Q&A<br />Platform</div>
                <p className="f-desc">Upload any document and chat with it. Built with Next.js, Postgres with pgvector for vector search, and Claude API for streaming answers. Users get a private workspace where their files and conversations are scoped and secure.</p>
                <div className="f-tags">{['Next.js', 'Claude API', 'pgvector', 'PostgreSQL', 'TailwindCSS'].map(t => <span key={t} className="tag">{t}</span>)}</div>
              </div>
              <div className="stack-wrap">
                <div className="stack-title">HOW IT'S BUILT (CLICK EACH LAYER)</div>
                {layers.map(([n, name, tech, detail]) => <StackLayer key={n} num={n} name={name} tech={tech} detail={detail} />)}
              </div>
            </div>
          </RevealSection>
          {smCards.map((c, i) => (
            <RevealSection key={i} delay={i * 80}>
              <div className="f-card" onMouseEnter={cardHover} onMouseLeave={cardLeave}>
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
    { id: 'SYS-01', cat: 'ai', title: 'AI Chat Assistant', desc: 'Conversational AI interface built on Claude API. Supports multi-turn conversations, system prompts, and streaming responses. Deployed as a Next.js app.', tags: ['Next.js', 'Claude API', 'React'] },
    { id: 'SYS-02', cat: 'ai', title: 'RAG Search App', desc: 'Ask questions against a knowledge base. Documents are chunked, embedded with OpenAI, stored in pgvector, and retrieved for context before each AI response.', tags: ['OpenAI API', 'pgvector', 'FastAPI'] },
    { id: 'SYS-03', cat: 'fs', title: 'Real-Time Dashboard', desc: 'Live data dashboard with WebSocket updates. Built with React and Node.js — displays metrics that update in real time without page refresh.', tags: ['React', 'Node.js', 'WebSocket'] },
    { id: 'SYS-04', cat: 'fs', title: 'REST API with Auth', desc: 'Full-featured REST API built with FastAPI and PostgreSQL. Includes JWT authentication, role-based permissions, and auto-generated API docs via Swagger.', tags: ['FastAPI', 'PostgreSQL', 'Python'] },
    { id: 'SYS-05', cat: 'ai', title: 'AI Form Filler', desc: 'Paste any text and AI automatically extracts and fills structured fields. Built with Claude API tool use — no manual parsing rules needed.', tags: ['Claude API', 'Next.js', 'TypeScript'] },
    { id: 'SYS-06', cat: 'fs', title: 'Notification System', desc: 'Multi-channel notification service that sends email, in-app alerts, and webhooks. Built on Postgres event triggers with retry logic and delivery tracking.', tags: ['Node.js', 'PostgreSQL', 'Resend'] },
  ]
  const filters = [{ k: 'all', l: 'All (6)' }, { k: 'ai', l: 'AI Projects' }, { k: 'fs', l: 'Full-Stack' }]
  const visible = filter === 'all' ? cards : cards.filter(c => c.cat === filter)
  const cardHover = e => anime({ targets: e.currentTarget, translateY: -5, borderColor: '#c8102e', boxShadow: '0 12px 32px rgba(200,16,46,.12)', duration: 220 })
  const cardLeave = e => anime({ targets: e.currentTarget, translateY: 0, borderColor: 'rgba(255,255,255,.05)', boxShadow: '0 0 0 rgba(0,0,0,0)', duration: 280 })
  return (
    <section className="section" id="matrix">
      <div className="wrap">
        <RevealSection><div className="sec-label">// 03.00 PROJECT INDEX <span className="sec-index">[03 / 06]</span></div></RevealSection>
        <RevealSection><h2 className="matrix-h">Project Matrix</h2></RevealSection>
        <RevealSection><p className="matrix-sub">A range of projects across full-stack development and AI integrations.</p></RevealSection>
        <RevealSection>
          <div className="filter-bar">
            {filters.map(f => (
              <button key={f.k}
                className={`f-btn${filter === f.k ? ' active' : ''}`}
                onClick={() => {
                  setFilter(f.k)
                  if (f.k !== filter) setTimeout(() => anime({ targets: '.m-card', opacity: [0, 1], translateY: [12, 0], delay: anime.stagger(60), duration: 400, easing: 'easeOutCubic' }), 0)
                }}>{f.l}</button>
            ))}
          </div>
        </RevealSection>
        <div className="m-grid">
          {visible.map((c, i) => (
            <RevealSection key={c.id + filter} delay={i * 50}>
              <div className="m-card" onMouseEnter={cardHover} onMouseLeave={cardLeave}>
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

/* ─── Hobbies Carousel ──────────────────────────────────── */
const HOBBY_ITEMS = [
  { type: 'img', src: cricket1, caption: 'Cover Drive', sub: 'Timing it through the covers' },
  { type: 'img', src: cricket2, caption: 'On the Drive', sub: 'Playing straight down the ground' },
  { type: 'img', src: cricket3, caption: 'Golden Hour', sub: 'Surveying the field at dusk' },
  { type: 'vid', src: cricketVid, caption: 'Match Day', sub: 'Live action from the crease' },
]

function Hobbies() {
  const [cur, setCur] = useState(0)
  const slidesRef = useRef([])
  const autoRef = useRef(null)
  const isAnimating = useRef(false)
  const curRef = useRef(0)
  const n = HOBBY_ITEMS.length

  // init: show slide 0, hide rest
  useEffect(() => {
    slidesRef.current.forEach((el, i) => {
      if (!el) return
      anime.set(el, { opacity: i === 0 ? 1 : 0, translateX: i === 0 ? '0%' : '100%', scale: i === 0 ? 1 : 0.95 })
    })
  }, [])

  const goTo = useCallback((nextIdx) => {
    if (isAnimating.current) return
    const next = ((nextIdx % n) + n) % n
    const prev = curRef.current
    if (next === prev) return
    isAnimating.current = true

    const dir = next > prev || (prev === n - 1 && next === 0) ? 1 : -1
    const prevEl = slidesRef.current[prev]
    const nextEl = slidesRef.current[next]
    if (!prevEl || !nextEl) { isAnimating.current = false; return }

    // position next off-screen in direction of travel
    anime.set(nextEl, { translateX: `${dir * 100}%`, opacity: 0, scale: 0.94, zIndex: 2 })
    anime.set(prevEl, { zIndex: 1 })

    // animate both simultaneously
    anime({ targets: prevEl, translateX: `${-dir * 60}%`, opacity: 0, scale: 0.9, duration: 550, easing: 'easeInCubic' })
    anime({
      targets: nextEl, translateX: [`${dir * 100}%`, '0%'], opacity: [0, 1], scale: [0.94, 1],
      duration: 650, easing: 'easeOutCubic',
      complete: () => { isAnimating.current = false; curRef.current = next; setCur(next) }
    })
    // animate caption
    const capEl = nextEl.querySelector('.carousel-caption')
    if (capEl) anime({ targets: capEl, opacity: [0, 1], translateY: [16, 0], delay: 300, duration: 400, easing: 'easeOutCubic' })
  }, [n])

  const restartAuto = useCallback(() => {
    clearInterval(autoRef.current)
    autoRef.current = setInterval(() => goTo(curRef.current + 1), 5000)
  }, [goTo])

  useEffect(() => {
    restartAuto()
    return () => clearInterval(autoRef.current)
  }, [restartAuto])

  const prev = () => { goTo(curRef.current - 1); restartAuto() }
  const next = () => { goTo(curRef.current + 1); restartAuto() }

  const touchX = useRef(null)
  const onTouchStart = e => { touchX.current = e.touches[0].clientX }
  const onTouchEnd = e => {
    if (touchX.current === null) return
    const dx = touchX.current - e.changedTouches[0].clientX
    if (Math.abs(dx) > 40) { dx > 0 ? next() : prev() }
    touchX.current = null
  }

  return (
    <section className="section" id="hobbies">
      <div className="wrap">
        <RevealSection><div className="sec-label">// 04.00 BEYOND THE CODE <span className="sec-index">[04 / 06]</span></div></RevealSection>
        <RevealSection><h2 className="hobbies-h">Life Beyond<br />The Stack</h2></RevealSection>
        <RevealSection><p className="hobbies-sub">When I'm not pushing to production — bat in hand, field set, mind empty of merge conflicts.</p></RevealSection>
        <RevealSection>
          <div className="carousel-wrap" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            {/* slides */}
            <div className="carousel-viewport">
              {HOBBY_ITEMS.map((item, i) => (
                <div key={i} ref={el => slidesRef.current[i] = el} className="carousel-slide">
                  {item.type === 'vid'
                    ? (
                      <video
                        className="carousel-media"
                        autoPlay muted loop playsInline
                        preload="auto"
                        onError={e => { e.target.style.display = 'none'; e.target.nextSibling && (e.target.nextSibling.style.display = 'flex') }}
                      >
                        <source src={item.src} type="video/mp4" />
                        <source src={item.src} type="video/quicktime" />
                      </video>
                    )
                    : <img src={item.src} alt={item.caption} className="carousel-media" loading="lazy" />}
                  <div className="carousel-caption">
                    <div className="carousel-cap-label">Cricket</div>
                    <div className="carousel-cap-title">{item.caption}</div>
                    <div className="carousel-cap-sub">{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* controls */}
            <button className="carousel-btn carousel-btn-prev" onClick={prev} aria-label="Previous">←</button>
            <button className="carousel-btn carousel-btn-next" onClick={next} aria-label="Next">→</button>

            {/* dots */}
            <div className="carousel-dots">
              {HOBBY_ITEMS.map((_, i) => (
                <button key={i}
                  className={`carousel-dot${i === cur ? ' active' : ''}`}
                  onClick={() => { goTo(i); restartAuto() }}
                  aria-label={`Slide ${i + 1}`} />
              ))}
            </div>

            {/* counter */}
            <div className="carousel-counter">
              <span className="carousel-cur">{String(cur + 1).padStart(2, '0')}</span>
              <span style={{ color: 'rgba(255,255,255,.35)' }}> / </span>
              <span style={{ color: 'rgba(255,255,255,.5)' }}>{String(n).padStart(2, '0')}</span>
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  )
}

function Contact() {
  const [copied, setCopied] = useState(false)
  const email = 'nithishbala1312@gmail.com'
  const doCopy = () => { navigator.clipboard?.writeText(email).then(() => { setCopied(true); setTimeout(() => setCopied(false), 3000) }) }
  const socHover = e => anime({ targets: e.currentTarget, backgroundColor: 'rgba(200,16,46,.12)', borderColor: '#c8102e', color: '#fff', duration: 200 })
  const socLeave = e => anime({ targets: e.currentTarget, backgroundColor: 'transparent', borderColor: 'rgba(255,255,255,.05)', color: 'var(--fm)', duration: 250 })
  return (
    <section id="contact">
      <div className="wrap contact-wrap">
        <RevealSection><div className="sec-label" style={{ justifyContent: 'center', marginBottom: 20 }}>// 05.00 CONTACT <span className="sec-index">[05 / 06]</span></div></RevealSection>
        <RevealSection><h2 className="contact-h">Let's Build Something<br />Together.</h2></RevealSection>
        <RevealSection><p className="contact-desc">Open to full-stack roles, AI product projects, and freelance work. Let's talk.</p></RevealSection>
        <RevealSection>
          <div className="contact-email-row">
            <span className="email-text">{email}</span>
            <MagneticBtn className={`btn-copy${copied ? ' ok' : ''}`} onClick={doCopy}>{copied ? '✓ Copied' : 'Copy Email'}</MagneticBtn>
          </div>
          {copied && <div className="copy-confirm">✓ Copied: {email}</div>}
        </RevealSection>
        <RevealSection>
          <div className="socials">
            <a href="https://github.com/zoro-2001" target="_blank" rel="noopener" className="soc" onMouseEnter={socHover} onMouseLeave={socLeave}>GitHub ↗</a>
            <a href="https://linkedin.com/" target="_blank" rel="noopener" className="soc" onMouseEnter={socHover} onMouseLeave={socLeave}>LinkedIn ↗</a>
            <a href="https://twitter.com/" target="_blank" rel="noopener" className="soc" onMouseEnter={socHover} onMouseLeave={socLeave}>X / Twitter ↗</a>
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
      <Hobbies />
      <div className="divider" />
      <Contact />
      <div className="divider" />
      <footer>
        <div className="wrap footer-inner">
          <span className="f-copy">© 2026 {FULL_NAME}.</span>
          <span className="f-credit">Noir & Crimson · React + Anime.js</span>
          <span className="f-copy">Built from scratch. Zero fluff.</span>
        </div>
      </footer>
    </>
  )
}
