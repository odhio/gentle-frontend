import { atom, atomFamily } from 'recoil'
import { MediaAtomKeys } from '../recoil-keys'
import { MediaElements } from '../models'

export const audioTrackState = atom<MediaStreamTrack | null>({
  key: MediaAtomKeys.AUDIO_TRACK,
  default: null,
})

export const videoTrackState = atom<MediaStreamTrack | null>({
  key: MediaAtomKeys.VIDEO_TRACK,
  default: null,
})

export const mediaElementsState = atomFamily<MediaElements | null, number>({
  key: MediaAtomKeys.MEDIA_ELEMENTS_STATE,
  default: null,
})

export const mediaElementsIdState = atom<number[]>({
  key: MediaAtomKeys.MEDIA_ID_STATE,
  default: [],
})

export const mikeEnabledState = atom<boolean>({
  key: MediaAtomKeys.MIKE_ENABLED_STATE,
  default: true,
})

export const videoEnabledState = atom<boolean>({
  key: MediaAtomKeys.VIDEO_ENABLED_STATE,
  default: true,
})
