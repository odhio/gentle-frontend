import { API_URL } from '@/config/env';
import { LocalDataStream } from "@skyway-sdk/core";
import { client } from '@/lib/api'


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

