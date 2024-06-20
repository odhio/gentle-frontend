'use client'
import { LocalDataStream, LocalP2PRoomMember } from '@skyway-sdk/room'
import React, {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from 'react'

// Recoilで管理しようとしたら読み取り専用プロパティにも書き込みアクセスしたので一旦こちらに移してます
type RoomContextType = {
  me: LocalP2PRoomMember | null
  setMe: Dispatch<SetStateAction<LocalP2PRoomMember | null>>
  localDataStream: LocalDataStream | null
  setLocalDataStream: Dispatch<SetStateAction<LocalDataStream | null>>
}

export const RoomContext = createContext<RoomContextType | undefined>(undefined)

export const useRoom = () => {
  const context = useContext(RoomContext)
  if (!context) {
    throw new Error('useRoom must be used within a RoomProvider')
  }
  return context
}

export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [me, setMe] = useState<LocalP2PRoomMember | null>(null)
  const [localDataStream, setLocalDataStream] =
    useState<LocalDataStream | null>(null)

  const value = {
    me: me,
    setMe: setMe,
    localDataStream: localDataStream,
    setLocalDataStream: setLocalDataStream,
  }

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>
}
