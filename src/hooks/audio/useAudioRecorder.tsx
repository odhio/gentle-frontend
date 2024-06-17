import { AudioRecorder } from '@/features/room/component/speech/audio-recorder'
import { SpeechRecognitionComponent } from '@/features/room/component/speech/speech-recognition'
import { useEffect, useState } from 'react'
import { createMessage } from '@/features/room/api/message'
import { LocalDataStream } from '@skyway-sdk/core'
import { useRecoilValue } from 'recoil'
import { mikeEnabledState } from '@/recoil/atoms/media-atom'

interface Props {
  roomId: string | undefined
  userId: string | undefined
  localDataStream: LocalDataStream | undefined
  localAudioStream: MediaStream | undefined
}

export const useAudioRecorder = ({
  roomId,
  userId,
  localDataStream,
  localAudioStream,
}: Props) => {
  const [isRecording, setIsRecording] = useState(false)
  const [interimResults, setInterimResults] = useState('')
  const mikeEnabled = useRecoilValue(mikeEnabledState)

  useEffect(() => {
    if (!roomId || !userId || !localDataStream || !localAudioStream) return
    console.log('AudioRecorder initialized')

    const audioRecorder = new AudioRecorder(roomId, userId, localAudioStream)
    const startFunc = () => {
      setIsRecording(true)
      audioRecorder.startRecording()
    }

    const speech = new SpeechRecognitionComponent(startFunc)

    speech.onFinal = async (finalTranscript) => {
      if (mikeEnabled === false) return
      console.log('finalTranscript', finalTranscript)
      let message
      // 閾値の関係で最終結果だけ空の可能性もあるため、その場合はinterimResultsを使う
      if (finalTranscript === '' && interimResults !== '') {
        message = interimResults
      } else if (finalTranscript !== '') {
        message = finalTranscript
      } else {
        message = '' // 何もない場合は空文字を入れてBE側で音声認識を行う（試験実装）
      }

      const body = {
        room_uuid: roomId,
        user_uuid: userId,
        message: message,
      }
      const messagePK = await createMessage(body)

      if (messagePK && messagePK !== undefined) {
        audioRecorder.stopRecording(messagePK)
      }
      setIsRecording(false)
    }

    speech.onProgress = (intreimTranscript) => {
      console.log('intreimTranscript', intreimTranscript)

      if (!isRecording) {
        setIsRecording(true)
        audioRecorder.startRecording()
      } else {
        setInterimResults(intreimTranscript)
      }
    }

    speech.onEnd = () => {
      if (isRecording) {
        audioRecorder.stopRecording()
      }
    }

    return () => {
      audioRecorder.endRecording()
      audioRecorder.cleanup()
      speech.stop()
    }
  }, [localAudioStream, localDataStream, roomId, userId, isRecording])
}
