'use client'
import 'regenerator-runtime'
import { AudioRecorder } from '@/features/room/component/speech/audio-recorder'
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { createMessage } from '@/features/room/api/message'
import { useRecoilValue } from 'recoil'
import { mikeEnabledState } from '@/recoil/atoms/media-atom'

interface Props {
  roomId: string | undefined
  userId: string | undefined
  localAudioStream: MediaStream | undefined
}

export const useAudioRecorder = ({
  roomId,
  userId,
  localAudioStream,
}: Props) => {
  const mikeEnabled = useRecoilValue(mikeEnabledState)
  const audioRecorder = useMemo(() => {
    if (!roomId || !userId || !localAudioStream) return
    return new AudioRecorder(roomId, userId, localAudioStream)
  }, [roomId, userId, localAudioStream])

  const {
    interimTranscript,
    finalTranscript,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition()
  const [speechUnit, setSpeechUnit] = useState('' as string)
  const [transcribing, setTranscribing] = useState(false)

  useEffect(() => {
    console.log('useAudioRecorder: Initialize')

    if (browserSupportsSpeechRecognition) {
      SpeechRecognition.startListening({ continuous: true, language: 'ja-JP' })
    } else {
      console.error('SpeechRecognition is not supported in this browser')
    }
    return () => {
      SpeechRecognition.stopListening()
      audioRecorder?.cleanup()
    }
  }, [])

  useEffect(() => {
    if (!mikeEnabled || !audioRecorder) return
    if (interimTranscript !== '' && !transcribing) {
      setTranscribing(true)
      audioRecorder.startRecording()
    } else if (interimTranscript === '' && transcribing) {
      setTranscribing(false)
      setSpeechUnit(finalTranscript)
      resetTranscript()
      sendResults()
    }
  }, [interimTranscript, transcribing])

  const sendResults = useCallback(async () => {
    if (speechUnit === '' || roomId === undefined || userId === undefined)
      return
    const body = {
      room_uuid: roomId,
      user_uuid: userId,
      message: speechUnit ?? '',
    }
    console.log('sendResults:', body)

    const messageId = await createMessage(body)
    if (audioRecorder) {
      if (messageId) {
        audioRecorder.stopRecording(messageId)
      } else {
        audioRecorder.stopRecording()
      }
    }
  }, [speechUnit])
}
