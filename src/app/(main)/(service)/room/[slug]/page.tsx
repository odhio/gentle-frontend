'use client'
import { MeetingRoom } from '@/features/room/routes/meeting-room'
import React from 'react'
import { RoomProvider } from '@/contexts/RoomContext'
import Layout from '@/app/(main)/layout'
import '@/styles/global.css'

export default function Room() {
  return (
    <RoomProvider>
      <Layout>
          <MeetingRoom />
      </Layout>
    </RoomProvider>
  )
}
