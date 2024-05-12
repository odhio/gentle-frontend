import { API_URL } from '@/config/env';
import { LocalDataStream } from "@skyway-sdk/core";
import { client } from '@/lib/api'

/*
export const sendAudio=async(dataStream:LocalDataStream, userId:string, messageId:string, audioBlob:Blob)=>{
  const formData = new FormData();
  formData.append("audio", audioBlob);

  const res = await fetch(API_URL + `/api/audio/upload/${messageId}`, {
    credentials: 'include',

    method: "POST",
    body: formData,
  })
  const data = res.json()
  if (dataStream !== undefined) {
    const writeBody = async (emotion) => {
      dataStream.write({
        type: 'emotion',
        member_id: userId,
        emotion: emotion['result'],
        pressure: emotion['pressure'],
      })
    }
    writeBody(data)
  }
  return data
}
*/


export const closeRoom = async (body: CloseRoomBody) => {
  const res = await client.delete<Response>(CloseRoomKEY(body.room_uuid))
  console.log(res);
  
  if (res.status === 200) {
    return true;
  }else{
    return false;
  }
}

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

  const data = await res.json();

  if (dataStream !== undefined) {
    const writeBody = async (emotion: { result: string, pressure: number }) => {
      dataStream.write({
        type: 'emotion',
        member_id: userId,
        emotion: emotion.result,
        pressure: emotion.pressure,
      });
    };
    writeBody(data);
  }

  return data;
};

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