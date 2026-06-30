// Unified webhook — handles Stripe + Paystack, sends email on payment

import crypto from 'crypto'
import Stripe from 'stripe'

async function sendEmail({ name, email, planName, amount, processor }) {
  const key = process.env.RESEND_API_KEY
  if (!key) { console.log('[webhook] No RESEND_API_KEY'); return }

  const processorLabel = processor === 'stripe' ? 'Stripe' : 'Paystack'
  const html = `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;background:#080314;color:#F0EAFF;border-radius:12px;overflow:hidden">
      <div style="background:linear-gradient(135deg,#190D3E,#0D0520);padding:32px 32px 24px;border-bottom:1px solid rgba(107,33,232,.3)">
        <div style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(204,174,255,.5);margin-bottom:8px">TitanLeap · Payment Alert</div>
        <h1 style="margin:0;font-size:26px;font-weight:900;letter-spacing:-1px;color:#F0EAFF">New client just paid 💰</h1>
      </div>
      <div style="padding:28px 32px">
        <table style="width:100%;border-collapse:collapse">
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid rgba(107,33,232,.15);font-size:12px;color:rgba(204,174,255,.5);width:36%">CLIENT</td>
            <td style="padding:10px 0;border-bottom:1px solid rgba(107,33,232,.15);font-size:14px;font-weight:700;color:#F0EAFF">${name || 'Unknown'}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid rgba(107,33,232,.15);font-size:12px;color:rgba(204,174,255,.5)">EMAIL</td>
            <td style="padding:10px 0;border-bottom:1px solid rgba(107,33,232,.15);font-size:14px;color:#AB7FF5"><a href="mailto:${email}" style="color:#AB7FF5">${email}</a></td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid rgba(107,33,232,.15);font-size:12px;color:rgba(204,174,255,.5)">PLAN</td>
            <td style="padding:10px 0;border-bottom:1px solid rgba(107,33,232,.15);font-size:14px;font-weight:700;color:#F5C518">${planName}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid rgba(107,33,232,.15);font-size:12px;color:rgba(204,174,255,.5)">AMOUNT</td>
            <td style="padding:10px 0;border-bottom:1px solid rgba(107,33,232,.15);font-size:22px;font-weight:900;color:#F0EAFF">$${amount}</td>
          </tr>
          <tr>
            <td style="padding:10px 0;font-size:12px;color:rgba(204,174,255,.5)">VIA</td>
            <td style="padding:10px 0;font-size:13px;color:#AB7FF5">${processorLabel}</td>
          </tr>
        </table>
        <div style="margin-top:24px;display:flex;gap:12px">
          <a href="https://dashboard.paystack.com/#/transactions" style="display:inline-block;background:#6B21E8;color:#F0EAFF;text-decoration:none;border-radius:8px;padding:12px 22px;font-size:13px;font-weight:700">Paystack →</a>
          <a href="https://dashboard.stripe.com/payments" style="display:inline-block;background:rgba(107,33,232,.2);color:#AB7FF5;text-decoration:none;border-radius:8px;padding:12px 22px;font-size:13px;font-weight:700;border:1px solid rgba(107,33,232,.4)">Stripe →</a>
        </div>
      </div>
    </div>
  `

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      from: 'TitanLeap <payments@mail.titanleap.co>',
      to: ['tazrt37@gmail.com'],
      subject: `💰 New client: ${name || email} — ${planName} (${processorLabel})`,
      html,
    }),
  })
  if (!res.ok) console.error('[webhook] Resend error:', await res.text())
}

// ── Stripe ────────────────────────────────────────────────────────────────────
async function handleStripe(req, body) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const sig = req.headers.get('stripe-signature')

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('[webhook/stripe] signature error:', err.message)
    return new Response('Invalid Stripe signature', { status: 400 })
  }

  if (event.type === 'checkout.session.completed' || event.type === 'payment_intent.succeeded') {
    const obj = event.data.object
    const meta = obj.metadata || {}
    const email = obj.customer_details?.email || obj.receipt_email || ''
    const name  = obj.customer_details?.name || ''
    const planName = meta.plan_name || meta.plan || 'Unknown plan'
    const amount = obj.amount_total ? (obj.amount_total / 100).toLocaleString() : '?'

    console.log('[webhook/stripe]', event.type, { email, plan: planName, amount })
    await sendEmail({ name, email, planName, amount, processor: 'stripe' })
  }

  return new Response('OK', { status: 200 })
}

// ── Paystack ──────────────────────────────────────────────────────────────────
async function handlePaystack(req, body) {
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY || '')
    .update(body)
    .digest('hex')

  if (hash !== req.headers.get('x-paystack-signature')) {
    return new Response('Invalid Paystack signature', { status: 400 })
  }

  const event = JSON.parse(body)
  if (event.event === 'charge.success') {
    const d = event.data
    const meta = d.metadata || {}
    const planName = meta.plan_name || meta.plan || 'Unknown plan'
    const amount = (d.amount / 100).toLocaleString()
    const email = d.customer?.email
    const name = d.customer?.first_name
      ? `${d.customer.first_name} ${d.customer.last_name || ''}`.trim()
      : email

    console.log('[webhook/paystack] charge.success', { email, plan: planName, amount })
    await sendEmail({ name, email, planName, amount, processor: 'paystack' })
  }

  return new Response('OK', { status: 200 })
}

// ── Router ────────────────────────────────────────────────────────────────────
export async function POST(req) {
  const body = await req.text()
  const isStripe = !!req.headers.get('stripe-signature')
  return isStripe ? handleStripe(req, body) : handlePaystack(req, bod