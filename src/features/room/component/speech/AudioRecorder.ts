'use client'
import { sendAudio } from '@/features/room/api/audio'
import { EventEmitter } from 'events'

export class AudioRecorder {
  private _mediaRecorder: MediaRecorder | null
  private _audioChunks: Blob[]
  private _audioBlob: Blob | null
  private _transcriptPK: string
  private _audioStream
  private _userId: string
  private _roomId: string
  private _eventEmitter: EventEmitter

  onError: () => void
  private _eventHandlers() {
    if (this._mediaRecorder == (null || undefined)) return
  }

  private async _sendBlob(blob: Blob, messageId:string) {
    try {
      const body = {
        message_uuid: messageId,
        audio: blob,
      }
    
      const data = await sendAudio(body)
      return data
    } catch (e) {
      console.error(e)
    }
  }

  constructor(roomId: string, userId: string, audioStream: MediaStream) {
    this._mediaRecorder = null
    this._audioChunks = []
    this._audioBlob = null
    this._transcriptPK = ''
    this._audioStream = audioStream
    this._userId = userId
    this._roomId = roomId
    this._eventEmitter = new EventEmitter()

    this._eventHandlers()
    this.onError = () => {}
  }

// eslint-disable-next-line no-unused-vars
onAnalysisEnd(listener: (data:any) => void) {
    this._eventEmitter.on('analysisEnd', listener)
}

  startRecording() {
    this._audioBlob = null
    this._audioChunks = []
    this._mediaRecorder = new MediaRecorder(this._audioStream, {
      mimeType: 'audio/webm',
    })

    this._mediaRecorder.ondataavailable = async (event: BlobEvent) => {
      if (this._transcriptPK == '') {
        return
      }
      if (event.data.size > 0) {
        this._audioChunks.push(event.data)

        this._audioBlob = new Blob(this._audioChunks, { type: 'audio/wav' })
        if(!this._transcriptPK) return
        const data = await this._sendBlob(this._audioBlob,this._transcriptPK)
        this._eventEmitter.emit('analysisEnd', data)
        this._audioChunks = []

        return data
      }
    }

    this._mediaRecorder.onstop = () => {
      this._audioBlob = new Blob(this._audioChunks, { type: 'audio/webm' })
      this._eventEmitter.emit('recordingStopped', this._audioBlob)
      this._audioBlob = null
    }

    if (this._mediaRecorder && this._mediaRecorder.state !== 'recording') {
      console.log('Recorder is starting');
      console.log(this._mediaRecorder.state);
      
      this._mediaRecorder.start()
    }
  }

  stopRecording(pk?: string) {
    if (
      this._mediaRecorder &&
      this._mediaRecorder.state === 'recording'
    ) {
      this._transcriptPK = pk || ''
      this._mediaRecorder.stop()
    } else {
      console.log('Recorder is not in recording state.')
    }
  }

  endRecordingOnRecognate() {
    this._mediaRecorder?.stop()
  }
  endRecording() {
    this._mediaRecorder?.stop()
  }

  clearRecordedData() {}
}
