'use client'

import { useEffect, useState, useRef, useCallback } from 'react'

/* ───────────────────────── SVG SERVICE ICONS ───────────────────────── */

function IconBrandStrategy() {
  return (
    <svg className="service-icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="32" height="32" rx="2" stroke="#c4a96b" strokeWidth="1" />
      <line x1="4" y1="14" x2="36" y2="14" stroke="#c4a96b" strokeWidth="1" />
      <line x1="20" y1="14" x2="20" y2="36" stroke="#c4a96b" strokeWidth="1" />
    </svg>
  )
}

function IconDigitalExperience() {
  return (
    <svg className="service-icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="15" stroke="#c4a96b" strokeWidth="1" />
      <circle cx="20" cy="20" r="6" stroke="#c4a96b" strokeWidth="1" />
      <line x1="20" y1="5" x2="20" y2="14" stroke="#c4a96b" strokeWidth="1" />
      <line x1="20" y1="26" x2="20" y2="35" stroke="#c4a96b" strokeWidth="1" />
    </svg>
  )
}

function IconGrowthAdvisory() {
  return (
    <svg className="service-icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polyline points="4,30 14,18 22,24 32,10 36,14" stroke="#c4a96b" strokeWidth="1" fill="none" />
      <circle cx="4" cy="30" r="2" fill="#c4a96b" />
      <circle cx="36" cy="14" r="2" fill="#c4a96b" />
    </svg>
  )
}

function IconContentSystems() {
  return (
    <svg className="service-icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="10" width="28" height="20" rx="1" stroke="#c4a96b" strokeWidth="1" />
      <line x1="13" y1="10" x2="13" y2="30" stroke="#c4a96b" strokeWidth="1" />
      <line x1="6" y1="20" x2="34" y2="20" stroke="#c4a96b" strokeWidth="1" />
    </svg>
  )
}

function IconProductDesign() {
  return (
    <svg className="service-icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 6 L34 14 L34 26 L20 34 L6 26 L6 14 Z" stroke="#c4a96b" strokeWidth="1" fill="none" />
      <path d="M20 13 L27 17 L27 23 L20 27 L13 23 L13 17 Z" stroke="#c4a96b" strokeWidth="1" fill="none" />
    </svg>
  )
}

function IconPartnerships() {
  return (
    <svg className="service-icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="20" r="4" stroke="#c4a96b" strokeWidth="1" />
      <circle cx="30" cy="12" r="4" stroke="#c4a96b" strokeWidth="1" />
      <circle cx="30" cy="28" r="4" stroke="#c4a96b" strokeWidth="1" />
      <line x1="14" y1="18" x2="26" y2="14" stroke="#c4a96b" strokeWidth="1" />
      <line x1="14" y1="22" x2="26" y2="26" stroke="#c4a96b" strokeWidth="1" />
    </svg>
  )
}

/* ───────────────────────── SERVICE DATA ───────────────────────── */

const services = [
  { num: '01', Icon: IconBrandStrategy, name: 'Brand Strategy', text: 'We build brands with conviction — from positioning and naming through to visual identity systems that speak with authority.' },
  { num: '02', Icon: IconDigitalExperience, name: 'Digital Experience', text: 'Websites and applications that convert — meticulously designed for performance, elegance, and meaningful user journeys.' },
  { num: '03', Icon: IconGrowthAdvisory, name: 'Growth Advisory', text: 'Strategic guidance that translates vision into measurable outcomes — market entry, scaling, and competitive positioning.' },
  { num: '04', Icon: IconContentSystems, name: 'Content Systems', text: 'Editorial frameworks, content strategy, and storytelling infrastructure that builds authority and drives organic growth.' },
  { num: '05', Icon: IconProductDesign, name: 'Product Design', text: 'End-to-end product design from concept through to pixel-perfect interfaces — always anchored in user behaviour.' },
  { num: '06', Icon: IconPartnerships, name: 'Partnerships', text: 'Curated strategic partnerships and go-to-market alliances that open doors and accelerate your trajectory.' },
]

const featureItems = [
  { title: 'Deep discovery', desc: 'We invest time understanding your market, competitors, and customers before proposing anything.' },
  { title: 'Cross-discipline thinking', desc: 'Strategy, design, and technology working in concert — not siloed departments passing briefs.' },
  { title: 'Measurable outcomes', desc: 'Every engagement defines clear success metrics. We don\'t just deliver work, we deliver results.' },
  { title: 'Long-term partnership', desc: 'We\'re selective about who we work with because we aim to be partners, not vendors.' },
]

const testimonials = [
  { quote: '"Luminary didn\'t just rebrand us — they fundamentally changed how we see ourselves. Revenue followed."', initials: 'SK', name: 'Sarah Kimani', role: 'CEO, Horizon Ventures' },
  { quote: '"The rigour of their process is unlike anything we\'ve experienced. Every decision is backed by insight."', initials: 'MR', name: 'Marc Roux', role: 'Founder, Atelier Labs' },
  { quote: '"Six months after launch, organic traffic is up 280%. The content system they built is still paying dividends."', initials: 'JP', name: 'Jade Petrov', role: 'CMO, Dusk Capital' },
]

/* ───────────────────────── HOOKS ───────────────────────── */

function useCustomCursor() {
  const mxRef = useRef(0)
  const myRef = useRef(0)
  const cxRef = useRef(0)
  const cyRef = useRef(0)
  const cursorRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    mxRef.current = window.innerWidth / 2
    myRef.current = window.innerHeight / 2
    cxRef.current = mxRef.current
    cyRef.current = myRef.current

    const onMouseMove = (e: MouseEvent) => {
      mxRef.current = e.clientX
      myRef.current = e.clientY
    }

    const animate = () => {
      cxRef.current += (mxRef.current - cxRef.current) * 0.18
      cyRef.current += (myRef.current - cyRef.current) * 0.18

      if (cursorRef.current) {
        cursorRef.current.style.left = mxRef.current + 'px'
        cursorRef.current.style.top = myRef.current + 'px'
      }
      if (ringRef.current) {
        ringRef.current.style.left = (cxRef.current - mxRef.current) + 'px'
        ringRef.current.style.top = (cyRef.current - myRef.current) + 'px'
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    document.addEventListener('mousemove', onMouseMove)
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return { cursorRef, ringRef }
}

function useHoverDetection() {
  useEffect(() => {
    const onEnter = () => document.body.classList.add('hovering')
    const onLeave = () => document.body.classList.remove('hovering')

    const addListeners = () => {
      document.querySelectorAll('a, button, input').forEach((el) => {
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
      })
    }

    addListeners()

    // Re-attach after React renders
    const observer = new MutationObserver(() => {
      document.querySelectorAll('a, button, input').forEach((el) => {
        if (!el.dataset.lumHover) {
          el.dataset.lumHover = '1'
          el.addEventListener('mouseenter', onEnter)
          el.addEventListener('mouseleave', onLeave)
        }
      })
    })

    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      document.querySelectorAll('a, button, input').forEach((el) => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
      })
    }
  }, [])
}

function useIntersectionObserver(selector: string) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement
            const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0
            setTimeout(() => el.classList.add('visible'), delay)
            observer.unobserve(el)
          }
        })
      },
      { threshold: 0.15 }
    )

    const els = document.querySelectorAll(selector)
    els.forEach((el, i) => {
      ;(el as HTMLElement).dataset.delay = String(i * 120)
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [selector])
}

function animateNumbers() {
  document.querySelectorAll<HTMLDivElement>('.stat-num').forEach((el) => {
    const text = el.dataset.value || el.textContent || ''
    const num = parseFloat(text)
    if (isNaN(num)) return
    const suffix = text.replace(/[\d.]/g, '')
    const duration = 1800
    const startTime = performance.now()

    const update = (now: number) => {
      const p = Math.min((now - startTime) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      const val = num * ease
      el.textContent = (Number.isInteger(num) ? Math.round(val) : val.toFixed(1)) + suffix
      if (p < 1) requestAnimationFrame(update)
    }

    requestAnimationFrame(update)
  })
}

function useNumberCounter() {
  const hasAnimated = useRef(false)

  useEffect(() => {
    const statsBar = document.querySelector('.stats-bar')
    if (!statsBar) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          animateNumbers()
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(statsBar)
    return () => observer.disconnect()
  }, [])
}

/* ───────────────────────── MAIN COMPONENT ───────────────────────── */

export default function Home() {
  const [scrolled, setScrolled] = useState(false)
  const [email, setEmail] = useState('')
  const [ctaMsg, setCtaMsg] = useState('No spam. No obligation. We respond within 24 hours.')
  const [ctaMsgColor, setCtaMsgColor] = useState('')

  const { cursorRef, ringRef } = useCustomCursor()
  useHoverDetection()

  // Scroll detection for navbar
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Intersection observers
  useIntersectionObserver('.stat-item')
  useIntersectionObserver('.service-card')
  useIntersectionObserver('.feature-list li')
  useIntersectionObserver('.testimonial-card')
  useNumberCounter()

  // Email form handler
  const handleSubmit = useCallback(() => {
    if (email && email.includes('@')) {
      setCtaMsg("✓ You're on the list. We'll be in touch soon.")
      setCtaMsgColor('#c4a96b')
      setEmail('')
    } else {
      setCtaMsg('Please enter a valid email address.')
      setCtaMsgColor('#e24b4a')
      setTimeout(() => {
        setCtaMsg('No spam. No obligation. We respond within 24 hours.')
        setCtaMsgColor('')
      }, 2400)
    }
  }, [email])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleSubmit()
    },
    [handleSubmit]
  )

  // Service card delay styling
  useEffect(() => {
    const serviceObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement
            const idx = parseInt(el.dataset.idx || '0')
            const delay = idx * 100
            setTimeout(() => el.classList.add('visible'), delay)
            serviceObserver.unobserve(el)
          }
        })
      },
      { threshold: 0.15 }
    )

    document.querySelectorAll('.service-card').forEach((el) => {
      serviceObserver.observe(el)
    })

    return () => serviceObserver.disconnect()
  }, [])

  // Feature list delay styling
  useEffect(() => {
    const featureObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement
            const idx = parseInt(el.dataset.idx || '0')
            const delay = idx * 120
            setTimeout(() => el.classList.add('visible'), delay)
            featureObserver.unobserve(el)
          }
        })
      },
      { threshold: 0.15 }
    )

    document.querySelectorAll('.feature-list li').forEach((el) => {
      featureObserver.observe(el)
    })

    return () => featureObserver.disconnect()
  }, [])

  return (
    <>
      {/* Custom Cursor */}
      <div id="cursor" ref={cursorRef}>
        <div id="cursor-ring" ref={ringRef} />
        <div id="cursor-dot" />
      </div>

      {/* Navbar */}
      <nav className={scrolled ? 'scrolled' : ''}>
        <a href="#" className="nav-logo">
          LUMINARY
        </a>
        <ul className="nav-links">
          <li>
            <a href="#services">Services</a>
          </li>
          <li>
            <a href="#approach">Approach</a>
          </li>
          <li>
            <a href="#work">Work</a>
          </li>
          <li>
            <a href="#contact">Contact</a>
          </li>
        </ul>
        <button className="nav-cta">Get Started</button>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-grid" />
        <div className="hero-eyebrow">Est. 2019 &nbsp;·&nbsp; Strategy &amp; Design</div>
        <h1 className="hero-title">
          We craft
          <br />
          <em>futures</em>
        </h1>
        <p className="hero-subtitle">that endure</p>
        <p className="hero-desc">
          Luminary partners with ambitious companies to build brands, systems, and strategies that stand
          the test of time. Precision. Purpose. Performance.
        </p>
        <div className="hero-actions">
          <button className="btn-primary">Start a project</button>
          <a href="#work" className="btn-ghost">
            View our work
          </a>
        </div>
        <div className="hero-scroll">
          <div className="scroll-line" />
          <span>Scroll</span>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-item">
          <div className="stat-num" data-value="240+">240+</div>
          <div className="stat-label">Projects delivered</div>
        </div>
        <div className="stat-item">
          <div className="stat-num" data-value="98%">98%</div>
          <div className="stat-label">Client retention</div>
        </div>
        <div className="stat-item">
          <div className="stat-num" data-value="18">18</div>
          <div className="stat-label">Industry awards</div>
        </div>
        <div className="stat-item">
          <div className="stat-num" data-value="3×">3×</div>
          <div className="stat-label">Avg. revenue growth</div>
        </div>
      </div>

      {/* Services */}
      <section className="lum-section" id="services">
        <div className="section-eyebrow">What we do</div>
        <h2 className="section-title">
          Services built
          <br />
          for <em>lasting impact</em>
        </h2>
        <p className="section-desc">
          We don&apos;t do templates. Every engagement is crafted around your unique context, market, and
          ambitions.
        </p>
        <div className="services-grid">
          {services.map((svc, idx) => (
            <div className="service-card" key={svc.num} data-idx={idx}>
              <div className="service-num">{svc.num}</div>
              <svc.Icon />
              <div className="service-name">{svc.name}</div>
              <p className="service-text">{svc.text}</p>
              <a href="#" className="service-arrow">
                Explore <span>→</span>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Feature / Approach Section */}
      <div className="feature-section" id="approach">
        <div className="feature-visual">
          <div className="feature-orb">
            <div className="orb-inner">L</div>
          </div>
        </div>
        <div className="feature-content">
          <div className="section-eyebrow">Our approach</div>
          <h2 className="section-title">
            Precision
            <br />
            over <em>volume</em>
          </h2>
          <ul className="feature-list">
            {featureItems.map((item, idx) => (
              <li key={item.title} data-idx={idx}>
                <div>
                  <strong>{item.title}</strong>
                  {item.desc}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Testimonials */}
      <section className="testimonials-section" id="work">
        <div className="testimonials-inner">
          <div className="section-eyebrow">What clients say</div>
          <h2 className="section-title" style={{ marginBottom: 0 }}>
            Trusted by
            <br />
            <em>industry leaders</em>
          </h2>
          <div className="testimonials-grid">
            {testimonials.map((t, idx) => (
              <div className="testimonial-card" key={idx}>
                <p className="testimonial-quote">{t.quote}</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{t.initials}</div>
                  <div>
                    <div className="author-name">{t.name}</div>
                    <div className="author-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section" id="contact">
        <div className="cta-bg" />
        <div className="section-eyebrow" style={{ textAlign: 'center' }}>
          Ready to begin
        </div>
        <h2 className="cta-title">
          Let&apos;s build
          <br />
          something <em>lasting</em>
        </h2>
        <p className="cta-sub">Join 240+ companies who chose precision over noise.</p>
        <div className="cta-form">
          <input
            type="email"
            className="cta-input"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="cta-submit" onClick={handleSubmit}>
            Request →
          </button>
        </div>
        <p className="cta-note" style={{ color: ctaMsgColor }}>
          {ctaMsg}
        </p>
      </section>

      {/* Footer */}
      <footer className="lum-footer">
        <div>
          <div className="footer-logo">LUMINARY</div>
          <div className="footer-tagline">Strategy · Design · Growth</div>
        </div>
        <ul className="footer-links">
          <li>
            <a href="#">Services</a>
          </li>
          <li>
            <a href="#">Case Studies</a>
          </li>
          <li>
            <a href="#">About</a>
          </li>
          <li>
            <a href="#">Careers</a>
          </li>
          <li>
            <a href="#">Contact</a>
          </li>
        </ul>
        <div className="footer-copy">© 2026 Luminary. All rights reserved.</div>
      </footer>
    </>
  )
}
