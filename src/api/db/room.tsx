import { API_URL } from "@/config/env";
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
/*
export interface ResRoom {
    uuid: string;
    name: string;
    closed_at?: Date | null; // Optional field which can be Date or null
}
export interface ResGetAllRooms {
    rooms: ResRoom[];
}

export const getAllRooms = async () => {
    try {
        const response = await fetch(API_URL + '/api/rooms/get_all', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch all rooms');
        }
        return await response.json();
    } catch (error) {
        return [];
    }
};

export const closeRoom = async (roomId: string) => {
    const res = await fetch(API_URL + `/api/rooms/close/${roomId}`, {
        method: "DELETE",
        body: JSON.stringify({ room_uuid: roomId }),
    })
    if (res.status === 200) {
        return true;
    }
}


export const createRoom = async (roomId: string, roomName: string) => {
    const res = await fetch( API_URL + "/api/rooms/create", {
        method: "POST",
        body: JSON.stringify({ room_uuid: roomId, name: roomName }),
    })
    if (res.status === 200) {
        return true;
    } else {
        return false;
    }
}

export const joinRoom = async (roomId: string, userId: string) => {
    const res = await fetch( API_URL + "/api/rooms/join", {
        method: "POST",
        body: JSON.stringify({ roomId: roomId, userId: userId }),
    })
    if (res.status === 200) {
        return true;
    } else {
        return false;
    }
}
*/