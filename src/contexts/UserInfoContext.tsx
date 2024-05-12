'use client'

import React, {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from 'react'
import { UserInformation } from '@/types/DataModel'
import { getCookie, getCookies } from 'cookies-next'
import { AUTH_TOKEN_KEY } from '@/lib/auth'

export const LoginUserContext = createContext<{
  loginUser: UserInformation | null
  setLoginUser: React.Dispatch<React.SetStateAction<UserInformation | null>>
}>({
  loginUser: null,
  setLoginUser: () => {},
})

export const useLoginUser = () => {
  const context = useContext(LoginUserContext)
  if (!context) {
    throw new Error('useLoginUser must be used within a LoginUserProvider')
  }
  return context
}

export const LoginUserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [loginUser, setLoginUser] = useState<UserInformation | null>(null)
  useEffect(() => {
    const userInfoStore = getCookie(AUTH_TOKEN_KEY)
    let userInfo: UserInformation | null = null
    try {
      console.log(userInfoStore)
      userInfo = userInfoStore ? JSON.parse(userInfoStore) : null
      console.log(userInfo)
    } catch (error) {
      console.log(error)
      userInfo = null
    }
    setLoginUser(userInfo)
  }, [])

  const value = {
    loginUser,
    setLoginUser,
  }
  return (
    <LoginUserContext.Provider value={value}>
      {children}
    </LoginUserContext.Provider>
  )
}
