export const metadata = {
  title: 'Privacy Policy — TitanLeap',
  description: 'How TitanLeap collects, uses, and protects your information across titanleap.co, our audit intake, payments, and AI-powered audits.',
}

export default function PolicyPage() {
  return (
    <div className="policy-page">
      <div className="policy-topbar">
        <a href="/" className="policy-logo">Titan<em>Leap</em></a>
        <a href="/" className="policy-back">← Back to site</a>
      </div>

      <div className="policy-wrap">
        <div className="policy-pill">Legal</div>
        <h1>Privacy Policy</h1>
        <div className="policy-updated">Last updated: September 21, 2026 — Effective for all users of titanleap.co</div>

        <div className="policy-lead">
          TitanLeap (&ldquo;TitanLeap,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; &ldquo;our&rdquo;) is a growth agency operated from Lagos, Nigeria, serving clients globally. This policy explains what information we collect when you visit our website, request a Revenue Leak Audit, purchase a service, or become a client — and what we do, and don&apos;t do, with it. We&apos;ve tried to write this in plain English rather than legal filler.
        </div>

        <h2><span className="num">01</span>Who we are</h2>
        <p>TitanLeap is a done-for-you growth agency. We audit businesses&apos; marketing and sales funnels, produce strategy blueprints, and — for retainer clients — run ongoing content, funnel, and sales-pipeline work using our internal software, &ldquo;Growth OS,&rdquo; and select third-party tools listed below.</p>
        <p>We are based in Lagos, Nigeria. We serve clients primarily in the United States, United Kingdom, Canada, and other English-speaking markets, so this policy is written to be consistent with the general principles of the GDPR (EU/UK), CCPA (California), and Nigeria&apos;s own Data Protection Act (NDPA) — even in jurisdictions where none of these strictly apply to us.</p>

        <h2><span className="num">02</span>Information we collect</h2>

        <h3>a) When you visit titanleap.co</h3>
        <ul>
          <li>Standard technical data: IP address, browser type, device type, pages viewed, referring site, and time on page — collected automatically through basic site analytics.</li>
          <li>We do not use invasive tracking or sell this data to third parties. We do not currently run retargeting pixels (Facebook Pixel, Google Ads tag) — if that changes, this policy will be updated and the change will be dated above.</li>
        </ul>

        <h3>b) When you request a Revenue Leak Audit or fill out our intake form</h3>
        <p>Our intake form asks for information about your business so we can produce an audit. This includes:</p>
        <ul>
          <li><strong>Contact details:</strong> name, email address, and your business/website URL.</li>
          <li><strong>Business information:</strong> your product or offer, revenue stage, current funnel, what marketing you&apos;ve tried, and what you believe is holding growth back — all provided voluntarily by you.</li>
          <li><strong>Your 90-day goal</strong>, if you choose to share one.</li>
        </ul>
        <p>This information is submitted directly to us at <strong>hello@titanleap.co</strong> and is used solely to prepare your audit and 90-day blueprint. We do not require you to create an account or set a password to submit an intake form.</p>

        <h3>c) When you pay for a service</h3>
        <p>Payments are processed through third-party payment processors (including Gumroad and Stripe). We do not receive or store your full card number, CVV, or banking details — the processor handles that under its own privacy policy. We receive only your name, email address, purchase amount, and transaction status, so we know who to deliver the service to.</p>

        <h3>d) When you become a retainer client</h3>
        <p>If you move from a one-time audit to an ongoing engagement, we may collect additional operational information necessary to do the work — for example, access credentials to ad accounts, CRM exports, or analytics dashboards you choose to share with us. This is governed by whatever service agreement we sign with you separately, and is used strictly to deliver the agreed work.</p>

        <h3>e) Email communication</h3>
        <p>If you email us or we email you (from <strong>hello@titanleap.co</strong>, run through Google Workspace), that correspondence is stored in our inbox like any normal business email account, and is subject to Google&apos;s own security and privacy practices for Workspace.</p>
        <p>If we reach out to you as a prospective client via cold email, the information we hold on you at that point is limited to what&apos;s publicly available about your business (name, title, company, public email, company website) — sourced from public business directories and lead databases. You can ask to be removed from this list at any time by replying &ldquo;unsubscribe&rdquo; or emailing us directly, and we will honor that immediately.</p>

        <h2><span className="num">03</span>How your business data is used in an audit — including AI processing</h2>
        <p>This is the part most people ask about, so we&apos;re being specific.</p>
        <p>When you submit an audit request, the business information you provide (your website, funnel description, offer, and answers to our intake questions) is processed using AI language models — including Anthropic&apos;s Claude and Google&apos;s Gemini — as part of how our Growth OS software generates the analysis, strategy angles, and draft content inside your audit and 90-day blueprint.</p>
        <div className="policy-callout">
          <p><strong>What this means in practice:</strong> the text you submit, and publicly available information about your website, is sent to these AI providers&apos; APIs to generate analysis. It is not used by Anthropic or Google to train their models on our usage tier, and it is not shared with any other client or third party. A human at TitanLeap reviews and edits every audit before it is delivered to you — nothing goes out unread.</p>
        </div>
        <p>We do not sell, license, or share your business information, strategy, or audit contents with any other business, including competitors in your industry.</p>

        <h2><span className="num">04</span>Where your data is stored</h2>
        <div className="policy-table-wrap">
          <table>
            <thead>
              <tr><th>Data type</th><th>Stored via</th><th>Location</th></tr>
            </thead>
            <tbody>
              <tr><td>Intake form submissions</td><td>Emailed directly to hello@titanleap.co</td><td>Google Workspace</td></tr>
              <tr><td>Payment &amp; purchase records</td><td>Gumroad / Stripe</td><td>Processor&apos;s own infrastructure (US)</td></tr>
              <tr><td>Email correspondence</td><td>Google Workspace</td><td>Google&apos;s global infrastructure</td></tr>
              <tr><td>Lead/prospect data (cold outreach)</td><td>Google Sheets, automation workflows</td><td>Google infrastructure</td></tr>
              <tr><td>Growth OS platform data (retainer clients)</td><td>Supabase (PostgreSQL)</td><td>Supabase-managed cloud infrastructure</td></tr>
              <tr><td>Website hosting</td><td>Vercel</td><td>Vercel&apos;s global edge network</td></tr>
            </tbody>
          </table>
        </div>
        <p>We use established, reputable providers for every part of this stack rather than self-hosting sensitive data — the trade-off is that your data is also subject to those providers&apos; own security and privacy practices.</p>

        <h2><span className="num">05</span>What we don&apos;t do</h2>
        <ul>
          <li>We don&apos;t sell your personal or business data to third parties, brokers, or advertisers.</li>
          <li>We don&apos;t share one client&apos;s business data, strategy, or audit findings with another client or competitor.</li>
          <li>We don&apos;t use your submitted business information for anything beyond delivering the service you requested (audit, blueprint, or retainer work) unless you separately agree — for example, if you agree to let us use your results as an anonymized case study, we&apos;ll ask first, explicitly.</li>
        </ul>

        <h2><span className="num">06</span>Your rights</h2>
        <p>Regardless of where you&apos;re located, you can ask us at any time to:</p>
        <ul>
          <li><strong>Access</strong> the information we hold about you.</li>
          <li><strong>Correct</strong> inaccurate information.</li>
          <li><strong>Delete</strong> your information, including your audit, intake submission, and any lead-database record we hold on you — we&apos;ll confirm once it&apos;s done.</li>
          <li><strong>Opt out</strong> of any further email communication, including cold outreach, at any time.</li>
          <li><strong>Export</strong> a copy of the data you&apos;ve given us, where feasible.</li>
        </ul>
        <p>To exercise any of these, email <strong>hello@titanleap.co</strong> with the subject line &ldquo;Privacy Request.&rdquo; We will respond within 14 days.</p>

        <h2><span className="num">07</span>Cookies</h2>
        <p>titanleap.co uses only essential cookies required for the site to function. We do not currently use third-party advertising or tracking cookies. If that changes, we will update this section and add a cookie consent notice.</p>

        <h2><span className="num">08</span>Data retention</h2>
        <ul>
          <li><strong>Audit and intake submissions:</strong> retained for as long as needed to deliver your audit and respond to related questions, and for up to 24 months afterward for our own records — unless you request earlier deletion.</li>
          <li><strong>Retainer client data:</strong> retained for the duration of the engagement plus a reasonable wind-down period, per your service agreement.</li>
          <li><strong>Cold outreach lead data:</strong> retained until you opt out, reply, or the lead record is removed during routine list cleanup.</li>
          <li><strong>Payment records:</strong> retained by our payment processor per their own retention policy and applicable tax/accounting law.</li>
        </ul>

        <h2><span className="num">09</span>International data transfers</h2>
        <p>Because we operate from Nigeria and use US/EU-based service providers (Google, Gumroad, Stripe, Supabase, Anthropic, Vercel), your information will typically be processed outside your home country. Each provider we use maintains its own security certifications and safeguards for cross-border data transfer.</p>

        <h2><span className="num">10</span>Children&apos;s privacy</h2>
        <p>TitanLeap&apos;s services are intended for businesses and business owners. We do not knowingly collect information from anyone under 18. If you believe a minor has submitted information to us, contact us and we&apos;ll remove it.</p>

        <h2><span className="num">11</span>Changes to this policy</h2>
        <p>If we materially change how we collect or use your data, we&apos;ll update the &ldquo;Last updated&rdquo; date at the top of this page. Significant changes affecting active clients will be communicated directly by email.</p>

        <h2><span className="num">12</span>Contact us</h2>
        <div className="policy-contact-box">
          <div className="row"><div className="k">Business</div><div className="v">TitanLeap</div></div>
          <div className="row"><div className="k">Email</div><div className="v"><a href="mailto:hello@titanleap.co">hello@titanleap.co</a></div></div>
          <div className="row"><div className="k">Based in</div><div className="v">Lagos, Nigeria</div></div>
          <div className="row"><div className="k">Website</div><div className="v"><a href="https://titanleap.co">titanleap.co</a></div></div>
        </div>
      </div>

      <footer className="policy-footer">
        © 2026 TitanLeap. All rights reserved. · <a href="/">Home</a>
      </footer>

      <style>{`
        .policy-page{background:var(--p900);color:var(--white);font-family:'Archivo',sans-serif;line-height:1.7;min-height:100vh;}
        .policy-page a{color:var(--gold);text-decoration:none;}
        .policy-page a:hover{text-decoration:underline;}
        .policy-topbar{position:sticky;top:0;z-index:20;background:rgba(8,3,20,.88);backdrop-filter:blur(14px);border-bottom:1px solid var(--borderfaint);padding:18px 6vw;display:flex;align-items:center;justify-content:space-between;}
        .policy-logo{font-size:18px;font-weight:800;letter-spacing:-.3px;color:var(--white)!important;text-decoration:none!important;}
        .policy-logo em{font-style:normal;color:var(--gold);}
        .policy-back{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)!important;}
        .policy-back:hover{color:var(--gold)!important;}
        .policy-wrap{max-width:820px;margin:0 auto;padding:80px 6vw 120px;}
        .policy-pill{display:inline-flex;align-items:center;gap:8px;background:var(--goldfaint);border:1px solid var(--goldtrim);padding:7px 15px;border-radius:3px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.15em;text-transform:uppercase;color:var(--gold);margin-bottom:24px;}
        .policy-wrap h1{font-size:clamp(36px,5vw,54px);font-weight:900;line-height:1;letter-spacing:-1.5px;margin-bottom:16px;}
        .policy-updated{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.08em;color:var(--muted);margin-bottom:48px;}
        .policy-lead{font-size:17px;color:rgba(240,234,255,.85);margin-bottom:56px;padding-bottom:40px;border-bottom:1px solid var(--borderfaint);}
        .policy-wrap h2{font-size:24px;font-weight:900;letter-spacing:-.5px;color:var(--white);margin:48px 0 18px;padding-top:8px;}
        .policy-wrap h2 .num{font-family:'JetBrains Mono',monospace;font-size:13px;color:var(--gold);letter-spacing:.1em;margin-right:10px;}
        .policy-wrap h3{font-size:15px;font-weight:700;color:var(--gold);text-transform:uppercase;letter-spacing:.06em;margin:26px 0 10px;}
        .policy-wrap p{font-size:15.5px;color:rgba(240,234,255,.82);margin-bottom:16px;}
        .policy-wrap p strong{color:var(--white);font-weight:700;}
        .policy-wrap ul{margin:0 0 16px 0;padding-left:0;list-style:none;}
        .policy-wrap li{font-size:15.5px;color:rgba(240,234,255,.82);margin-bottom:10px;padding-left:22px;position:relative;}
        .policy-wrap li::before{content:"—";position:absolute;left:0;color:var(--gold);}
        .policy-wrap li strong{color:var(--white);font-weight:700;}
        .policy-table-wrap{overflow-x:auto;}
        .policy-wrap table{width:100%;border-collapse:collapse;margin:20px 0 28px;font-size:14px;min-width:520px;}
        .policy-wrap th{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--gold);text-align:left;padding:10px 14px;border-bottom:1px solid var(--goldtrim);background:var(--goldfaint);}
        .policy-wrap td{padding:12px 14px;border-bottom:1px solid var(--borderfaint);color:rgba(240,234,255,.82);vertical-align:top;}
        .policy-wrap tr:last-child td{border-bottom:none;}
        .policy-callout{background:var(--p800);border:1px solid var(--borderfaint);border-left:3px solid var(--gold);border-radius:4px;padding:20px 24px;margin:24px 0;}
        .policy-callout p{margin-bottom:0;font-size:14.5px;}
        .policy-contact-box{background:var(--p800);border:1px solid var(--border);border-radius:6px;padding:32px;margin-top:16px;}
        .policy-contact-box .row{display:flex;gap:12px;margin-bottom:10px;font-size:14.5px;}
        .policy-contact-box .k{font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);min-width:110px;padding-top:2px;}
        .policy-contact-box .v{color:var(--white);}
        .policy-footer{border-top:1px solid var(--borderfaint);padding:36px 6vw;text-align:center;font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--muted);letter-spacing:.05em;}
        @media(max-width:640px){
          .policy-wrap{padding:56px 6vw 90px;}
          .policy-wrap table{font-size:12.5px;}
          .policy-wrap th,.policy-wrap td{padding:8px 10px;}
        }
      `}</style>
    </div>
  )
}
