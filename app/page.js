'use client'
import { useState, useEffect } from 'react'
import Loader from '../components/Loader'
import Nav from '../components/Nav'
import Hero from '../components/Hero'
import Marquee from '../components/Marquee'
import Logos from '../components/Logos'
import Problem from '../components/Problem'
import Services from '../components/Services'
import Guarantees from '../components/Guarantees'
import Process from '../components/Process'
import Testimonials from '../components/Testimonials'
import TheSystem from '../components/TheSystem'
import Pricing from '../components/Pricing'
import Results from '../components/Results'
import CTA from '../components/CTA'
import Footer from '../components/Footer'
import AuditModal from '../components/AuditModal'

export default function Home() {
  const [auditOpen, setAuditOpen] = useState(false)

  useEffect(() => {
    // Custom cursor — only on real pointer (mouse) devices, not touch
    const isPointerFine = window.matchMedia('(pointer: fine)').matches
    let cleanupCursor = () => {}

    if (isPointerFine) {
      const cur = document.createElement('div')
      cur.id = 'cur'
      const ring = document.createElement('div')
      ring.id = 'cur-ring'
      document.body.appendChild(cur)
      document.body.appendChild(ring)

      let mx = 0, my = 0, rx = 0, ry = 0
      const onMove = e => {
        mx = e.clientX; my = e.clientY
        cur.style.transform = `translate(${mx - 3.5}px,${my - 3.5}px)`
      }
      document.addEventListener('mousemove', onMove)
      let rafId
      const raf = () => {
        rx += (mx - rx) * 0.1; ry += (my - ry) * 0.1
        ring.style.transform = `translate(${rx - 18}px,${ry - 18}px)`
        rafId = requestAnimationFrame(raf)
      }
      raf()

      const hoverEls = document.querySelectorAll('a,button,.svc-card,.r-card,.p-card,.prob-card,.proc-step,.test-card,.addon-card')
      hoverEls.forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('big'))
        el.addEventListener('mouseleave', () => ring.classList.remove('big'))
      })

      cleanupCursor = () => {
        document.removeEventListener('mousemove', onMove)
        cancelAnimationFrame(rafId)
        if (document.body.contains(cur)) document.body.removeChild(cur)
        if (document.body.contains(ring)) document.body.removeChild(ring)
      }
    }

    // Reveal on scroll
    const obs = new IntersectionObserver(
      es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('on') }),
      { threshold: 0.08 }
    )
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el))

    return () => {
      cleanupCursor()
      obs.disconnect()
    }
  }, [])

  return (
    <>
      <Loader />
      <Nav onAudit={() => setAuditOpen(true)} />
      <Hero onAudit={() => setAuditOpen(true)} />
      <Marquee />
      <Logos />
      <Problem />
      <Services onAudit={() => setAuditOpen(true)} />
      <Guarantees />
      <Process />
      <Testimonials />
      <TheSystem onAudit={() => setAuditOpen(true)} />
      <Pricing onAudit={() => setAuditOpen(true)} />
      <Results />
      <CTA onAudit={() => setAuditOpen(true)} />
      <Footer />
      <AuditModal open={auditOpen} onClose={() => setAuditOpen(false)} />
    </>
  )
}
