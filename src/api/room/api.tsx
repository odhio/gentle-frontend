import { API_URL } from "@/config/env";
import { LocalDataStream } from "@skyway-sdk/core";

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

/* BEに移動
export const announceRoomLeave = async (roomId: string) => {
  try {
    let messages = await getRoomMessages(roomId)
    const sortedMessages = Object.values(messages).sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    )
    messages = {}

    if (!sortedMessages.length) {
      return true
    }
    let content = '以下の会議の内容を要約してください\n'

    sortedMessages.forEach((message) => {
      content += `
    --------------------------
    ${message.message_body}
    `
    })
    const res = await fetch(API_URL + "/api/generate", {
      credentials: 'include',
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([{ role: 'user', content: content }]),
    })

    const data = await res.json()

    await addRoomSummary(roomId, data['content'])
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}
*/