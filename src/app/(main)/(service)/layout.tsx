import React from 'react'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { AUTH_TOKEN_KEY } from '@/lib/auth'


export default function ServiceLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const store = cookies()
  const token = store.get(AUTH_TOKEN_KEY)
  if (!token) {
    return redirect('/login')
  }

  return <>{children}</>
}
