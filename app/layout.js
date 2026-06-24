import './globals.css'
import { ThemeProvider } from '../components/ThemeContext'
import { Analytics } from '@vercel/analytics/react'

export const metadata = {
  title: 'TitanLeap — Done-For-You Growth Systems',
  description: 'Audit-first, done-for-you growth partner for SaaS founders. We build the funnel, automate lead flow, and scale your MRR.',
  keywords: 'SaaS growth, growth agency, funnel optimization, AI automation, revenue growth',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#080314" />
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
