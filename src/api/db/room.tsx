import { client } from "@/lib/api";

type CloseRoomBody = {
  room_uuid: string;
}

type CreateRoomBody = {
  room_uuid: string;
  name: string;
}

type JoinRoomBody = {
  room_uuid: string;
  user_uuid: string;
}

const getAllRoomsKEY = () => `/api/rooms/get_all`;
const CloseRoomKEY = (roomId: string) => `/api/rooms/close/${roomId}`;
const CreateRoomKEY = () => '/api/rooms/create';
const JoinRoomKEY = () => '/api/room_members/join';

export const getAllRooms = async () => {
  const { data } = await client.get<Response>(getAllRoomsKEY())
  console.log(data);
  
  return data
}

export const closeRoom = async (body: CloseRoomBody) => {
  const res = await client.delete<Response>(CloseRoomKEY(body.room_uuid))
  console.log(res);
  
  if (res.status === 200) {
    return true;
  }else{
    return false;
  }
}

export const createRoom = async (body: CreateRoomBody) => {
  const { data } = await client.post<Response>(CreateRoomKEY(), body)
  console.log(data);
  
  return data
}

export const joinRoom = async (body: JoinRoomBody) => {
  const res = await client.post<Response>(JoinRoomKEY(), body)
  if (res.status === 200) {
    return true;
  } else {
    return false;
  }
}