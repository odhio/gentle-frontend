export interface MediaElements {
  publicationId: string
  videoElement: HTMLVideoElement | null
  audioElement: HTMLAudioElement | null
  mikeEnabled: boolean
  videoEnabled: boolean
  state?: string
}
