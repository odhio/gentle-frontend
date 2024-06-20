// API関係
export interface DateTimeInfo {
  dateTime: string
  timeZone: string
}

export interface UserInformation {
  uuid: string
  name: string
  image?: string
}

export interface EmotionLabel {
  result: string // happy, sad, anger, disgust, fear, neutral
  pressure: string // low, medium, high
}

export interface SpeechMessage {
  id: string
  memberId: string
  createdAt: number
  messageBody: string
  emotionLabel?: string
  pressure?: string
}

// Milestone
export interface Milestone {
  id: string
  name: string
  description: string
  createdAt: number
  closedAt?: number
  summary?: string
}

// DaylyScrum (child)
export interface Room {
  uuid: string
  name: string
  createdAt: number
  closedAt?: number
  members?: string[]
  summary?: string
  emotion?: EmotionLabel
  googleSchedule?: string
}

export interface UserEmotion {
  memberId: string
  emotion: string
  pressure: string
}

export interface Transcripts {
  memberId: string
  data: string
}
