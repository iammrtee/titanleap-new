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
          <div className="cta-tag">✦ Free Revenue Leak Audit — 5 spots left this week</div>
          <h2 className="cta-h2 reveal">Your funnel is probably<br /><em>leaking revenue.</em><br />We&apos;ll prove it.</h2>
          <p className="cta-sub reveal">Apply for a free audit and get a full breakdown of your funnel, traffic, and conversion gaps — the same framework we use with every Scaling System client. Delivered in 5 hours.</p>
          <div className="cta-form reveal">
            <input className="cta-inp" type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} />
            <button className="cta-go" onClick={submit}>Apply for Free Audit →</button>
          </div>
          <p className="cta-fine reveal">100% free. No pitch, no retainer required. We do 5 audits per week — first come, first served.</p>
        </div>
      </div>
    </section>
  )
}
