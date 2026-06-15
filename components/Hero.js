'use client'
import { useRef } from 'react'

export default function Hero({ onAudit }) {
  const videoRef = useRef(null)
  const overlayRef = useRef(null)

  const playVideo = () => {
    videoRef.current?.play()
    if (overlayRef.current) overlayRef.current.style.opacity = '0'
    setTimeout(() => { if (overlayRef.current) overlayRef.current.style.display = 'none' }, 400)
  }

  return (
    <section className="hero">
      <div className="orb orb1" /><div className="orb orb2" /><div className="orb orb3" />
      <div className="hero-left">
        <div className="hero-eyebrow"><span className="dot" />Built by founders, for founders</div>
        <h1 className="hero-h1">We build the<br /><em>growth system</em><br />your SaaS is <span className="ghost">missing.</span></h1>
        <p className="hero-p">TitanLeap is a <strong>done-for-you growth partner</strong> — not another agency selling campaigns. We design the funnel, automate your lead flow, and build the content engine that turns your SaaS into a system that compounds, month after month.</p>
        <div className="hero-actions">
          <a href="#" className="btn-primary" onClick={e=>{e.preventDefault();onAudit()}}>Get Your $297 Audit <span>→</span></a>
          <a href="#process" className="btn-ghost">See how it works ↓</a>
        </div>
        <div className="hero-trust">
          <div className="trust-text"><strong>Founder-led.</strong> Built on proven growth frameworks.<br />Every engagement starts with a hands-on audit — not a template.</div>
        </div>
      </div>
      <div className="hero-right">
        <div className="video-panel">
          <div className="video-glow" />
          <div className="video-frame">
            <div className="video-inner">
              <div className="video-chrome">
                <div className="chrome-dots">
                  <div className="chrome-dot" /><div className="chrome-dot" /><div className="chrome-dot" />
                </div>
                <div className="chrome-bar">titanleap.co/client-session</div>
                <div className="chrome-live"><span className="chrome-live-dot" />Live</div>
              </div>
              <video ref={videoRef} preload="metadata" playsInline muted>
                <source src="/clientcall.mp4" type="video/mp4" />
              </video>
              <div className="video-overlay" ref={overlayRef} onClick={playVideo}>
                <div className="play-btn">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--p900)"><polygon points="5,3 19,12 5,21"/></svg>
                </div>
              </div>
            </div>
          </div>
          <div className="vid-chip vid-chip-1">
            <span className="vid-chip-dot" />
            <div className="vid-chip-text"><strong>Client Success Call</strong><span>Real results, real founders</span></div>
          </div>
          <div className="vid-chip vid-chip-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
            <div className="vid-chip-text"><strong>3.8× ROAS</strong><span>90-day average</span></div>
          </div>
        </div>
      </div>
    </section>
  )
}
