import { client } from '@/lib/api'
import useSWR, { SWRConfiguration } from 'swr'

type Room = {
  uuid: string
  name: string
  emotion: string | null
  summary: string | null
  closed_at: string | null
}

type Response = {
  rooms: Room[]
}

const KEY = () => '/api/rooms/get_all'

export const getRoomList = async () => {
  const { data } = await client.get<Response>(KEY())
  return data
}

export const useRoomList = (options?: SWRConfiguration<Response>) =>
  useSWR(KEY(), getRoomList, options)