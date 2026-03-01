import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { clsx } from 'clsx'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'R&R Tool Tracking System',
  description: 'Reward and Recognition Submission Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={clsx(inter.className, 'min-h-screen bg-slate-50 text-slate-900')}>
        {children}
      </body>
    </html>
  )
}
