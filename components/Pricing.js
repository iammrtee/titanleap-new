'use client'
import { useState, useEffect, useRef } from 'react'

const entrySteps = [
  {
    key: 'audit',
    n: '1',
    name: 'Revenue Leak Audit',
    price: '$297',
    period: 'one-time',
    desc: 'Your funnel, traffic, and conversion gaps — three ranked leaks with dollar-range impact, delivered in 5 hours. The average leak we find costs $4k–$11k/mo.',
    cta: 'Get the audit →',
  },
  {
    key: 'sprint',
    n: '2',
    name: 'Growth System Sprint',
    price: '$2,500',
    period: 'one-time',
    desc: 'Not ready for a retainer? We hand you a 90-day growth blueprint and build your core system — positioning, one launched funnel, automated follow-up. Yours to keep. Credits toward any plan.',
    cta: 'Book a sprint →',
  },
]

const plans = [
  {
    key: 'starter', tier: 'Starter', name: 'Launch Accelerator', hot: false,
    desc: 'For pre-revenue or early-stage SaaS ready to build the foundation of a real growth system.',
    monthly: '1,500', annual: '1,200',
    sections: [
      { head: 'Strategy & Foundations', feats: ['<b>90-day growth blueprint</b>', 'Funnel audit + full strategy map', 'ICP definition & competitor research', 'Market positioning brief'] },
      { head: 'Content Production', feats: ['<b>5 short-form videos/mo</b>', '<b>15 branded graphics & designs/mo</b>', 'Email nurture sequence (5-part)'] },
      { head: 'Funnel & Conversion', feats: ['Landing page build & CRO optimization', 'Lead capture & form setup'] },
      { head: 'Automation & Reporting', feats: ['Basic AI lead scoring + CRM sync', 'CRM integration (HubSpot / Notion)', 'Monthly report + strategy call'] },
    ],
    btnClass: 'p-btn-ghost',
  },
  {
    key: 'growth', tier: 'Growth', name: 'Scaling System', hot: true,
    desc: 'For SaaS with traction that needs a full growth engine built, launched, and running month over month.',
    monthly: '3,500', annual: '2,800',
    sections: [
      { head: 'Everything in Launch Accelerator, plus:', feats: ['<b>4-person team on your account</b>', 'Full content calendar management'] },
      { head: 'Content Production', feats: ['<b>20 short-form videos/mo</b> <span style="font-size:10px;color:rgba(196,168,255,.4)">(4\xd7 Launch)</span>', '<b>40 branded designs/mo</b> <span style="font-size:10px;color:rgba(196,168,255,.4)">(includes ad creative)</span>', '4 long-form blog posts/mo', 'Email campaigns + broadcast management'] },
      { head: 'Paid Ads Management', feats: ['Meta + Google Ads, fully managed', 'Ad creative refresh every 2 weeks', 'Full attribution dashboard'] },
      { head: 'AI Automation', feats: ['Advanced n8n automation + attribution', 'AI lead scoring & prioritization', 'Automated follow-up sequences', 'Weekly strategy calls'] },
    ],
    btnClass: 'p-btn-gold',
  },
  {
    key: 'authority', tier: 'Authority', name: 'Authority Domination', hot: false,
    desc: 'For established founders ready to build a category-defining brand and dominate their market entirely.',
    monthly: '6,999', annual: '5,599',
    sections: [
      { head: 'Everything in Scaling System, plus:', feats: ['<b>Full team assigned</b> — strategist, editor, brand manager + specialists'] },
      { head: 'Content Production', feats: ['<b>Up to 60 short-form videos/mo</b> <span style="font-size:10px;color:rgba(196,168,255,.4)">(3\xd7 Scaling)</span>', '<b>Up to 100 branded designs/mo</b> <span style="font-size:10px;color:rgba(196,168,255,.4)">(3\xd7 Scaling)</span>', '8 long-form blog posts/mo', 'LinkedIn daily content (30 posts/mo)', 'TikTok + YouTube Shorts system', 'Founder brand build — personal authority content'] },
      { head: 'Enterprise Growth', feats: ['Dedicated senior growth strategist', 'Custom AI automation builds (unlimited)', 'PR & thought leadership outreach', 'Competitive intelligence reports'] },
      { head: 'Concierge Support', feats: ['Weekly strategy + performance calls', 'Slack direct access + 24h priority'] },
    ],
    btnClass: 'p-btn-ghost',
  },
]

const included = [
  { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>, title: 'No lock-in contracts', desc: ' Monthly rolling — leave anytime. We earn your business every single month.' },
  { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>, title: 'Live performance dashboard', desc: ' Real-time view of every metric that matters — funnel, CAC, ROAS, leads.' },
  { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, title: '90-day results guarantee', desc: " If we don't move your growth metrics in 90 days, we work free until we do." },
  { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, title: 'Founder-direct', desc: " You work with the team building your system — not an account manager relaying messages." },
]

const addons = [
  { id:'ads',   price: 799, label: '$799', name: 'Extra Ad Channel',      icon: '⚡', desc: 'Add TikTok Ads, LinkedIn Ads, or YouTube Ads to any plan. Includes creative, targeting setup, and weekly optimization.' },
  { id:'seo',   price: 499, label: '$499', name: 'SEO Growth Engine',     icon: '📈', desc: '8 long-form SEO articles per month, keyword strategy, internal linking, and quarterly technical SEO audit. Built to rank.' },
  { id:'email', price: 599, label: '$599', name: 'Email Revenue System',  icon: '✉️', desc: 'Full email list management, broadcast campaigns, automated sequences, and monthly list hygiene. Done for you, every week.' },
]

function useCountUp(target, duration = 400) {
  const [val, setVal] = useState(target)
  const prev = useRef(target)
  useEffect(() => {
    const start = prev.current
    const diff = target - start
    if (diff === 0) return
    const steps = 20
    const stepTime = duration / steps
    let i = 0
    const t = setInterval(() => {
      i++
      setVal(Math.round(start + diff * (i / steps)))
      if (i >= steps) { clearInterval(t); prev.current = target }
    }, stepTime)
    return () => clearInterval(t)
  }, [target, duration])
  return val
}

// Payment method picker modal
function PaymentModal({ planKey, billing, price, onClose }) {
  const [loading, setLoading] = useState(null)

  const pay = async (processor) => {
    setLoading(processor)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planKey, billing, processor }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else { alert('Something went wrong. Please try again.'); setLoading(null) }
    } catch {
      alert('Something went wrong. Please try again.')
      setLoading(null)
    }
  }

  return (
    <div
      style={{position:'fixed',inset:0,zIndex:9999,display:'flex',alignItems:'center',justifyContent:'center',padding:'20px',background:'rgba(4,1,14,.85)',backdropFilter:'blur(6px)'}}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{background:'#0D0520',border:'1px solid rgba(107,33,232,.35)',borderRadius:'20px',padding:'36px',maxWidth:'400px',width:'100%',boxShadow:'0 40px 100px rgba(0,0,0,.7), 0 0 60px rgba(107,33,232,.12)'}}>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'10px',fontWeight:'700',letterSpacing:'.14em',textTransform:'uppercase',color:'rgba(196,168,255,.4)',marginBottom:'10px'}}>
          Choose payment method
        </div>
        <div style={{fontFamily:"-apple-system,'SF Pro Display',BlinkMacSystemFont,sans-serif",fontSize:'22px',fontWeight:'800',letterSpacing:'-.5px',color:'var(--white)',marginBottom:'6px'}}>
          How would you like to pay?
        </div>
        <div style={{fontSize:'13px',color:'var(--muted)',marginBottom:'28px'}}>
          Both methods are secure. Stripe is global; Paystack is great for Africa / NGN.
        </div>

        {/* Stripe */}
        <button
          onClick={() => pay('stripe')}
          disabled={!!loading}
          style={{width:'100%',marginBottom:'10px',padding:'16px 20px',background:loading==='stripe'?'rgba(99,91,255,.25)':'rgba(99,91,255,.12)',border:'1px solid rgba(99,91,255,.4)',borderRadius:'12px',cursor:loading?'wait':'pointer',display:'flex',alignItems:'center',gap:'14px',transition:'all .18s',textAlign:'left'}}
        >
          <div style={{width:'36px',height:'36px',borderRadius:'8px',background:'#635BFF',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
            <svg width="20" height="20" viewBox="0 0 60 25" fill="white"><path d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a14.2 14.2 0 0 1-4.56.83c-4.05 0-6.83-2.5-6.83-7.48 0-4.3 2.49-7.52 6.3-7.52 3.92 0 5.96 2.9 5.96 7.15 0 .5-.05 1.1-.06 1.1zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.25c0-1.85-1.07-2.58-2.08-2.58zM40.95 20l-.24-1.16c-.92 1.16-2.26 1.52-3.65 1.52-3.65 0-5.51-2.86-5.51-7.26 0-4.94 2.08-7.74 5.87-7.74 1.3 0 2.43.42 3.24 1.33V0h4.29v19.8L40.95 20zm-.29-4.5V9.01c-.5-.47-1.08-.73-1.8-.73-1.67 0-2.61 1.37-2.61 3.91 0 2.72.97 3.95 2.64 3.95.72 0 1.28-.24 1.77-.64zm-13.69 4.5h-4.29V5.36h4.08l.12 1.44c.79-1.16 1.93-1.8 3.33-1.8.34 0 .67.05.97.13V9.3a5.77 5.77 0 0 0-1.4-.16c-1.34 0-2.36.68-2.81 1.93V20zm-9.42 0h-4.3V5.36h4.3V20zm-2.15-16.36c-1.41 0-2.53-1.08-2.53-2.46S13.99.72 15.4.72c1.4 0 2.53 1.08 2.53 2.46S16.8 3.64 15.4 3.64zM7.24 20H0V.8h7.05c4.35 0 7.2 1.97 7.2 5.98 0 2.42-1.22 4.04-3.1 4.97C13.54 12.6 14.9 14.45 14.9 17c0 2.28-1.73 3-3.66 3zm-.58-14.76H4.3v4.46h2.28c1.82 0 3.01-.68 3.01-2.23 0-1.58-1.12-2.23-2.93-2.23zm.47 8.3H4.3V19h2.87c1.87 0 3.04-.7 3.04-2.35 0-1.66-1.24-2.11-3.08-2.11z"/></svg>
          </div>
          <div style={{flex:1}}>
            <div style={{fontFamily:"-apple-system,'SF Pro Display',sans-serif",fontWeight:'700',fontSize:'15px',color:'var(--white)',marginBottom:'2px'}}>
              {loading === 'stripe' ? 'Redirecting…' : 'Pay with Stripe'}
            </div>
            <div style={{fontSize:'12px',color:'rgba(196,168,255,.5)'}}>Credit / debit card — global, instant</div>
          </div>
        </button>

        {/* Paystack */}
        <button
          onClick={() => pay('paystack')}
          disabled={!!loading}
          style={{width:'100%',marginBottom:'24px',padding:'16px 20px',background:loading==='paystack'?'rgba(0,192,96,.15)':'rgba(0,192,96,.08)',border:'1px solid rgba(0,192,96,.3)',borderRadius:'12px',cursor:loading?'wait':'pointer',display:'flex',alignItems:'center',gap:'14px',transition:'all .18s',textAlign:'left'}}
        >
          <div style={{width:'36px',height:'36px',borderRadius:'8px',background:'#00C060',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontWeight:'900',color:'white',fontSize:'16px',fontFamily:'sans-serif'}}>P</div>
          <div style={{flex:1}}>
            <div style={{fontFamily:"-apple-system,'SF Pro Display',sans-serif",fontWeight:'700',fontSize:'15px',color:'var(--white)',marginBottom:'2px'}}>
              {loading === 'paystack' ? 'Redirecting…' : 'Pay with Paystack'}
            </div>
            <div style={{fontSize:'12px',color:'rgba(196,168,255,.5)'}}>Card, bank transfer, USSD — great for Africa / NGN</div>
          </div>
        </button>

        <button
          onClick={onClose}
          style={{width:'100%',background:'none',border:'none',color:'rgba(196,168,255,.4)',fontSize:'13px',cursor:'pointer',padding:'0',fontFamily:'-apple-system,sans-serif'}}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default function Pricing({ onAudit }) {
  const [annual, setAnnual] = useState(false)
  const [activeAddons, setActiveAddons] = useState(new Set())
  const [modal, setModal] = useState(null) // { planKey, billing, price }

  const toggleAddon = id => setActiveAddons(prev => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

  const addonTotal = addons.filter(a => activeAddons.has(a.id)).reduce((s, a) => s + a.price, 0)
  const animatedTotal = useCountUp(addonTotal)

  const openModal = (planKey, billing, price) => setModal({ planKey, billing, price })

  return (
    <section className="sec pricing" id="pricing">
      {modal && (
        <PaymentModal
          planKey={modal.planKey}
          billing={modal.billing}
          price={modal.price}
          onClose={() => setModal(null)}
        />
      )}
      <div className="wrap">

        <div className="price-head">
          <div className="sec-tag reveal" style={{justifyContent:'center'}}>Pricing</div>
          <h2 className="price-h2 reveal">Find the leak. <em>Then fix it.</em></h2>
          <p className="price-sub reveal">Every founder starts in the same place — a $297 audit that shows exactly where revenue is leaking. From there you choose how far you want us to take it. No lock-in. No contracts.</p>
        </div>

        {/* Entry steps */}
        <div className="reveal" style={{marginBottom:'8px'}}>
          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:'10px',letterSpacing:'.16em',textTransform:'uppercase',color:'rgba(196,168,255,.4)',marginBottom:'14px'}}>
            Every engagement starts here
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px'}}>
            {entrySteps.map((s, i) => (
              <div key={i} className="p-card" style={{padding:'24px 26px'}}>
                <div style={{display:'flex',alignItems:'flex-start',gap:'16px'}}>
                  <div style={{fontFamily:"'Archivo',sans-serif",fontWeight:'800',fontSize:'26px',color:'var(--p300)',lineHeight:'1',flexShrink:0,width:'32px'}}>{s.n}</div>
                  <div style={{flex:1}}>
                    <div style={{display:'flex',alignItems:'baseline',justifyContent:'space-between',gap:'10px',flexWrap:'wrap',marginBottom:'8px'}}>
                      <div style={{fontFamily:"'Archivo',sans-serif",fontWeight:'700',fontSize:'16px',color:'var(--white)'}}>{s.name}</div>
                      <div style={{fontFamily:"'Archivo',sans-serif",fontWeight:'800',fontSize:'18px',color:'var(--white)',whiteSpace:'nowrap'}}>
                        {s.price} <span style={{fontSize:'11px',color:'var(--p200)',fontWeight:'600'}}>{s.period}</span>
                      </div>
                    </div>
                    <p style={{fontSize:'13px',color:'var(--p200)',lineHeight:'1.55',marginBottom:'14px'}}>{s.desc}</p>
                    <button
                      onClick={() => openModal(s.key, 'once', s.price)}
                      style={{fontSize:'12px',fontWeight:'700',color:'var(--white)',background:'none',border:'none',borderBottom:'1px solid rgba(255,255,255,.2)',paddingBottom:'2px',transition:'border-color .18s',fontFamily:"'Archivo',sans-serif",cursor:'pointer',padding:'0 0 2px'}}
                    >
                      {s.cta}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="reveal" style={{margin:'28px 0 20px',fontFamily:"'JetBrains Mono',monospace",fontSize:'10px',letterSpacing:'.16em',textTransform:'uppercase',color:'rgba(196,168,255,.35)',display:'flex',alignItems:'center',gap:'16px'}}>
          <div style={{flex:1,height:'1px',background:'rgba(107,33,232,.18)'}}/>
          <span>Then pick how far we take it</span>
          <div style={{flex:1,height:'1px',background:'rgba(107,33,232,.18)'}}/>
        </div>

        {/* Annual toggle */}
        <div className="price-toggle reveal">
          <span className={"toggle-label" + (!annual?' active':'')}>Monthly</span>
          <div className={"toggle-switch" + (annual?' on':'')} onClick={() => setAnnual(a => !a)}>
            <div className="toggle-knob"/>
          </div>
          <span className={"toggle-label" + (annual?' active':'')}>Annual</span>
          <span className={"toggle-badge" + (annual?' show':'')}>Save 20%</span>
        </div>

        {/* Retainer cards */}
        <div className="price-grid">
          {plans.map((p, i) => (
            <div key={i} className={"p-card reveal" + (p.hot?' hot':'')} style={i>0?{animationDelay:`${i*0.1}s`}:{}}>
              {p.hot && <div className="p-badge">Most Popular</div>}
              <div className="p-tier">{p.tier}</div>
              <div className="p-name">{p.name}</div>
              <p className="p-desc">{p.desc}</p>
              <div className="p-price-wrap">
                <div className="p-price">
                  <span className="p-curr">$</span>
                  <span className="p-num">{annual ? p.annual : p.monthly}</span>
                  <span className="p-mo">/mo</span>
                </div>
              </div>
              <div className="p-div"/>
              {p.sections.map((s, si) => (
                <div key={si}>
                  <div className="p-section-head">{s.head}</div>
                  <div className="p-feats">
                    {s.feats.map((f, fi) => (
                      <div key={fi} className="p-feat"><span className="p-ck">&#10003;</span><span dangerouslySetInnerHTML={{__html: f}}/></div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="p-div2"/>
              <button
                className={"p-btn " + p.btnClass}
                onClick={() => openModal(p.key, annual ? 'annual' : 'monthly', `$${annual ? p.annual : p.monthly}/mo`)}
                style={{width:'100%'}}
              >
                {`Subscribe — $${annual ? p.annual : p.monthly}/mo →`}
              </button>
            </div>
          ))}
        </div>

        <p className="reveal" style={{marginTop:'24px',textAlign:'center',fontFamily:"'JetBrains Mono',monospace",fontSize:'12px',color:'var(--p200)',letterSpacing:'.02em'}}>
          We take on a <strong style={{color:'var(--gold)'}}>limited number of retainer clients at a time</strong> so every system gets built right. Current availability shown when you apply.
        </p>

        {/* Included strip */}
        <div className="price-all reveal">
          <div className="price-all-head">&#10086; Included in every plan</div>
          <div className="price-all-grid">
            {included.map((item, i) => (
              <div key={i} className="price-all-item">
                <div className="ico">{item.icon}</div>
                <p><strong>{item.title}</strong>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Add-ons */}
        <div className="price-addons">
          <div className="price-addons-head">
            <div className="sec-tag reveal">Add-Ons</div>
            <div className="reveal" style={{display:'flex',alignItems:'flex-end',justifyContent:'space-between',flexWrap:'wrap',gap:'12px'}}>
              <h3 style={{fontFamily:"-apple-system,'SF Pro Display',BlinkMacSystemFont,sans-serif",fontSize:'32px',fontWeight:'800',letterSpacing:'-.5px',margin:0}}>
                Extend any plan.
              </h3>
              <div style={{display:'flex',alignItems:'center',gap:'10px',background:addonTotal>0?'rgba(107,33,232,.15)':'rgba(255,255,255,.04)',border:`1px solid ${addonTotal>0?'rgba(107,33,232,.45)':'rgba(255,255,255,.08)'}`,borderRadius:'100px',padding:'8px 18px',transition:'all .3s ease'}}>
                <span style={{fontSize:'11px',fontWeight:'600',color:'rgba(196,168,255,.5)',fontFamily:"'JetBrains Mono',monospace",letterSpacing:'.06em',textTransform:'uppercase'}}>Add-ons</span>
                <span style={{fontSize:'18px',fontWeight:'900',letterSpacing:'-.5px',color:addonTotal>0?'var(--gold)':'rgba(255,255,255,.25)',transition:'color .3s',fontFamily:"'Archivo',sans-serif"}}>
                  {addonTotal > 0 ? `+$${animatedTotal.toLocaleString()}/mo` : '$0'}
                </span>
                {addonTotal > 0 && (
                  <button onClick={() => setActiveAddons(new Set())} style={{fontSize:'10px',color:'rgba(196,168,255,.4)',background:'none',border:'none',cursor:'pointer',padding:'0',fontFamily:'inherit',transition:'color .2s'}}
                    onMouseEnter={e=>e.target.style.color='rgba(252,165,165,.8)'}
                    onMouseLeave={e=>e.target.style.color='rgba(196,168,255,.4)'}>
                    clear
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="addons-grid">
            {addons.map((a, i) => {
              const on = activeAddons.has(a.id)
              return (
                <div key={i} className={"addon-card reveal" + (i>0?` d${i}`:'')} onClick={() => toggleAddon(a.id)}
                  style={{cursor:'pointer',borderColor:on?'rgba(107,33,232,.6)':undefined,background:on?'rgba(107,33,232,.12)':undefined,boxShadow:on?'0 0 0 1px rgba(107,33,232,.3), 0 8px 32px rgba(107,33,232,.12)':undefined,transition:'all .22s ease',userSelect:'none'}}>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'12px'}}>
                    <span style={{fontSize:'20px',lineHeight:'1'}}>{a.icon}</span>
                    <div style={{width:'36px',height:'20px',borderRadius:'100px',background:on?'#6B21E8':'rgba(255,255,255,.08)',border:`1px solid ${on?'#8B5CF6':'rgba(255,255,255,.12)'}`,position:'relative',transition:'all .22s ease',flexShrink:0}}>
                      <div style={{position:'absolute',top:'2px',left:on?'17px':'2px',width:'14px',height:'14px',borderRadius:'50%',background:on?'#fff':'rgba(255,255,255,.35)',transition:'left .22s ease, background .22s ease',boxShadow:on?'0 1px 4px rgba(0,0,0,.3)':'none'}}/>
                    </div>
                  </div>
                  <div className="addon-price" style={{color:on?'var(--gold)':undefined,transition:'color .22s'}}>{a.label}<span>/mo</span></div>
                  <div className="addon-name">{a.name}</div>
                  <p className="addon-desc">{a.desc}</p>
                </div>
              )
            })}
          </div>

          {addonTotal > 0 && (
            <div style={{marginTop:'20px',display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:'12px',background:'rgba(107,33,232,.08)',border:'1px solid rgba(107,33,232,.2)',borderRadius:'12px',padding:'16px 22px'}}>
              <div>
                <div style={{fontSize:'13px',fontWeight:'700',color:'var(--white)',marginBottom:'2px'}}>
                  {activeAddons.size} add-on{activeAddons.size!==1?'s':''} selected &middot; <span style={{color:'var(--gold)'}}>+${animatedTotal.toLocaleString()}/mo</span>
                </div>
                <div style={{fontSize:'11px',color:'rgba(196,168,255,.45)'}}>Added to whichever plan you choose — mention them when you apply.</div>
              </div>
              <a href="#" className="p-btn p-btn-gold" onClick={e=>{e.preventDefault();onAudit()}} style={{width:'auto',padding:'12px 24px',whiteSpace:'nowrap'}}>
                Apply with add-ons &rarr;
              </a>
            </div>
          )}
        </div>

      </div>
    </section>
  )
}
