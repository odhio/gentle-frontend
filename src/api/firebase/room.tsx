import { db, app } from '@/lib/firebase/firebase';
import { v4 as uuidv4 } from 'uuid';
import { EmotionLabel, Room, SpeachMessage} from '@/types/DataModel';
import { equalTo, orderByChild, get, push, query, ref, orderByKey, update, onChildAdded, onValue } from 'firebase/database';
import { resolve } from 'path';

/* FIXME: if(!data.active)にすれば終了した会議のみ取得可能です。
active=false && result !==undefined で閉室済みの結果一覧をオブジェクト配列で受け取るような形で転用できるのではとおもってます */
export const getAllActiveRooms = async () => {
  const roomRef = ref(db, 'rooms/');
  let resultArray = [];
  
  await new Promise<void>((resolve) => {
    onValue(roomRef, (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        resultArray.push({ id: childSnapshot.key, ...data }); // PKと本文のペアで取ってます
      });
      resolve();
    });
  });

  return resultArray;
};

export const getClosedRooom = async () => {
  const roomRef = ref(db, 'rooms/');
  let resultArray = [];
  
  await new Promise<void>((resolve) => {
    onValue(roomRef, (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        if (data.active) {
          resultArray.push({ id: childSnapshot.key, ...data });
        }
      });
      resolve();
    });
  });

  return resultArray;
};

export const createRoom = async(roomId:string, roomname:string)=> {
  const roomRef = ref(db, 'rooms/');
  let data: any[] = [];
  await new Promise<void>((resolve) => {
    onValue(roomRef, (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        data.push(childSnapshot.val());
      });
      resolve();
    });
  });

  const roomExists = data.some((room) => room.roomId === roomId);

  if (roomExists) {
    return; 
  }
  const roomData = {
    roomId: roomId,               // ルームID
    name: roomname,              // ルーム名
    active: true,                   // 開催中/終了済み
    createdAt: Date.now() as number, // 開室日時
    closedAt: null,                 // 閉室日時
    messages: null,                 // メッセージ{[]}
  };
  const snapshot = await push(roomRef,roomData);
  
  return snapshot.key; // Firebase参照用のID
}

// ルーム参加画面
export const getActiveRooms = async()=> {
  const roomRef = ref(db, 'rooms/');
  const roomQuery = query(roomRef,orderByChild('active'), equalTo(true));
  const snapshot = await get(roomQuery);
  return snapshot.val();
}

export const checkRoomState = async (roomId: string) => {
  const roomRef = ref(db, 'rooms/');
  const roomQuery = query(roomRef,orderByChild('roomId'), equalTo(roomId));
  const snapshot = await get(roomQuery);
  console.log(snapshot);  
}

export const joinRoom=async(roomId:string, userId:string)=>{
    const roomRef = ref(db,'rooms/' + roomId + '/members');
    const snapshot = await push(roomRef,userId);

    return snapshot.key;
}

export const toggleRoomState = async (roomId: string): Promise<void> => {
  const roomRef = ref(db, 'rooms/' + roomId);
  await update(roomRef, { active: false });
}

export const pushChatMessageEmotion =async(roomId:string,chatMessagePK:string, emotion:EmotionLabel)=>{
  if (emotion.result === (null||undefined) || emotion.pressure === (null||undefined)) return
  const roomRef = ref(db,'rooms/' + roomId + '/messages/');
  const updates = {};
  updates[chatMessagePK+ '/emotion'] = emotion.result;
  updates[chatMessagePK+ '/pressure'] = emotion.pressure;
  await update(roomRef,updates);
  return 'success';
}

export const addMessageFB =async(roomId:string, message:SpeachMessage)=>{
    const roomRef = ref(db,'rooms/' + roomId + '/messages');
    const snapshot = await push(roomRef,message);

    return snapshot.key;
}



export const getRoomMessages = async (roomId: string): Promise<{
  [key: string]: SpeachMessage
}> =>{
  const r = ref(db, 'rooms/' + roomId + '/messages/');
  // FIXME: createdAtでソートしたかったがorderByChild('createdAt')だと動作しなかったため一旦keyでorderしてます。
  const q = query(r, orderByKey());
  const snapshot = await get(q);
  return snapshot.val();
}

export const addRoomSummary = async (roomId: string, summary: string): Promise<void> => {
    const roomRef = ref(db,'rooms/' + roomId);
    await update(roomRef, { summary: summary } satisfies Required<Pick<Room, 'summary'>>)
}
