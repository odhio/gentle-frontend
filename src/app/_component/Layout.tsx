'use client'

import CommonHeader from './CommonHeader'
import { useState } from 'react'
import { UserInformation } from '@/types/DataModel'

const Layout = ({ children }) => {
  const [loginUser, setLoginUser] = useState<UserInformation | null>(null)
  const value = { loginUser, setLoginUser }
  return (
    <>
      <main>{children}</main>
    </>
  )
}

export default Layout
