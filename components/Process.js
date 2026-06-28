const steps = [
  { n:'1', title:'Free Revenue Leak Audit', desc:"We dig into your funnel, traffic, and conversion points and hand back a clear report — what's broken, what to fix first, and what to do about it." },
  { n:'2', title:'Strategy Sprint', desc:'We map your full growth system and identify the highest-leverage opportunities first.' },
  { n:'3', title:'Build & Launch', desc:'We build funnels, content, automations, and ads — all tested before going live.' },
  { n:'4', title:'Automate Leads', desc:"AI-powered lead flow keeps your pipeline running 24/7 without manual effort." },
  { n:'5', title:'Scale What Works', desc:"Double down on what drives revenue. Cut what doesn't. Every single month." },
]

export default function Process() {
  return (
    <section className="sec process" id="process">
      <div className="wrap">
        <div className="proc-head">
          <div className="sec-tag reveal" style={{justifyContent:'center'}}>The Process</div>
          <h2 className="proc-h2 reveal">From audit to <em>revenue</em><br />in 90 days.</h2>
          <p className="proc-sub reveal">A proven 5-step system — no fluff, no delays.</p>
        </div>
        <div className="proc-line">
          {steps.map((s, i) => (
            <div key={i} className={`proc-step reveal${i > 0 ? ` d${i}` : ''}`}>
              <div className="proc-num"><span>{s.n}</span></div>
              <div className="proc-title">{s.title}</div>
              <div className="proc-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
