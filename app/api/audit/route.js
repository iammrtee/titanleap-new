export async function POST(request) {
  try {
    const { a1, a2, a3, a4, a5, name, email, url, goal } = await request.json()

    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#111">
        <h2 style="color:#6B21E8">New Revenue Leak Audit Request</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;border-bottom:1px solid #eee;width:140px"><strong>Name</strong></td><td style="padding:8px 0;border-bottom:1px solid #eee">${name}</td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #eee"><strong>Email</strong></td><td style="padding:8px 0;border-bottom:1px solid #eee"><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #eee"><strong>Website</strong></td><td style="padding:8px 0;border-bottom:1px solid #eee">${url || '—'}</td></tr>
          <tr><td style="padding:8px 0;border-bottom:1px solid #eee"><strong>Revenue</strong></td><td style="padding:8px 0;border-bottom:1px solid #eee">${a2}</td></tr>
        </table>
        <h3 style="margin-top:24px;color:#6B21E8">Their Answers</h3>
        <p><strong>1. Product:</strong><br/>${a1}</p>
        <p><strong>2. Funnel:</strong><br/>${a3}</p>
        <p><strong>3. Biggest leak:</strong><br/>${a4}</p>
        <p><strong>4. What they tried:</strong><br/>${a5}</p>
        <p><strong>5. 90-day goal:</strong><br/>${goal}</p>
        <hr style="margin:24px 0;border:none;border-top:1px solid #eee"/>
        <p style="color:#888;font-size:12px">Submitted via titanleap.co · Reply directly to this email to reach the client</p>
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
