import { LocalDataStream } from "@skyway-sdk/core";
import { client } from '@/lib/api'

type SendAudioBody = {
  message_uuid: string,
  audio: Blob,
}
const sendAudioKEY = (messageId: string) => `/api/audio/upload/${messageId}`;

export const sendAudio = async (dataStream: LocalDataStream, body:SendAudioBody) => {
  const formData = new FormData();
  formData.append("audio", body.audio);

  const res = await client.post<Response>(sendAudioKEY(body.message_uuid), formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    withCredentials: true,
  });

  const data = res.data;
  return data;
};

type createMessageBody = {
  room_uuid: string,
  user_uuid: string,
  message: string,
}

const createMessageKEY = () => '/api/messages/create/';

export const createMessage = async (body: createMessageBody) => {
const res = await client.post<Response>(createMessageKEY(),body)
console.log(res);

if (res.status === 200) {
  return true;
}else{
  return false;
}
};