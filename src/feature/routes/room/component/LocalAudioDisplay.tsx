import { useAudioRecorder } from '@/hooks/audio/useAudioRecorder'
import React from 'react'

interface Props {
  userId?: string | undefined
  localStream: MediaStream
  roomId: string
  loginUser: string
}

export const LocalAudioDisplay = (props: Props) => {
  const { transcript, interimTranscript, isRecording } = useAudioRecorder(props)
  return <></>
}
