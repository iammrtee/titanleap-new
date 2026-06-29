'use client'
import { useState } from 'react'

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
      { head: 'Funnel & Conversion', feats: ['Short-form video (5/mo)', 'Landing page build & CRO optimization', 'Email nurture sequence (5-part)', 'Lead capture & form setup'] },
      { head: 'Automation & Reporting', feats: ['Basic AI lead scoring + CRM sync', 'CRM integration (HubSpot / Notion)', 'Monthly report + strategy call'] },
    ],
    btnClass: 'p-btn-ghost',
  },
  {
    tier: 'Growth', name: 'Scaling System', hot: true,
    desc: 'For SaaS with traction that needs a full growth engine built, launched, and running month over month.',
    monthly: '3,500', annual: '2,800',
    sections: [
      { head: 'Everything in Launch Accelerator, plus:', feats: ['<b>4-person team on your account</b>', 'Full content system — video, email, SEO', 'Short-form video (12+/mo) + blog (4/mo)'] },
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
      { head: 'Everything in Scaling System, plus:', feats: ['<b>Full team assigned</b> — strategist, editor, brand manager + specialists', 'Founder brand build (LinkedIn daily)', 'TikTok + YouTube Shorts system'] },
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
  { price: '$799', name: 'Extra Ad Channel', desc: 'Add TikTok Ads, LinkedIn Ads, or YouTube Ads management to any plan. Includes creative, targeting setup, and weekly optimization.' },
  { price: '$499', name: 'SEO Growth Engine', desc: '8 long-form SEO articles per month, keyword strategy, internal linking, and quarterly technical SEO audit. Built to rank.' },
  { price: '$599', name: 'Email Revenue System', desc: 'Full email list management, broadcast campaigns, automated sequences, and monthly list hygiene. Done for you, every week.' },
]

export default function Pricing({ onAudit }) {
  const [annual, setAnnual] = useState(false)

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
            <h3 className="reveal" style={{fontFamily:"-apple-system,'SF Pro Display',BlinkMacSystemFont,sans-serif",fontSize:'32px',fontWeight:'800',letterSpacing:'-.5px'}}>Power up any plan.</h3>
          </div>
          <div className="addons-grid">
            {addons.map((a, i) => (
              <div key={i} className={`addon-card reveal${i>0?` d${i}`:''}`}>
                <div className="addon-price">{a.price}<span>/mo</span></div>
                <div className="addon-name">{a.name}</div>
                <p className="addon-desc">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
