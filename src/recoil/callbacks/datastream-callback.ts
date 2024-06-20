import { useRecoilCallback } from 'recoil'
import { ChatMessage } from '../models'
import {
  textDataStreamAtom,
  textDataStreamIdsAtom,
} from '../atoms/localstream-atom'

let id = 1
const getId = () => {
  return id++
}

export const updateTextState = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const addText = useRecoilCallback(
    ({ set }) =>
      (memberId: string, memberName: string, message: string) => {
        const newChatText: ChatMessage = {
          memberId: memberId,
          memberName: memberName,
          message: message,
        }
        console.log(newChatText)
        const id = getId()
        set(textDataStreamAtom(id), newChatText)
        set(textDataStreamIdsAtom, (prev) => [...prev, id])
      },
    [],
  )

  return {
    addText,
  }
}
