import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'B2B Subscription Calculator | eTrainToday',
  description: 'Calculate your enterprise training subscription with tier-based pricing, volume discounts, and pay-as-you-go course options from eTrainToday.',
  keywords: 'B2B training, enterprise subscription, OSHA training, safety training, volume discounts',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
