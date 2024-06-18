// DataStreamはソケットを通じて時間差でデータを受け取るためundefinedを許容する形にしてます
export interface MediaElementsType {
  publicationId?: string
  videoElement?: HTMLVideoElement
  audioElement?: HTMLAudioElement
  mikeEnabled: boolean
  videoEnabled: boolean
  state?: string
}
