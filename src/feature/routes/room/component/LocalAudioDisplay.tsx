import { useAudioRecorder } from '@/hooks/audio/useAudioRecorder'
import React, { useContext, useEffect, useRef } from 'react'
import { SpeechRecognitionComponent } from './speech/SpeechRecognition'
import { RoomContext } from '@/contexts/RoomContext'
import { LocalDataStream } from '@skyway-sdk/core'

interface Props {
  userId?: string | undefined
  localStream: MediaStream
  roomId: string
}

export const LocalAudioDisplay = (props: Props) => {
  const { transcript, interimTranscript, isRecording } = useAudioRecorder(
    props.userId,
    props.localStream,
  )
  const { roomId, setRoomId, dataStream, setDataStream } =
    useContext(RoomContext) || {}

  return <></>
}
