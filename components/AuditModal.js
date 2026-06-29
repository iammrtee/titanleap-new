'use client'
import { useState, useEffect, useRef } from 'react'

// Internal scoring — sent in email only, never shown to client
const clamp = v => Math.min(100, Math.max(0, Math.round(v)))
function computeScores(d) {
  let pos = 40
  if (d.websiteClarity === 'Immediately') pos += 30
  else if (d.websiteClarity === 'Within 10 seconds') pos += 12
  if (d.oneSentence === 'Yes') pos += 20; else if (d.oneSentence === 'Somewhat') pos += 8
  let auth = (d.trustSignals?.length || 0) * 12
  let acq = 35; if (['Paid ads','Content/SEO','Cold outreach'].includes(d.acquisition)) acq += 20
  let conv = d.leadFlow === 'Yes, automated' ? 70 : d.leadFlow === 'Partly' ? 45 : 25
  let sales = d.emailSequences === 'Yes' ? 75 : d.emailSequences === 'Not sure' ? 40 : 20
  let ops = 55
  const s = { positioning:clamp(pos), authority:clamp(auth), acquisition:clamp(acq), conversion:clamp(conv), sales:clamp(sales), operations:clamp(ops) }
  s.overall = clamp(Math.round(Object.values(s).reduce((a,b)=>a+b,0)/6))
  return s
}

const initData = () => ({
  // AI-populated (editable)
  company:'', description:'', stage:'', pricingModel:'', acquisitionChannels:'',
  // Human-only
  name:'', email:'', bottleneck:'', auditWin:'', budget:'', gbpUrl:'',
  // Consent
  consentEmail: false,
  // Internal tracking
  website:'',
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
  const mainRef  = useRef(null)
  const scanTimer = useRef(null)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (!open) {
      setPhase('scan'); setData(initData()); setScanUrl('')
      setScanResult(null); setScanError(''); setErr('')
    }
  }, [open])

  const set = (k, v) => setData(d => ({ ...d, [k]: v }))
  const scrollTop = () => { mainRef.current && (mainRef.current.scrollTop = 0) }
  const goTo = p => { setPhase(p); scrollTop() }

  const doScan = async (url) => {
    const clean = url?.trim()
    if (!clean) return
    const normalized = clean.startsWith('http') ? clean : `https://${clean}`
    setScanning(true); setScanError('')
    try {
      const res = await fetch('/api/enrich', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ url: normalized }),
      })
      const d = await res.json()
      if (d.error) { setScanError(d.error); return }
      setScanResult(d)
      // Auto-populate AI fields
      const channels = []
      if (d.pixels?.includes('Google Analytics') || d.pixels?.includes('Meta Pixel')) channels.push('Paid ads')
      if (d.hasBlog) channels.push('Content/SEO')
      if (d.liveSocials?.length) channels.push(d.liveSocials.slice(0,2).join(', '))
      setData(prev => ({
        ...prev,
        website: normalized,
        company: prev.company || d.company || '',
        description: prev.description || d.tagline || '',
        acquisitionChannels: prev.acquisitionChannels || channels.join(' · ') || '',
        pricingModel: prev.pricingModel || (d.prices?.length ? 'Self-serve' : ''),
      }))
    } catch { setScanError("Couldn't reach that URL — check it and try again, or skip to continue.") }
    finally { setScanning(false) }
  }

  const handleUrlKey = e => { if (e.key === 'Enter' && !scanning) doScan(scanUrl) }

  const submit = async () => {
    if (!data.name?.trim())           { setErr('Please enter your name.'); return }
    if (!data.email?.includes('@'))   { setErr('Please enter a valid email.'); return }
    if (!data.bottleneck)             { setErr('Please select your biggest bottleneck.'); return }
    if (!data.auditWin?.trim())       { setErr('Please tell us what a win looks like.'); return }
    if (!data.consentEmail)           { setErr('Please confirm you agree to receive your audit by email.'); return }
    setSending(true); setErr('')
    const scores = computeScores(data)
    try {
      const res = await fetch('/api/audit', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          name: data.name, email: data.email, url: data.website,
          a1: [data.company, data.description].filter(Boolean).join(' — '),
          a2: data.stage,
          a3: [data.acquisitionChannels, data.pricingModel].filter(Boolean).join(' | '),
          a4: data.bottleneck,
          a5: [data.emailSequences, data.leadFlow].filter(Boolean).join(' | '),
          goal: [data.auditWin, data.budget ? `Budget: ${data.budget}` : '', data.gbpUrl ? `GBP: ${data.gbpUrl}` : ''].filter(Boolean).join(' · '),
          leaks: scanResult?.leaks,
          scanData: { ...scanResult, scores, fullData: data },
        }),
      })
      if (!res.ok) throw new Error()
      goTo('success')
    } catch { setErr('Something went wrong — email us at hello@titanleap.co') }
    finally { setSending(false) }
  }

  if (!open) return null

  const stepNum = { scan:1, review:2, human:3, success:3 }[phase] || 1
  const leakCount = scanResult?.leaks?.length || 0

  return (
    <div className="audit-overlay open" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="diag-shell">
        <button className="diag-close" onClick={onClose}>✕</button>

        {/* Sidebar */}
        <aside className="diag-sidebar">
          <div className="diag-brand">
            <div className="diag-brand-mark">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="32" height="32" style={{display:'block'}}>
                <circle cx="200" cy="200" r="200" fill="#4520CC"/>
                <path d="M 90 118 H 202 V 202 A 82 82 0 0 0 118 280 H 90 Z" fill="white"/>
                <rect x="218" y="118" width="52" height="162" rx="7" fill="white"/>
                <circle cx="285" cy="148" r="40" fill="#F5C518"/>
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
                { n:1, label:'Scan your site'   },
                { n:2, label:'Confirm details'  },
                { n:3, label:'Your goals'       },
              ].map(s => (
                <div key={s.n} className={`diag-step${stepNum > s.n ? ' done' : stepNum === s.n ? ' active' : ''}`}>
                  <div className="diag-step-dot">{stepNum > s.n ? '✓' : s.n}</div>
                  <span className="diag-step-label">{s.label}</span>
                </div>
              ))}
            </nav>
          )}

          {leakCount > 0 && phase !== 'success' && (
            <div className="diag-sidebar-leaks">
              <span className="diag-leaks-n">{leakCount}</span>
              <span>leak{leakCount !== 1 ? 's' : ''} detected</span>
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
              <div className="diag-screen-tag">Step 1 of 3</div>
              <h3 className="diag-screen-h">Paste your URL.<br/>We'll find the leaks.</h3>
              <p className="diag-screen-sub">Our AI scans your site and pre-fills your application — you just confirm.</p>

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

                  <button className="diag-generate" style={{marginTop:'20px',width:'100%'}} onClick={() => goTo('review')}>
                    {leakCount > 0
                      ? `Continue — ${leakCount} Leak${leakCount !== 1 ? 's' : ''} to Fix →`
                      : 'Looks good — Continue →'}
                  </button>
                </div>
              )}

              {!scanResult && !scanning && (
                <button className="diag-skip" onClick={() => {
                  if (scanUrl.trim()) set('website', scanUrl.startsWith('http') ? scanUrl : `https://${scanUrl}`)
                  goTo('review')
                }}>
                  {scanError ? 'Continue without scan →' : 'Skip — fill in manually →'}
                </button>
              )}
            </div>
          )}

          {/* ── STEP 2: REVIEW AI-POPULATED FIELDS ── */}
          {phase === 'review' && (() => {
            const aiFilledCount = [data.company, data.description, data.acquisitionChannels, data.pricingModel].filter(Boolean).length
            const fullyFilled = aiFilledCount >= 3
            const partiallyFilled = aiFilledCount > 0 && aiFilledCount < 3
            const notFilled = aiFilledCount === 0
            return (
            <div className="diag-screen">
              <div className="diag-screen-tag">
                Step 2 of 3 {fullyFilled ? '— AI Pre-filled' : notFilled ? '— Fill manually' : '— Partially filled'}
              </div>
              <h3 className="diag-screen-h">
                {fullyFilled ? 'Does this look right?' : notFilled ? 'Tell us about your business.' : 'We got some of it — fill in the rest.'}
              </h3>
              <p className="diag-screen-sub">
                {fullyFilled
                  ? 'Our AI filled this from your site. Correct anything that\'s off.'
                  : notFilled
                  ? "We couldn't read your site — fill these in manually. Takes 60 seconds."
                  : "We filled what we could. Complete anything that's missing."}
              </p>

              <div className="diag-review-grid">
                <div className="diag-field diag-full">
                  <label>Company / Product Name</label>
                  <input className="diag-input" value={data.company} onChange={e=>set('company',e.target.value)} placeholder="Your company name"/>
                </div>
                <div className="diag-field diag-full">
                  <label>What you do <span className="diag-hint">(one line)</span></label>
                  <input className="diag-input" value={data.description} onChange={e=>set('description',e.target.value)} placeholder="e.g. B2B SaaS that automates client reporting for agencies"/>
                </div>
                <div className="diag-field">
                  <label>Stage</label>
                  <div className="diag-chips" style={{flexWrap:'wrap'}}>
                    {['Pre-launch','Just launched','<$10k MRR','$10k–50k MRR','$50k+ MRR'].map(v=>(
                      <button key={v} className={`diag-chip${data.stage===v?' sel':''}`} onClick={()=>set('stage',v)}>{v}</button>
                    ))}
                  </div>
                </div>
                <div className="diag-field">
                  <label>Pricing Model</label>
                  <div className="diag-chips" style={{flexWrap:'wrap'}}>
                    {['Free trial','Freemium','Demo-led','Self-serve','Other'].map(v=>(
                      <button key={v} className={`diag-chip${data.pricingModel===v?' sel':''}`} onClick={()=>set('pricingModel',v)}>{v}</button>
                    ))}
                  </div>
                </div>
                <div className="diag-field diag-full">
                  <label>Where signups come from today
                    {data.acquisitionChannels && <span className="diag-ai-badge">AI detected</span>}
                  </label>
                  <input className="diag-input" value={data.acquisitionChannels} onChange={e=>set('acquisitionChannels',e.target.value)} placeholder="e.g. Organic, Paid ads, Referrals"/>
                </div>
              </div>

              <div className="diag-nav-row">
                <button className="diag-back" onClick={() => goTo('scan')}>← Back</button>
                <button className="diag-next" onClick={() => goTo('human')}>
                  {notFilled ? 'Continue →' : 'Looks right →'}
                </button>
              </div>
            </div>
            )
          })()}

          {/* ── STEP 3: HUMAN-ONLY ── */}
          {phase === 'human' && (
            <div className="diag-screen">
              <div className="diag-screen-tag">Step 3 of 3</div>
              <h3 className="diag-screen-h">Almost there.</h3>
              <p className="diag-screen-sub">Two quick questions only you can answer.</p>

              {/* Name + email side by side */}
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'22px'}}>
                <div className="diag-field">
                  <label style={{fontSize:'12px', fontWeight:'600', color:'rgba(196,168,255,.5)', letterSpacing:'.01em', marginBottom:'7px', display:'block'}}>
                    Your name <span style={{color:'#fca5a5'}}>*</span>
                  </label>
                  <input className="diag-input" value={data.name} onChange={e=>set('name',e.target.value)} placeholder="Full name" autoFocus/>
                </div>
                <div className="diag-field">
                  <label style={{fontSize:'12px', fontWeight:'600', color:'rgba(196,168,255,.5)', letterSpacing:'.01em', marginBottom:'7px', display:'block'}}>
                    Work email <span style={{color:'#fca5a5'}}>*</span>
                  </label>
                  <input className="diag-input" type="email" value={data.email} onChange={e=>{set('email',e.target.value);setErr('')}} placeholder="you@company.com"/>
                </div>
              </div>

              {/* Bottleneck — icon option cards */}
              <div style={{marginBottom:'22px'}}>
                <div style={{fontSize:'12px', fontWeight:'600', color:'rgba(196,168,255,.5)', letterSpacing:'.01em', marginBottom:'12px'}}>
                  Where's the real friction? <span style={{color:'#fca5a5'}}>*</span>
                </div>
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px'}}>
                  {[
                    { v:'Not enough traffic',         icon:'📉', sub:'Top of funnel is too thin' },
                    { v:"Traffic doesn't convert",    icon:'🎯', sub:'Visitors leave without acting' },
                    { v:"Leads don't book or buy",    icon:'💸', sub:'Pipeline leaks after inquiry' },
                    { v:"Can't track what's working", icon:'📊', sub:'Blind to what actually converts' },
                    { v:'Something else',             icon:'💬', sub:'Tell us more below' },
                  ].map(opt => {
                    const sel = data.bottleneck === opt.v
                    return (
                      <div
                        key={opt.v}
                        onClick={() => { set('bottleneck', opt.v); setErr('') }}
                        style={{
                          display:'flex', alignItems:'center', gap:'12px',
                          padding:'12px 14px',
                          background: sel ? 'rgba(124,58,237,.13)' : 'rgba(255,255,255,.02)',
                          border:`1.5px solid ${sel ? '#7C3AED' : 'rgba(124,58,237,.11)'}`,
                          borderRadius:'10px', cursor:'pointer',
                          transition:'all .15s',
                          gridColumn: opt.v === 'Something else' ? '1/-1' : undefined,
                        }}
                      >
                        <span style={{fontSize:'18px', lineHeight:'1', flexShrink:0}}>{opt.icon}</span>
                        <div style={{flex:1, minWidth:0}}>
                          <div style={{fontSize:'12.5px', fontWeight:'600', color: sel ? '#EFE9FF' : 'rgba(239,233,255,.7)', lineHeight:'1.3', marginBottom:'2px'}}>{opt.v}</div>
                          <div style={{fontSize:'10.5px', color:'rgba(196,168,255,.38)', lineHeight:'1.2'}}>{opt.sub}</div>
                        </div>
                        <div style={{
                          width:'18px', height:'18px', borderRadius:'50%', flexShrink:0,
                          background: sel ? '#7C3AED' : 'rgba(255,255,255,.06)',
                          border:`1.5px solid ${sel ? '#8B5CF6' : 'rgba(255,255,255,.1)'}`,
                          display:'flex', alignItems:'center', justifyContent:'center',
                          transition:'all .15s',
                        }}>
                          {sel && <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1.5 4.5l2 2L7.5 2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Win textarea */}
              <div style={{marginBottom:'22px'}}>
                <div style={{fontSize:'12px', fontWeight:'600', color:'rgba(196,168,255,.5)', letterSpacing:'.01em', marginBottom:'8px'}}>
                  What would make this a win for you? <span style={{color:'#fca5a5'}}>*</span>
                </div>
                <textarea
                  className="diag-textarea"
                  style={{minHeight:'96px'}}
                  value={data.auditWin}
                  onChange={e=>set('auditWin',e.target.value)}
                  placeholder="e.g. Know exactly why our trial-to-paid is stuck at 8% and what to fix first."
                />
              </div>

              {/* Budget */}
              <div style={{marginBottom:'22px'}}>
                <div style={{fontSize:'12px', fontWeight:'600', color:'rgba(196,168,255,.5)', letterSpacing:'.01em', marginBottom:'10px'}}>
                  Investment range for fixing what we find
                </div>
                <div className="diag-chips">
                  {['Just exploring','Under $1k','$1k–$5k','$5k+'].map(v=>(
                    <button key={v} className={`diag-chip${data.budget===v?' sel':''}`} onClick={()=>set('budget',v)}>{v}</button>
                  ))}
                </div>
              </div>

              {/* GBP — low-key optional */}
              <div style={{marginBottom:'22px'}}>
                <div style={{fontSize:'11.5px', fontWeight:'500', color:'rgba(196,168,255,.32)', marginBottom:'8px'}}>
                  Google Business Profile <span style={{fontSize:'10px'}}>— optional, we verify it manually</span>
                </div>
                <input className="diag-input" value={data.gbpUrl} onChange={e=>set('gbpUrl',e.target.value)} placeholder="https://g.page/your-business" style={{opacity:.65}}/>
              </div>

              {/* Custom consent toggle */}
              <div
                onClick={() => set('consentEmail', !data.consentEmail)}
                style={{
                  display:'flex', alignItems:'center', gap:'14px',
                  padding:'13px 16px', borderRadius:'10px', cursor:'pointer',
                  background: data.consentEmail ? 'rgba(34,197,94,.06)' : 'rgba(255,255,255,.02)',
                  border:`1.5px solid ${data.consentEmail ? 'rgba(34,197,94,.28)' : 'rgba(255,255,255,.07)'}`,
                  transition:'all .22s',
                }}
              >
                <div style={{
                  width:'38px', height:'22px', borderRadius:'100px', flexShrink:0,
                  background: data.consentEmail ? '#22c55e' : 'rgba(255,255,255,.07)',
                  border:`1px solid ${data.consentEmail ? '#4ade80' : 'rgba(255,255,255,.1)'}`,
                  position:'relative', transition:'all .22s',
                }}>
                  <div style={{
                    position:'absolute', top:'3px',
                    left: data.consentEmail ? '18px' : '3px',
                    width:'14px', height:'14px', borderRadius:'50%',
                    background: data.consentEmail ? '#fff' : 'rgba(255,255,255,.35)',
                    transition:'left .22s ease',
                    boxShadow: data.consentEmail ? '0 1px 4px rgba(0,0,0,.25)' : 'none',
                  }}/>
                </div>
                <div>
                  <div style={{fontSize:'13px', fontWeight:'600', lineHeight:'1.3', color: data.consentEmail ? 'rgba(239,233,255,.9)' : 'rgba(196,168,255,.5)', transition:'color .2s'}}>
                    Send my audit to {data.email || 'my email'}
                  </div>
                  <div style={{fontSize:'10.5px', color:'rgba(196,168,255,.3)', marginTop:'2px'}}>Required — this is how we deliver your report</div>
                </div>
              </div>

              {err && <div className="diag-err" style={{marginTop:'12px'}}>{err}</div>}

              <div className="diag-nav-row">
                <button className="diag-back" onClick={() => goTo('review')}>← Back</button>
                <button className="diag-generate" onClick={submit} disabled={sending}>
                  {sending ? 'Submitting…' : 'Submit Application →'}
                </button>
              </div>
              <p className="diag-fine" style={{marginTop:'12px'}}>100% Free · No pitch unless you ask · Delivered in 5 hours</p>
            </div>
          )}

          {/* ── SUCCESS ── */}
          {phase === 'success' && (
            <div className="diag-success">
              <div className="diag-success-icon">✓</div>
              <h3 className="diag-success-h">Application received.</h3>
              <p className="diag-success-p">
                We&apos;ll review your site, run a full revenue leak audit, and send a personalized report to <strong>{data.email}</strong> within 5 hours.
              </p>
              <p className="diag-success-p" style={{marginTop:'8px',opacity:.7}}>
                Check your inbox — and spam just in case.
              </p>
              <div className="diag-success-fine">Questions? <strong style={{color:'#F5C518'}}>hello@titanleap.co</strong></div>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}
