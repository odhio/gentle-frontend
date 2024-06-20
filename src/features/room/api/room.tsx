'use server'
import { client } from '@/lib/api'
import { Room } from '@/types/types'

interface CloseRoomBody {
  room_uuid: string
}

interface CloseRoomResponse {
  room_uuid: string
  room_summary: string
  room_emotion: string
}

interface CreateRoomBody {
  room_uuid: string
  name: string
}

interface CreateRoomResponse {
  room_uuid: string
  name: string
}

interface JoinRoomBody {
  room_uuid: string
  user_uuid: string
}

interface JoinRoomResponse {
  success: boolean
}
interface AllRoomsResponse {
  rooms: Room[]
}

const getAllRoomsKEY = () => `/api/rooms/get_all`
const CloseRoomKEY = (roomId: string) => `/api/rooms/close/${roomId}`
const CreateRoomKEY = () => '/api/rooms/create'
const JoinRoomKEY = () => '/api/room_members/join'

export const getAllRooms = async (): Promise<Room[]> => {
  const res = await client.get<AllRoomsResponse>(getAllRoomsKEY())

  let results: Room[] = []
  let rooms = []
  if (res.status === 200) {
    rooms = res.data.rooms
    rooms.forEach((room) => {
      results.push(room)
    })
  }
  return results
}

export const joinRoom = async (body: JoinRoomBody): Promise<boolean> => {
  const res = await client.post<JoinRoomResponse>(JoinRoomKEY(), body)
  if (res.status === 200) {
    return true
  } else {
    return false
  }
}

export const createRoom = async (
  body: CreateRoomBody,
): Promise<CreateRoomBody> => {
  const res = await client.post<CreateRoomResponse>(CreateRoomKEY(), body)
  return res.data
}

export const closeRoom = async (
  body: CloseRoomBody,
): Promise<CloseRoomResponse> => {
  const res = await client.post<CloseRoomResponse>(CloseRoomKEY(body.room_uuid))
  return res.data
}
