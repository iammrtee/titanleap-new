const services = [
  { n:'01', title:'Unique Market Positioning', desc:"We identify your distinct market angle and build a positioning strategy that makes buyers choose you over every competitor.", chips:['Competitor Analysis','ICP Definition','Messaging'], icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><line x1="12" y1="3" x2="12" y2="7"/><line x1="12" y1="17" x2="12" y2="21"/><line x1="3" y1="12" x2="7" y2="12"/><line x1="17" y1="12" x2="21" y2="12"/></svg> },
  { n:'02', title:'Done-For-You Execution', desc:"We don't hand you a strategy doc and walk away. We build, launch, and optimize everything — funnels, automations, ads, and content.", chips:['Funnel Build','Landing Pages','CRO'], icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> },
  { n:'03', title:'Content That Converts', desc:'Short-form video, email sequences, ad creative, and long-form content — all engineered to move buyers from aware to paying.', chips:['Short-form Video','Email Sequences','Ad Creative'], icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> },
  { n:'04', title:'High-Performance Sales', desc:'We build the systems, scripts, and pipelines that feed your sales team with qualified leads — not browsers wasting their time.', chips:['Lead Scoring','Sales Scripts','Pipeline'], icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { n:'05', title:'AI Marketing Automation', desc:'n8n workflows, AI lead scoring, automated follow-up, and intelligent CRM routing — your pipeline runs 24/7 without manual intervention.', chips:['n8n Workflows','AI Scoring','CRM Sync'], icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="6" height="6"/><path d="M9 9V5M15 9V5M9 15v4M15 15v4M5 9H9M5 15H9M15 9h4M15 15h4"/><rect x="2" y="2" width="20" height="20" rx="2"/></svg> },
]

export default function Services({ onAudit }) {
  return (
    <section className="sec services" id="services">
      <div className="wrap">
        <div className="svc-head-row">
          <div>
            <div className="sec-tag reveal">What We Build</div>
            <h2 className="svc-h2 reveal">Five systems.<br /><em>One machine.</em></h2>
          </div>
          <p className="svc-note reveal">Every engagement builds interconnected systems — not one-off tactics that stop working when we stop working.</p>
        </div>
        <div className="svc-grid">
          {services.map((s, i) => (
            <div key={i} className={`svc-card reveal${i > 0 ? ` d${(i % 3) + 1}` : ''}`}>
              <div className="svc-glow" />
              <div className="svc-n">{s.n}</div>
              <div className="svc-icon">{s.icon}</div>
              <div className="svc-title">{s.title}</div>
              <p className="svc-desc">{s.desc}</p>
              <div className="svc-chips">{s.chips.map(c => <span key={c} className="svc-chip">{c}</span>)}</div>
            </div>
          ))}
          <div className="svc-card reveal d3" style={{background:'linear-gradient(135deg,rgba(107,33,232,0.3),rgba(245,197,24,0.06))',display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',borderColor:'var(--goldtrim)'}}>
            <div>
              <div style={{fontSize:'32px',marginBottom:'14px',opacity:.7}}>✦</div>
              <div className="svc-title" style={{marginBottom:'10px'}}>Ready to start?</div>
              <p className="svc-desc" style={{marginBottom:'24px'}}>Get a free audit and see exactly which systems will move the needle for your business.</p>
              <a href="#" className="btn-primary" onClick={e=>{e.preventDefault();onAudit()}} style={{display:'inline-flex',fontSize:'11px',padding:'13px 28px'}}>Get Free Audit →</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
