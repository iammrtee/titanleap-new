export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="ft-grid">
          <div>
            <div className="ft-brand" style={{display:'flex',alignItems:'center',gap:'12px'}}>
              <span style={{fontSize:'22px',fontWeight:'800'}}>Titan<em style={{fontStyle:'normal',color:'var(--gold)'}}>Leap</em></span>
            </div>
            <p className="ft-about" style={{marginTop:'16px'}}>Done-for-you growth systems for early-stage SaaS founders. We build the machine — you run the business. Lagos, Nigeria · Working with founders globally.</p>
          </div>
          <div className="ft-col">
            <div className="ft-col-head">Services</div>
            <ul>
              <li><a href="#services">Market Positioning</a></li>
              <li><a href="#services">Content Systems</a></li>
              <li><a href="#services">AI Automation</a></li>
              <li><a href="#services">Paid Acquisition</a></li>
            </ul>
          </div>
          <div className="ft-col">
            <div className="ft-col-head">Company</div>
            <ul>
              <li><a href="#">About</a></li>
              <li><a href="#results">Results</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#guarantees">Guarantees</a></li>
            </ul>
          </div>
          <div className="ft-col">
            <div className="ft-col-head">Connect</div>
            <ul>
              <li><a href="#">Twitter / X</a></li>
              <li><a href="mailto:hello@titanleap.co">hello@titanleap.co</a></li>
            </ul>
          </div>
        </div>
        <div className="ft-bottom">
          <span className="ft-copy">© 2026 TitanLeap · titanleap.co · All rights reserved.</span>
          <span className="ft-copy">Built for founders, by a founder · Lagos, Nigeria</span>
        </div>
      </div>
    </footer>
  )
}
