// API関係
export interface UserInformation {
    id: string;
    name: string;
    joined?: string[];　// デイリースクラム
    image?: string;
}


// NOTE: 分析にまわす際のデータ整形がややこしくなりそうなので、ネスト構造をやめます
// ラベルのヒントとしてexportを外し、メモ的に置いておきます
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

export interface Room {
    id: string;
    sprint: string; // スプリントID, [...slug]でルーティングする形を想定しています。
    members: string[]; // BE側ではRDBのため配列長分の行をもつ
    createdAt: number;
    closedAt: number;
    messages: SpeechMessage[]; //発話データ
    summary?: string; // 要約
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