// Checkout — supports Stripe (global card) and Paystack (NGN/Africa)

import Stripe from 'stripe'

const PLAN_DETAILS = {
  starter:   { name: 'Launch Accelerator',   monthly: 1500, annual: 1200  },
  growth:    { name: 'Scaling System',        monthly: 3500, annual: 2800  },
  authority: { name: 'Authority Domination',  monthly: 6999, annual: 5599  },
  audit:     { name: 'Revenue Leak Audit',    once: 297                    },
  sprint:    { name: 'Growth System Sprint',  once: 2500                   },
}

async function stripeCheckout({ plan, billing, details, amount, baseUrl }) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const mode = billing === 'once' ? 'payment' : 'subscription'

  const priceData = {
    currency: 'usd',
    unit_amount: amount * 100,
    product_data: { name: details.name },
  }
  if (mode === 'subscription') {
    priceData.recurring = { interval: billing === 'annual' ? 'year' : 'month' }
  }

  const session = await stripe.checkout.sessions.create({
    mode,
    line_items: [{ price_data: priceData, quantity: 1 }],
    success_url: `${baseUrl}/checkout-success?plan=${plan}&processor=stripe`,
    cancel_url:  `${baseUrl}/#pricing`,
    metadata: { plan, billing, plan_name: details.name },
  })
  return session.url
}

async function paystackCheckout({ plan, billing, details, amount, email, baseUrl }) {
  const res = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email || 'client@titanleap.co',
      amount: amount * 100,
      currency: 'USD',
      callback_url: `${baseUrl}/checkout-success?plan=${plan}&processor=paystack`,
      metadata: { plan, billing, plan_name: details.name },
    }),
  })
  const data = await res.json()
  if (!data.status) throw new Error(data.message)
  return data.data.authorization_url
}

export async function POST(req) {
  try {
    const { plan, billing = 'monthly', email = '', processor = 'stripe' } = await req.json()

    const details = PLAN_DETAILS[plan]
    if (!details) return Response.json({ error: 'Invalid plan' }, { status: 400 })

    const amount = billing === 'once'
      ? details.once
      : billing === 'annual' ? details.annual : details.monthly

    if (!amount) return Response.json({ error: 'Invalid billing period' }, { status: 400 })

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://titanleap.co'

    const url = processor === 'paystack'
      ? await paystackCheckout({ plan, billing, details, amount, email, baseUrl })
      : await stripeCheckout({ plan, billing, details, amount, baseUrl })

    return Response.json({ url })
  } catch (err) {
    console.error('[checkout]', err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}
