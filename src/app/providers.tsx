'use client'

import React from 'react'

import { ChakraProvider } from '@chakra-ui/react'
import { LoginUserProvider } from '@/contexts/UserInfoContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return <ChakraProvider><LoginUserProvider>{children}</LoginUserProvider></ChakraProvider>
}
