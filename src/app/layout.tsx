import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Header } from '@/components/header/header'
import { Session } from 'next-auth'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Gentle - web meeting',
  description: 'Gentle is a web meeting app that is simple and easy to use.',
}

export default function RootLayout({
  children,
  session,
}: Readonly<{
  children: React.ReactNode
  session: Session
}>) {
  return (
    <html>
      <body className={inter.className}>
        <Providers session={session}>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  )
}
