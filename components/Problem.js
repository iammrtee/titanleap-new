const cards = [
  { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>, title: 'Traffic with no conversion', desc: "You're getting clicks but your funnel leaks leads before they ever become customers." },
  { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, title: 'Manual follow-up killing time', desc: 'Leads go cold while you\'re busy building. You need automation that works while you sleep.' },
  { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>, title: 'Ads without a growth strategy', desc: 'Spending on Meta or Google with no attribution, no funnel, and no idea what\'s actually working.' },
  { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>, title: 'No market positioning', desc: 'Looking like every other SaaS. No distinct angle that makes buyers choose you over competitors.' },
]

export default function Problem() {
  return (
    <section className="sec problem" id="problem">
      <div className="wrap">
        <div className="prob-grid">
          <div>
            <div className="sec-tag reveal">The Problem</div>
            <h2 className="prob-head reveal">You're running a SaaS.<br />Not a <em>marketing agency.</em></h2>
            <p className="prob-body reveal">Whether you're pre-launch or already have users, most SaaS founders end up doing marketing instead of building. You're guessing at positioning, patching together tools, and hoping content "just works." Meanwhile your funnel — if you have one — is leaking leads you'll never get back.</p>
          </div>
          <div className="prob-cards">
            {cards.map((c, i) => (
              <div key={i} className={`prob-card reveal${i > 0 ? ` d${i}` : ''}`}>
                <div className="prob-icon">{c.icon}</div>
                <div className="prob-content"><strong>{c.title}</strong><p>{c.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
