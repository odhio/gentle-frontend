import { useRecoilCallback } from 'recoil'
import { mediaElementsIdState, mediaElementsState } from '../atoms/media-atom'
import { MediaElementsType } from '../models'

export const updateMediaElements = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const addMediaElementAtom = useRecoilCallback(
    ({ set }) =>
      (id: string) => {
        {
          const newMediaElement: MediaElementsType = {
            publicationId: id,
            mikeEnabled: true,
            videoEnabled: true,
          }
          set(mediaElementsState(id), newMediaElement)
          set(mediaElementsIdState, (prev) => [...prev, id])
        }
      },
    [],
  )

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const addVideoElement = useRecoilCallback(
    ({ set }) =>
      (id: string, element: HTMLVideoElement) => {
        set(mediaElementsState(id), (prev: MediaElementsType | null) => {
          if (!prev || id !== prev.publicationId) return null
          return {
            ...prev,
            videoElement: element,
            mikeEnabled: prev.mikeEnabled ?? true,
            videoEnabled: prev.videoEnabled ?? true,
          }
        })
      },
    [],
  )

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const addAudioElement = useRecoilCallback(
    ({ set }) =>
      (id: string, element: HTMLAudioElement) => {
        set(mediaElementsState(id), (prev: MediaElementsType | null) => {
          if (!prev || id !== prev.publicationId) return null
          return {
            ...prev,
            audioElement: element,
            mikeEnabled: prev.mikeEnabled ?? true,
            videoEnabled: prev.videoEnabled ?? true,
          }
        })
      },
    [],
  )
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const removeMediaElementAtom = useRecoilCallback(
    ({ set, reset }) =>
      (id: string) => {
        set(mediaElementsIdState, (prev) => prev.filter((id) => id !== id))
        reset(mediaElementsState(id))
      },
    [],
  )

  return {
    addMediaElementAtom,
    addVideoElement,
    addAudioElement,
    removeMediaElementAtom,
  }
}
