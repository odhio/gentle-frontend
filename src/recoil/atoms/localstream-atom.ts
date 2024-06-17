import { atom } from 'recoil'
import { LocalStreamAtomKeys } from '../recoil-keys'
import { LocalDataStream } from '@skyway-sdk/core'

export const localAudioStreamAtom = atom<MediaStream | null>({
  key: LocalStreamAtomKeys.Local_Audio_Stream,
  default: null,
})

export const localVideoStreamAtom = atom<MediaStream | null>({
  key: LocalStreamAtomKeys.Local_Video_Stream,
  default: null,
})

export const localDataStreamAtom = atom<LocalDataStream | null>({
  key: LocalStreamAtomKeys.Local_Data_Stream,
  default: null,
})
