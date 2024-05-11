import { LocalDataStream } from "@skyway-sdk/core";
import { addRoomSummary, getRoomMessages, pushChatMessageEmotion } from "../firebase/room";

export const sendAudio=async(dataStream:LocalDataStream, userId:string, audioBlob:Blob)=>{
  const formData = new FormData();
  formData.append("audio", audioBlob);
  
  const res = await fetch("http://127.0.0.1:8000/api/audio/upload", {
    method: "POST",
    body: formData,
  });
  const data = res.json();
  if (dataStream !== undefined ) {
  const writeBody = async (sendAudioResult) => {
    const result = await sendAudioResult;
    dataStream.write({type:"emotion", member_id: userId, emotion: result["result"], "pressure": result["pressure"]});
  };
    writeBody(data);
  }
  return data;
}

export const announceRoomLeave = async(roomId: string)=>{
  try {
    let messages = await getRoomMessages(roomId);
    const sortedMessages = Object.values(messages).sort((a,b)=> new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    messages = {}

    if (!sortedMessages.length ) {
      return true
    }
    let content ='以下の会議の内容を要約してください\n'

    sortedMessages.forEach((message)=>{
      content += `
    --------------------------
    ${message.message_body}
    `
    })
    const res = await fetch("http://localhost:8000/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        { role: "user", content: content }
      ]),
    });

    const data = await res.json();

    await addRoomSummary(roomId, data['content']);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}