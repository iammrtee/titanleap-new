'use client'
import { useState, useRef } from 'react'

const initData = () => ({
  company:'', description:'', stage:'', pricingModel:'', acquisitionChannels:'',
  name:'', email:'', bottleneck:'', website:'',
})

export default function AuditModal({ open, onClose }) {
  const [phase, setPhase]           = useState('scan')
  const [data, setData]             = useState(initData)
  const [scanUrl, setScanUrl]       = useState('')
  const [scanning, setScanning]     = useState(false)
  const [scanResult, setScanResult] = useState(null)
  const [scanError, setScanError]   = useState('')
  const [sending, setSending]       = useState(false)
  const [err, setErr]               = useState('')
  const mainRef = useRef(null)

  const set = (k, v) => setData(p => ({ ...p, [k]: v }))
  const scrollTop = () => mainRef.current?.scrollTo({ top:0, behavior:'smooth' })
  const goTo = p => { setPhase(p); scrollTop() }

  if (!open) return null

  /* ── Scan ── */
  const doScan = async (url) => {
    const clean = url.trim().replace(/^https?:\/\//,'')
    if (!clean) { setScanError('Enter your website URL to continue.'); return }
    setScanError(''); setScanning(true); setScanResult(null)
    set('website', `https://${clean}`)
    try {
      const r = await fetch('/api/enrich', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ url: `https://${clean}` }),
      })
      const d = await r.json()
      setScanResult(d)
      if (d.company)             set('company', d.company)
      if (d.description)         set('description', d.description)
      if (d.acquisitionChannels) set('acquisitionChannels', d.acquisitionChannels)
      if (d.pricingModel)        set('pricingModel', d.pricingModel)
    } catch { setScanError('') }
    finally { setScanning(false) }
  }
  const handleUrlKey = e => { if (e.key === 'Enter' && !scanning) doScan(scanUrl) }

  /* ── Submit ── */
  const submit = async () => {
    if (!data.name?.trim())         { setErr('Please enter your name.'); return }
    if (!data.email?.includes('@')) { setErr('Please enter a valid email.'); return }
    if (!data.bottleneck)           { setErr('Please select your biggest bottleneck.'); return }
    setSending(true); setErr('')
    try {
      const res = await fetch('/api/audit', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          name: data.name, email: data.email, url: data.website,
          a1: [data.company, data.description].filter(Boolean).join(' — '),
          a2: data.stage,
          a3: [data.acquisitionChannels, data.pricingModel].filter(Boolean).join(' | '),
          a4: data.bottleneck,
          goal: '',
          leaks: scanResult?.leaks,
          scanData: { ...scanResult, fullData: data },
        }),
      })
      if (!res.ok) throw new Error()
      goTo('success')
    } catch { setErr('Something went wrong — email us at hello@titanleap.co') }
    finally { setSending(false) }
  }

  const leakCount = scanResult?.leaks?.length || 0

  return (
    <div className="audit-overlay open" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="diag-shell">
        <button className="diag-close" onClick={onClose}>✕</button>

        {/* Sidebar */}
        <aside className="diag-sidebar">
          <div className="diag-brand">
            <div className="diag-brand-mark">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="36" height="36" style={{display:'block'}}>
                <rect width="200" height="200" rx="44" fill="#6B21E8"/>
                <text x="100" y="138" textAnchor="middle" fontFamily="'Archivo',sans-serif" fontWeight="900" fontSize="110" fill="white">TL</text>
              </svg>
            </div>
            <div>
              <div className="diag-brand-name">TitanLeap</div>
              <div className="diag-brand-sub">Revenue Leak Audit</div>
            </div>
          </div>

          {phase !== 'success' && (
            <nav className="diag-steps">
              {[
                { n:1, label:'Scan your site' },
                { n:2, label:'Get your audit' },
              ].map(s => (
                <div key={s.n} className={`diag-step${(phase==='scan'?1:2) > s.n ? ' done' : (phase==='scan'?1:2) === s.n ? ' active' : ''}`}>
                  {s.n < 2 && <div className="diag-step-line"/>}
                  <div className="diag-step-num">{(phase==='scan'?1:2) > s.n ? '✓' : s.n}</div>
                  <span className="diag-step-label">{s.label}</span>
                </div>
              ))}
            </nav>
          )}

          {leakCount > 0 && phase !== 'success' && (
            <div className="diag-sidebar-leaks">
              <div className="diag-leaks-count">{leakCount}</div>
              <div className="diag-leaks-label">Revenue leak{leakCount !== 1 ? 's' : ''} detected</div>
            </div>
          )}

          <div className="diag-sidebar-footer">
            <div className="diag-delivery">⚡ Delivered in 5 hours</div>
            <div className="diag-delivery" style={{marginTop:'4px',opacity:.5}}>Free · No pitch</div>
          </div>
        </aside>

        {/* Main */}
        <main className="diag-main" ref={mainRef}>

          {/* ── STEP 1: SCAN ── */}
          {phase === 'scan' && (
            <div className="diag-screen">
              <div className="diag-screen-tag">Step 1 of 2</div>
              <h3 className="diag-screen-h">Paste your URL.<br/>We'll find the leaks.</h3>
              <p className="diag-screen-sub">Our AI scans your site in seconds. Most founders are losing $4k–$15k/mo — we'll show you exactly where.</p>

              <div className={`diag-url-box${scanning?' scanning':''}`}>
                <span className="diag-url-icon">↗</span>
                <input
                  className="diag-url-input"
                  type="text"
                  value={scanUrl}
                  onChange={e => { setScanUrl(e.target.value); setScanError('') }}
                  onKeyDown={handleUrlKey}
                  placeholder="yourwebsite.com"
                  autoFocus
                />
                <button className="diag-scan-btn" onClick={() => doScan(scanUrl)} disabled={scanning}>
                  {scanning ? <span className="diag-spin"/> : 'Scan →'}
                </button>
              </div>
              {scanError && <div className="diag-scan-error">{scanError}</div>}

              {scanResult && !scanning && (
                <div className="diag-scan-result">
                  <div className="diag-scan-company">
                    <span className="diag-scan-check">✓</span>
                    <strong>{scanResult.company}</strong>
                    <span className="diag-scan-domain">{scanResult.domain}</span>
                  </div>
                  {(scanResult.pixels?.length > 0 || scanResult.liveSocials?.length > 0 || scanResult.hasBlog) && (
                    <div className="diag-scan-chips">
                      {scanResult.pixels?.map(p => <span key={p} className="diag-scan-chip green">{p} ✓</span>)}
                      {scanResult.hasBlog && <span className="diag-scan-chip purple">Content ✓</span>}
                      {[...new Set(scanResult.liveSocials || [])].map(s => <span key={s} className="diag-scan-chip blue">{s} ✓</span>)}
                    </div>
                  )}
                  {scanResult.leaks?.length > 0 && (
                    <div className="diag-scan-leaks">
                      <div className="diag-leaks-title">Revenue leaks detected:</div>
                      {scanResult.leaks.map((l, i) => (
                        <div key={i} className="diag-leak-row">
                          <span className="diag-leak-dot"/>
                          <span>{l}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <button className="diag-generate" style={{marginTop:'20px',width:'100%'}} onClick={() => goTo('human')}>
                    {leakCount > 0
                      ? `Get My Full Report — ${leakCount} Leak${leakCount !== 1 ? 's' : ''} Found →`
                      : 'Get My Free Audit →'}
                  </button>
                </div>
              )}

              {!scanResult && !scanning && (
                <button className="diag-skip" onClick={() => {
                  if (scanUrl.trim()) set('website', scanUrl.startsWith('http') ? scanUrl : `https://${scanUrl}`)
                  goTo('human')
                }}>
                  {scanError ? 'Continue without scan →' : 'Skip — enter URL manually →'}
                </button>
              )}
            </div>
          )}

          {/* ── STEP 2: CONTACT ── */}
          {phase === 'human' && (
            <div className="diag-screen">
              <div className="diag-screen-tag">Step 2 of 2 — Almost done</div>
              <h3 className="diag-screen-h">Where should we send it?</h3>
              <p className="diag-screen-sub">Two quick things and we get to work. Your audit lands in your inbox in 5 hours.</p>

              <div className="diag-form-row">
                <div className="diag-field">
                  <label className="diag-field-label">Your name <span className="req">*</span></label>
                  <input className="diag-input" value={data.name} onChange={e=>set('name',e.target.value)} placeholder="First name" autoFocus/>
                </div>
                <div className="diag-field">
                  <label className="diag-field-label">Work email <span className="req">*</span></label>
                  <input className="diag-input" type="email" value={data.email} onChange={e=>{set('email',e.target.value);setErr('')}} placeholder="you@company.com"/>
                </div>
              </div>

              <div className="diag-form-section">
                <label className="diag-field-label">Biggest growth blocker right now <span className="req">*</span></label>
                <div className="diag-option-grid">
                  {[
                    { v:'Not enough traffic',         icon:'📉', sub:'Top of funnel is too thin' },
                    { v:"Traffic doesn't convert",    icon:'🎯', sub:'Visitors leave without acting' },
                    { v:"Leads don't book or buy",    icon:'💸', sub:'Pipeline leaks after inquiry' },
                    { v:"Can't track what's working", icon:'📊', sub:'Flying blind on attribution' },
                    { v:'Something else',             icon:'💬', sub:'Tell us in the audit', wide:true },
                  ].map(opt => (
                    <button
                      key={opt.v}
                      className={`diag-option-card${data.bottleneck===opt.v?' sel':''}${opt.wide?' wide':''}`}
                      onClick={() => { set('bottleneck', opt.v); setErr('') }}
                    >
                      <span className="diag-option-icon">{opt.icon}</span>
                      <span className="diag-option-body">
                        <span className="diag-option-title">{opt.v}</span>
                        <span className="diag-option-sub">{opt.sub}</span>
                      </span>
                      <span className="diag-option-check">
                        {data.bottleneck===opt.v && <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1.5 4.5l2 2L7.5 2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {err && <div className="diag-err" style={{marginTop:'8px'}}>{err}</div>}

              <div className="diag-nav-row">
                <button className="diag-back" onClick={() => goTo('scan')}>← Back</button>
                <button className="diag-generate" onClick={submit} disabled={sending}>
                  {sending ? 'Sending…' : 'Get My Free Audit →'}
                </button>
              </div>

              <p className="diag-fine" style={{marginTop:'12px'}}>Free · No credit card · No pitch unless you ask</p>
            </div>
          )}

          {/* ── SUCCESS ── */}
          {phase === 'success' && (
            <div className="diag-success-inner">
              <div className="diag-success-icon">✓</div>
              <h3 className="diag-success-h">You're in — we're on it.</h3>
              <p className="diag-success-p">
                Your revenue audit is being prepared. Expect it in your inbox within{' '}
                <strong>5 hours</strong>. We'll show you exactly where the leaks are and what each one costs you per month.
              </p>
              <p className="diag-success-p" style={{marginTop:'8px',opacity:.7}}>
                Check spam if you don't see it. Questions? <strong style={{color:'#F5C518'}}>hello@titanleap.co</strong>
              </p>
              <div className="diag-success-fine">Free · No pitch unless you ask for it</div>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}
