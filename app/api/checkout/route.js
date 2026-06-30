// Paystack Checkout — works globally, instant NGN/USD withdrawal for Nigerian founders

const PLAN_DETAILS = {
  starter:   { name: 'Launch Accelerator',   monthly: 1500, annual: 1200, currency: 'USD' },
  growth:    { name: 'Scaling System',        monthly: 3500, annual: 2800, currency: 'USD' },
  authority: { name: 'Authority Domination',  monthly: 6999, annual: 5599, currency: 'USD' },
  audit:     { name: 'Revenue Leak Audit',    once: 297,                   currency: 'USD' },
  sprint:    { name: 'Growth System Sprint',  once: 2500,                  currency: 'USD' },
}

export async function POST(req) {
  try {
    const { plan, billing = 'monthly', email = '' } = await req.json()

    const details = PLAN_DETAILS[plan]
    if (!details) return Response.json({ error: 'Invalid plan' }, { status: 400 })

    const amount = billing === 'once'
      ? details.once
      : billing === 'annual' ? details.annual : details.monthly

    if (!amount) return Response.json({ error: 'Invalid billing period' }, { status: 400 })

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://titanleap.co'
    const amountInCents = amount * 100

    const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email || 'client@titanleap.co',
        amount: amountInCents,
        currency: details.currency,
        callback_url: `${baseUrl}/checkout-success?plan=${plan}`,
        metadata: {
          plan,
          billing,
          plan_name: details.name,
        },
      }),
    })

    const data = await paystackRes.json()
    if (!data.status) {
      console.error('[checkout] Paystack error:', data.message)
      return Response.json({ error: data.message }, { status: 400 })
    }

    return Response.json({ url: data.data.authorization_url })
  } catch (err) {
    console.error('[checkout]', err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}
