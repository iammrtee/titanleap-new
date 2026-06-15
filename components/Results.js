const cards = [
  { n:'01', title:'Audit-First', p:"Every engagement starts with data, not assumptions. We map your funnel, traffic, and conversion points before recommending a single fix.", source:'$297 Revenue Leak Audit · 5-hour delivery' },
  { n:'02', title:'AI-Powered From Day One', p:"Lead scoring, automated nurture sequences, and intelligent routing are built into every system — so your pipeline runs without manual babysitting.", source:'n8n + AI lead scoring · Built-in' },
  { n:'03', title:'Compound Systems', p:"Each month builds on the last. Funnels, content, and automation are designed to keep working long after the initial build is done.", source:'Scaling System · Month over month' },
  { n:'04', title:'Founder-Direct', p:"You work with the person building your system — not an account manager relaying messages between you and the people doing the actual work.", source:'Direct line · Every engagement' },
]

export default function Results() {
  return (
    <section className="sec results" id="results">
      <div className="wrap">
        <div className="r-head">
          <div className="sec-tag reveal">How We Work</div>
          <h2 className="r-h2 reveal">Built different,<br /><em>from day one.</em></h2>
        </div>
        <div className="r-grid">
          {cards.map((c, i) => (
            <div key={i} className={`r-card reveal${i>0?` d${i}`:''}`}>
              <div className="r-big">{c.n}</div>
              <div className="r-title">{c.title}</div>
              <p className="r-p">{c.p}</p>
              <div className="r-source">{c.source}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
