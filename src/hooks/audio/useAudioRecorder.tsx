import { AudioRecorder } from '@/feature/routes/room/component/speech/AudioRecorder';
import { SpeechRecognitionComponent } from '@/feature/routes/room/component/speech/SpeechRecognition';
import { useRoom } from '@/contexts/RoomContext';
import { useEffect, useState, useRef, useMemo, useContext } from 'react';
import { SpeechMessage } from '@/types/DataModel';
import { uuidV4 } from '@skyway-sdk/token';
import { LoginUserContext } from '@/contexts/UserInfoContext';
import { useParams, useSearchParams } from 'next/navigation';
import { createMessage } from '@/api/db/message';
interface Props {
  userId?: string | undefined;
  localStream: MediaStream;
  roomId: string;
  loginUser: string;
}

export const useAudioRecorder = (props: Props) => {
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const audioRecorderRef = useRef<AudioRecorder>();
  const speechRecognitionRef = useRef<SpeechRecognitionComponent>();
  const { dataStream } = useRoom();
  const { loginUser } = useContext(LoginUserContext);

  const params = useParams()
  const searchParams = useSearchParams()
  const roomId = searchParams.get('roomId')
  const pk = params.slug

  const stream = useRef<MediaStream | null>(null)

  useMemo(() => {
    stream.current = props.localStream
  }, [props.localStream])
  useEffect(() => {
    if (!stream.current) return

    const audioRecorder = new AudioRecorder(
      dataStream,
      props.roomId,
      loginUser,
      stream.current,
    )
    const startFunc = () => {
      setIsRecording(true)
      audioRecorder.startRecording()
      audioRecorder.state = 'recording'
    }
    const speech = new SpeechRecognitionComponent(startFunc)

    if (speech == (null || undefined) || audioRecorder == (null || undefined)) {
      alert(
        `Failed to initialize speech recognition or audio recorder:${speech} ${audioRecorder}`,
      )
    }

    audioRecorder.onError = () => {}

    audioRecorder.onAnalysisEnd((data) => {
      if (dataStream !== undefined && data !== undefined) {
        dataStream.write({
          type: 'emotion',
          member_id: props.userId,
          emotion: data.result,
          pressure: data.pressure,
        })
      } else {
        console.log('dataStream or data is undefined:', dataStream, data)
      }
    })

    speech.onFinal = async (finalTranscript) => {
      setTranscript(finalTranscript)

      if (finalTranscript === '') return
      else {
        const message = finalTranscript
        const body = {
          room_uuid: roomId,
          user_uuid: loginUser,
          message: message,
        }
        const messagePK = await createMessage(body)
        if (messagePK !== null && messagePK !== undefined) {
          audioRecorder.stopRecording(messagePK)
          console.log('messagePK', messagePK)
        }
      }

      audioRecorder.state = 'inactive'
      setIsRecording(false)
    }

    speech.onProgress = (progressTranscript) => {
      if (audioRecorder.state == 'recording') {
        setInterimTranscript(progressTranscript)
      } else {
        setIsRecording(true)

        audioRecorder.startRecording()
        audioRecorder.state = 'recording'
      }
    }
    speech.onEnd = () => {
      if (isRecording) {
        audioRecorder.stopRecording()
      } else {
      }
    }

    speech.onError = () => {
      // TODO: エラー処理 内部的には書き起こしが途切れないように認識再開するようになっています
    }

    audioRecorderRef.current = audioRecorder
    speechRecognitionRef.current = speech

    return () => {
      audioRecorder.endRecording()
      speech.stop()
    }
  }, [stream])
  return <></>
}
