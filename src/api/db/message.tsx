export const createMessage = async (
  roomId: string,
  userId: string,
  message: string,
) => {
  const res = await fetch(`/api/messages/create/`, {
    method: 'POST',
    body: JSON.stringify({
      room_uuid: roomId,
      user_uuid: userId,
      message: message,
    }),
  })
  if (res.status === 200) {
    return true
  } else {
    return false
  }
}
