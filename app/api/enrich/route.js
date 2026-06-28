export async function POST(request) {
  try {
    let { url } = await request.json()
    if (!url) return Response.json({ error: 'No URL provided' }, { status: 400 })
    if (!url.startsWith('http')) url = 'https://' + url

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      signal: AbortSignal.timeout(12000),
    })
    if (!res.ok) throw new Error('fetch failed')
    const html = await res.text()

    const lower = html.toLowerCase()
    const bodyText = html.replace(/<script[\s\S]*?<\/script>/gi, '')
                         .replace(/<style[\s\S]*?<\/style>/gi, '')
                         .replace(/<[^>]*>/g, ' ')
                         .replace(/\s+/g, ' ')
                         .trim()

    // — Business basics —
    const title = (html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] || '').trim()
    const descTag = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i)
                 || html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i)
    const desc = (descTag?.[1] || '').trim()
    const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
    const h1 = h1Match ? h1Match[1].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim() : ''
    const emails = [...new Set((html.match(/[\w.+-]+@[\w-]+\.[\w.-]+/g) || []))]
      .filter(e => !e.includes('woff') && !e.includes('.png'))

    const domain = (() => { try { return new URL(url).hostname.replace('www.', '') } catch { return url } })()
    const company = title.split(/[—|·\-]/)[0].trim() || domain

    // — Pricing —
    const priceRe = /\$\s?[\d,]+(?:\.\d{2})?(?:\s?\/\s?(?:mo|month|yr|year))?/gi
    const prices = [...new Set((bodyText.match(priceRe) || []).map(p => p.replace(/\s/g, '')))]

    // — Pixels —
    const pixels = []
    if (/connect\.facebook\.net|fbq\s*\(/i.test(html)) pixels.push('Meta Pixel')
    if (/googletagmanager\.com|google-analytics\.com|gtag\s*\(/i.test(html)) pixels.push('Google Analytics')
    if (/snap\.licdn\.com|_linkedin_partner_id/i.test(html)) pixels.push('LinkedIn Insight')
    if (/hotjar\.com/i.test(html)) pixels.push('Hotjar')
    if (/analytics\.tiktok\.com|ttq\./i.test(html)) pixels.push('TikTok Pixel')

    // — Socials (real vs dead) —
    const socialMap = { 'twitter.com': 'Twitter/X', 'x.com': 'Twitter/X', 'linkedin.com': 'LinkedIn', 'instagram.com': 'Instagram', 'facebook.com': 'Facebook', 'youtube.com': 'YouTube', 'tiktok.com': 'TikTok' }
    const liveSocials = [], deadSocials = []
    const linkRe = /href=["']([^"']*)["']/gi
    let lm
    while ((lm = linkRe.exec(html)) !== null) {
      const href = lm[1]
      for (const [dom, name] of Object.entries(socialMap)) {
        if (href.toLowerCase().includes(dom)) {
          if (href.trim() === '#' || href.trim() === '' || href.endsWith('/#')) deadSocials.push(name)
          else liveSocials.push(name)
        }
      }
    }

    // — CTA / funnel —
    const ctaWords = ['get started', 'book', 'demo', 'audit', 'free trial', 'sign up', 'get access', 'start free', 'try']
    const ctaRe = /href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi
    let cm, deadCtas = 0, totalCtas = 0
    while ((cm = ctaRe.exec(lower)) !== null) {
      const label = cm[2].replace(/<[^>]*>/g, '').trim()
      if (ctaWords.some(w => label.includes(w)) && label.length < 50) {
        totalCtas++
        if (cm[1].trim() === '#' || cm[1].trim() === '') deadCtas++
      }
    }

    // — Content — check homepage for blog/content links broadly
    const hasBlog = /\/blog|\/articles|\/resources|\/insights|\/content|\/news|\/posts?|\/guides?|\/learn|\/academy|\/podcast/i.test(html)
    const hasYouTube = /youtube\.com(?:\/embed|\/channel|\/user|\/@)/i.test(html)
    const hasVideo = /<video/i.test(html) || /\.mp4/i.test(html) || /youtube\.com\/embed|vimeo\.com/i.test(html)
    const hasFreeOffer = /\bfree\b.{0,30}(trial|plan|demo|audit|forever)/i.test(bodyText)
    // Only flag missing content if there's genuinely nothing — no blog link, no YouTube, no video
    const hasAnyContent = hasBlog || hasYouTube || hasVideo

    // — Leaks — only report what we can actually confirm from the HTML
    const leaks = []
    if (!prices.length) leaks.push("No pricing visible on the page — visitors can't self-qualify, which increases bounce rate and wastes sales calls.")
    if (!pixels.length) leaks.push("No tracking pixel detected — you can't retarget visitors or measure what's actually converting. Every ad dollar flies blind.")
    if (!hasAnyContent) leaks.push("No blog, content hub, or video found linked from the homepage — organic traffic and trust-building are being left on the table.")
    if (deadCtas > 0) leaks.push(`${deadCtas} CTA button${deadCtas > 1 ? 's' : ''} link to a placeholder (#) — the page looks ready to sell but doesn't actually convert.`)
    const uniqueDead = [...new Set(deadSocials)]
    if (uniqueDead.length) leaks.push(`${uniqueDead.join(', ')} social link${uniqueDead.length > 1 ? 's' : ''} point to a placeholder (#) — visitors who want to verify you hit a dead end.`)

    // — Auto-fill suggestions —
    const a1Suggestion = [company, desc || h1].filter(Boolean).join(' — ').slice(0, 280)
    const a3Parts = []
    if (hasFreeOffer) a3Parts.push('Free offer detected on site')
    if (prices.length) a3Parts.push(`Pricing visible: ${prices.slice(0, 3).join(', ')}`)
    if (totalCtas) a3Parts.push(`${totalCtas} CTA button${totalCtas > 1 ? 's' : ''} found`)

    return Response.json({
      ok: true,
      company,
      domain,
      tagline: h1 || desc.slice(0, 120),
      description: desc,
      contactEmail: emails.find(e => !e.startsWith('example')) || null,
      prices,
      pixels,
      liveSocials: [...new Set(liveSocials)],
      deadSocials: [...new Set(deadSocials)],
      hasBlog,
      hasVideo,
      hasFreeOffer,
      leaks,
      prefill: {
        a1: a1Suggestion,
        a3: a3Parts.length ? a3Parts.join('. ') + '. (Describe your full funnel above)' : '',
      },
    })
  } catch (e) {
    return Response.json({ error: "Couldn't scan that site. Fill in the form manually — it only takes 3 minutes." }, { status: 200 })
  }
}
