import { atom } from 'recoil'
import { MediaAtomKeys } from '../recoil-keys'

export const audioEnabledState = atom<boolean>({
  key: MediaAtomKeys.AUDIO_ENABLED_STATE,
  default: true,
})

export const volumeState = atom<number>({
  key: MediaAtomKeys.VOLUME_STATE,
  default: 1,
})

export const videoEnabledState = atom<boolean>({
  key: MediaAtomKeys.VIDEO_ENABLED_STATE,
  default: true,
})

export const chatAnnouncementState = atom<boolean>({
  key: MediaAtomKeys.CHAT_ANNOUNCEMENT_STATE,
  default: false,
})

export const participantsState = atom<number>({
  key: MediaAtomKeys.PARTICIPANTS_STATE,
  default: 1,
})
