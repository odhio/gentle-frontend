import NextAuth from 'next-auth'
import { authConfig } from './auth'

export const { auth: middleware } = NextAuth(authConfig)
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|asset|favicon.ico|sw.js).*)'],
}
