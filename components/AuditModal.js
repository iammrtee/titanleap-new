'use client'
import { useState, useEffect } from 'react'

const revOpts = ['Pre-revenue','Under $1k/mo','$1k–$5k/mo','$5k–$15k/mo','$15k–$50k/mo','Over $50k/mo']
const revVals = ['Pre-revenue — not making money yet','Under $1k/month','$1k–$5k/month','$5k–$15k/month','$15k–$50k/month','Over $50k/month']

export default function AuditModal({ open, onClose }) {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)
  const [answers, setAnswers] = useState({ a1:'', a2:'', a3:'', a4:'', a5:'', name:'', email:'', url:'', goal:'' })
  const [err, setErr] = useState('')

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (!open) { setStep(1); setSubmitted(false); setErr('') }
  }, [open])

  const set = (key, val) => setAnswers(a => ({ ...a, [key]: val }))

  const validate = () => {
    if (step === 1 && !answers.a1.trim()) { setErr('Please tell us about your product.'); return false }
    if (step === 2 && !answers.a2) { setErr('Please select your revenue stage.'); return false }
    if (step === 3 && !answers.a3.trim()) { setErr('Please describe your funnel.'); return false }
    if (step === 4 && !answers.a4.trim()) { setErr('Please share your instinct.'); return false }
    if (step === 5 && !answers.a5.trim()) { setErr("Please tell us what you've tried."); return false }
    if (step === 6 && (!answers.name.trim() || !answers.email.trim() || !answers.goal.trim())) { setErr('Please fill in name, email, and success goal.'); return false }
    setErr(''); return true
  }

  const next = () => { if (validate()) setStep(s => Math.min(s + 1, 7)) }
  const back = () => { setErr(''); setStep(s => Math.max(s - 1, 1)) }

  const submit = async () => {
    setSending(true)
    setErr('')
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(answers),
      })
      if (!res.ok) throw new Error('failed')
      setSubmitted(true)
    } catch {
      setErr('Something went wrong. Please email us directly at hello@titanleap.co')
    } finally {
      setSending(false)
    }
  }

  if (!open) return null

  const progress = Math.min(step, 6)

  return (
    <div className="audit-overlay open" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="audit-modal">
        <div className="audit-modal-header">
          <span className="audit-modal-title">Revenue Leak Audit — Intake Form</span>
          <div className="audit-modal-close" onClick={onClose}>✕</div>
        </div>
        <div className="am-wrap">
          <div className="am-header">
            <div className="am-tag"><span className="am-tag-dot"/><span>Revenue Leak Audit</span></div>
            <h2>Tell us about your<br />business. We&apos;ll find<br />the <em>leaks.</em></h2>
            <p className="am-sub">Takes <strong>5 minutes.</strong> The more specific you are, the more specific your diagnosis. Audit delivered within 5 hours.</p>
            {!submitted && (
              <div className="am-progress">
                <span className="am-pb-label">Question {Math.min(step,6)} of 6</span>
                <div className="am-pb-steps">
                  {[1,2,3,4,5,6].map(i => (
                    <div key={i} className={`am-pb-step${i < progress ? ' done' : i === progress ? ' active' : ''}`}/>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="am-card">
            {submitted ? (
              <div className="am-success">
                <div className="am-success-icon">✓</div>
                <h3>Audit request received.</h3>
                <p>We'll send your Revenue Leak Report to your email <strong>within 5 hours.</strong> Check your inbox — and spam just in case.</p>
                <p style={{marginTop:'14px',fontSize:'13px',color:'rgba(196,168,255,.55)'}}>Questions? <strong style={{color:'#F5C518'}}>hello@titanleap.co</strong></p>
              </div>
            ) : (
              <>
                {/* Q1 */}
                {step === 1 && (
                  <div className="am-q active">
                    <div className="am-q-num">Question 1 of 6</div>
                    <div className="am-q-label">What does your product do and who is it for?</div>
                    <div className="am-q-hint">Be specific. "B2B SaaS for marketing agencies that automates client reporting" is better than "a marketing tool."</div>
                    <textarea value={answers.a1} onChange={e => set('a1', e.target.value)} placeholder="e.g. We build project management software for remote design teams..."/>
                    {err && <div className="am-err">{err}</div>}
                    <div className="am-nav"><div/><button className="am-btn-next" onClick={next}>Next →</button></div>
                  </div>
                )}

                {/* Q2 */}
                {step === 2 && (
                  <div className="am-q active">
                    <div className="am-q-num">Question 2 of 6</div>
                    <div className="am-q-label">Where are you right now with revenue?</div>
                    <div className="am-q-hint">Be honest — this helps us calibrate the audit to your stage.</div>
                    <div className="am-rev-opts">
                      {revOpts.map((opt, i) => (
                        <div key={i} className={`am-rev-opt${answers.a2 === revVals[i] ? ' selected' : ''}`} onClick={() => set('a2', revVals[i])}>{opt}</div>
                      ))}
                    </div>
                    {err && <div className="am-err">{err}</div>}
                    <div className="am-nav"><button className="am-btn-back" onClick={back}>← Back</button><button className="am-btn-next" onClick={next}>Next →</button></div>
                  </div>
                )}

                {/* Q3 */}
                {step === 3 && (
                  <div className="am-q active">
                    <div className="am-q-num">Question 3 of 6</div>
                    <div className="am-q-label">How does someone go from stranger to paying customer?</div>
                    <div className="am-q-hint">Walk us through the steps. Where do they find you, what do they do next, where do they drop off?</div>
                    <textarea value={answers.a3} onChange={e => set('a3', e.target.value)} placeholder="e.g. They find us through Google ads → land on homepage → free trial → emails → 12% convert..."/>
                    {err && <div className="am-err">{err}</div>}
                    <div className="am-nav"><button className="am-btn-back" onClick={back}>← Back</button><button className="am-btn-next" onClick={next}>Next →</button></div>
                  </div>
                )}

                {/* Q4 */}
                {step === 4 && (
                  <div className="am-q active">
                    <div className="am-q-num">Question 4 of 6</div>
                    <div className="am-q-label">Where do you think the biggest leak is?</div>
                    <div className="am-q-hint">Your gut instinct. Even if you're not sure — what feels most broken right now?</div>
                    <textarea value={answers.a4} onChange={e => set('a4', e.target.value)} placeholder="e.g. I think people are dropping off between free trial and paid conversion..."/>
                    {err && <div className="am-err">{err}</div>}
                    <div className="am-nav"><button className="am-btn-back" onClick={back}>← Back</button><button className="am-btn-next" onClick={next}>Next →</button></div>
                  </div>
                )}

                {/* Q5 */}
                {step === 5 && (
                  <div className="am-q active">
                    <div className="am-q-num">Question 5 of 6</div>
                    <div className="am-q-label">What have you already tried to fix it?</div>
                    <div className="am-q-hint">Anything — ads, content, email sequences, pricing changes, landing page rewrites.</div>
                    <textarea value={answers.a5} onChange={e => set('a5', e.target.value)} placeholder="e.g. Rewrote onboarding emails twice, tried reducing price, ran Facebook ads for 3 months..."/>
                    {err && <div className="am-err">{err}</div>}
                    <div className="am-nav"><button className="am-btn-back" onClick={back}>← Back</button><button className="am-btn-next" onClick={next}>Next →</button></div>
                  </div>
                )}

                {/* Q6 */}
                {step === 6 && (
                  <div className="am-q active">
                    <div className="am-q-num">Question 6 of 6</div>
                    <div className="am-q-label">Last one — your contact details and success goal.</div>
                    <div className="am-q-hint">We'll send your audit here. Tell us what success looks like in 90 days.</div>
                    <input type="text" value={answers.name} onChange={e => set('name', e.target.value)} placeholder="Your name" style={{marginBottom:'8px'}}/>
                    <input type="email" value={answers.email} onChange={e => set('email', e.target.value)} placeholder="Your email address" style={{marginBottom:'8px'}}/>
                    <input type="url" value={answers.url} onChange={e => set('url', e.target.value)} placeholder="Your website URL (optional)" style={{marginBottom:'8px'}}/>
                    <textarea value={answers.goal} onChange={e => set('goal', e.target.value)} placeholder="What does success look like in 90 days?" style={{minHeight:'90px'}}/>
                    {err && <div className="am-err">{err}</div>}
                    <div className="am-nav"><button className="am-btn-back" onClick={back}>← Back</button><button className="am-btn-next" onClick={next}>Review →</button></div>
                  </div>
                )}

                {/* Review */}
                {step === 7 && (
                  <div className="am-submit">
                    <div className="am-submit-title">Ready to submit?</div>
                    <p className="am-submit-sub">Check it looks right then hit submit — audit delivered to your inbox within 5 hours.</p>
                    <div className="am-review">
                      {[
                        ['Product', answers.a1],
                        ['Revenue', answers.a2],
                        ['Funnel', answers.a3],
                        ['Biggest leak', answers.a4],
                        ['What you tried', answers.a5],
                        ['Contact', `${answers.name} · ${answers.email}`],
                        ['Goal', answers.goal],
                      ].map(([label, val]) => val && (
                        <div key={label} style={{marginBottom:'10px',fontSize:'13px'}}>
                          <strong style={{color:'var(--mgold)',display:'block',marginBottom:'2px'}}>{label}</strong>
                          <span style={{color:'rgba(196,168,255,.8)'}}>{val}</span>
                        </div>
                      ))}
                    </div>
                    <button className="am-btn-submit" onClick={submit} disabled={sending}>
                      {sending ? 'Sending…' : 'Submit — Start My Audit →'}
                    </button>
                    <div className="am-fine">One-time $297 · Delivered in 5 hours · Full refund if not useful</div>
                    <div style={{marginTop:'10px'}}><button className="am-btn-back" onClick={back}>← Edit answers</button></div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
