import './globals.css'
import { ThemeProvider } from '../components/ThemeContext'
import { Analytics } from '@vercel/analytics/react'

export const metadata = {
  metadataBase: new URL('https://titanleap.co'),
  title: 'TitanLeap — Get more customers from the traffic you already have',
  description: 'We find where your SaaS is losing customers and show you exactly what to fix. Free first look within 24 hours.',
  openGraph: { siteName: 'TitanLeap', type: 'website', images: [{ url: '/og-home.png', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', images: ['/og-home.png'] },
  keywords: 'SaaS growth, growth agency, funnel optimization, AI automation, revenue growth',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#F7F3FF" />
        <script dangerouslySetInnerHTML={{ __html: "try{if(localStorage.getItem('tl-theme')!=='dark')document.documentElement.classList.add('light')}catch(e){document.documentElement.classList.add('light')}" }} />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
      </head>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
