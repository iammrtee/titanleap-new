'use client'
import { useState } from 'react'

const items = [
  { q: 'Predictable lead pipeline within 60 days', a: "You'll have a predictable lead pipeline within 60 days — or we work for free until you do. We monitor weekly performance, remove bottlenecks, and keep optimizing until results are consistent." },
  { q: 'More content in 30 days than most do in 6 months', a: 'Your brand will produce more high-quality content in 30 days than most companies produce in 6 months — with a system that keeps going without you. Batched production, AI-assisted editing, platform-native formats.' },
  { q: 'Growth metrics improve in 90 days — or we\'re free', a: "If we don't improve your growth metrics within the first 90 days, we continue working for free until we do. Simple. No excuses, no renegotiation, no asterisks." },
]

export default function Guarantees() {
  const [open, setOpen] = useState(null)
  const toggle = i => setOpen(open === i ? null : i)

  return (
    <section className="sec guarantees" id="guarantees">
      <div className="wrap">
        <div className="g-grid">
          <div>
            <div className="sec-tag reveal">Our Guarantees</div>
            <h2 className="g-left-head reveal">We put our<br /><em>work on the line.</em></h2>
            <p className="g-left-p reveal">Three guarantees that mean we don't get paid until you see results. No vague promises — hard commitments with consequences if we miss.</p>
          </div>
          <div className="g-items">
            {items.map((item, i) => (
              <div key={i} className={`reveal d${i+1}`}>
                <div className={`g-item${open === i ? ' open' : ''}`}>
                  <div className="g-q" onClick={() => toggle(i)}>
                    <span>{item.q}</span>
                    <span className="g-ico">{open === i ? '−' : '+'}</span>
                  </div>
                  <div className="g-a">{item.a}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
