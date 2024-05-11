'use client'

import React from 'react'
import { RoomProvider } from '@/contexts/RoomContext'
import Layout from '@/app/_component/Layout'
import { LoungeRoom } from '@/feature/routes/lounge/component/Lounge'

export default function Lounge(
  {
    /*{params}:{prams: {slug: ['sprint']}}*/
  },
) {
  return (
    <Layout>
      <RoomProvider>
        <LoungeRoom /*params={params}*/ />
      </RoomProvider>
    </Layout>
  )
}
