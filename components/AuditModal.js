'use client'
import { useState, useEffect, useRef } from 'react'

// ─── Internal scoring (sent in email only, never shown to client) ─────────────
const clamp = v => Math.min(100, Math.max(0, Math.round(v)))

function computeScores(d) {
  let pos = 40
  if (d.websiteClarity === 'Immediately') pos += 30
  else if (d.websiteClarity === 'Within 10 seconds') pos += 12
  else if (d.websiteClarity === "It's confusing") pos -= 10
  if (d.oneSentence === 'Yes') pos += 20
  else if (d.oneSentence === 'Somewhat') pos += 8
  if ((d.differentiation || '').trim().length > 40) pos += 10

  let auth = (d.trustSignals?.length || 0) * 12
  auth += ({ Daily:28, Weekly:18, Monthly:8, Rarely:2, Never:0 }[d.contentFrequency] || 0)

  let acq = 28
  if (['Google Search','Paid Ads','LinkedIn','TikTok','Instagram'].includes(d.leadSource)) acq += 20
  const leads = parseInt(d.monthlyLeads) || 0
  if (leads >= 100) acq += 35
  else if (leads >= 50) acq += 22
  else if (leads >= 20) acq += 12
  else if (leads >= 5) acq += 5

  let conv = 18
  const customers = parseInt(d.leadConversion) || 0
  if (leads > 0 && customers > 0) {
    const rate = (customers / leads) * 100
    if (rate >= 25) conv = 88
    else if (rate >= 15) conv = 68
    else if (rate >= 8) conv = 48
    else if (rate >= 3) conv = 32
  }
  if (d.websiteFeatures?.includes('Landing Pages')) conv += 8
  if (d.websiteFeatures?.includes('Analytics')) conv += 5
  conv += Math.round((parseInt(d.websiteConfidence) || 5) * 0.5)

  let sales = 14
  sales += ({ CRM:40, Email:18, WhatsApp:10, Spreadsheet:8 }[d.leadManagement] || 0)
  if (d.autoFollowUp === 'Yes') sales += 30

  let ops = 55
  ops -= (d.timeConsumers?.length || 0) * 5
  if ((d.software || '').trim().length > 8) ops += 15
  if (d.websiteFeatures?.includes('Email Automation')) ops += 12
  if (d.leadManagement === 'CRM') ops += 8

  const s = {
    positioning: clamp(pos), authority: clamp(auth), acquisition: clamp(acq),
    conversion: clamp(conv), sales: clamp(sales), operations: clamp(ops),
  }
  s.overall = clamp(Math.round(Object.values(s).reduce((a,b) => a+b, 0) / 6))
  return s
}

// ─── Phase config ─────────────────────────────────────────────────────────────
const PHASE_STEPS = [
  { key:'business',    label:'Business Profile' },
  { key:'challenges',  label:'Core Challenges'  },
  { key:'positioning', label:'Positioning'       },
  { key:'authority',   label:'Authority'         },
  { key:'leadgen',     label:'Lead Generation'   },
  { key:'sales',       label:'Sales Process'     },
  { key:'website',     label:'Website Audit'     },
  { key:'operations',  label:'Operations'        },
  { key:'vision',      label:'Vision'            },
  { key:'contact',     label:'Your Details'      },
]

const initData = () => ({
  businessName:'', website:'', industry:'', teamSize:'', revenue:'', marketingSpend:'', primaryGoal:'',
  challenges:[],
  websiteClarity:'', oneSentence:'', differentiation:'',
  trustSignals:[], contentFrequency:'',
  leadSource:'', monthlyLeads:'', leadConversion:'',
  leadManagement:'', autoFollowUp:'', dealSize:'',
  websiteFeatures:[], websiteConfidence:5,
  timeConsumers:[], software:'',
  oneYearVision:'', ifNothingChanges:'', successLooks:'',
  name:'', email:'',
})

export default function AuditModal({ open, onClose }) {
  const [phase, setPhase]         = useState('welcome')
  const [data, setData]           = useState(initData)
  const [scanning, setScanning]   = useState(false)
  const [scanResult, setScanResult] = useState(null)
  const [sending, setSending]     = useState(false)
  const [err, setErr]             = useState('')
  const mainRef  = useRef(null)
  const scanTimer = useRef(null)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (!open) { setPhase('welcome'); setData(initData()); setScanResult(null); setErr('') }
  }, [open])

  const set = (k, v) => setData(d => ({ ...d, [k]: v }))
  const toggleArr = (k, v) => setData(d => ({ ...d, [k]: d[k].includes(v) ? d[k].filter(x=>x!==v) : [...d[k], v] }))
  const scrollTop = () => { mainRef.current && (mainRef.current.scrollTop = 0) }
  const goTo = p => { setPhase(p); scrollTop() }

  const phases = () => {
    const base = ['business','challenges','positioning','authority','leadgen','sales']
    if (data.website?.trim()) base.push('website')
    return [...base, 'operations', 'vision', 'contact']
  }

  const nextPhase = () => {
    const order = phases()
    const idx = order.indexOf(phase)
    if (idx < order.length - 1) goTo(order[idx + 1])
    else handleSubmit()
  }
  const prevPhase = () => {
    const order = phases()
    const idx = order.indexOf(phase)
    if (idx > 0) goTo(order[idx - 1])
    else goTo('welcome')
  }

  // Auto-scan URL as user types (debounced 800ms)
  const handleUrlChange = (url) => {
    set('website', url)
    clearTimeout(scanTimer.current)
    if (url.trim().length > 8 && url.includes('.')) {
      scanTimer.current = setTimeout(() => scanWebsite(url), 800)
    }
  }

  const scanWebsite = async url => {
    if (!url?.trim()) return
    const normalized = url.startsWith('http') ? url : `https://${url}`
    setScanning(true)
    try {
      const res = await fetch('/api/enrich', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ url: normalized }),
      })
      const d = await res.json()
      if (!d.error) {
        setScanResult(d)
        // Auto-fill business name if empty
        if (d.company) setData(prev => ({ ...prev, businessName: prev.businessName || d.company }))
      }
    } catch {}
    finally { setScanning(false) }
  }

  const handleSubmit = async () => {
    if (!data.email?.includes('@')) { setErr('Please enter a valid email address.'); return }
    if (!data.name?.trim()) { setErr('Please enter your name.'); return }
    setSending(true); setErr('')
    // Compute scores internally — for email only, never shown to client
    const scores = computeScores(data)
    try {
      const res = await fetch('/api/audit', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          name: data.name, email: data.email, url: data.website,
          a1: [data.businessName, data.industry, data.teamSize ? `Team: ${data.teamSize}` : ''].filter(Boolean).join(' · '),
          a2: data.revenue,
          a3: [data.leadSource, data.monthlyLeads ? `${data.monthlyLeads} leads/mo` : '', data.leadConversion ? `${data.leadConversion} convert` : ''].filter(Boolean).join(' · '),
          a4: data.challenges?.join(', '),
          a5: [data.software, data.timeConsumers?.join(', ')].filter(Boolean).join(' | '),
          goal: [data.oneYearVision, data.successLooks].filter(Boolean).join(' → '),
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

  const order = phases()
  const phaseIdx = order.indexOf(phase)
  const progress = phase === 'welcome' ? 0
    : phase === 'success' ? 100
    : Math.round(((phaseIdx + 1) / order.length) * 100)

  const visibleSteps = PHASE_STEPS.filter(s => s.key !== 'website' || data.website?.trim())

  return (
    <div className="audit-overlay open" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="diag-shell">
        <button className="diag-close" onClick={onClose}>✕</button>

        {/* ── Sidebar ── */}
        <aside className="diag-sidebar">
          <div className="diag-brand">
            <div className="diag-brand-mark">TL</div>
            <div>
              <div className="diag-brand-name">TitanLeap</div>
              <div className="diag-brand-sub">AI Business Diagnosis™</div>
            </div>
          </div>

          {phase === 'welcome' && (
            <div className="diag-sidebar-body">
              <p className="diag-sidebar-tagline">We find the <em>hidden constraints</em> blocking your growth.</p>
              <div className="diag-stats">
                <div className="diag-stat"><strong>8–12</strong><span>minutes</span></div>
                <div className="diag-stat"><strong>10</strong><span>dimensions</span></div>
                <div className="diag-stat"><strong>Free</strong><span>no cost</span></div>
              </div>
            </div>
          )}

          {phase !== 'welcome' && phase !== 'success' && (
            <nav className="diag-steps">
              {visibleSteps.map((s, i) => {
                const sIdx = order.indexOf(s.key)
                const done   = phaseIdx > sIdx
                const active = phase === s.key
                return (
                  <div key={s.key} className={`diag-step${done?' done':active?' active':''}`}>
                    <div className="diag-step-dot">{done ? '✓' : i+1}</div>
                    <span className="diag-step-label">{s.label}</span>
                  </div>
                )
              })}
            </nav>
          )}

          {phase === 'success' && (
            <div className="diag-sidebar-body">
              <p className="diag-sidebar-tagline">Your application is in. We&apos;ll take it from here.</p>
            </div>
          )}

          {phase !== 'welcome' && (
            <div className="diag-progress">
              <div className="diag-progress-track">
                <div className="diag-progress-fill" style={{width:`${progress}%`}}/>
              </div>
              <span className="diag-progress-label">{progress}% complete</span>
            </div>
          )}
        </aside>

        {/* ── Main ── */}
        <main className="diag-main" ref={mainRef}>

          {/* WELCOME */}
          {phase === 'welcome' && (
            <div className="diag-welcome">
              <div className="diag-eyebrow">AI Business Diagnosis™</div>
              <h2 className="diag-welcome-h">Let&apos;s find what&apos;s<br />slowing your business down.</h2>
              <div className="diag-welcome-text">
                <p>Most businesses don&apos;t have a marketing problem.</p>
                <p>They have <strong>one or two hidden constraints</strong> preventing growth.</p>
                <p>Answer a few questions and we&apos;ll identify them — then send you a step-by-step plan to remove them.</p>
              </div>
              <div className="diag-welcome-chips">
                <span>⏱ 8–12 minutes</span>
                <span>📊 10 dimensions analyzed</span>
                <span>🎯 Delivered within 5 hours</span>
              </div>
              <button className="diag-start-btn" onClick={() => goTo('business')}>Start Application →</button>
            </div>
          )}

          {/* BUSINESS PROFILE */}
          {phase === 'business' && (
            <div className="diag-screen">
              <div className="diag-screen-tag">Business Profile</div>
              <h3 className="diag-screen-h">Tell us about your business</h3>
              <div className="diag-grid">
                <div className="diag-field">
                  <label>Business Name</label>
                  <input className="diag-input" value={data.businessName} onChange={e=>set('businessName',e.target.value)} placeholder="e.g. Acme Growth Co." autoFocus/>
                </div>
                <div className="diag-field">
                  <label>
                    Website
                    <span className="diag-scan-status">
                      {scanning ? '⟳ Scanning…' : scanResult ? '✓ Auto-filled' : '— paste URL to auto-fill'}
                    </span>
                  </label>
                  <input
                    className="diag-input"
                    type="text"
                    value={data.website}
                    onChange={e => handleUrlChange(e.target.value)}
                    placeholder="yourwebsite.com"
                  />
                </div>
                <div className="diag-field">
                  <label>Industry</label>
                  <input className="diag-input" value={data.industry} onChange={e=>set('industry',e.target.value)} placeholder="e.g. SaaS, E-commerce, Consulting"/>
                </div>
                <div className="diag-field">
                  <label>Team Size</label>
                  <div className="diag-chips">
                    {['Solo','2–5','6–15','16–50','50+'].map(v=>(
                      <button key={v} className={`diag-chip${data.teamSize===v?' sel':''}`} onClick={()=>set('teamSize',v)}>{v}</button>
                    ))}
                  </div>
                </div>
                <div className="diag-field diag-full">
                  <label>Monthly Revenue</label>
                  <div className="diag-chips">
                    {['Pre-revenue','Under $1k','$1k–$5k','$5k–$15k','$15k–$50k','$50k+'].map(v=>(
                      <button key={v} className={`diag-chip${data.revenue===v?' sel':''}`} onClick={()=>set('revenue',v)}>{v}</button>
                    ))}
                  </div>
                </div>
                <div className="diag-field diag-full">
                  <label>Monthly Marketing Spend</label>
                  <div className="diag-chips">
                    {['$0','Under $500','$500–$2k','$2k–$5k','$5k+'].map(v=>(
                      <button key={v} className={`diag-chip${data.marketingSpend===v?' sel':''}`} onClick={()=>set('marketingSpend',v)}>{v}</button>
                    ))}
                  </div>
                </div>
                <div className="diag-field diag-full">
                  <label>Primary Goal</label>
                  <div className="diag-chips">
                    {['Get more leads','Increase sales','Improve branding','Build systems','Scale operations'].map(v=>(
                      <button key={v} className={`diag-chip${data.primaryGoal===v?' sel':''}`} onClick={()=>set('primaryGoal',v)}>{v}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="diag-nav-row">
                <button className="diag-back" onClick={prevPhase}>← Back</button>
                <button className="diag-next" onClick={nextPhase}>Continue →</button>
              </div>
            </div>
          )}

          {/* CHALLENGES */}
          {phase === 'challenges' && (
            <div className="diag-screen">
              <div className="diag-screen-tag">Core Challenges</div>
              <h3 className="diag-screen-h">What&apos;s currently stopping growth?</h3>
              <p className="diag-screen-sub">Choose up to three.</p>
              <div className="diag-card-grid">
                {['Not enough leads','Low-quality leads','Low website conversions','Poor branding','Weak social media','No clear positioning','Sales process is inconsistent','Clients don\'t trust us','Too much manual work','Team inefficiencies','Other'].map(v=>(
                  <button key={v} className={`diag-card-check${data.challenges.includes(v)?' sel':''}`}
                    onClick={()=>{ if(data.challenges.includes(v)) toggleArr('challenges',v); else if(data.challenges.length<3) toggleArr('challenges',v) }}>
                    <span className="diag-card-tick">{data.challenges.includes(v)?'✓':''}</span>
                    {v}
                  </button>
                ))}
              </div>
              <div className="diag-nav-row">
                <button className="diag-back" onClick={prevPhase}>← Back</button>
                <button className="diag-next" onClick={nextPhase}>Continue →</button>
              </div>
            </div>
          )}

          {/* POSITIONING */}
          {phase === 'positioning' && (
            <div className="diag-screen">
              <div className="diag-screen-tag">Positioning</div>
              <h3 className="diag-screen-h">When someone lands on your website…</h3>
              <div className="diag-qblock">
                <label>How quickly can they understand what you do?</label>
                <div className="diag-radio-stack">
                  {['Immediately','Within 10 seconds',"It's confusing"].map(v=>(
                    <button key={v} className={`diag-radio${data.websiteClarity===v?' sel':''}`} onClick={()=>set('websiteClarity',v)}>
                      <span className="diag-radio-dot"/>{v}
                    </button>
                  ))}
                </div>
              </div>
              <div className="diag-qblock">
                <label>Can you explain your business in one sentence?</label>
                <div className="diag-radio-stack">
                  {['Yes','Somewhat','No'].map(v=>(
                    <button key={v} className={`diag-radio${data.oneSentence===v?' sel':''}`} onClick={()=>set('oneSentence',v)}>
                      <span className="diag-radio-dot"/>{v}
                    </button>
                  ))}
                </div>
              </div>
              <div className="diag-qblock">
                <label>What makes you different from competitors?</label>
                <textarea className="diag-textarea" value={data.differentiation} onChange={e=>set('differentiation',e.target.value)} placeholder="Be specific — 'we care more' doesn't differentiate."/>
              </div>
              <div className="diag-nav-row">
                <button className="diag-back" onClick={prevPhase}>← Back</button>
                <button className="diag-next" onClick={nextPhase}>Continue →</button>
              </div>
            </div>
          )}

          {/* AUTHORITY */}
          {phase === 'authority' && (
            <div className="diag-screen">
              <div className="diag-screen-tag">Authority</div>
              <h3 className="diag-screen-h">Which trust signals do you currently have?</h3>
              <div className="diag-card-grid">
                {['Testimonials','Google Reviews','Case Studies','Client Logos','Certifications','Portfolio','Awards','Press Features'].map(v=>(
                  <button key={v} className={`diag-card-check${data.trustSignals.includes(v)?' sel':''}`} onClick={()=>toggleArr('trustSignals',v)}>
                    <span className="diag-card-tick">{data.trustSignals.includes(v)?'✓':''}</span>
                    {v}
                  </button>
                ))}
              </div>
              <div className="diag-qblock" style={{marginTop:'24px'}}>
                <label>How often do you publish content?</label>
                <div className="diag-chips">
                  {['Daily','Weekly','Monthly','Rarely','Never'].map(v=>(
                    <button key={v} className={`diag-chip${data.contentFrequency===v?' sel':''}`} onClick={()=>set('contentFrequency',v)}>{v}</button>
                  ))}
                </div>
              </div>
              <div className="diag-nav-row">
                <button className="diag-back" onClick={prevPhase}>← Back</button>
                <button className="diag-next" onClick={nextPhase}>Continue →</button>
              </div>
            </div>
          )}

          {/* LEAD GEN */}
          {phase === 'leadgen' && (
            <div className="diag-screen">
              <div className="diag-screen-tag">Lead Generation</div>
              <h3 className="diag-screen-h">Where do most customers come from?</h3>
              <div className="diag-chips" style={{flexWrap:'wrap',marginBottom:'28px'}}>
                {['Referrals','Google Search','Paid Ads','Instagram','LinkedIn','TikTok','Cold Outreach','Email','Other'].map(v=>(
                  <button key={v} className={`diag-chip${data.leadSource===v?' sel':''}`} onClick={()=>set('leadSource',v)}>{v}</button>
                ))}
              </div>
              <div className="diag-grid">
                <div className="diag-field">
                  <label>Approx. leads per month</label>
                  <input className="diag-input" type="number" min="0" value={data.monthlyLeads} onChange={e=>set('monthlyLeads',e.target.value)} placeholder="e.g. 40"/>
                </div>
                <div className="diag-field">
                  <label>How many become paying customers?</label>
                  <input className="diag-input" type="number" min="0" value={data.leadConversion} onChange={e=>set('leadConversion',e.target.value)} placeholder="e.g. 6"/>
                </div>
              </div>
              <div className="diag-nav-row">
                <button className="diag-back" onClick={prevPhase}>← Back</button>
                <button className="diag-next" onClick={nextPhase}>Continue →</button>
              </div>
            </div>
          )}

          {/* SALES */}
          {phase === 'sales' && (
            <div className="diag-screen">
              <div className="diag-screen-tag">Sales Process</div>
              <h3 className="diag-screen-h">How are leads managed?</h3>
              <div className="diag-radio-stack" style={{marginBottom:'24px'}}>
                {['CRM','Email','WhatsApp','Spreadsheet',"We don't really have a process"].map(v=>(
                  <button key={v} className={`diag-radio${data.leadManagement===v?' sel':''}`} onClick={()=>set('leadManagement',v)}>
                    <span className="diag-radio-dot"/>{v}
                  </button>
                ))}
              </div>
              <div className="diag-qblock">
                <label>Do you follow up automatically?</label>
                <div className="diag-chips">
                  {['Yes','No'].map(v=>(
                    <button key={v} className={`diag-chip${data.autoFollowUp===v?' sel':''}`} onClick={()=>set('autoFollowUp',v)}>{v}</button>
                  ))}
                </div>
              </div>
              <div className="diag-qblock">
                <label>Average deal size</label>
                <input className="diag-input" value={data.dealSize} onChange={e=>set('dealSize',e.target.value)} placeholder="e.g. $1,500"/>
              </div>
              <div className="diag-nav-row">
                <button className="diag-back" onClick={prevPhase}>← Back</button>
                <button className="diag-next" onClick={nextPhase}>Continue →</button>
              </div>
            </div>
          )}

          {/* WEBSITE AUDIT — adaptive */}
          {phase === 'website' && (
            <div className="diag-screen">
              <div className="diag-screen-tag">Website Audit</div>
              <h3 className="diag-screen-h">Do you currently have…</h3>
              <div className="diag-card-grid" style={{marginBottom:'28px'}}>
                {['Landing Pages','Booking System','Live Chat','CRM','Analytics','Heatmaps','Email Automation','Lead Magnet'].map(v=>(
                  <button key={v} className={`diag-card-check${data.websiteFeatures.includes(v)?' sel':''}`} onClick={()=>toggleArr('websiteFeatures',v)}>
                    <span className="diag-card-tick">{data.websiteFeatures.includes(v)?'✓':''}</span>
                    {v}
                  </button>
                ))}
              </div>
              <div className="diag-qblock">
                <label>How confident are you in your website? <strong className="diag-slider-val">{data.websiteConfidence}/10</strong></label>
                <input type="range" min="1" max="10" value={data.websiteConfidence} onChange={e=>set('websiteConfidence',parseInt(e.target.value))} className="diag-slider"/>
                <div className="diag-slider-labels"><span>Not confident</span><span>Very confident</span></div>
              </div>
              <div className="diag-nav-row">
                <button className="diag-back" onClick={prevPhase}>← Back</button>
                <button className="diag-next" onClick={nextPhase}>Continue →</button>
              </div>
            </div>
          )}

          {/* OPERATIONS */}
          {phase === 'operations' && (
            <div className="diag-screen">
              <div className="diag-screen-tag">Operations</div>
              <h3 className="diag-screen-h">Which tasks consume the most time?</h3>
              <div className="diag-card-grid" style={{marginBottom:'28px'}}>
                {['Following up leads','Client onboarding','Reporting','Social media','Scheduling','Sales','Admin'].map(v=>(
                  <button key={v} className={`diag-card-check${data.timeConsumers.includes(v)?' sel':''}`} onClick={()=>toggleArr('timeConsumers',v)}>
                    <span className="diag-card-tick">{data.timeConsumers.includes(v)?'✓':''}</span>
                    {v}
                  </button>
                ))}
              </div>
              <div className="diag-qblock">
                <label>Which software do you use? <span className="diag-hint">(CRM, email, project management…)</span></label>
                <input className="diag-input" value={data.software} onChange={e=>set('software',e.target.value)} placeholder="e.g. HubSpot, Notion, Mailchimp"/>
              </div>
              <div className="diag-nav-row">
                <button className="diag-back" onClick={prevPhase}>← Back</button>
                <button className="diag-next" onClick={nextPhase}>Continue →</button>
              </div>
            </div>
          )}

          {/* VISION */}
          {phase === 'vision' && (
            <div className="diag-screen">
              <div className="diag-screen-tag">Vision</div>
              <h3 className="diag-screen-h">Where do you want the business in one year?</h3>
              <div className="diag-qblock">
                <label>One-year vision</label>
                <textarea className="diag-textarea" value={data.oneYearVision} onChange={e=>set('oneYearVision',e.target.value)} placeholder="Revenue target, team size, market position…"/>
              </div>
              <div className="diag-qblock">
                <label>If nothing changes, what happens?</label>
                <textarea className="diag-textarea" style={{minHeight:'80px'}} value={data.ifNothingChanges} onChange={e=>set('ifNothingChanges',e.target.value)} placeholder="Be honest with yourself…"/>
              </div>
              <div className="diag-qblock">
                <label>What would success look like?</label>
                <textarea className="diag-textarea" style={{minHeight:'80px'}} value={data.successLooks} onChange={e=>set('successLooks',e.target.value)} placeholder="Specific, measurable outcome…"/>
              </div>
              <div className="diag-nav-row">
                <button className="diag-back" onClick={prevPhase}>← Back</button>
                <button className="diag-next" onClick={nextPhase}>Continue →</button>
              </div>
            </div>
          )}

          {/* CONTACT */}
          {phase === 'contact' && (
            <div className="diag-screen">
              <div className="diag-screen-tag">Your Details</div>
              <h3 className="diag-screen-h">Last step — where do we send your diagnosis?</h3>
              <p className="diag-screen-sub">We'll review your answers and send a personalised report within 5 hours.</p>
              <div className="diag-grid" style={{marginBottom:'8px'}}>
                <div className="diag-field diag-full">
                  <label>Your Name</label>
                  <input className="diag-input" value={data.name} onChange={e=>set('name',e.target.value)} placeholder="Full name" autoFocus/>
                </div>
                <div className="diag-field diag-full">
                  <label>Email Address</label>
                  <input className="diag-input" type="email" value={data.email} onChange={e=>{set('email',e.target.value);setErr('')}} placeholder="your@email.com"/>
                </div>
              </div>
              {err && <div className="diag-err">{err}</div>}
              <div className="diag-nav-row">
                <button className="diag-back" onClick={prevPhase}>← Back</button>
                <button className="diag-generate" onClick={handleSubmit} disabled={sending}>
                  {sending ? 'Submitting…' : 'Submit Application →'}
                </button>
              </div>
              <p className="diag-fine">100% Free · No pitch unless you ask · Delivered in 5 hours</p>
            </div>
          )}

          {/* SUCCESS */}
          {phase === 'success' && (
            <div className="diag-success">
              <div className="diag-success-icon">✓</div>
              <h3 className="diag-success-h">Application received.</h3>
              <p className="diag-success-p">
                We&apos;ll review your answers, run a full diagnosis on your business, and send a personalized Growth Blueprint to <strong>{data.email}</strong> within 5 hours.
              </p>
              <p className="diag-success-p" style={{marginTop:'8px'}}>
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
