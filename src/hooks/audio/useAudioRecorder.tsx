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
  const [ interimResults, setInterimResults  ] = useState('');
  const audioRecorderRef = useRef<AudioRecorder>();
  const speechRecognitionRef = useRef<SpeechRecognitionComponent>();

  useEffect(() => {
    if (!localAudioStream) return

    const audioRecorder = new AudioRecorder(
      roomId,
      userId,
      localAudioStream
    )
    const startFunc = () => {
      setIsRecording(true)
      audioRecorder.startRecording()
    }

    const speech = new SpeechRecognitionComponent(startFunc);
    audioRecorder.onError = () => {}


    speech.onFinal = async (finalTranscript) => {
      console.log('finalTranscript', finalTranscript);
      let message 
      // 閾値の関係で最終結果だけ空の可能性もあるため、その場合はinterimResultsを使う
      if ( finalTranscript === '' && interimResults !== '') {
        message = interimResults
      }else if (finalTranscript !== '') {
        message = finalTranscript
      }else{
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
      if (!isRecording) {
        setIsRecording(true)
        audioRecorder.startRecording()
      }else{
        setInterimResults(intreimTranscript)
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
  }, [localAudioStream,localDataStream,roomId,userId,isRecording])
}
