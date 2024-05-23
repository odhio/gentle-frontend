import { client } from '@/lib/api'

interface SendAudioBody {
  message_uuid: string;
  audio: Blob;
}

interface SendAudioResponse {
  result: string;
  pressure: string;
}

const sendAudioKEY = (messageId: string) => `/api/audio/upload/${messageId}`;

export const sendAudio = async (body:SendAudioBody) => {
  const formData = new FormData();
  formData.append("audio", body.audio);

  const res = await client.post<SendAudioResponse>(sendAudioKEY(body.message_uuid), formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    withCredentials: true,
  });

  const data = res.data;
  return data;
};

