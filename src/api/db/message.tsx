import { API_URL } from "@/config/env";
import { client } from "@/lib/api";

export const createMessage = async (roomId: string, userId:string, message:string) => {
    const res = await fetch(API_URL +`/api/messages/create/`,{
        method: "POST",
        body: JSON.stringify({
            room_uuid: roomId,
            user_uuid: userId,
            message: message,
        }),
        })
    if (res.status === 200) {
        return true;
    }else{
        return false;
    }
}

type createMessageBody = {
    room_uuid: string,
    user_uuid: string,
    message: string,
  }

const createMessageKEY = () => '/api/messages/create/';

export const createMessage = async (body: createMessageBody) => {
  const res = await client.delete<Response>(createMessageKEY(),body)
  console.log(res);
  
  if (res.status === 200) {
    return true;
  }else{
    return false;
  }
};