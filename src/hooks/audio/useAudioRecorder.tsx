import { AudioRecorder } from '@/features/room/component/speech/AudioRecorder';
import { SpeechRecognitionComponent } from '@/features/room/component/speech/SpeechRecognition';
import { useEffect, useState, useRef } from 'react';
import { createMessage } from '@/features/room/api/message';
import { LocalDataStream } from '@skyway-sdk/core';

interface Props {
  roomId: string;
  userId: string;
  localDataStream: LocalDataStream;
  localAudioStream: MediaStream;
}

export const useAudioRecorder = ({roomId, userId, localDataStream, localAudioStream}: Props) => {
  useEffect(() => {
    if (!roomId || !userId || !localDataStream || !localAudioStream) {
      return
    }else{
      console.log('AudioRecorder initialized')
    }
  }, [roomId, userId, localDataStream, localAudioStream])

  const [isRecording, setIsRecording] = useState(false);
  const audioRecorderRef = useRef<AudioRecorder>();
  const speechRecognitionRef = useRef<SpeechRecognitionComponent>();

  useEffect(() => {
    if (!localAudioStream) return

    const audioRecorder = new AudioRecorder(
      roomId,
      userId,
      localDataStream,
      localAudioStream
    )
    const startFunc = () => {
      setIsRecording(true)
      audioRecorder.startRecording()
      audioRecorder.state = 'recording'
    }

    const speech = new SpeechRecognitionComponent(startFunc);
    console.log('speech', speech);

    audioRecorder.onError = () => {}

    audioRecorder.onAnalysisEnd((data:any) => {
      if (localDataStream !== undefined && data !== undefined) {
        localDataStream.write({
          type: 'emotion',
          member_id: userId,
          emotion: data.result,
          pressure: data.pressure,
        })
      } else {
        console.log('dataStream or data is undefined:', localDataStream, data)
      }
    })

    speech.onFinal = async (finalTranscript) => {
        const body = {
          room_uuid: roomId,
          user_uuid: userId,
          message: finalTranscript,
        }
        const messagePK = await createMessage(body)
        
        if (messagePK && messagePK !== undefined) {
          audioRecorder.stopRecording(messagePK)
        }
      audioRecorder.state = 'inactive'
      setIsRecording(false)
    }

    speech.onProgress = () => {
      if (audioRecorder.state !== 'recording') {
        setIsRecording(true)
        audioRecorder.startRecording()
        audioRecorder.state = 'recording'
      }
    }

    speech.onEnd = () => {
      if (isRecording) {
        audioRecorder.stopRecording()
      }
    }


    audioRecorderRef.current = audioRecorder
    speechRecognitionRef.current = speech

    return () => {
      audioRecorder.endRecording()
      speech.stop()
    }
  }, [localAudioStream])
  return (
    <></>
  )
}
