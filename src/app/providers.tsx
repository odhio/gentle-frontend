'use client'
import React from 'react'
import { SessionProvider } from 'next-auth/react'
import { ChakraProvider } from '@chakra-ui/react'
import { Session } from 'next-auth'
import customTheme from '@/lib/chakra/theme'
import { RecoilRoot } from 'recoil'

export function Providers({
  children,
  session,
}: {
  children: React.ReactNode
  session: Session
}) {
  return (
    <SessionProvider session={session}>
      <RecoilRoot>
        <ChakraProvider theme={customTheme}>{children}</ChakraProvider>
      </RecoilRoot>
    </SessionProvider>
  )
}
