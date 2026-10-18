const CONSTRAINT_LABELS = {
  positioning:  'Positioning',
  authority:    'Authority & Trust',
  acquisition:  'Lead Acquisition',
  conversion:   'Conversion Rate',
  sales:        'Sales Process',
  operations:   'Operations',
}

const CONSTRAINT_NOTES = {
  positioning:  'Visitors may not understand the value quickly. Focus on headline clarity and value prop.',
  authority:    'Low social proof detected. Recommend adding testimonials, case studies, or reviews.',
  acquisition:  'Lead volume or channel diversity is thin. Explore paid or content-led acquisition.',
  conversion:   'Gap between traffic and customers. Audit CTA, landing page copy, and offer clarity.',
  sales:        'Manual or absent follow-up process. CRM + automation will recover leaking revenue.',
  operations:   'High manual task load detected. Systematize top time-consumers to free capacity.',
}

function scoreBar(score) {
  const filled = Math.round(score / 10)
  const color = score < 40 ? '#ef4444' : score < 65 ? '#f59e0b' : '#22c55e'
  return `<span style="color:${color};font-weight:700">${'█'.repeat(filled)}${'░'.repeat(10-filled)} ${score}%</span>`
}

const FROM = 'TitanLeap <hello@titanleap.co>'
// Leads and replies go to info@ (hello@ is the sender).
const INBOX = 'info@titanleap.co'

async function sendEmail(payload) {
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (r.ok) return { ok: true }
    return { ok: false, error: `${r.status} ${await r.text()}` }
  } catch (e) {
    return { ok: false, error: String(e) }
  }
}

const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
const clean = (u) => String(u || '').replace(/^https?:\/\//, '').replace(/\/$/, '').slice(0, 80)

function confirmText({ url }) {
  const site = url ? clean(url) : 'your site'
  return `Got it. Your free first look at ${site} is in the queue.

What happens next:
1. Triumph goes through ${site} the way a new customer would: home page, signup and pricing.
2. Within 24 hours you get a short email with the one step where you're losing the most customers, and what to change.
3. If it's worth going deeper, we'll tell you how the full $297 audit works. No pressure either way.

Anything we should know first? Just reply to this email.

Triumph
TitanLeap · titanleap.co`
}

function confirmHtml({ url }) {
  const site = url ? esc(clean(url)) : 'your site'
  return `<!doctype html><html><body style="margin:0;background:#F7F3FF;padding:32px 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;color:#190D3E">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #E3D9F7">
    <div style="background:#190D3E;padding:22px 28px">
      <span style="color:#ffffff;font-weight:900;font-size:18px;letter-spacing:.5px">TITAN<span style="color:#F5C518">LEAP</span></span>
    </div>
    <div style="padding:30px 28px 8px">
      <h1 style="margin:0 0 12px;font-size:24px;line-height:1.2;color:#190D3E">Got it. Your free first look at ${site} is in the queue.</h1>
      <p style="margin:0 0 22px;font-size:16px;line-height:1.6;color:#46396B">Here's what happens next.</p>
      <table role="presentation" style="width:100%;border-collapse:collapse;font-size:15px;line-height:1.55;color:#190D3E">
        <tr><td style="width:34px;vertical-align:top;padding:0 0 14px"><span style="display:inline-block;width:24px;height:24px;border-radius:50%;background:#6B21E8;color:#fff;text-align:center;font-weight:700;font-size:13px;line-height:24px">1</span></td><td style="padding:0 0 14px">Triumph goes through ${site} the way a new customer would: home page, signup and pricing.</td></tr>
        <tr><td style="width:34px;vertical-align:top;padding:0 0 14px"><span style="display:inline-block;width:24px;height:24px;border-radius:50%;background:#6B21E8;color:#fff;text-align:center;font-weight:700;font-size:13px;line-height:24px">2</span></td><td style="padding:0 0 14px">Within <b>24 hours</b> you get a short email with the one step where you're losing the most customers, and what to change.</td></tr>
        <tr><td style="width:34px;vertical-align:top;padding:0 0 14px"><span style="display:inline-block;width:24px;height:24px;border-radius:50%;background:#6B21E8;color:#fff;text-align:center;font-weight:700;font-size:13px;line-height:24px">3</span></td><td style="padding:0 0 14px">If it's worth going deeper, we'll tell you how the full $297 audit works. No pressure either way.</td></tr>
      </table>
      <p style="margin:8px 0 0;padding:14px 16px;background:#FFF8DB;border-radius:10px;font-size:14px;line-height:1.5;color:#3A2A00">Anything we should know first, like a page you're unsure about? Just reply to this email.</p>
      <p style="margin:24px 0 26px;font-size:15px;color:#190D3E">Triumph<br><span style="color:#65598A">TitanLeap</span></p>
    </div>
    <div style="padding:16px 28px;border-top:1px solid #EFE6FF;font-size:12px;color:#65598A">You're getting this because you asked for a free first look at <a href="https://titanleap.co" style="color:#6B21E8">titanleap.co</a>. One email with your result, no list.</div>
  </div></body></html>`
}


// ── Lead card for free-first-look requests: everything about the lead in one place ──
function money(n) { const v = Number(n); return isFinite(v) && v > 0 ? '$' + Math.round(v).toLocaleString('en-US') : '—' }
function num(n) { const v = Number(n); return isFinite(v) && v > 0 ? Math.round(v).toLocaleString('en-US') : '—' }
function pct(n) { const v = Number(n); return isFinite(v) && v > 0 ? v + '%' : '—' }
function parseCalc(a3) {
  // fallback for the older form, which sent the calculator as one sentence
  const m = String(a3 || '').match(/([\d,]+) visitors\/mo, ([\d.]+)% sign up, ([\d.]+)% pay, \$([\d.,]+)\/customer\/mo\. Est\. \$([\d.,]+)\/mo/)
  if (!m) return null
  const n = (x) => Number(String(x).replace(/,/g, ''))
  return { visitors: n(m[1]), signup_rate: n(m[2]), paid_rate: n(m[3]), arpu: n(m[4]), est_leak: n(m[5]) }
}
function row(label, value) {
  return `<tr><td style="padding:8px 0;border-bottom:1px solid #EFE6FF;width:150px;font-size:13px;color:#65598A;vertical-align:top">${label}</td><td style="padding:8px 0;border-bottom:1px solid #EFE6FF;font-size:14px;color:#190D3E;font-weight:600">${value}</td></tr>`
}
function section(title, inner) {
  return `<div style="margin:22px 0 0"><div style="font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#6B21E8;margin:0 0 6px">${title}</div>${inner}</div>`
}
function firstLookLead({ email, url, revenue, calc, scan, leaks }) {
  const site = url ? (url.startsWith('http') ? url : 'https://' + url) : ''
  const when = new Date().toLocaleString('en-GB', { timeZone: 'Africa/Lagos', dateStyle: 'medium', timeStyle: 'short' }) + ' (Lagos)'
  const signups = calc && calc.visitors && calc.signup_rate ? calc.visitors * calc.signup_rate / 100 : 0
  const paying = signups && calc.paid_rate ? signups * calc.paid_rate / 100 : 0
  const contact = `<table style="width:100%;border-collapse:collapse">${[
    row('Email', `<a href="mailto:${esc(email)}" style="color:#6B21E8">${esc(email)}</a>`),
    row('Website', site ? `<a href="${esc(site)}" style="color:#6B21E8">${esc(clean(url))}</a>` : '—'),
    row('Monthly revenue', esc(revenue || '—')),
    row('Company (from site)', esc(scan?.company || '—')),
    row('Requested', esc(when)),
  ].join('')}</table>`
  const numbers = calc ? `<table style="width:100%;border-collapse:collapse">${[
    row('Visitors a month', num(calc.visitors)),
    row('Sign up', pct(calc.signup_rate) + (signups ? ` <span style="color:#65598A;font-weight:400">(~${num(signups)} signups)</span>` : '')),
    row('Become paying', pct(calc.paid_rate) + (paying ? ` <span style="color:#65598A;font-weight:400">(~${num(paying)} customers)</span>` : '')),
    row('Revenue per customer', money(calc.arpu) + ' /mo'),
    row('Calculator says missing', `<span style="color:#B45309">${money(calc.est_leak)} /mo</span>`),
  ].join('')}</table><p style="margin:6px 0 0;font-size:12px;color:#65598A">These are the slider values on the calculator when they sent the form. If they never touched it, they're our defaults.</p>` : '<p style="font-size:13px;color:#65598A;margin:0">No calculator numbers sent.</p>'
  const scanBlock = scan ? `<table style="width:100%;border-collapse:collapse">${[
    row('Headline', esc(scan.tagline || '—')),
    row('Prices on page', scan.prices?.length ? esc(scan.prices.slice(0, 6).join(', ')) : '<span style="color:#DC2626">None visible</span>'),
    row('Tracking', scan.pixels?.length ? esc(scan.pixels.join(', ')) : '<span style="color:#DC2626">None found</span>'),
    row('Blog / content', scan.hasBlog ? 'Yes' : 'Not found'),
    row('Socials', scan.liveSocials?.length ? esc(scan.liveSocials.join(', ')) : 'None found'),
  ].join('')}</table>${leaks?.length ? `<div style="margin:12px 0 0;padding:12px 14px;background:#FEF2F2;border-radius:10px">${leaks.map((l) => `<div style="font-size:13px;color:#7F1D1D;margin:0 0 6px">• ${esc(l)}</div>`).join('')}</div>` : ''}` : '<p style="font-size:13px;color:#65598A;margin:0">We couldn\'t scan the site automatically. Open it yourself.</p>'
  const html = `<!doctype html><html><body style="margin:0;background:#F7F3FF;padding:24px 12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:14px;border:1px solid #E3D9F7;overflow:hidden">
    <div style="background:#190D3E;padding:18px 24px;color:#fff"><div style="font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:#F5C518;font-weight:800">New free first look</div><div style="font-size:22px;font-weight:900;margin-top:4px">${esc(clean(url) || email)}</div><div style="font-size:13px;color:#CCB6F5;margin-top:2px">${esc(revenue || 'Revenue not given')} · reply within 24 hours</div></div>
    <div style="padding:6px 24px 24px">
      ${section('Who', contact)}
      ${section('Their numbers', numbers)}
      ${section('Site scan', scanBlock)}
      ${section('Next step', `<p style="margin:0;font-size:14px;color:#190D3E;line-height:1.55">They've already had our "Got it" email promising a reply within 24 hours. Go through ${site ? `<a href="${esc(site)}" style="color:#6B21E8">${esc(clean(url))}</a>` : 'their site'} as a new customer, find the one step losing them the most, and hit <b>Reply</b> to send it straight to them.</p>`)}
    </div>
  </div></body></html>`
  const text = [
    `NEW FREE FIRST LOOK: ${clean(url) || email}`, '',
    `Email: ${email}`, `Website: ${site || '-'}`, `Revenue: ${revenue || '-'}`, `Company: ${scan?.company || '-'}`, `Requested: ${when}`, '',
    calc ? `Numbers: ${num(calc.visitors)} visitors/mo, ${pct(calc.signup_rate)} sign up, ${pct(calc.paid_rate)} pay, ${money(calc.arpu)}/customer. Calculator says ${money(calc.est_leak)}/mo missing.` : 'Numbers: none sent',
    leaks?.length ? '\nScan found:\n' + leaks.map((l) => '- ' + l).join('\n') : '',
    '\nReply to this email to answer them directly.',
  ].join('\n')
  return { html, text }
}

export async function POST(request) {
  try {
    const { a1, a2, a3, a4, a5, name, email, url, goal, leaks, scanData, calc: calcIn, source } = await request.json()
    const scores = scanData?.scores || null
    const fullData = scanData?.fullData || {}

    // ── Internal diagnosis section (for TitanLeap's eyes only) ──────────────
    const diagnosisHtml = scores ? (() => {
      const entries = Object.entries(scores).filter(([k]) => k !== 'overall').sort(([,a],[,b]) => a - b)
      const weakest = entries.slice(0, 3)
      return `
      <div style="background:#0f0720;border:1px solid #4c1d95;border-radius:10px;padding:20px 24px;margin:24px 0">
        <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:#a78bfa;margin-bottom:16px">
          🧠 AI Diagnosis — Internal Use Only
        </div>
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:18px;padding-bottom:16px;border-bottom:1px solid #2d1b69">
          <div style="font-size:32px;font-weight:900;color:#EFE9FF;line-height:1">${scores.overall}</div>
          <div>
            <div style="font-size:11px;color:#7c3aed;font-weight:700;text-transform:uppercase;letter-spacing:.06em">Growth Readiness Score</div>
            <div style="font-size:12px;color:#9ca3af;margin-top:2px">${scores.overall>=75?'Strong Foundation':scores.overall>=55?'Room to Grow':'Action Required'}</div>
          </div>
        </div>
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#6b7280;margin-bottom:10px">Constraint Map</div>
        ${entries.map(([key, score]) => `
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;font-family:monospace">
            <div style="width:90px;font-size:11px;color:#9ca3af">${CONSTRAINT_LABELS[key]}</div>
            <div style="font-size:12px">${scoreBar(score)}</div>
          </div>`).join('')}
        <div style="margin-top:18px;padding-top:14px;border-top:1px solid #2d1b69">
          <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:#6b7280;margin-bottom:10px">Top Constraints to Address</div>
          ${weakest.map((([key, score], i) => `
            <div style="background:#1a0a3d;border-radius:6px;padding:10px 12px;margin-bottom:8px">
              <div style="font-size:12px;font-weight:700;color:#EFE9FF;margin-bottom:3px">#${i+1} ${CONSTRAINT_LABELS[key]} — ${score}%</div>
              <div style="font-size:11.5px;color:#9ca3af;line-height:1.5">${CONSTRAINT_NOTES[key]}</div>
            </div>`)).join('')}
        </div>
      </div>`
    })() : ''

    // ── Site scan section ────────────────────────────────────────────────────
    const scanHtml = scanData ? `
      <div style="background:#f5f3ff;border:1px solid #ddd6fe;border-radius:8px;padding:16px 20px;margin:16px 0">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#6B21E8;margin-bottom:10px">📡 Site Scan</div>
        ${scanData.pixels?.length ? `<p style="margin:4px 0;font-size:13px"><strong>Pixels:</strong> ${scanData.pixels.join(', ')}</p>` : '<p style="margin:4px 0;font-size:13px;color:#dc2626"><strong>Pixels:</strong> None detected</p>'}
        ${scanData.prices?.length ? `<p style="margin:4px 0;font-size:13px"><strong>Pricing visible:</strong> ${scanData.prices.join(', ')}</p>` : '<p style="margin:4px 0;font-size:13px;color:#dc2626"><strong>Pricing:</strong> Not visible on page</p>'}
        <p style="margin:4px 0;font-size:13px"><strong>Blog/Content:</strong> ${scanData.hasBlog ? '✓ Yes' : '✗ Not detected'}</p>
        ${scanData.liveSocials?.length
          ? `<p style="margin:4px 0;font-size:13px"><strong>Social profiles:</strong> ${scanData.liveSocials.join(', ')}</p>`
          : '<p style="margin:4px 0;font-size:13px;color:#dc2626"><strong>Social:</strong> No active profiles found — all links may be placeholders</p>'}
        ${scanData.deadSocials?.length ? `<p style="margin:4px 0;font-size:13px;color:#dc2626"><strong>Dead social (#):</strong> ${scanData.deadSocials.join(', ')}</p>` : ''}
        ${leaks?.length ? `<div style="margin-top:10px"><div style="font-size:11px;font-weight:700;color:#dc2626;margin-bottom:6px">⚠ Auto-detected leaks:</div>${leaks.map(l=>`<div style="font-size:12px;color:#7f1d1d;margin-bottom:4px">• ${l}</div>`).join('')}</div>` : ''}
      </div>` : ''

    const html = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:640px;margin:0 auto;color:#111;background:#fff;padding:32px;border-radius:12px">

        <!-- Header -->
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:28px">
          <div style="width:36px;height:36px;border-radius:8px;background:linear-gradient(135deg,#6B21E8,#9333ea);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900;font-size:12px">TL</div>
          <div>
            <div style="font-weight:800;font-size:14px;color:#111">TitanLeap</div>
            <div style="font-size:11px;color:#888">New Audit Application</div>
          </div>
        </div>

        <h2 style="color:#6B21E8;font-size:22px;font-weight:900;margin:0 0 20px;letter-spacing:-.5px">New Audit Application</h2>

        <!-- Contact info -->
        <table style="width:100%;border-collapse:collapse;margin-bottom:8px">
          <tr><td style="padding:9px 0;border-bottom:1px solid #f0f0f0;width:120px;font-size:13px;color:#666">Name</td><td style="padding:9px 0;border-bottom:1px solid #f0f0f0;font-size:13px;font-weight:600">${name}</td></tr>
          <tr><td style="padding:9px 0;border-bottom:1px solid #f0f0f0;font-size:13px;color:#666">Email</td><td style="padding:9px 0;border-bottom:1px solid #f0f0f0;font-size:13px"><a href="mailto:${email}" style="color:#6B21E8">${email}</a></td></tr>
          <tr><td style="padding:9px 0;border-bottom:1px solid #f0f0f0;font-size:13px;color:#666">Website</td><td style="padding:9px 0;border-bottom:1px solid #f0f0f0;font-size:13px">${url ? `<a href="${url.startsWith('http')?url:'https://'+url}" style="color:#6B21E8">${url}</a>` : '—'}</td></tr>
          <tr><td style="padding:9px 0;border-bottom:1px solid #f0f0f0;font-size:13px;color:#666">Revenue</td><td style="padding:9px 0;border-bottom:1px solid #f0f0f0;font-size:13px;font-weight:600">${a2 || '—'}</td></tr>
          <tr><td style="padding:9px 0;font-size:13px;color:#666">Goal</td><td style="padding:9px 0;font-size:13px">${fullData.primaryGoal || '—'}</td></tr>
        </table>

        ${diagnosisHtml}
        ${scanHtml}

        <!-- Their answers -->
        <h3 style="color:#6B21E8;font-size:14px;font-weight:800;margin:24px 0 14px;letter-spacing:-.2px">Application Answers</h3>
        ${[
          ['Business', a1],
          ['Lead source / volume', a3],
          ['Biggest challenges', a4],
          ['Sales management', fullData.leadManagement],
          ['Auto follow-up', fullData.autoFollowUp],
          ['Content frequency', fullData.contentFrequency],
          ['Trust signals', fullData.trustSignals?.join(', ')],
          ['Time consumers', fullData.timeConsumers?.join(', ')],
          ['Software used', a5],
          ['One-year vision', goal],
          ['If nothing changes', fullData.ifNothingChanges],
          ['Success looks like', fullData.successLooks],
        ].filter(([,v]) => v).map(([label, val]) => `
          <div style="margin-bottom:12px">
            <div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:#6B21E8;margin-bottom:3px">${label}</div>
            <div style="font-size:13px;color:#333;line-height:1.6;background:#f9f9f9;padding:9px 12px;border-radius:6px;border-left:3px solid #6B21E8">${val}</div>
          </div>`).join('')}

        <hr style="margin:24px 0;border:none;border-top:1px solid #eee"/>
        <p style="color:#aaa;font-size:11px;margin:0">Submitted via titanleap.co · Reply to reach ${name} at ${email}</p>
      </div>
    `

    // 1. Notify TitanLeap. Sent from our own domain; falls back to Resend's shared
    //    sender if the domain isn't verified yet, so leads are never lost.
    const isFirstLook = source === 'first-look' || String(a1 || '').startsWith('FREE FIRST LOOK')
    let subject = `New Audit Application — ${name}${a2 ? ` (${a2})` : ''}${scores ? ` · Score: ${scores.overall}/100` : ''}`
    let body = { html }
    if (isFirstLook) {
      const lead = firstLookLead({ email, url, revenue: a2, calc: calcIn || parseCalc(a3), scan: scanData, leaks })
      subject = `New free first look · ${clean(url) || email}${a2 ? ` · ${a2}` : ''}`
      body = { html: lead.html, text: lead.text }
    }
    let internal = await sendEmail({ from: FROM, to: [INBOX], reply_to: email, subject, ...body })
    if (!internal.ok) {
      console.error('Resend (internal, own domain) error:', internal.error)
      internal = await sendEmail({ from: 'TitanLeap Audits <onboarding@resend.dev>', to: [INBOX], reply_to: email, subject, ...body })
    }
    if (!internal.ok) {
      console.error('Resend (internal) error:', internal.error)
      return Response.json({ error: 'Failed to send email' }, { status: 500 })
    }

    // 2. Confirm to the person who applied. Needs titanleap.co verified in Resend.
    let confirm = { ok: false, error: 'no email' }
    if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email || '')) {
      confirm = await sendEmail({
        from: FROM,
        to: [email],
        reply_to: INBOX,
        subject: url ? `Got it — your free first look at ${clean(url)} is on its way` : 'Got it — your free first look is on its way',
        html: confirmHtml({ url }),
        text: confirmText({ url }),
      })
      if (!confirm.ok) console.error('Resend (confirmation) error:', confirm.error)
    }

    return Response.json({ ok: true, confirmation: confirm.ok ? 'sent' : 'failed' })
  } catch (e) {
    console.error('Audit route error:', e)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
