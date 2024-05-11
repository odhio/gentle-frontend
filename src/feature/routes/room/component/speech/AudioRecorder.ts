import { pushChatMessageEmotion } from "@/api/firebase/room";
import { sendAudio } from "@/api/room/api";
import { EventEmitter } from "events";

export class AudioRecorder {    
    private _audioChunks: Blob[];
    private _audioBlob: Blob | null;
    private _mediaRecorder: MediaRecorder | null;
    private _transcriptPK: string;
    private _eventEmitter: EventEmitter;
    private dataStream
    private _roomId: string;
    private _audioTrack;
    private _audioStream;

    readonly stream: MediaStream;
    
    userId: string;
    state: 'inactive' | 'recording' = 'inactive';
    
    onError: () => void;
    private _eventHandlers() {
        if (this._mediaRecorder == (null || undefined)) return;
    }

    private async _sendBlob(blob: Blob) {
        try{
            const data = await sendAudio(this.dataStream, this.userId, blob);
     
            if (data !== null || data !== undefined) {
                const result = await pushChatMessageEmotion(this._roomId, this._transcriptPK, data);
                console.log(result);
            }
            return data;
        }catch(e){
            console.error(e);
        }
    }

    constructor(dataStream, roomId:string, userId:string ,stream: MediaStream) {
        this._audioTrack = stream.getAudioTracks();
        this._audioStream = new MediaStream(this._audioTrack);
        this.dataStream = dataStream;
        this._roomId = roomId;
        this.userId = userId;
        this.stream = stream;
        this._audioChunks = [];
        this._audioBlob = null;
         // { mimeType: 'audio/webm'}で明示可能
        this._eventEmitter = new EventEmitter();
        this._eventHandlers();
        this.onError = () => {};
        this._mediaRecorder = null;
    }

    onAnalysisEnd(listener: (data: any) => void) {
        this._eventEmitter.on('analysisEnd', listener);
    }

    startRecording() {
        this._audioBlob = null;
        this._audioChunks = [];
        console.log("startRecording");
        this.state = 'recording';
        this._mediaRecorder = new MediaRecorder(this._audioStream, { mimeType: 'audio/webm' });
        
        this._mediaRecorder.ondataavailable = async (event: BlobEvent) => {
            if (this._transcriptPK == '') {
                return
            };         
            if (event.data.size > 0) {

                this._audioChunks.push(event.data);

                this._audioBlob = new Blob(this._audioChunks, { type: 'audio/wav' });
                console.log(this._audioBlob);
                
                const data = await this._sendBlob(this._audioBlob);
                console.log("Data emitted to analysisEnd:", data);
                
                this._eventEmitter.emit('analysisEnd', data);

                this._audioChunks = [];
            }
        };
        this._mediaRecorder.onstop = () => {
            this._audioBlob = new Blob(this._audioChunks, { type: 'audio/webm' });
            this._eventEmitter.emit('recordingStopped', this._audioBlob);
            this.state = 'inactive';
            this._audioBlob = null;
        };
    
        if (this._mediaRecorder && this._mediaRecorder.state !== 'recording') {
            this._mediaRecorder.start();
        }
    }
    
    stopRecording(pk?: string) {
        console.log("stopRecording");
        console.log(this._mediaRecorder);
        
        if (this.state === 'recording' && this._mediaRecorder && this._mediaRecorder.state === 'recording') {
            this._transcriptPK = pk || '';
            this._mediaRecorder.stop();
            console.log("stopRecording");
        } else {
            console.log("Recorder is not in recording state.");
        }
    }
    
    endRecordingOnRecognate(script:string){
        this._mediaRecorder?.stop();
    }
    endRecording() {
        this._mediaRecorder?.stop();
    }

    clearRecordedData() {
    }

}