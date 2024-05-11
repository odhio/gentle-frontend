export const getAllRooms = async () => {
    try {
      const response = await fetch('/api/rooms/get_all', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch all rooms');
      }
      return await response.json();
    } catch (error) {
      return [];
    }
  };
  
export const closeRoom = async (roomId: string) => {
    const res = await fetch(`/api/rooms/close/${roomId}`,{
        method: "DELETE",
        body: JSON.stringify({room_uuid: roomId}),
        })
    if (res.status === 200) {
        return true;
    }
}


export const createRoom = async (roomId: string, roomName:string) => {
    const res = await fetch("/api/rooms/create",{
        method: "POST",
        body: JSON.stringify({room_uuid: roomId, nmae: roomName}),
        })
    if (res.status === 200) {
        return true;
    }else{
        return false;
    }
}

export const joinRoom = async (roomId: string, userId:string) => {
    const res = await fetch("/api/rooms/join",{
        method: "POST",
        body: JSON.stringify({roomId: roomId, userId: userId}),
        })
    if (res.status === 200) {
        return true;
    }else{
        return false;
    }
}
