'use client';

import { useEffect, useRef } from 'react';

const TEMPLATE_HTML = `
<style>
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --bg: #0a0a0b;
    --bg2: #111113;
    --bg3: #18181b;
    --border: rgba(255,255,255,0.07);
    --border2: rgba(255,255,255,0.13);
    --text: #e8e6e1;
    --muted: #6b6967;
    --muted2: #9b9895;
    --accent: #c9b99a;
    --accent2: #e8ddd0;
    --gold: #c4a96b;
    --gold2: #e8c87a;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Mono', monospace;
    font-weight: 300;
    font-size: 13px;
    letter-spacing: 0.02em;
    line-height: 1.6;
    overflow-x: hidden;
  }

  /* CURSOR */
  * { cursor: none !important; }
  #cursor {
    position: fixed; top: 0; left: 0; pointer-events: none; z-index: 9999;
    transition: transform 0.1s ease;
  }
  #cursor-dot {
    width: 6px; height: 6px; background: var(--gold);
    border-radius: 50%; position: absolute;
    transform: translate(-50%, -50%);
    transition: width 0.2s, height 0.2s, background 0.2s;
  }
  #cursor-ring {
    width: 32px; height: 32px; border: 1px solid rgba(196,169,107,0.4);
    border-radius: 50%; position: absolute;
    transform: translate(-50%, -50%);
    transition: width 0.3s ease, height 0.3s ease, border-color 0.3s ease, transform 0.15s ease;
  }
  body.hovering #cursor-dot { width: 8px; height: 8px; background: var(--gold2); }
  body.hovering #cursor-ring {
    width: 48px; height: 48px;
    border-color: rgba(196,169,107,0.7);
  }

  /* NAV */
  nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 28px 56px;
    transition: background 0.4s, padding 0.4s;
  }
  nav.scrolled {
    background: rgba(10,10,11,0.92);
    backdrop-filter: blur(12px);
    padding: 18px 56px;
    border-bottom: 1px solid var(--border);
  }
  .nav-logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px; font-weight: 300; letter-spacing: 0.18em;
    color: var(--accent2); text-decoration: none;
  }
  .nav-links { display: flex; gap: 40px; list-style: none; }
  .nav-links a {
    color: var(--muted2); text-decoration: none; font-size: 11px;
    letter-spacing: 0.12em; text-transform: uppercase;
    transition: color 0.2s;
    position: relative;
  }
  .nav-links a::after {
    content: ''; position: absolute; bottom: -4px; left: 0; right: 0;
    height: 1px; background: var(--gold);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.3s ease;
  }
  .nav-links a:hover { color: var(--accent2); }
  .nav-links a:hover::after { transform: scaleX(1); }
  .nav-cta {
    border: 1px solid var(--border2); color: var(--accent2);
    padding: 9px 22px; font-size: 11px; letter-spacing: 0.12em;
    text-transform: uppercase; background: transparent;
    transition: background 0.3s, border-color 0.3s;
    font-family: 'DM Mono', monospace;
  }
  .nav-cta:hover { background: rgba(255,255,255,0.05); border-color: var(--accent); }

  /* HERO */
  .hero {
    min-height: 100vh;
    display: flex; flex-direction: column;
    justify-content: center; align-items: center;
    text-align: center;
    padding: 120px 24px 80px;
    position: relative; overflow: hidden;
  }
  .hero-grid {
    position: absolute; inset: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
    background-size: 80px 80px;
    mask-image: radial-gradient(ellipse 80% 70% at 50% 50%, black 40%, transparent 100%);
  }
  .hero-eyebrow {
    display: flex; align-items: center; gap: 16px; margin-bottom: 40px;
    color: var(--gold); font-size: 10px; letter-spacing: 0.25em;
    text-transform: uppercase; opacity: 0;
    animation: fadeUp 0.8s 0.2s forwards;
  }
  .hero-eyebrow::before, .hero-eyebrow::after {
    content: ''; flex: 1; max-width: 60px; height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold));
  }
  .hero-eyebrow::after { background: linear-gradient(270deg, transparent, var(--gold)); }
  .hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(52px, 9vw, 110px);
    font-weight: 300; line-height: 0.95;
    letter-spacing: -0.01em; color: var(--accent2);
    margin-bottom: 12px;
    opacity: 0; animation: fadeUp 0.8s 0.4s forwards;
  }
  .hero-title em { font-style: italic; color: var(--gold); }
  .hero-subtitle {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(28px, 4vw, 52px);
    font-weight: 300; font-style: italic;
    color: var(--muted2); margin-bottom: 40px;
    opacity: 0; animation: fadeUp 0.8s 0.5s forwards;
  }
  .hero-desc {
    max-width: 480px; color: var(--muted); font-size: 13px; line-height: 1.8;
    margin-bottom: 56px;
    opacity: 0; animation: fadeUp 0.8s 0.65s forwards;
  }
  .hero-actions {
    display: flex; gap: 16px; align-items: center;
    opacity: 0; animation: fadeUp 0.8s 0.8s forwards;
  }
  .btn-primary {
    background: var(--gold); color: #0a0a0b;
    padding: 14px 36px; font-size: 11px; letter-spacing: 0.15em;
    text-transform: uppercase; font-family: 'DM Mono', monospace;
    border: none; font-weight: 400;
    transition: background 0.3s, transform 0.2s;
  }
  .btn-primary:hover { background: var(--gold2); transform: translateY(-1px); }
  .btn-ghost {
    color: var(--muted2); font-size: 11px; letter-spacing: 0.15em;
    text-transform: uppercase; text-decoration: none;
    padding: 14px 24px; border: 1px solid var(--border2);
    font-family: 'DM Mono', monospace; background: none;
    transition: color 0.3s, border-color 0.3s;
  }
  .btn-ghost:hover { color: var(--accent2); border-color: var(--border2); }
  .hero-scroll {
    position: absolute; bottom: 40px;
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    color: var(--muted); font-size: 10px; letter-spacing: 0.2em;
    text-transform: uppercase;
    animation: fadeIn 1s 1.4s forwards; opacity: 0;
  }
  .scroll-line {
    width: 1px; height: 48px;
    background: linear-gradient(to bottom, var(--gold), transparent);
    animation: scrollAnim 2s 1.8s infinite;
  }

  /* STATS BAR */
  .stats-bar {
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    background: var(--bg2);
    display: grid; grid-template-columns: repeat(4, 1fr);
  }
  .stat-item {
    padding: 40px 48px;
    border-right: 1px solid var(--border);
    opacity: 0; transform: translateY(20px);
    transition: opacity 0.6s, transform 0.6s;
  }
  .stat-item:last-child { border-right: none; }
  .stat-item.visible { opacity: 1; transform: none; }
  .stat-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 48px; font-weight: 300; color: var(--gold);
    line-height: 1; margin-bottom: 8px; letter-spacing: -0.02em;
  }
  .stat-label { color: var(--muted); font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase; }

  /* SERVICES */
  .section { padding: 120px 56px; max-width: 1400px; margin: 0 auto; }
  .section-eyebrow {
    font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase;
    color: var(--gold); margin-bottom: 24px;
  }
  .section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(36px, 5vw, 64px); font-weight: 300; line-height: 1.1;
    color: var(--accent2); margin-bottom: 16px;
  }
  .section-title em { font-style: italic; color: var(--muted2); }
  .section-desc { color: var(--muted); max-width: 480px; line-height: 1.9; margin-bottom: 72px; }
  .services-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px;
    background: var(--border);
  }
  .service-card {
    background: var(--bg); padding: 48px 40px;
    transition: background 0.3s;
    position: relative; overflow: hidden;
    opacity: 0; transform: translateY(30px);
    transition: opacity 0.6s, transform 0.6s, background 0.3s;
  }
  .service-card.visible { opacity: 1; transform: none; }
  .service-card:hover { background: var(--bg3); }
  .service-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0;
    height: 2px; background: var(--gold);
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.4s ease;
  }
  .service-card:hover::before { transform: scaleX(1); }
  .service-num { font-size: 10px; letter-spacing: 0.15em; color: var(--muted); margin-bottom: 32px; }
  .service-icon { width: 40px; height: 40px; margin-bottom: 24px; opacity: 0.6; }
  .service-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 28px; font-weight: 400; color: var(--accent2);
    margin-bottom: 16px; line-height: 1.2;
  }
  .service-text { color: var(--muted); font-size: 12px; line-height: 1.9; }
  .service-arrow {
    margin-top: 32px; display: inline-flex; align-items: center; gap: 8px;
    color: var(--gold); font-size: 10px; letter-spacing: 0.15em;
    text-transform: uppercase; text-decoration: none;
    transition: gap 0.3s;
  }
  .service-arrow:hover { gap: 14px; }

  /* FEATURE SECTION */
  .feature-section {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 0; border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }
  .feature-visual {
    background: var(--bg2);
    display: flex; align-items: center; justify-content: center;
    padding: 80px;
    position: relative; overflow: hidden;
  }
  .feature-orb {
    width: 240px; height: 240px; border-radius: 50%;
    background: radial-gradient(circle at 40% 40%, rgba(196,169,107,0.15), transparent 70%);
    border: 1px solid rgba(196,169,107,0.2);
    display: flex; align-items: center; justify-content: center;
    position: relative;
  }
  .feature-orb::before {
    content: ''; position: absolute; inset: -24px; border-radius: 50%;
    border: 1px dashed rgba(196,169,107,0.1);
    animation: spin 20s linear infinite;
  }
  .feature-orb::after {
    content: ''; position: absolute; inset: -48px; border-radius: 50%;
    border: 1px dashed rgba(196,169,107,0.06);
    animation: spin 35s linear infinite reverse;
  }
  .orb-inner {
    font-family: 'Cormorant Garamond', serif;
    font-size: 64px; font-weight: 300; color: var(--gold);
    opacity: 0.7;
  }
  .feature-content {
    padding: 80px 72px; display: flex;
    flex-direction: column; justify-content: center;
  }
  .feature-list { list-style: none; margin-top: 40px; }
  .feature-list li {
    display: flex; gap: 16px; align-items: flex-start;
    padding: 20px 0; border-bottom: 1px solid var(--border);
    color: var(--muted); font-size: 12px; line-height: 1.7;
    opacity: 0; transform: translateX(20px);
    transition: opacity 0.5s, transform 0.5s;
  }
  .feature-list li.visible { opacity: 1; transform: none; }
  .feature-list li::before {
    content: ''; flex-shrink: 0; width: 4px; height: 4px;
    background: var(--gold); border-radius: 50%; margin-top: 8px;
  }
  .feature-list li strong { color: var(--accent2); font-weight: 400; display: block; margin-bottom: 4px; }

  /* TESTIMONIALS */
  .testimonials-section { background: var(--bg2); padding: 120px 56px; }
  .testimonials-inner { max-width: 1400px; margin: 0 auto; }
  .testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 72px; }
  .testimonial-card {
    background: var(--bg); border: 1px solid var(--border);
    padding: 40px 36px;
    opacity: 0; transform: translateY(20px);
    transition: opacity 0.6s, transform 0.6s, border-color 0.3s;
  }
  .testimonial-card.visible { opacity: 1; transform: none; }
  .testimonial-card:hover { border-color: var(--border2); }
  .testimonial-quote {
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px; font-style: italic; font-weight: 300;
    color: var(--accent2); line-height: 1.7; margin-bottom: 32px;
  }
  .testimonial-author { display: flex; gap: 12px; align-items: center; }
  .author-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    background: var(--bg3); border: 1px solid var(--border2);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; color: var(--gold);
    font-family: 'Cormorant Garamond', serif;
  }
  .author-name { font-size: 12px; color: var(--accent2); letter-spacing: 0.05em; }
  .author-role { font-size: 10px; color: var(--muted); letter-spacing: 0.1em; margin-top: 2px; }

  /* CTA SECTION */
  .cta-section {
    padding: 160px 56px; text-align: center;
    position: relative; overflow: hidden;
  }
  .cta-bg {
    position: absolute; inset: 0; pointer-events: none;
    background: radial-gradient(ellipse 60% 50% at 50% 50%, rgba(196,169,107,0.06), transparent);
  }
  .cta-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(44px, 7vw, 88px); font-weight: 300;
    color: var(--accent2); line-height: 1; margin-bottom: 24px;
  }
  .cta-title em { font-style: italic; color: var(--gold); }
  .cta-sub { color: var(--muted); margin-bottom: 56px; }
  .cta-form { display: flex; gap: 0; max-width: 440px; margin: 0 auto; }
  .cta-input {
    flex: 1; background: var(--bg2); border: 1px solid var(--border2);
    border-right: none; color: var(--text); padding: 14px 20px;
    font-family: 'DM Mono', monospace; font-size: 12px;
    outline: none;
    transition: border-color 0.3s;
  }
  .cta-input:focus { border-color: var(--gold); }
  .cta-input::placeholder { color: var(--muted); }
  .cta-submit {
    background: var(--gold); color: #0a0a0b;
    border: 1px solid var(--gold); padding: 14px 28px;
    font-family: 'DM Mono', monospace; font-size: 11px;
    letter-spacing: 0.12em; text-transform: uppercase;
    font-weight: 400;
    transition: background 0.3s;
  }
  .cta-submit:hover { background: var(--gold2); }
  .cta-note { margin-top: 16px; font-size: 10px; color: var(--muted); letter-spacing: 0.1em; }

  /* FOOTER */
  footer {
    border-top: 1px solid var(--border);
    padding: 60px 56px 40px;
    display: grid; grid-template-columns: 1fr auto 1fr;
    align-items: end; gap: 40px;
  }
  .footer-logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px; font-weight: 300; letter-spacing: 0.18em;
    color: var(--accent2);
  }
  .footer-tagline { color: var(--muted); font-size: 10px; letter-spacing: 0.1em; margin-top: 8px; }
  .footer-links { display: flex; gap: 32px; justify-content: center; list-style: none; }
  .footer-links a { color: var(--muted); font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; text-decoration: none; transition: color 0.2s; }
  .footer-links a:hover { color: var(--accent2); }
  .footer-copy { text-align: right; color: var(--muted); font-size: 10px; letter-spacing: 0.08em; }

  /* ANIMATIONS */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    to { opacity: 0.5; }
  }
  @keyframes scrollAnim {
    0% { transform: scaleY(0); transform-origin: top; }
    50% { transform: scaleY(1); transform-origin: top; }
    51% { transform: scaleY(1); transform-origin: bottom; }
    100% { transform: scaleY(0); transform-origin: bottom; }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @media (max-width: 900px) {
    nav { padding: 20px 24px; }
    nav.scrolled { padding: 14px 24px; }
    .nav-links { display: none; }
    .section { padding: 80px 24px; }
    .stats-bar { grid-template-columns: repeat(2, 1fr); }
    .services-grid { grid-template-columns: 1fr; }
    .feature-section { grid-template-columns: 1fr; }
    .feature-visual { padding: 60px; min-height: 300px; }
    .testimonials-grid { grid-template-columns: 1fr; }
    .testimonials-section { padding: 80px 24px; }
    .cta-section { padding: 100px 24px; }
    footer { grid-template-columns: 1fr; text-align: center; padding: 48px 24px; }
    .footer-copy { text-align: center; }
    .footer-links { flex-wrap: wrap; justify-content: center; }
  }
</style>

<div id="cursor"><div id="cursor-ring"></div><div id="cursor-dot"></div></div>

<nav id="navbar">
  <a href="#" class="nav-logo">LUMINARY</a>
  <ul class="nav-links">
    <li><a href="#services">Services</a></li>
    <li><a href="#approach">Approach</a></li>
    <li><a href="#work">Work</a></li>
    <li><a href="#contact">Contact</a></li>
  </ul>
  <button class="nav-cta">Get Started</button>
</nav>

<section class="hero">
  <div class="hero-grid"></div>
  <div class="hero-eyebrow">Est. 2019 &nbsp;·&nbsp; Strategy & Design</div>
  <h1 class="hero-title">We craft<br><em>futures</em></h1>
  <p class="hero-subtitle">that endure</p>
  <p class="hero-desc">Luminary partners with ambitious companies to build brands, systems, and strategies that stand the test of time. Precision. Purpose. Performance.</p>
  <div class="hero-actions">
    <button class="btn-primary">Start a project</button>
    <a href="#work" class="btn-ghost">View our work</a>
  </div>
  <div class="hero-scroll">
    <div class="scroll-line"></div>
    <span>Scroll</span>
  </div>
</section>

<div class="stats-bar">
  <div class="stat-item"><div class="stat-num">240+</div><div class="stat-label">Projects delivered</div></div>
  <div class="stat-item"><div class="stat-num">98%</div><div class="stat-label">Client retention</div></div>
  <div class="stat-item"><div class="stat-num">18</div><div class="stat-label">Industry awards</div></div>
  <div class="stat-item"><div class="stat-num">3×</div><div class="stat-label">Avg. revenue growth</div></div>
</div>

<section class="section" id="services">
  <div class="section-eyebrow">What we do</div>
  <h2 class="section-title">Services built<br>for <em>lasting impact</em></h2>
  <p class="section-desc">We don't do templates. Every engagement is crafted around your unique context, market, and ambitions.</p>
  <div class="services-grid">
    <div class="service-card">
      <div class="service-num">01</div>
      <svg class="service-icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="4" width="32" height="32" rx="2" stroke="#c4a96b" stroke-width="1"/>
        <line x1="4" y1="14" x2="36" y2="14" stroke="#c4a96b" stroke-width="1"/>
        <line x1="20" y1="14" x2="20" y2="36" stroke="#c4a96b" stroke-width="1"/>
      </svg>
      <div class="service-name">Brand Strategy</div>
      <p class="service-text">We build brands with conviction — from positioning and naming through to visual identity systems that speak with authority.</p>
      <a href="#" class="service-arrow">Explore <span>→</span></a>
    </div>
    <div class="service-card">
      <div class="service-num">02</div>
      <svg class="service-icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="15" stroke="#c4a96b" stroke-width="1"/>
        <circle cx="20" cy="20" r="6" stroke="#c4a96b" stroke-width="1"/>
        <line x1="20" y1="5" x2="20" y2="14" stroke="#c4a96b" stroke-width="1"/>
        <line x1="20" y1="26" x2="20" y2="35" stroke="#c4a96b" stroke-width="1"/>
      </svg>
      <div class="service-name">Digital Experience</div>
      <p class="service-text">Websites and applications that convert — meticulously designed for performance, elegance, and meaningful user journeys.</p>
      <a href="#" class="service-arrow">Explore <span>→</span></a>
    </div>
    <div class="service-card">
      <div class="service-num">03</div>
      <svg class="service-icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polyline points="4,30 14,18 22,24 32,10 36,14" stroke="#c4a96b" stroke-width="1" fill="none"/>
        <circle cx="4" cy="30" r="2" fill="#c4a96b"/>
        <circle cx="36" cy="14" r="2" fill="#c4a96b"/>
      </svg>
      <div class="service-name">Growth Advisory</div>
      <p class="service-text">Strategic guidance that translates vision into measurable outcomes — market entry, scaling, and competitive positioning.</p>
      <a href="#" class="service-arrow">Explore <span>→</span></a>
    </div>
    <div class="service-card">
      <div class="service-num">04</div>
      <svg class="service-icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="10" width="28" height="20" rx="1" stroke="#c4a96b" stroke-width="1"/>
        <line x1="13" y1="10" x2="13" y2="30" stroke="#c4a96b" stroke-width="1"/>
        <line x1="6" y1="20" x2="34" y2="20" stroke="#c4a96b" stroke-width="1"/>
      </svg>
      <div class="service-name">Content Systems</div>
      <p class="service-text">Editorial frameworks, content strategy, and storytelling infrastructure that builds authority and drives organic growth.</p>
      <a href="#" class="service-arrow">Explore <span>→</span></a>
    </div>
    <div class="service-card">
      <div class="service-num">05</div>
      <svg class="service-icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6 L34 14 L34 26 L20 34 L6 26 L6 14 Z" stroke="#c4a96b" stroke-width="1" fill="none"/>
        <path d="M20 13 L27 17 L27 23 L20 27 L13 23 L13 17 Z" stroke="#c4a96b" stroke-width="1" fill="none"/>
      </svg>
      <div class="service-name">Product Design</div>
      <p class="service-text">End-to-end product design from concept through to pixel-perfect interfaces — always anchored in user behaviour.</p>
      <a href="#" class="service-arrow">Explore <span>→</span></a>
    </div>
    <div class="service-card">
      <div class="service-num">06</div>
      <svg class="service-icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="20" r="4" stroke="#c4a96b" stroke-width="1"/>
        <circle cx="30" cy="12" r="4" stroke="#c4a96b" stroke-width="1"/>
        <circle cx="30" cy="28" r="4" stroke="#c4a96b" stroke-width="1"/>
        <line x1="14" y1="18" x2="26" y2="14" stroke="#c4a96b" stroke-width="1"/>
        <line x1="14" y1="22" x2="26" y2="26" stroke="#c4a96b" stroke-width="1"/>
      </svg>
      <div class="service-name">Partnerships</div>
      <p class="service-text">Curated strategic partnerships and go-to-market alliances that open doors and accelerate your trajectory.</p>
      <a href="#" class="service-arrow">Explore <span>→</span></a>
    </div>
  </div>
</section>

<div class="feature-section" id="approach">
  <div class="feature-visual">
    <div class="feature-orb">
      <div class="orb-inner">L</div>
    </div>
  </div>
  <div class="feature-content">
    <div class="section-eyebrow">Our approach</div>
    <h2 class="section-title">Precision<br>over <em>volume</em></h2>
    <ul class="feature-list">
      <li><div><strong>Deep discovery</strong>We invest time understanding your market, competitors, and customers before proposing anything.</div></li>
      <li><div><strong>Cross-discipline thinking</strong>Strategy, design, and technology working in concert — not siloed departments passing briefs.</div></li>
      <li><div><strong>Measurable outcomes</strong>Every engagement defines clear success metrics. We don't just deliver work, we deliver results.</div></li>
      <li><div><strong>Long-term partnership</strong>We're selective about who we work with because we aim to be partners, not vendors.</div></li>
    </ul>
  </div>
</div>

<section class="testimonials-section" id="work">
  <div class="testimonials-inner">
    <div class="section-eyebrow">What clients say</div>
    <h2 class="section-title" style="margin-bottom:0;">Trusted by<br><em>industry leaders</em></h2>
    <div class="testimonials-grid">
      <div class="testimonial-card">
        <p class="testimonial-quote">"Luminary didn't just rebrand us — they fundamentally changed how we see ourselves. Revenue followed."</p>
        <div class="testimonial-author">
          <div class="author-avatar">SK</div>
          <div><div class="author-name">Sarah Kimani</div><div class="author-role">CEO, Horizon Ventures</div></div>
        </div>
      </div>
      <div class="testimonial-card">
        <p class="testimonial-quote">"The rigour of their process is unlike anything we've experienced. Every decision is backed by insight."</p>
        <div class="testimonial-author">
          <div class="author-avatar">MR</div>
          <div><div class="author-name">Marc Roux</div><div class="author-role">Founder, Atelier Labs</div></div>
        </div>
      </div>
      <div class="testimonial-card">
        <p class="testimonial-quote">"Six months after launch, organic traffic is up 280%. The content system they built is still paying dividends."</p>
        <div class="testimonial-author">
          <div class="author-avatar">JP</div>
          <div><div class="author-name">Jade Petrov</div><div class="author-role">CMO, Dusk Capital</div></div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="cta-section" id="contact">
  <div class="cta-bg"></div>
  <div class="section-eyebrow" style="text-align:center;">Ready to begin</div>
  <h2 class="cta-title">Let's build<br>something <em>lasting</em></h2>
  <p class="cta-sub">Join 240+ companies who chose precision over noise.</p>
  <div class="cta-form">
    <input type="email" class="cta-input" placeholder="your@email.com" id="emailInput">
    <button class="cta-submit" id="cta-submit">Request →</button>
  </div>
  <p class="cta-note" id="cta-msg">No spam. No obligation. We respond within 24 hours.</p>
</section>

<footer>
  <div>
    <div class="footer-logo">LUMINARY</div>
    <div class="footer-tagline">Strategy · Design · Growth</div>
  </div>
  <ul class="footer-links">
    <li><a href="#">Services</a></li>
    <li><a href="#">Case Studies</a></li>
    <li><a href="#">About</a></li>
    <li><a href="#">Careers</a></li>
    <li><a href="#">Contact</a></li>
  </ul>
  <div class="footer-copy">© 2026 Luminary. All rights reserved.</div>
</footer>
`;

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // ── Custom Cursor ──
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let cx = mx;
    let cy = my;
    const cursor = document.getElementById('cursor');
    const ring = document.getElementById('cursor-ring');

    document.addEventListener('mousemove', (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    });

    function animCursor() {
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;
      if (cursor) { cursor.style.left = mx + 'px'; cursor.style.top = my + 'px'; }
      if (ring) { ring.style.left = (cx - mx) + 'px'; ring.style.top = (cy - my) + 'px'; }
      requestAnimationFrame(animCursor);
    }
    animCursor();

    // ── Hover detection ──
    document.querySelectorAll('a, button, input').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });

    // ── Navbar scroll ──
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
      if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60);
    });

    // ── Intersection Observer for scroll-reveal ──
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;
          setTimeout(() => el.classList.add('visible'), delay);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.stat-item').forEach((el, i) => {
      (el as HTMLElement).dataset.delay = String(i * 120);
      observer.observe(el);
    });
    document.querySelectorAll('.service-card').forEach((el, i) => {
      (el as HTMLElement).dataset.delay = String(i * 100);
      observer.observe(el);
    });
    document.querySelectorAll('.feature-list li').forEach((el, i) => {
      (el as HTMLElement).dataset.delay = String(i * 120);
      observer.observe(el);
    });
    document.querySelectorAll('.testimonial-card').forEach((el, i) => {
      (el as HTMLElement).dataset.delay = String(i * 150);
      observer.observe(el);
    });

    // ── Number counter ──
    function animateNumbers() {
      document.querySelectorAll<HTMLDivElement>('.stat-num').forEach(el => {
        const text = el.textContent || '';
        const num = parseFloat(text);
        if (isNaN(num)) return;
        const suffix = text.replace(/[\d.]/g, '');
        const duration = 1800;
        const startTime = performance.now();
        function update(now: number) {
          const p = Math.min((now - startTime) / duration, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          const val = num * ease;
          el.textContent = (Number.isInteger(num) ? Math.round(val) : val.toFixed(1)) + suffix;
          if (p < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
      });
    }

    const statsBar = document.querySelector('.stats-bar');
    if (statsBar) {
      const statsObserver = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) { animateNumbers(); statsObserver.disconnect(); }
      }, { threshold: 0.5 });
      statsObserver.observe(statsBar);
    }

    // ── CTA form ──
    function handleSubmit() {
      const input = document.getElementById('emailInput') as HTMLInputElement;
      const msg = document.getElementById('cta-msg');
      const v = input?.value;
      if (msg && input) {
        if (v && v.includes('@')) {
          msg.textContent = "✓ You're on the list. We'll be in touch soon.";
          msg.style.color = '#c4a96b';
          input.value = '';
        } else {
          msg.textContent = 'Please enter a valid email address.';
          msg.style.color = '#e24b4a';
          setTimeout(() => {
            msg.textContent = 'No spam. No obligation. We respond within 24 hours.';
            msg.style.color = '';
          }, 2400);
        }
      }
    }

    const submitBtn = document.getElementById('cta-submit');
    if (submitBtn) submitBtn.addEventListener('click', handleSubmit);
    const emailInput = document.getElementById('emailInput');
    if (emailInput) emailInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleSubmit(); });
  }, []);

  return (
    <div
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: TEMPLATE_HTML }}
    />
  );
}
