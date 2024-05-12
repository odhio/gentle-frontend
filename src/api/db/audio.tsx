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
  const formattedData = { result: data.result, pressure: data.pressure };
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
};

