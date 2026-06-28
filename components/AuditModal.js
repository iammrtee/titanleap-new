'use client'
import { useState, useEffect, useRef } from 'react'

const STEPS = [
  {
    key: 'a1', label: 'Your product', type: 'textarea',
    q: 'What does your product do and who is it for?',
    hint: 'Be specific. "B2B SaaS for marketing agencies that automates client reporting" beats "a marketing tool."',
    placeholder: 'e.g. We build project management software for remote design teams with 5–50 people...',
  },
  {
    key: 'a2', label: 'Revenue stage', type: 'radio',
    q: 'Where are you right now with revenue?',
    hint: "Be honest — this helps us calibrate the audit to your stage.",
  },
  {
    key: 'a3', label: 'Your funnel', type: 'textarea',
    q: 'How does someone go from stranger to paying customer?',
    hint: 'Walk us through each step. Where do they find you, what do they do next, where do they drop off?',
    placeholder: 'e.g. Google ads → homepage → free trial signup → email sequence → 12% convert to paid...',
  },
  {
    key: 'a4', label: 'Biggest leak', type: 'textarea',
    q: 'Where do you think the biggest leak is?',
    hint: "Your gut instinct — even if you're not sure. What feels most broken right now?",
    placeholder: 'e.g. People sign up for free trial but only 8% upgrade. The drop happens around day 4...',
  },
  {
    key: 'a5', label: "What you've tried", type: 'textarea',
    q: "What have you already tried to fix it?",
    hint: 'Anything — ads, content, email sequences, pricing changes, landing page rewrites.',
    placeholder: 'e.g. Rewrote onboarding emails twice, reduced price by 30%, ran Facebook ads for 3 months...',
  },
  {
    key: 'contact', label: 'Contact + goal', type: 'contact',
    q: "Last one — who are you and what does success look like?",
    hint: "We'll send your audit here. Tell us what a win looks like in 90 days.",
  },
]

const REV_OPTS = [
  { label: 'Pre-revenue', val: 'Pre-revenue — not making money yet' },
  { label: 'Under $1k/mo', val: 'Under $1k/month' },
  { label: '$1k–$5k/mo', val: '$1k–$5k/month' },
  { label: '$5k–$15k/mo', val: '$5k–$15k/month' },
  { label: '$15k–$50k/mo', val: '$15k–$50k/month' },
  { label: 'Over $50k/mo', val: 'Over $50k/month' },
]

export default function AuditModal({ open, onClose }) {
  const [phase, setPhase] = useState('scan') // scan | form | review | success
  const [step, setStep] = useState(1)
  const [scanUrl, setScanUrl] = useState('')
  const [scanning, setScanning] = useState(false)
  const [scanResult, setScanResult] = useState(null)
  const [scanError, setScanError] = useState('')
  const [sending, setSending] = useState(false)
  const [answers, setAnswers] = useState({ a1: '', a2: '', a3: '', a4: '', a5: '', name: '', email: '', url: '', goal: '' })
  const [autofilled, setAutofilled] = useState({})
  const [err, setErr] = useState('')
  const urlInputRef = useRef(null)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (!open) {
      setPhase('scan'); setStep(1); setScanResult(null)
      setScanUrl(''); setScanError(''); setErr(''); setSending(false)
      setAnswers({ a1: '', a2: '', a3: '', a4: '', a5: '', name: '', email: '', url: '', goal: '' })
      setAutofilled({})
    } else {
      setTimeout(() => urlInputRef.current?.focus(), 400)
    }
  }, [open])

  const set = (k, v) => setAnswers(a => ({ ...a, [k]: v }))

  const scan = async () => {
    if (!scanUrl.trim()) { setScanError('Enter a URL first'); return }
    setScanning(true); setScanError(''); setScanResult(null)
    try {
      const res = await fetch('/api/enrich', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: scanUrl }),
      })
      const data = await res.json()
      if (data.error) { setScanError(data.error); return }
      setScanResult(data)
      const newAuto = {}
      setAnswers(prev => {
        const next = { ...prev, url: scanUrl }
        if (data.prefill?.a1) { next.a1 = data.prefill.a1; newAuto.a1 = true }
        if (data.prefill?.a3) { next.a3 = data.prefill.a3; newAuto.a3 = true }
        return next
      })
      setAutofilled(newAuto)
    } catch {
      setScanError("Couldn't reach that URL. Fill in the form manually.")
    } finally {
      setScanning(false)
    }
  }

  const validate = () => {
    const s = STEPS[step - 1]
    if (s.type === 'textarea' && !answers[s.key]?.trim()) { setErr('Please answer this question.'); return false }
    if (s.type === 'radio' && !answers.a2) { setErr('Please select your revenue stage.'); return false }
    if (s.type === 'contact') {
      if (!answers.name.trim()) { setErr('Please enter your name.'); return false }
      if (!answers.email.trim() || !answers.email.includes('@')) { setErr('Please enter a valid email.'); return false }
      if (!answers.goal.trim()) { setErr('Please describe your 90-day success goal.'); return false }
    }
    setErr(''); return true
  }

  const next = () => { if (validate()) step < 6 ? setStep(s => s + 1) : setPhase('review') }
  const back = () => { setErr(''); step > 1 ? setStep(s => s - 1) : setPhase('scan') }

  const submit = async () => {
    setSending(true); setErr('')
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...answers, leaks: scanResult?.leaks, scanData: scanResult }),
      })
      if (!res.ok) throw new Error()
      setPhase('success')
    } catch {
      setErr('Something went wrong. Email us at hello@titanleap.co')
    } finally {
      setSending(false)
    }
  }

  if (!open) return null

  const cur = STEPS[step - 1]

  return (
    <div className="audit-overlay open" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="am2-modal">

        {/* ── Close ── */}
        <button className="am2-close" onClick={onClose} aria-label="Close">✕</button>

        {/* ── Sidebar ── */}
        <div className="am2-sidebar">
          <div className="am2-brand">
            <div className="am2-brand-mark">TL</div>
            <div>
              <div className="am2-brand-name">TitanLeap</div>
              <div className="am2-brand-sub">Free Revenue Audit</div>
            </div>
          </div>

          {(phase === 'form' || phase === 'review') ? (
            <nav className="am2-steps">
              {STEPS.map((s, i) => {
                const isDone = step > i + 1 || phase === 'review'
                const isActive = step === i + 1 && phase === 'form'
                return (
                  <div key={i} className={`am2-step${isDone ? ' done' : isActive ? ' active' : ''}`}>
                    <div className="am2-step-dot">{isDone ? '✓' : i + 1}</div>
                    <div className="am2-step-label">{s.label}</div>
                  </div>
                )
              })}
            </nav>
          ) : (
            <div className="am2-scan-tagline">
              We find<br />the leaks.<br /><em>You close<br />the deals.</em>
            </div>
          )}

          <div className="am2-sidebar-footer">
            {scanResult?.leaks?.length > 0 && (
              <div className="am2-leaks-badge">
                <span className="am2-leaks-count">{scanResult.leaks.length}</span>
                <span>leak{scanResult.leaks.length !== 1 ? 's' : ''} detected</span>
              </div>
            )}
            <div className="am2-delivery">⚡ Audit delivered in 5 hours</div>
          </div>
        </div>

        {/* ── Main content ── */}
        <div className="am2-main">

          {/* SCAN PHASE */}
          {phase === 'scan' && (
            <div className="am2-phase">
              <div className="am2-phase-tag">Free Audit — 5 spots/week</div>
              <h2 className="am2-phase-head">Drop your URL.<br />We'll find the leaks.</h2>
              <p className="am2-phase-sub">
                We scan your site in seconds — detecting funnel gaps, missing pixels, dead CTAs, and pricing blind spots — then pre-fill your application with real intel.
              </p>

              <div className={`am2-url-box${scanning ? ' am2-scanning' : ''}`}>
                <span className="am2-url-icon">↗</span>
                <input
                  ref={urlInputRef}
                  type="url"
                  className="am2-url-input"
                  value={scanUrl}
                  onChange={e => { setScanUrl(e.target.value); setScanError('') }}
                  onKeyDown={e => e.key === 'Enter' && !scanning && scan()}
                  placeholder="https://yourwebsite.com"
                  disabled={scanning}
                />
                <button className="am2-scan-btn" onClick={scan} disabled={scanning}>
                  {scanning ? <span className="am2-spin" /> : 'Scan →'}
                </button>
              </div>
              {scanError && <div className="am2-scan-error">{scanError}</div>}

              {/* Scan result */}
              {scanResult && !scanning && (
                <div className="am2-scan-result">
                  <div className="am2-scan-company">
                    <span className="am2-scan-check">✓</span>
                    <strong>{scanResult.company}</strong>
                    <span className="am2-scan-domain">{scanResult.domain}</span>
                  </div>

                  {scanResult.pixels?.length > 0 && (
                    <div className="am2-scan-chips">
                      {scanResult.pixels.map(p => <span key={p} className="am2-chip am2-chip-green">{p}</span>)}
                      {scanResult.hasBlog && <span className="am2-chip am2-chip-purple">Blog ✓</span>}
                      {scanResult.hasFreeOffer && <span className="am2-chip am2-chip-purple">Free offer ✓</span>}
                    </div>
                  )}

                  {scanResult.leaks?.length > 0 && (
                    <div className="am2-scan-leaks">
                      <div className="am2-leaks-title">Revenue leaks found:</div>
                      {scanResult.leaks.map((l, i) => (
                        <div key={i} className="am2-scan-leak">
                          <span className="am2-leak-dot" />
                          {l}
                        </div>
                      ))}
                    </div>
                  )}

                  <button className="am2-cta-btn" onClick={() => setPhase('form')}>
                    {scanResult.leaks?.length > 0
                      ? `Start Audit — ${scanResult.leaks.length} Leak${scanResult.leaks.length !== 1 ? 's' : ''} to Fix →`
                      : 'Continue to Full Audit →'}
                  </button>
                </div>
              )}

              {!scanResult && !scanning && (
                <button className="am2-skip-btn" onClick={() => setPhase('form')}>
                  Skip scan — fill in manually →
                </button>
              )}
            </div>
          )}

          {/* FORM PHASE */}
          {phase === 'form' && (
            <div className="am2-phase am2-form-phase">
              <div className="am2-step-header">
                <span className="am2-step-num">Question {step} <span className="am2-step-of">/ 6</span></span>
                {autofilled[cur.key] && (
                  <span className="am2-auto-badge">✦ Auto-filled from scan</span>
                )}
              </div>

              <h3 className="am2-q-head">{cur.q}</h3>
              <p className="am2-q-hint">{cur.hint}</p>

              {cur.type === 'textarea' && (
                <textarea
                  className={`am2-textarea${autofilled[cur.key] ? ' am2-autofilled' : ''}`}
                  value={answers[cur.key] || ''}
                  onChange={e => {
                    set(cur.key, e.target.value)
                    if (autofilled[cur.key]) setAutofilled(a => ({ ...a, [cur.key]: false }))
                  }}
                  placeholder={cur.placeholder}
                  autoFocus
                />
              )}

              {cur.type === 'radio' && (
                <div className="am2-radio-grid">
                  {REV_OPTS.map((o, i) => (
                    <div
                      key={i}
                      className={`am2-radio-opt${answers.a2 === o.val ? ' am2-selected' : ''}`}
                      onClick={() => { set('a2', o.val); setErr('') }}
                    >
                      <span className="am2-radio-dot" />
                      {o.label}
                    </div>
                  ))}
                </div>
              )}

              {cur.type === 'contact' && (
                <div className="am2-contact-grid">
                  <input type="text" className="am2-input" value={answers.name} onChange={e => set('name', e.target.value)} placeholder="Your full name" autoFocus />
                  <input type="email" className="am2-input" value={answers.email} onChange={e => set('email', e.target.value)} placeholder="Email address" />
                  <input type="url" className="am2-input am2-col-span" value={answers.url} onChange={e => set('url', e.target.value)} placeholder="Website URL (optional — already scanned if provided above)" />
                  <textarea className="am2-textarea am2-col-span" style={{ minHeight: '80px' }} value={answers.goal} onChange={e => set('goal', e.target.value)} placeholder="What does success look like in 90 days? (revenue target, conversion rate, MRR goal...)" />
                </div>
              )}

              {err && <div className="am2-err">{err}</div>}

              <div className="am2-nav">
                <button className="am2-back-btn" onClick={back}>← Back</button>
                <button className="am2-next-btn" onClick={next}>
                  {step === 6 ? 'Review Answers →' : 'Continue →'}
                </button>
              </div>
            </div>
          )}

          {/* REVIEW PHASE */}
          {phase === 'review' && (
            <div className="am2-phase">
              <div className="am2-phase-tag">Final step</div>
              <h3 className="am2-q-head">Looks good?</h3>
              <p className="am2-q-hint">Check your answers then submit. Your Revenue Leak Report lands in your inbox within 5 hours.</p>

              <div className="am2-review-list">
                {[
                  ['Product', answers.a1],
                  ['Revenue', answers.a2],
                  ['Funnel', answers.a3],
                  ['Biggest leak', answers.a4],
                  ['What you tried', answers.a5],
                  ['Name', answers.name],
                  ['Email', answers.email],
                  ['90-day goal', answers.goal],
                ].filter(([, v]) => v?.trim()).map(([label, val]) => (
                  <div key={label} className="am2-review-row">
                    <div className="am2-review-label">{label}</div>
                    <div className="am2-review-val">{val}</div>
                  </div>
                ))}
              </div>

              {err && <div className="am2-err">{err}</div>}

              <div className="am2-submit-row">
                <button className="am2-back-btn" onClick={() => { setPhase('form'); setStep(6) }}>← Edit</button>
                <button className="am2-submit-btn" onClick={submit} disabled={sending}>
                  {sending ? 'Submitting…' : 'Submit Application →'}
                </button>
              </div>
              <div className="am2-fine">100% Free · Delivered in 5 hours · No pitch unless you ask</div>
            </div>
          )}

          {/* SUCCESS PHASE */}
          {phase === 'success' && (
            <div className="am2-phase am2-success-phase">
              <div className="am2-success-icon">✓</div>
              <h3 className="am2-success-head">Audit request received.</h3>
              <p className="am2-success-sub">
                We'll send your Revenue Leak Report to <strong>{answers.email}</strong> within 5 hours. Check your inbox — and spam just in case.
              </p>
              <div className="am2-success-fine">Questions? <strong style={{ color: '#F5C518' }}>hello@titanleap.co</strong></div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
