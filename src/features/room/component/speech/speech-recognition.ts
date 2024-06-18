export class SpeechRecognitionComponent {
  recognition =
    new window.webkitSpeechRecognition() || new window.SpeechRecognition()
  running: boolean

  // eslint-disable-next-line no-unused-vars
  onFinal?: (str: string) => void
  // eslint-disable-next-line no-unused-vars
  onProgress?: (str: string) => void
  onError?: () => void
  onEnd?: () => void

  constructor() {
    this.recognition.lang = 'ja-JP'
    this.recognition.interimResults = true
    this.recognition.continuous = true
    this.running = false

    // 音声認識自体はデタッチされるまで実行し続けるようにする
    this.recognition.onsoundend = () => {
      this.running = false
      console.log('音声認識が停止しました。')
      SpeechRecognitionComponent.prototype.start()
    }

    this.recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        console.log(event.results[i][0].transcript)

        if (event.results[i].isFinal) {
          if (this.onFinal) {
            this.onFinal(event.results[i][0].transcript)
          }
        } else {
          if (this.onProgress) {
            this.onProgress(event.results[i][0].transcript)
          }
        }
      }
    }

    this.recognition.onerror = (event) => {
      if (event.error === 'no-speech') {
        console.log('No speech was detected. Please try again.')
        this.start()
      } else if (event.error === 'network') {
        console.error(
          'Speech recognition aborted due to network error.Please check your network settings if this error continues to occur.',
        )
        this.start()
      } else {
        this.stop()
      }
    }
    this.start()
  }

  start() {
    console.log('音声認識を開始します。')

    if (this.running === false) {
      this.running = true
      console.log(this.recognition)
      this.recognition.start()
    }
  }

  stop() {
    if (this.running === true) {
      this.running = false
      this.recognition.stop()
    }
  }
}
