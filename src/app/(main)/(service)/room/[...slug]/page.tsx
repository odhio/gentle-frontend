'use client'
import { MeetingRoom } from '@/feature/routes/room/MeetingRoom'
import React from 'react'
import { RoomProvider } from '@/contexts/RoomContext'
import Layout from '@/app/_component/Layout'
import '@/styles/global.css'
import { LoginUserProvider } from '@/contexts/UserInfoContext'

export default function Room({
  params,
}: {
  params: { slug: ['sprints', 'roomId'] }
}) {
  return (
    <RoomProvider>
      <Layout>
        <LoginUserProvider>
          <MeetingRoom params={params.slug} />
        </LoginUserProvider>
      </Layout>
    </RoomProvider>
  )
}
