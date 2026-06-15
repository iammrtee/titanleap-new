export default function TheSystem({ onAudit }) {
  return (
    <section className="sec system" id="system">
      <div className="wrap">
        <div className="system-inner">

          {/* LEFT: copy */}
          <div className="system-left reveal">
            <div className="system-tag">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.2"/><circle cx="5" cy="5" r="1.5" fill="currentColor"/></svg>
              Built In-House
            </div>
            <h2 className="system-h2">The system behind<br /><em>every result.</em></h2>
            <p className="system-sub">While other agencies juggle spreadsheets and Slack threads, we run on Monolith — our proprietary growth OS that tracks every campaign, client, and conversion in one place.</p>

            <div className="system-features">
              <div className="system-feat">
                <div className="system-feat-icon">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1" y="10" width="3" height="6" rx="1" fill="currentColor" opacity=".4"/><rect x="6" y="6" width="3" height="10" rx="1" fill="currentColor" opacity=".7"/><rect x="11" y="3" width="3" height="13" rx="1" fill="currentColor"/><path d="M1 8.5 L4.5 5.5 L9 7 L17 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity=".6"/><circle cx="17" cy="2" r="1.2" fill="currentColor" opacity=".8"/></svg>
                </div>
                <div className="system-feat-body">
                  <div className="system-feat-title">Live Revenue Dashboard</div>
                  <div className="system-feat-desc">Real-time revenue tracking, ROAS monitoring, and pipeline visibility across every client account.</div>
                </div>
              </div>
              <div className="system-feat">
                <div className="system-feat-icon">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="2" fill="currentColor"/><circle cx="3" cy="5" r="1.5" fill="currentColor" opacity=".6"/><circle cx="15" cy="5" r="1.5" fill="currentColor" opacity=".6"/><circle cx="3" cy="13" r="1.5" fill="currentColor" opacity=".6"/><circle cx="15" cy="13" r="1.5" fill="currentColor" opacity=".6"/><line x1="4.2" y1="5.8" x2="7.2" y2="8" stroke="currentColor" strokeWidth="1.1" opacity=".5"/><line x1="13.8" y1="5.8" x2="10.8" y2="8" stroke="currentColor" strokeWidth="1.1" opacity=".5"/><line x1="4.2" y1="12.2" x2="7.2" y2="10" stroke="currentColor" strokeWidth="1.1" opacity=".5"/><line x1="13.8" y1="12.2" x2="10.8" y2="10" stroke="currentColor" strokeWidth="1.1" opacity=".5"/></svg>
                </div>
                <div className="system-feat-body">
                  <div className="system-feat-title">AI Automation Engine</div>
                  <div className="system-feat-desc">Automated lead scoring, email sequences, and campaign adjustments — running 24/7 without human intervention.</div>
                </div>
              </div>
              <div className="system-feat">
                <div className="system-feat-icon">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 3h14l-5.5 6v5.5l-3-1.5V9L2 3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" fill="currentColor" fillOpacity=".15"/><path d="M2 3h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" opacity=".9"/></svg>
                </div>
                <div className="system-feat-body">
                  <div className="system-feat-title">Funnel Intelligence</div>
                  <div className="system-feat-desc">End-to-end funnel tracking from first touch to closed deal. Every leak is visible, every fix is measurable.</div>
                </div>
              </div>
              <div className="system-feat">
                <div className="system-feat-icon">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.3" opacity=".5"/><circle cx="9" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.3" opacity=".75"/><circle cx="9" cy="9" r="1.2" fill="currentColor"/><line x1="9" y1="1" x2="9" y2="3.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity=".6"/><line x1="9" y1="14.2" x2="9" y2="17" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity=".6"/><line x1="1" y1="9" x2="3.8" y2="9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity=".6"/><line x1="14.2" y1="9" x2="17" y2="9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity=".6"/></svg>
                </div>
                <div className="system-feat-body">
                  <div className="system-feat-title">Campaign Command Center</div>
                  <div className="system-feat-desc">All paid channels in one view. Budgets, creatives, A/B results, and performance trends — no tab-switching required.</div>
                </div>
              </div>
            </div>

            <div className="system-cta-row">
              <a href="#" className="btn-gold" onClick={e=>{e.preventDefault();onAudit()}}>Get Your Free Audit</a>
              <a href="#pricing" className="system-link">
                See what's included
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
            </div>
          </div>

          {/* RIGHT: dashboard mockup */}
          <div className="system-right reveal">
            <div className="dash-mockup">
              <div className="dm-chrome">
                <div className="dm-dots"><div className="dm-dot"/><div className="dm-dot"/><div className="dm-dot"/></div>
                <div className="dm-addr">monolith.titanleap.co/dashboard</div>
              </div>
              <div className="dm-body">
                <div className="dm-sidebar">
                  <div className="dm-sb-brand">
                    <div className="dm-sb-logo-icon">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1L10 4V8L6 11L2 8V4L6 1Z" fill="white" fillOpacity=".9"/></svg>
                    </div>
                    <div className="dm-sb-brand-text">
                      <div className="dm-sb-brand-name">TitanLeap</div>
                      <div className="dm-sb-brand-sub">Growth System</div>
                    </div>
                  </div>
                  <div className="dm-nav">
                    <div className="dm-nav-item active">
                      <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><rect x=".5" y=".5" width="3.5" height="3.5" rx=".8" fill="#c4b5fd"/><rect x="5" y=".5" width="3.5" height="3.5" rx=".8" fill="#c4b5fd" opacity=".5"/><rect x=".5" y="5" width="3.5" height="3.5" rx=".8" fill="#c4b5fd" opacity=".5"/><rect x="5" y="5" width="3.5" height="3.5" rx=".8" fill="#c4b5fd" opacity=".5"/></svg>
                      Dashboard
                    </div>
                    {['Audit','Strategy','Creatives','Funnels'].map(item => (
                      <div key={item} className="dm-nav-item">{item}</div>
                    ))}
                    <div className="dm-nav-sep"/>
                    {['AI Automation','Emails'].map(item => (
                      <div key={item} className="dm-nav-item">{item}</div>
                    ))}
                  </div>
                  <div className="dm-sb-bottom">
                    <div className="dm-upgrade">⚡ Upgrade Plan</div>
                  </div>
                </div>
                <div className="dm-main-wrap">
                  <div className="dm-topbar">
                    <div className="dm-topbar-titles">
                      <div className="dm-topbar-title">Monolith Dash</div>
                      <div className="dm-topbar-sub">Dashboard Overview</div>
                    </div>
                    <div className="dm-topbar-search">
                      <svg width="7" height="7" viewBox="0 0 7 7" fill="none"><circle cx="3" cy="3" r="2" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/><line x1="4.5" y1="4.5" x2="6.5" y2="6.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeLinecap="round"/></svg>
                      Search…
                    </div>
                    <div className="dm-topbar-icons">
                      <div className="dm-topbar-icon">
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M4 1C2.3 1 1 2.3 1 4v2l-.5.5h7L7 6V4C7 2.3 5.7 1 4 1z" stroke="rgba(255,255,255,0.4)" strokeWidth=".9"/><path d="M3 6.5c0 .55.45 1 1 1s1-.45 1-1" stroke="rgba(255,255,255,0.4)" strokeWidth=".9"/></svg>
                      </div>
                      <div className="dm-avatar"/>
                    </div>
                  </div>
                  <div className="dm-main">
                    <div className="dm-page-head">
                      <div>
                        <div className="dm-page-title">Overview</div>
                        <div className="dm-page-sub">Real-time performance metrics</div>
                      </div>
                      <div className="dm-head-btns">
                        <div className="dm-btn-outline">Export</div>
                        <div className="dm-btn-purple">+ New Campaign</div>
                      </div>
                    </div>
                    <div className="dm-stats">
                      <div className="dm-stat"><div className="dm-stat-label">Total Revenue</div><div className="dm-stat-val">$84k</div><div className="dm-stat-badge">↗ +12.4%</div></div>
                      <div className="dm-stat"><div className="dm-stat-label">Active Clients</div><div className="dm-stat-val">1,284</div><div className="dm-stat-badge dm-stat-green">+42 this week</div></div>
                      <div className="dm-stat"><div className="dm-stat-label">Leads Generated</div><div className="dm-stat-val">3,847</div><div className="dm-stat-badge dm-stat-green">↗ +8.1%</div></div>
                    </div>
                    <div className="dm-chart-wrap">
                      <div className="dm-chart-top">
                        <div className="dm-chart-label">Total Revenue</div>
                        <div className="dm-chart-tabs">
                          <div className="dm-chart-tab">7D</div>
                          <div className="dm-chart-tab active">30D</div>
                          <div className="dm-chart-tab">1YR</div>
                        </div>
                      </div>
                      <div className="dm-bars">
                        {[32,42,38,55,50,60,70,65,80,72,75,92,85,100].map((h,i) => (
                          <div key={i} className={`dm-bar${h>=90?' gold':h>=70?' hi':''}`} style={{height:`${h}%`}}/>
                        ))}
                      </div>
                    </div>
                    <div className="dm-camp-row">
                      <div className="dm-camp">
                        <div className="dm-camp-title">Q4 Retail Expansion</div>
                        <div className="dm-pill-row"><div className="dm-pill green">Active</div><div className="dm-pill gold">4.8% Conv.</div></div>
                      </div>
                      <div className="dm-camp">
                        <div className="dm-camp-title">Brand Affinity Survey</div>
                        <div className="dm-pill-row"><div className="dm-pill purple">Stable</div><div className="dm-pill gold">32% Conv.</div></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
