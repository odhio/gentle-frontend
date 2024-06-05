import { client } from '@/lib/api'


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
};

type Response = {
    rooms: RoomDetail[]
}

const KEY = () => '/api/rooms/get_all/detail'

export const getAllRoomsDetail = async () => {
    const { data } = await client.get<Response>(KEY())
    return data.rooms
}
