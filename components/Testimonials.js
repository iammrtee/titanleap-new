export default function Testimonials() {
  return (
    <section className="sec testimonials" id="testimonials">
      <div className="wrap">
        <div className="test-head">
          <div className="sec-tag reveal" style={{justifyContent:'center'}}>Why TitanLeap Exists</div>
          <h2 className="test-h2 reveal">Built from the<br /><em>other side of the table.</em></h2>
        </div>
        <div className="test-grid">
          <div className="test-card reveal" style={{gridColumn:'1 / -1'}}>
            <div className="test-quote">&ldquo;</div>
            <p className="test-body" style={{fontSize:'16px',maxWidth:'780px'}}>
              I've spent years on the agency and freelance side of growth — building funnels, editing video, running ad accounts for founders who were drowning in marketing tasks they never wanted to do in the first place. The pattern was always the same: scattered tools, disconnected freelancers, campaigns that stopped working the moment nobody was watching them. TitanLeap is the system I wish those founders had — an audit-first, done-for-you growth partner that builds things to compound, not to expire. No bloated retainers before you've seen value. Just a clear-eyed look at what's broken, and a team that actually fixes it.
            </p>
            <div className="test-author">
              <div className="test-avatar">T</div>
              <div><div className="test-name">Triumph</div><div className="test-role">Founder, TitanLeap</div></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
