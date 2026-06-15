const items = ['Funnel Architecture','AI Lead Automation','Paid Acquisition','Content Systems','Growth Analytics','Conversion Optimization','SaaS Scaling','Market Positioning','High-Performance Sales']
const doubled = [...items, ...items]

export default function Marquee() {
  return (
    <div className="marquee">
      <div className="mq-track">
        {doubled.map((item, i) => (
          <span key={i} className="mq-item">{item} <span className="star">✦</span></span>
        ))}
      </div>
    </div>
  )
}
