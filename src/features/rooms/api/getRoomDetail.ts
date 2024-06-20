'use client'
import { client } from '@/lib/api'
import useSWR, { SWRConfiguration } from 'swr'

type RoomMember = {
  member_uuid: string
  user_uuid: string
  name: string
  summary: string
}

type Response = {
  uuid: string
  name: string
  summary: string
  emotion: string
  roomMembers: RoomMember[]
  closedAt: string
  googleSchedule?: CalendarEvent | null
}

type DateTimeInfo = {
  dateTime: string
  timeZone: string
}

type CalendarEvent = {
  end: DateTimeInfo
  start: DateTimeInfo
  summary: string
  location: string
  description: string
}

const KEY = (roomUuid: string) => `/api/rooms/detail/${roomUuid}`

export const getRoomDetail = async (roomUuid: string) => {
  const { data } = await client.get<Response>(KEY(roomUuid))
  return data
}

export const useRoomDetail = (
  roomUuid: string | undefined,
  options?: SWRConfiguration<Response>,
) =>
  useSWR(
    roomUuid ? [KEY(roomUuid)] : null,
    () => getRoomDetail(roomUuid!),
    options,
  )
