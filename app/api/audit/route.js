export async function POST(request) {
  try {
    const { a1, a2, a3, a4, a5, name, email, url, goal, leaks, scanData } = await request.json()

    const leaksHtml = leaks?.length ? `
      <div style="background:#fff5f5;border:1px solid #fecaca;border-radius:8px;padding:16px 20px;margin:20px 0">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#dc2626;margin-bottom:10px">⚠ Auto-Detected Revenue Leaks</div>
        ${leaks.map(l => `<div style="display:flex;gap:8px;margin-bottom:6px;font-size:13px;color:#7f1d1d">
          <span style="color:#ef4444;flex-shrink:0">●</span>${l}
        </div>`).join('')}
      </div>` : ''

    const scanHtml = scanData ? `
      <div style="background:#f5f3ff;border:1px solid #ddd6fe;border-radius:8px;padding:16px 20px;margin:20px 0">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#6B21E8;margin-bottom:10px">📊 Site Scan Data</div>
        ${scanData.pixels?.length ? `<p style="margin:4px 0;font-size:13px"><strong>Pixels:</strong> ${scanData.pixels.join(', ')}</p>` : '<p style="margin:4px 0;font-size:13px;color:#dc2626"><strong>Pixels:</strong> None detected</p>'}
        ${scanData.prices?.length ? `<p style="margin:4px 0;font-size:13px"><strong>Pricing found:</strong> ${scanData.prices.join(', ')}</p>` : '<p style="margin:4px 0;font-size:13px;color:#dc2626"><strong>Pricing:</strong> Not visible</p>'}
        <p style="margin:4px 0;font-size:13px"><strong>Blog/Content:</strong> ${scanData.hasBlog ? '✓ Yes' : '✗ None detected'}</p>
        ${scanData.liveSocials?.length ? `<p style="margin:4px 0;font-size:13px"><strong>Social links:</strong> ${scanData.liveSocials.join(', ')}</p>` : ''}
      </div>` : ''

    const html = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:620px;margin:0 auto;color:#111;background:#fff;padding:32px;border-radius:12px">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:28px">
          <div style="width:36px;height:36px;border-radius:8px;background:linear-gradient(135deg,#6B21E8,#9333ea);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900;font-size:12px">TL</div>
          <div>
            <div style="font-weight:800;font-size:14px;color:#111">TitanLeap</div>
            <div style="font-size:11px;color:#888">Revenue Leak Audit</div>
          </div>
        </div>

        <h2 style="color:#6B21E8;font-size:22px;font-weight:900;margin:0 0 20px;letter-spacing:-.5px">New Audit Request</h2>

        <table style="width:100%;border-collapse:collapse;margin-bottom:8px">
          <tr><td style="padding:9px 0;border-bottom:1px solid #f0f0f0;width:130px;font-size:13px;color:#666">Name</td><td style="padding:9px 0;border-bottom:1px solid #f0f0f0;font-size:13px;font-weight:600">${name}</td></tr>
          <tr><td style="padding:9px 0;border-bottom:1px solid #f0f0f0;font-size:13px;color:#666">Email</td><td style="padding:9px 0;border-bottom:1px solid #f0f0f0;font-size:13px"><a href="mailto:${email}" style="color:#6B21E8">${email}</a></td></tr>
          <tr><td style="padding:9px 0;border-bottom:1px solid #f0f0f0;font-size:13px;color:#666">Website</td><td style="padding:9px 0;border-bottom:1px solid #f0f0f0;font-size:13px">${url ? `<a href="${url}" style="color:#6B21E8">${url}</a>` : '—'}</td></tr>
          <tr><td style="padding:9px 0;font-size:13px;color:#666">Revenue</td><td style="padding:9px 0;font-size:13px;font-weight:600">${a2 || '—'}</td></tr>
        </table>

        ${leaksHtml}
        ${scanHtml}

        <h3 style="color:#6B21E8;font-size:15px;font-weight:800;margin:24px 0 16px;letter-spacing:-.3px">Their Answers</h3>
        ${[['Product', a1],['Funnel', a3],['Biggest leak', a4],['What they tried', a5],['90-day goal', goal]].filter(([,v])=>v).map(([label, val]) => `
          <div style="margin-bottom:16px">
            <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#6B21E8;margin-bottom:4px">${label}</div>
            <div style="font-size:13px;color:#333;line-height:1.6;background:#f9f9f9;padding:10px 14px;border-radius:6px;border-left:3px solid #6B21E8">${val}</div>
          </div>`).join('')}

        <hr style="margin:28px 0;border:none;border-top:1px solid #eee"/>
        <p style="color:#aaa;font-size:11px;margin:0">Submitted via titanleap.co · Hit Reply to contact ${name} directly</p>
      </div>
    `

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'TitanLeap Audits <onboarding@resend.dev>',
        to: ['hello@titanleap.co'],
        reply_to: email,
        subject: `New Audit Request — ${name} (${a2})`,
        html,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('Resend error:', err)
      return Response.json({ error: 'Failed to send email' }, { status: 500 })
    }

    return Response.json({ ok: true })
  } catch (e) {
    console.error('Audit route error:', e)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
