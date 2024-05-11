// API関係
export interface UserInformation {
    id: string;
    name: string;
    joined?: string[];
    image?: string;
}


export interface EmotionLabel {    
        result: string,   // happy, sad, anger, disgust, fear, neutral
        pressure: string, // low, medium, high
}

export interface SpeechMessage {
    id: string;
    memberId: string;
    createdAt: number;
    messageBody: string;
    emotionLabel?: string;
    pressure?: string;
}

// 会議開始画面に表示するデータ群
// Milestone (parent)
export interface Milestone{
    id: string;
    name: string; // 目標
    description: string; // 目標設定
    createdAt: number;
    closedAt: number;
    summary?: string; // 要約
}

// DaylyScrum (child)
export interface DaylyScrum {
    id: string;
    scrum: string;
    name?: string; // タスク名
    createdAt: number;
    closedAt: number;
    members: string[];
    summary?: string; // 要約
    emotion?: EmotionLabel
}



// DataStream(FE)関係
export interface ChatMessage {
    memberId: string;  // MemberID
    memberName: string;  // MemberName
    message: string;    // 任意の文字列
}

// こっちはチャット枠に表示する必要最低限の型
export interface UserEmotion {
    memberId: string;  // MemberID
    emotion: string;    // EmotionLabel [low,mid,high]
    pressure: string;   // Level 
}

export interface Transcripts {
    memberId: string;  // MemberID
    data: string;       // Transcription
}
export interface UserInfo {
    id: string;
    name: string;
    joined: string[]; // RoomID[]
    image: string;  // FilePath
}