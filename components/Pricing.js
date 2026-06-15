'use client'
import { useState } from 'react'

const plans = [
  {
    tier: 'Starter', name: 'Launch Accelerator', hot: false,
    desc: 'For pre-revenue or early-stage SaaS ready to build the foundation of a real growth system.',
    monthly: '2,999', annual: '2,399',
    sections: [
      { head: 'Strategy & Foundations', feats: ['Funnel audit + full strategy map','ICP definition & competitor research','Market positioning brief'] },
      { head: 'Funnel & Conversion', feats: ['Landing page build & CRO optimization','Email nurture sequence (5-part)','Lead capture & form setup'] },
      { head: 'Automation & Reporting', feats: ['Basic AI lead scoring','CRM integration (HubSpot / Notion)','Monthly performance report','1 strategy call/month'] },
    ],
    btnClass: 'p-btn-ghost',
  },
  {
    tier: 'Growth', name: 'Scaling System', hot: true,
    desc: 'For SaaS with traction that needs a full growth engine built, launched, and running month over month.',
    monthly: '6,999', annual: '5,599',
    sections: [
      { head: 'Everything in Launch Accelerator, plus:', feats: ['Full content system — video, email, SEO','Short-form video production (8/mo)','Long-form blog content (4/mo)'] },
      { head: 'Paid Ads Management', feats: ['Meta Ads setup, management & creative','Google Ads (Search + Display)','Ad creative refresh every 2 weeks','Full attribution dashboard'] },
      { head: 'AI Automation', feats: ['Advanced n8n lead automation','AI lead scoring & prioritization','Automated follow-up sequences','Bi-weekly strategy calls'] },
    ],
    btnClass: 'p-btn-gold',
  },
  {
    tier: 'Authority', name: 'Authority Domination', hot: false,
    desc: 'For established founders ready to build a category-defining brand and dominate their market entirely.',
    monthly: '9,999', annual: '7,999',
    sections: [
      { head: 'Everything in Scaling System, plus:', feats: ['Founder personal brand strategy & build','LinkedIn authority content (daily)','TikTok & YouTube Shorts system'] },
      { head: 'Enterprise Growth', feats: ['Dedicated senior growth strategist','Custom AI automation builds (unlimited)','PR & thought leadership outreach','Competitive intelligence reports'] },
      { head: 'Concierge Support', feats: ['Weekly strategy + performance calls','Slack direct access to your team','Priority 24h response guarantee'] },
    ],
    btnClass: 'p-btn-ghost',
  },
]

const included = [
  { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>, title: 'Free funnel audit', desc: 'No commitment. Just a clear picture of where your revenue is leaking.' },
  { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>, title: 'No lock-in contracts', desc: 'Monthly rolling — leave anytime. We earn your business every single month.' },
  { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>, title: 'Live performance dashboard', desc: 'Real-time view of every metric that matters — funnel, CAC, ROAS, leads.' },
  { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, title: '90-day results guarantee', desc: "If we don't move your growth metrics in 90 days, we work free until we do." },
]

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
        <div className="price-head">
          <div className="sec-tag reveal" style={{justifyContent:'center'}}>Pricing</div>
          <h2 className="price-h2 reveal">Pick your <em>growth tier.</em></h2>
          <p className="price-sub reveal">Every plan starts with a free funnel audit. No commitment, no contracts — cancel anytime.</p>
        </div>

        <div className="price-toggle reveal">
          <span className={`toggle-label${!annual?' active':''}`}>Monthly</span>
          <div className={`toggle-switch${annual?' on':''}`} onClick={() => setAnnual(a => !a)}>
            <div className="toggle-knob"/>
          </div>
          <span className={`toggle-label${annual?' active':''}`}>Annual</span>
          <span className={`toggle-badge${annual?' show':''}`}>Save 20%</span>
        </div>

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
