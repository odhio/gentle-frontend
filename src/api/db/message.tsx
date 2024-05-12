import { client } from "@/lib/api";

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