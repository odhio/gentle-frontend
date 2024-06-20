import { atom, atomFamily, selector } from 'recoil'
import { LocalStreamAtomKeys } from '../recoil-keys'
import { ChatMessage } from '../models'

export const localAudioStreamAtom = atom<MediaStream | null>({
  key: LocalStreamAtomKeys.LOCAL_AUDIO_STREAM,
  default: null,
})

export const localVideoStreamAtom = atom<MediaStream | null>({
  key: LocalStreamAtomKeys.LOCAL_VIDEO_STREAM,
  default: null,
})

export const textDataStreamAtom = atomFamily<ChatMessage | null, number>({
  key: LocalStreamAtomKeys.TEXT_DARA_STREAM,
  default: null,
})

export const textDataStreamIdsAtom = atom<number[]>({
  key: LocalStreamAtomKeys.TEXT_DARA_STREAM_IDS,
  default: [],
})

export const stateTextData = selector<ChatMessage[] | null>({
  key: LocalStreamAtomKeys.TEXT_DATA_SELECTOR,
  get: ({ get }) => {
    const chatIds = get(textDataStreamIdsAtom)
    return chatIds.map((chatId) => get(textDataStreamAtom(chatId))) as
      | ChatMessage[]
      | null
  },
})
