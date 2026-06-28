'use client'
import { useEffect, useRef, useState } from 'react'
import { useTheme } from './ThemeContext'

export default function Nav({ onAudit }) {
  const { theme, toggleTheme } = useTheme()
  const navRef = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => navRef.current?.classList.toggle('stuck', window.scrollY > 80)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close menu on resize to desktop
  useEffect(() => {
    const handler = () => { if (window.innerWidth > 680) setMenuOpen(false) }
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  // Prevent scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <nav id="nav" ref={navRef}>
        <a href="#" className="logo">
          <span className="logo-text">Titan<em>Leap</em></span>
        </a>
        <ul className="nav-mid">
          <li><a href="#services">Services</a></li>
          <li><a href="#process">Process</a></li>
          <li><a href="#results">Results</a></li>
          <li><a href="#system">The System</a></li>
          <li><a href="#pricing">Pricing</a></li>
        </ul>
        <div className="nav-right">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            <svg className="icon-moon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            <svg className="icon-sun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          </button>
          <a href="#" className="nav-btn desktop-only" onClick={e=>{e.preventDefault();onAudit()}}>Free Audit <span>→</span></a>
          {/* Hamburger — mobile only */}
          <button
            className="hamburger"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span className={`ham-bar ${menuOpen ? 'open' : ''}`} />
            <span className={`ham-bar ${menuOpen ? 'open' : ''}`} />
            <span className={`ham-bar ${menuOpen ? 'open' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile overlay menu */}
      <div className={`mobile-menu ${menuOpen ? 'mobile-menu--open' : ''}`} aria-hidden={!menuOpen}>
        <nav className="mobile-menu__nav">
          <ul>
            <li><a href="#services" onClick={closeMenu}>Services</a></li>
            <li><a href="#process" onClick={closeMenu}>Process</a></li>
            <li><a href="#results" onClick={closeMenu}>Results</a></li>
            <li><a href="#system" onClick={closeMenu}>The System</a></li>
            <li><a href="#pricing" onClick={closeMenu}>Pricing</a></li>
          </ul>
          <a
            href="#"
            className="btn-primary mobile-menu__cta"
            onClick={e => { e.preventDefault(); closeMenu(); onAudit() }}
          >
            Apply for Free Audit →
          </a>
        </nav>
      </div>
    </>
  )
}
