'use client'
import { useState } from 'react'

export default function CTA({ onAudit }) {
  const [email, setEmail] = useState('')

  const submit = () => {
    if (email) {
      window.location.href = `mailto:hello@titanleap.co?subject=Revenue Leak Audit Request&body=Email: ${email}`
    }
    onAudit()
  }

  return (
    <section className="sec cta" id="cta">
      <div className="wrap">
        <div className="cta-box">
          <div className="cta-tag">✦ $297 Revenue Leak Audit</div>
          <h2 className="cta-h2 reveal">Your funnel might be<br /><em>leaking revenue.</em><br />Let&apos;s find out.</h2>
          <p className="cta-sub reveal">For $297, get a full breakdown of your funnel, traffic, and conversion gaps — the same audit framework we use with Scaling System clients, delivered in 5 hours.</p>
          <div className="cta-form reveal">
            <input className="cta-inp" type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} />
            <button className="cta-go" onClick={submit}>Get My Audit →</button>
          </div>
          <p className="cta-fine reveal">One-time $297. Delivered in 5 hours. No retainer required.</p>
        </div>
      </div>
    </section>
  )
}
