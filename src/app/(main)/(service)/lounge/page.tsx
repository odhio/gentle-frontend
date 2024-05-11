'use client'

import React from 'react'
import { RoomProvider } from '@/contexts/RoomContext'
import Layout from '@/app/_component/Layout'
import { LoungeRoom } from '@/feature/routes/lounge/component/Lounge'

export default function Lounge() {
  return (
    <Layout>
      <RoomProvider>
        <LoungeRoom />
      </RoomProvider>
    </Layout>
  )
}
