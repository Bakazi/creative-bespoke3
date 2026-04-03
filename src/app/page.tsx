'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

/* ───────────────────────── MAIN COMPONENT ───────────────────────── */

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [ctaMsg, setCtaMsg] = useState('No spam. No obligation. We respond within 24 hours.');
  const [ctaMsgColor, setCtaMsgColor] = useState('');
  const [email, setEmail] = useState('');

  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const statsAnimated = useRef(false);

  // ── Custom Cursor ──
  useEffect(() => {
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let cx = mx;
    let cy = my;
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const animate = () => {
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;
      cursor.style.left = mx + 'px';
      cursor.style.top = my + 'px';
      ring.style.left = (cx - mx) + 'px';
      ring.style.top = (cy - my) + 'px';
      requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', onMouseMove);
    requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  // ── Hover Detection ──
  useEffect(() => {
    const onEnter = () => document.body.classList.add('hovering');
    const onLeave = () => document.body.classList.remove('hovering');

    const attach = () => {
      document.querySelectorAll('a, button, input').forEach((el) => {
        if (!el.dataset.lh) {
          el.dataset.lh = '1';
          el.addEventListener('mouseenter', onEnter);
          el.addEventListener('mouseleave', onLeave);
        }
      });
    };

    attach();

    const observer = new MutationObserver(attach);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      document.querySelectorAll('[data-lh]').forEach((el) => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      });
    };
  }, []);

  // ── Navbar scroll ──
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Intersection Observer for scroll-reveal ──
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;
            setTimeout(() => el.classList.add('visible'), delay);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );

    // Observe stat items
    document.querySelectorAll('.stat-item').forEach((el, i) => {
      (el as HTMLElement).dataset.delay = String(i * 120);
      observer.observe(el);
    });

    // Observe service cards
    document.querySelectorAll('.service-card').forEach((el, i) => {
      (el as HTMLElement).dataset.delay = String(i * 100);
      observer.observe(el);
    });

    // Observe feature list items
    document.querySelectorAll('.feature-list li').forEach((el, i) => {
      (el as HTMLElement).dataset.delay = String(i * 120);
      observer.observe(el);
    });

    // Observe testimonial cards
    document.querySelectorAll('.testimonial-card').forEach((el, i) => {
      (el as HTMLElement).dataset.delay = String(i * 150);
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // ── Number counter animation ──
  useEffect(() => {
    const statsBar = document.querySelector('.stats-bar');
    if (!statsBar) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !statsAnimated.current) {
          statsAnimated.current = true;
          animateNumbers();
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(statsBar);
    return () => observer.disconnect();
  }, []);

  // ── Email submit ──
  const handleSubmit = useCallback(() => {
    if (email && email.includes('@')) {
      setCtaMsg("✓ You're on the list. We'll be in touch soon.");
      setCtaMsgColor('#c4a96b');
      setEmail('');
    } else {
      setCtaMsg('Please enter a valid email address.');
      setCtaMsgColor('#e24b4a');
      setTimeout(() => {
        setCtaMsg('No spam. No obligation. We respond within 24 hours.');
        setCtaMsgColor('');
      }, 2400);
    }
  }, [email]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  }, [handleSubmit]);

  return (
    <>
      {/* Cursor */}
      <div id="cursor" ref={cursorRef}>
        <div id="cursor-ring" ref={ringRef}></div>
        <div id="cursor-dot"></div>
      </div>

      {/* Navbar */}
      <nav className={scrolled ? 'scrolled' : ''}>
        <a href="#" className="nav-logo">LUMINARY</a>
        <ul className="nav-links">
          <li><a href="#services">Services</a></li>
          <li><a href="#approach">Approach</a></li>
          <li><a href="#work">Work</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <button className="nav-cta">Get Started</button>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-grid"></div>
        <div className="hero-eyebrow">Est. 2019 &nbsp;·&nbsp; Strategy &amp; Design</div>
        <h1 className="hero-title">We craft<br /><em>futures</em></h1>
        <p className="hero-subtitle">that endure</p>
        <p className="hero-desc">Luminary partners with ambitious companies to build brands, systems, and strategies that stand the test of time. Precision. Purpose. Performance.</p>
        <div className="hero-actions">
          <button className="btn-primary">Start a project</button>
          <a href="#work" className="btn-ghost">View our work</a>
        </div>
        <div className="hero-scroll">
          <div className="scroll-line"></div>
          <span>Scroll</span>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-item">
          <div className="stat-num">240+</div>
          <div className="stat-label">Projects delivered</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">98%</div>
          <div className="stat-label">Client retention</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">18</div>
          <div className="stat-label">Industry awards</div>
        </div>
        <div className="stat-item">
          <div className="stat-num">3×</div>
          <div className="stat-label">Avg. revenue growth</div>
        </div>
      </div>

      {/* Services */}
      <section className="section" id="services">
        <div className="section-eyebrow">What we do</div>
        <h2 className="section-title">Services built<br />for <em>lasting impact</em></h2>
        <p className="section-desc">We don&apos;t do templates. Every engagement is crafted around your unique context, market, and ambitions.</p>
        <div className="services-grid">
          <div className="service-card">
            <div className="service-num">01</div>
            <svg className="service-icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="4" width="32" height="32" rx="2" stroke="#c4a96b" strokeWidth="1" />
              <line x1="4" y1="14" x2="36" y2="14" stroke="#c4a96b" strokeWidth="1" />
              <line x1="20" y1="14" x2="20" y2="36" stroke="#c4a96b" strokeWidth="1" />
            </svg>
            <div className="service-name">Brand Strategy</div>
            <p className="service-text">We build brands with conviction — from positioning and naming through to visual identity systems that speak with authority.</p>
            <a href="#" className="service-arrow">Explore <span>→</span></a>
          </div>
          <div className="service-card">
            <div className="service-num">02</div>
            <svg className="service-icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="15" stroke="#c4a96b" strokeWidth="1" />
              <circle cx="20" cy="20" r="6" stroke="#c4a96b" strokeWidth="1" />
              <line x1="20" y1="5" x2="20" y2="14" stroke="#c4a96b" strokeWidth="1" />
              <line x1="20" y1="26" x2="20" y2="35" stroke="#c4a96b" strokeWidth="1" />
            </svg>
            <div className="service-name">Digital Experience</div>
            <p className="service-text">Websites and applications that convert — meticulously designed for performance, elegance, and meaningful user journeys.</p>
            <a href="#" className="service-arrow">Explore <span>→</span></a>
          </div>
          <div className="service-card">
            <div className="service-num">03</div>
            <svg className="service-icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polyline points="4,30 14,18 22,24 32,10 36,14" stroke="#c4a96b" strokeWidth="1" fill="none" />
              <circle cx="4" cy="30" r="2" fill="#c4a96b" />
              <circle cx="36" cy="14" r="2" fill="#c4a96b" />
            </svg>
            <div className="service-name">Growth Advisory</div>
            <p className="service-text">Strategic guidance that translates vision into measurable outcomes — market entry, scaling, and competitive positioning.</p>
            <a href="#" className="service-arrow">Explore <span>→</span></a>
          </div>
          <div className="service-card">
            <div className="service-num">04</div>
            <svg className="service-icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="6" y="10" width="28" height="20" rx="1" stroke="#c4a96b" strokeWidth="1" />
              <line x1="13" y1="10" x2="13" y2="30" stroke="#c4a96b" strokeWidth="1" />
              <line x1="6" y1="20" x2="34" y2="20" stroke="#c4a96b" strokeWidth="1" />
            </svg>
            <div className="service-name">Content Systems</div>
            <p className="service-text">Editorial frameworks, content strategy, and storytelling infrastructure that builds authority and drives organic growth.</p>
            <a href="#" className="service-arrow">Explore <span>→</span></a>
          </div>
          <div className="service-card">
            <div className="service-num">05</div>
            <svg className="service-icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6 L34 14 L34 26 L20 34 L6 26 L6 14 Z" stroke="#c4a96b" strokeWidth="1" fill="none" />
              <path d="M20 13 L27 17 L27 23 L20 27 L13 23 L13 17 Z" stroke="#c4a96b" strokeWidth="1" fill="none" />
            </svg>
            <div className="service-name">Product Design</div>
            <p className="service-text">End-to-end product design from concept through to pixel-perfect interfaces — always anchored in user behaviour.</p>
            <a href="#" className="service-arrow">Explore <span>→</span></a>
          </div>
          <div className="service-card">
            <div className="service-num">06</div>
            <svg className="service-icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="20" r="4" stroke="#c4a96b" strokeWidth="1" />
              <circle cx="30" cy="12" r="4" stroke="#c4a96b" strokeWidth="1" />
              <circle cx="30" cy="28" r="4" stroke="#c4a96b" strokeWidth="1" />
              <line x1="14" y1="18" x2="26" y2="14" stroke="#c4a96b" strokeWidth="1" />
              <line x1="14" y1="22" x2="26" y2="26" stroke="#c4a96b" strokeWidth="1" />
            </svg>
            <div className="service-name">Partnerships</div>
            <p className="service-text">Curated strategic partnerships and go-to-market alliances that open doors and accelerate your trajectory.</p>
            <a href="#" className="service-arrow">Explore <span>→</span></a>
          </div>
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
          <h2 className="section-title">Precision<br />over <em>volume</em></h2>
          <ul className="feature-list">
            <li>
              <div>
                <strong>Deep discovery</strong>
                We invest time understanding your market, competitors, and customers before proposing anything.
              </div>
            </li>
            <li>
              <div>
                <strong>Cross-discipline thinking</strong>
                Strategy, design, and technology working in concert — not siloed departments passing briefs.
              </div>
            </li>
            <li>
              <div>
                <strong>Measurable outcomes</strong>
                Every engagement defines clear success metrics. We don&apos;t just deliver work, we deliver results.
              </div>
            </li>
            <li>
              <div>
                <strong>Long-term partnership</strong>
                We&apos;re selective about who we work with because we aim to be partners, not vendors.
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Testimonials */}
      <section className="testimonials-section" id="work">
        <div className="testimonials-inner">
          <div className="section-eyebrow">What clients say</div>
          <h2 className="section-title" style={{ marginBottom: 0 }}>Trusted by<br /><em>industry leaders</em></h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <p className="testimonial-quote">&ldquo;Luminary didn&apos;t just rebrand us — they fundamentally changed how we see ourselves. Revenue followed.&rdquo;</p>
              <div className="testimonial-author">
                <div className="author-avatar">SK</div>
                <div>
                  <div className="author-name">Sarah Kimani</div>
                  <div className="author-role">CEO, Horizon Ventures</div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <p className="testimonial-quote">&ldquo;The rigour of their process is unlike anything we&apos;ve experienced. Every decision is backed by insight.&rdquo;</p>
              <div className="testimonial-author">
                <div className="author-avatar">MR</div>
                <div>
                  <div className="author-name">Marc Roux</div>
                  <div className="author-role">Founder, Atelier Labs</div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <p className="testimonial-quote">&ldquo;Six months after launch, organic traffic is up 280%. The content system they built is still paying dividends.&rdquo;</p>
              <div className="testimonial-author">
                <div className="author-avatar">JP</div>
                <div>
                  <div className="author-name">Jade Petrov</div>
                  <div className="author-role">CMO, Dusk Capital</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section" id="contact">
        <div className="cta-bg"></div>
        <div className="section-eyebrow" style={{ textAlign: 'center' }}>Ready to begin</div>
        <h2 className="cta-title">Let&apos;s build<br />something <em>lasting</em></h2>
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
          <button className="cta-submit" onClick={handleSubmit}>Request →</button>
        </div>
        <p className="cta-note" style={ctaMsgColor ? { color: ctaMsgColor } : undefined}>
          {ctaMsg}
        </p>
      </section>

      {/* Footer */}
      <footer>
        <div>
          <div className="footer-logo">LUMINARY</div>
          <div className="footer-tagline">Strategy · Design · Growth</div>
        </div>
        <ul className="footer-links">
          <li><a href="#">Services</a></li>
          <li><a href="#">Case Studies</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Careers</a></li>
          <li><a href="#">Contact</a></li>
        </ul>
        <div className="footer-copy">© 2026 Luminary. All rights reserved.</div>
      </footer>
    </>
  );
}

/* ───────────────────────── NUMBER COUNTER ───────────────────────── */

function animateNumbers() {
  document.querySelectorAll<HTMLDivElement>('.stat-num').forEach((el) => {
    const text = el.textContent || '';
    const num = parseFloat(text);
    if (isNaN(num)) return;
    const suffix = text.replace(/[\d.]/g, '');
    const duration = 1800;
    const startTime = performance.now();

    const update = (now: number) => {
      const p = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      const val = num * ease;
      el.textContent = (Number.isInteger(num) ? Math.round(val) : val.toFixed(1)) + suffix;
      if (p < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  });
}
