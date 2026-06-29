'use client'
import { useState, useEffect, useRef } from 'react'

// ── Entry steps (one-time, before any retainer) ─────────────────────────────
const entrySteps = [
  {
    n: '1',
    name: 'Revenue Leak Audit',
    price: '$297',
    period: 'one-time',
    desc: 'Your funnel, traffic, and conversion gaps — three ranked leaks with dollar-range impact, delivered in 5 hours. The average leak we find costs $4k–$11k/mo.',
    cta: 'Get the audit →',
  },
  {
    n: '2',
    name: 'Growth System Sprint',
    price: '$2,500',
    period: 'one-time',
    desc: 'Not ready for a retainer? We hand you a 90-day growth blueprint and build your core system — positioning, one launched funnel, automated follow-up. Yours to keep. Credits toward any plan.',
    cta: 'Book a sprint →',
  },
]

// ── Retainer plans (all original features preserved, prices updated) ─────────
const plans = [
  {
    tier: 'Starter', name: 'Launch Accelerator', hot: false,
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
    tier: 'Growth', name: 'Scaling System', hot: true,
    desc: 'For SaaS with traction that needs a full growth engine built, launched, and running month over month.',
    monthly: '3,500', annual: '2,800',
    sections: [
      { head: 'Everything in Launch Accelerator, plus:', feats: ['<b>4-person team on your account</b>', 'Full content calendar management'] },
      { head: 'Content Production', feats: ['<b>20 short-form videos/mo</b> <span style="font-size:10px;color:rgba(196,168,255,.4)">(4× Launch)</span>', '<b>40 branded designs/mo</b> <span style="font-size:10px;color:rgba(196,168,255,.4)">(includes ad creative)</span>', '4 long-form blog posts/mo', 'Email campaigns + broadcast management'] },
      { head: 'Paid Ads Management', feats: ['Meta + Google Ads, fully managed', 'Ad creative refresh every 2 weeks', 'Full attribution dashboard'] },
      { head: 'AI Automation', feats: ['Advanced n8n automation + attribution', 'AI lead scoring & prioritization', 'Automated follow-up sequences', 'Weekly strategy calls'] },
    ],
    btnClass: 'p-btn-gold',
  },
  {
    tier: 'Authority', name: 'Authority Domination', hot: false,
    desc: 'For established founders ready to build a category-defining brand and dominate their market entirely.',
    monthly: '6,999', annual: '5,599',
    sections: [
      { head: 'Everything in Scaling System, plus:', feats: ['<b>Full team assigned</b> — strategist, editor, brand manager + specialists'] },
      { head: 'Content Production', feats: ['<b>Up to 60 short-form videos/mo</b> <span style="font-size:10px;color:rgba(196,168,255,.4)">(3× Scaling)</span>', '<b>Up to 100 branded designs/mo</b> <span style="font-size:10px;color:rgba(196,168,255,.4)">(3× Scaling)</span>', '8 long-form blog posts/mo', 'LinkedIn daily content (30 posts/mo)', 'TikTok + YouTube Shorts system', 'Founder brand build — personal authority content'] },
      { head: 'Enterprise Growth', feats: ['Dedicated senior growth strategist', 'Custom AI automation builds (unlimited)', 'PR & thought leadership outreach', 'Competitive intelligence reports'] },
      { head: 'Concierge Support', feats: ['Weekly strategy + performance calls', 'Slack direct access + 24h priority'] },
    ],
    btnClass: 'p-btn-ghost',
  },
]

// ── Included in every plan ───────────────────────────────────────────────────
const included = [
  { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>, title: 'No lock-in contracts', desc: ' Monthly rolling — leave anytime. We earn your business every single month.' },
  { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>, title: 'Live performance dashboard', desc: ' Real-time view of every metric that matters — funnel, CAC, ROAS, leads.' },
  { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, title: '90-day results guarantee', desc: " If we don't move your growth metrics in 90 days, we work free until we do." },
  { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>, title: 'Founder-direct', desc: " You work with the team building your system — not an account manager relaying messages." },
]

// ── Add-ons ──────────────────────────────────────────────────────────────────
const addons = [
  { id:'ads',   price: 799, label: '$799', name: 'Extra Ad Channel',      icon: '⚡', desc: 'Add TikTok Ads, LinkedIn Ads, or YouTube Ads to any plan. Includes creative, targeting setup, and weekly optimization.' },
  { id:'seo',   price: 499, label: '$499', name: 'SEO Growth Engine',     icon: '📈', desc: '8 long-form SEO articles per month, keyword strategy, internal linking, and quarterly technical SEO audit. Built to rank.' },
  { id:'email', price: 599, label: '$599', name: 'Email Revenue System',  icon: '✉️', desc: 'Full email list management, broadcast campaigns, automated sequences, and monthly list hygiene. Done for you, every week.' },
]

// ── Animated counter hook ────────────────────────────────────────────────────
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

export default function Pricing({ onAudit }) {
  const [annual, setAnnual] = useState(false)
  const [activeAddons, setActiveAddons] = useState(new Set())

  const toggleAddon = id => setActiveAddons(prev => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

  const addonTotal = addons.filter(a => activeAddons.has(a.id)).reduce((s, a) => s + a.price, 0)
  const animatedTotal = useCountUp(addonTotal)

  return (
    <section className="sec pricing" id="pricing">
      <div className="wrap">

        {/* Head */}
        <div className="price-head">
          <div className="sec-tag reveal" style={{justifyContent:'center'}}>Pricing</div>
          <h2 className="price-h2 reveal">Find the leak. <em>Then fix it.</em></h2>
          <p className="price-sub reveal">Every founder starts in the same place — a $297 audit that shows exactly where revenue is leaking. From there you choose how far you want us to take it. No lock-in. No contracts.</p>
        </div>

        {/* ── Entry steps ── */}
        <div className="reveal" style={{marginBottom:'8px'}}>
          <div style={{
            fontFamily:"'JetBrains Mono',monospace", fontSize:'10px',
            letterSpacing:'.16em', textTransform:'uppercase',
            color:'rgba(196,168,255,.4)', marginBottom:'14px',
          }}>
            Every engagement starts here
          </div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px'}}>
            {entrySteps.map((s, i) => (
              <div key={i} className="p-card" style={{padding:'24px 26px'}}>
                <div style={{display:'flex', alignItems:'flex-start', gap:'16px'}}>
                  <div style={{
                    fontFamily:"'Archivo',sans-serif", fontWeight:'800',
                    fontSize:'26px', color:'var(--p300)', lineHeight:'1',
                    flexShrink:0, width:'32px',
                  }}>{s.n}</div>
                  <div style={{flex:1}}>
                    <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between', gap:'10px', flexWrap:'wrap', marginBottom:'8px'}}>
                      <div style={{fontFamily:"'Archivo',sans-serif", fontWeight:'700', fontSize:'16px', color:'var(--white)'}}>
                        {s.name}
                      </div>
                      <div style={{fontFamily:"'Archivo',sans-serif", fontWeight:'800', fontSize:'18px', color:'var(--white)', whiteSpace:'nowrap'}}>
                        {s.price} <span style={{fontSize:'11px', color:'var(--p200)', fontWeight:'600'}}>{s.period}</span>
                      </div>
                    </div>
                    <p style={{fontSize:'13px', color:'var(--p200)', lineHeight:'1.55', marginBottom:'14px'}}>{s.desc}</p>
                    <a
                      href="#"
                      onClick={e => { e.preventDefault(); onAudit() }}
                      style={{
                        fontSize:'12px', fontWeight:'700', color:'var(--white)',
                        textDecoration:'none', borderBottom:'1px solid rgba(255,255,255,.2)',
                        paddingBottom:'2px', transition:'border-color .18s',
                        fontFamily:"'Archivo',sans-serif",
                      }}
                    >
                      {s.cta}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="reveal" style={{
          margin:'28px 0 20px',
          fontFamily:"'JetBrains Mono',monospace", fontSize:'10px',
          letterSpacing:'.16em', textTransform:'uppercase',
          color:'rgba(196,168,255,.35)',
          display:'flex', alignItems:'center', gap:'16px',
        }}>
          <div style={{flex:1, height:'1px', background:'rgba(107,33,232,.18)'}}/>
          <span>Then pick how far we take it</span>
          <div style={{flex:1, height:'1px', background:'rgba(107,33,232,.18)'}}/>
        </div>

        {/* Annual toggle */}
        <div className="price-toggle reveal">
          <span className={`toggle-label${!annual?' active':''}`}>Monthly</span>
          <div className={`toggle-switch${annual?' on':''}`} onClick={() => setAnnual(a => !a)}>
            <div className="toggle-knob"/>
          </div>
          <span className={`toggle-label${annual?' active':''}`}>Annual</span>
          <span className={`toggle-badge${annual?' show':''}`}>Save 20%</span>
        </div>

        {/* Retainer cards */}
        <div className="price-grid">
          {plans.map((p, i) => (
            <div key={i} className={`p-card reveal${p.hot?' hot':''}`} style={i>0?{animationDelay:`${i*0.1}s`}:{}}>
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
                      <div key={fi} className="p-feat"><span className="p-ck">✓</span><span dangerouslySetInnerHTML={{__html: f}}/></div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="p-div2"/>
              <a href="#" className={`p-btn ${p.btnClass}`} onClick={e=>{e.preventDefault();onAudit()}}>Start with Free Audit →</a>
            </div>
          ))}
        </div>

        {/* Capacity note */}
        <p className="reveal" style={{
          marginTop:'24px', textAlign:'center',
          fontFamily:"'JetBrains Mono',monospace", fontSize:'12px',
          color:'var(--p200)', letterSpacing:'.02em',
        }}>
          We take on a <strong style={{color:'var(--gold)'}}>limited number of retainer clients at a time</strong> so every system gets built right. Current availability shown when you apply.
        </p>

        {/* Included strip */}
        <div className="price-all reveal">
          <div className="price-all-head">✦ Included in every plan</div>
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
            <div className="reveal" style={{display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:'12px'}}>
              <h3 style={{fontFamily:"-apple-system,'SF Pro Display',BlinkMacSystemFont,sans-serif",fontSize:'32px',fontWeight:'800',letterSpacing:'-.5px',margin:0}}>
                Extend any plan.
              </h3>
              {/* Live total pill */}
              <div style={{
                display:'flex', alignItems:'center', gap:'10px',
                background: addonTotal > 0 ? 'rgba(107,33,232,.15)' : 'rgba(255,255,255,.04)',
                border: `1px solid ${addonTotal > 0 ? 'rgba(107,33,232,.45)' : 'rgba(255,255,255,.08)'}`,
                borderRadius:'100px', padding:'8px 18px',
                transition:'all .3s ease',
              }}>
                <span style={{fontSize:'11px', fontWeight:'600', color:'rgba(196,168,255,.5)', fontFamily:"'JetBrains Mono',monospace", letterSpacing:'.06em', textTransform:'uppercase'}}>
                  Add-ons
                </span>
                <span style={{
                  fontSize:'18px', fontWeight:'900', letterSpacing:'-.5px',
                  color: addonTotal > 0 ? 'var(--gold)' : 'rgba(255,255,255,.25)',
                  transition:'color .3s',
                  fontFamily:"'Archivo',sans-serif",
                }}>
                  {addonTotal > 0 ? `+$${animatedTotal.toLocaleString()}/mo` : '$0'}
                </span>
                {addonTotal > 0 && (
                  <button
                    onClick={() => setActiveAddons(new Set())}
                    style={{
                      fontSize:'10px', color:'rgba(196,168,255,.4)',
                      background:'none', border:'none', cursor:'pointer',
                      padding:'0', fontFamily:'inherit', transition:'color .2s',
                    }}
                    onMouseEnter={e=>e.target.style.color='rgba(252,165,165,.8)'}
                    onMouseLeave={e=>e.target.style.color='rgba(196,168,255,.4)'}
                  >
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
                <div
                  key={i}
                  className={`addon-card reveal${i>0?` d${i}`:''}`}
                  onClick={() => toggleAddon(a.id)}
                  style={{
                    cursor:'pointer',
                    borderColor: on ? 'rgba(107,33,232,.6)' : undefined,
                    background: on ? 'rgba(107,33,232,.12)' : undefined,
                    boxShadow: on ? '0 0 0 1px rgba(107,33,232,.3), 0 8px 32px rgba(107,33,232,.12)' : undefined,
                    transition:'all .22s ease',
                    userSelect:'none',
                  }}
                >
                  {/* Toggle switch */}
                  <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'12px'}}>
                    <span style={{fontSize:'20px', lineHeight:'1'}}>{a.icon}</span>
                    <div
                      style={{
                        width:'36px', height:'20px', borderRadius:'100px',
                        background: on ? '#6B21E8' : 'rgba(255,255,255,.08)',
                        border: `1px solid ${on ? '#8B5CF6' : 'rgba(255,255,255,.12)'}`,
                        position:'relative', transition:'all .22s ease', flexShrink:0,
                      }}
                    >
                      <div style={{
                        position:'absolute', top:'2px',
                        left: on ? '17px' : '2px',
                        width:'14px', height:'14px', borderRadius:'50%',
                        background: on ? '#fff' : 'rgba(255,255,255,.35)',
                        transition:'left .22s ease, background .22s ease',
                        boxShadow: on ? '0 1px 4px rgba(0,0,0,.3)' : 'none',
                      }}/>
                    </div>
                  </div>

                  <div className="addon-price" style={{color: on ? 'var(--gold)' : undefined, transition:'color .22s'}}>
                    {a.label}<span>/mo</span>
                  </div>
                  <div className="addon-name">{a.name}</div>
                  <p className="addon-desc">{a.desc}</p>
                </div>
              )
            })}
          </div>

          {/* CTA row when addons selected */}
          {addonTotal > 0 && (
            <div style={{
              marginTop:'20px', display:'flex', alignItems:'center',
              justifyContent:'space-between', flexWrap:'wrap', gap:'12px',
              background:'rgba(107,33,232,.08)', border:'1px solid rgba(107,33,232,.2)',
              borderRadius:'12px', padding:'16px 22px',
              animation:'fadeIn .25s ease',
            }}>
              <div>
                <div style={{fontSize:'13px', fontWeight:'700', color:'var(--white)', marginBottom:'2px'}}>
                  {activeAddons.size} add-on{activeAddons.size !== 1 ? 's' : ''} selected · <span style={{color:'var(--gold)'}}>+${animatedTotal.toLocaleString()}/mo</span>
                </div>
                <div style={{fontSize:'11px', color:'rgba(196,168,255,.45)'}}>Added to whichever plan you choose — mention them when you apply.</div>
              </div>
              <a
                href="#"
                className="p-btn p-btn-gold"
                onClick={e=>{e.preventDefault();onAudit()}}
                style={{width:'auto', padding:'12px 24px', whiteSpace:'nowrap'}}
              >
                Apply with add-ons →
              </a>
            </div>
          )}
        </div>

        <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}`}</style>

      </div>
    </section>
  )
}
