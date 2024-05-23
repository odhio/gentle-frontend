import { client } from '@/lib/api'
import { CalendarEvent } from '@/types/types'

type RoomMember = {
    member_uuid: string
    user_uuid: string
    name: string
    summary: string
};

export type RoomDetail = {
    uuid: string
    name: string
    summary: string
    emotion: string
    rooMembers: RoomMember[]
    closedAt: string
    googleSchedule?: CalendarEvent | null
};

type Response = {
    rooms: RoomDetail[]
}

const KEY = () => '/api/rooms/get_all/detail'

export const getAllRoomsDetail = async () => {
    const { data } = await client.get<Response>(KEY())
    return data.rooms
}
