import { client } from "@/lib/api";

interface CreateMessageBody {
    room_uuid: string;
    user_uuid: string;
    message: string;
  }

interface CreateMessageResponse {
    messageUuid: string;
}

const createMessageKEY = () => '/api/messages/create';

export const createMessage = async (body: CreateMessageBody) => {
  const res = await client.post<CreateMessageResponse>(createMessageKEY(),body)
  if (res.status === 200) {
    return res.data.messageUuid;
  }else{
    return false;
  }
};