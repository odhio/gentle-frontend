'use server'

import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function Home() {
  const user = await auth()
  if (user) {
    redirect('/lounge')
  } else {
    redirect('/login')
  }
}
