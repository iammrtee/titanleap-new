'use client'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const PLAN_NAMES = {
  starter: 'Launch Accelerator',
  growth: 'Scaling System',
  authority: 'Authority Domination',
  audit: 'Revenue Leak Audit',
  sprint: 'Growth System Sprint',
}

function SuccessContent() {
  const params = useSearchParams()
  const plan = params.get('plan') || 'starter'
  const planName = PLAN_NAMES[plan] || 'your plan'

  return (
    <div style={{
      minHeight:'100vh', background:'var(--p900)',
      display:'flex', alignItems:'center', justifyContent:'center',
      padding:'40px 20px', fontFamily:"'Archivo',sans-serif",
    }}>
      <div style={{
        maxWidth:'520px', width:'100%', textAlign:'center',
        background:'var(--p850)', border:'1px solid var(--border)',
        borderRadius:'20px', padding:'48px 40px',
        boxShadow:'0 40px 100px rgba(0,0,0,.6), 0 0 60px rgba(107,33,232,.1)',
      }}>
        {/* Check icon */}
        <div style={{
          width:'72px', height:'72px', borderRadius:'50%',
          background:'rgba(34,197,94,.08)', border:'2px solid rgba(34,197,94,.25)',
          display:'flex', alignItems:'center', justifyContent:'center',
          margin:'0 auto 28px', fontSize:'28px',
        }}>✓</div>

        <div style={{
          fontFamily:"'JetBrains Mono',monospace",
          fontSize:'10px', fontWeight:'700', letterSpacing:'.14em',
          textTransform:'uppercase', color:'var(--gold)', marginBottom:'14px',
        }}>
          Payment confirmed
        </div>

        <h1 style={{
          fontSize:'clamp(28px,4vw,38px)', fontWeight:'900',
          letterSpacing:'-1.5px', color:'var(--white)',
          margin:'0 0 14px', lineHeight:'1.1',
        }}>
          Welcome to TitanLeap.
        </h1>

        <p style={{
          fontSize:'15px', color:'var(--muted)', lineHeight:'1.7',
          marginBottom:'32px',
        }}>
          You're now on the <strong style={{color:'var(--white)'}}>{planName}</strong>.
          Our team will reach out within <strong style={{color:'var(--gold)'}}>5 business hours</strong> to
          get everything set up and kick off your growth system.
        </p>

        <div style={{
          background:'rgba(107,33,232,.08)', border:'1px solid var(--borderfaint)',
          borderRadius:'12px', padding:'16px 20px', marginBottom:'28px', textAlign:'left',
        }}>
          <div style={{fontSize:'11px', fontWeight:'700', color:'var(--subtle)', marginBottom:'10px', letterSpacing:'.06em', textTransform:'uppercase', fontFamily:"'JetBrains Mono',monospace"}}>What happens next</div>
          {['Check your email for a confirmation receipt', 'We review your business and prepare your onboarding', 'You get a Slack invite + kickoff call booked'].map((s, i) => (
            <div key={i} style={{display:'flex', gap:'10px', marginBottom: i < 2 ? '8px' : 0}}>
              <span style={{color:'var(--gold)', fontWeight:'800', flexShrink:0}}>{i+1}.</span>
              <span style={{fontSize:'13px', color:'var(--muted)'}}>{s}</span>
            </div>
          ))}
        </div>

        <a href="/" style={{
          display:'inline-block', background:'var(--gold)', color:'var(--p900)',
          borderRadius:'10px', padding:'14px 32px',
          fontSize:'13px', fontWeight:'800', textDecoration:'none',
          letterSpacing:'.02em',
          boxShadow:'0 4px 18px rgba(245,197,24,.28)',
        }}>
          Back to home →
        </a>
      </div>
    </div>
  )
}

export default function CheckoutSuccess() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  )
}
