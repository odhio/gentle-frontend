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

  constructor(restarter?: () => void) {
    this.recognition.lang = 'ja-JP'
    this.recognition.interimResults = true
    this.recognition.continuous = true
    this.running = false

    // 音声認識自体はデタッチされるまで実行し続けるようにする
    this.recognition.onend = () => {
      this.start()
    }

    this.recognition.onspeechend = () => {
      this.start()
    }

    this.recognition.onstart = () => {
      if (restarter) {
        restarter()
      }
    }

    this.recognition.onnomatch = (e) => {
      console.log(`I didn't recognize that. ${e.results}`)
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
        this.start()
      }
      this.start()
    }

    // 呼び出されたタイミングで実行
    this.start()
  }

  start() {
    if (this.running) return
    this.running = true
    this.recognition.start()
  }

  stop() {
    this.running = false
    this.recognition.stop()
  }

  toggle() {
    console.log(this)

    if (this.running) {
      this.stop()
    } else {
      this.start()
    }
  }
}
