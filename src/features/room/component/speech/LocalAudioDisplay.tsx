import { useAudioRecorder } from '@/hooks/audio/useAudioRecorder'
import { LocalDataStream } from '@skyway-sdk/core';
import React from 'react'

interface Props {
  roomId: string;
  userId: string;
  localDataStream: LocalDataStream;
  localAudioStream: MediaStream;
}

export const LocalAudioDisplay = (props: Props) => {
  useAudioRecorder(props)
  return <></>
}
