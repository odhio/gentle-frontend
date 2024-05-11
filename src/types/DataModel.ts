// API関係
export interface UserInformation {
    id: string;
    name: string;
    joined?: string[];
    image?: string;
}


// NOTE: 分析にまわす際のデータ整形がややこしくなりそうなので、ネスト構造をやめます
// ラベルのヒントとしてexportを外し、メモ的に置いておきます
export interface EmotionLabel {    
        result: string,   // happy, sad, anger, disgust, fear, neutral
        pressure: string, // low, medium, high
}

// データベース構成関係
export interface SpeechMessage {
    id: string;
    memberId: string;
    createdAt: number;
    messageBody: string;
    emotionLabel?: string; // 推論完了後に追加
    pressure?: string;
}

export interface Room {
    active: boolean;
    members: string[]; // MemberID[]
    createdAt: number;
    closedAt: number;
    messages: SpeachMessage[];
    summary?: string;
}

/* TODO: ここは要件に応じて拡張する方向で考えております
export interface MeetingResult {
    roomId: string;
    summary: string;
}
*/

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