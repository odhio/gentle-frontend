import React, { createContext, useContext, useState, Dispatch, SetStateAction } from 'react';
import { LocalDataStream } from '@skyway-sdk/core';
import { set } from 'firebase/database';
import { Room } from '@skyway-sdk/room';

interface RoomMetaInfo {
    roomName?: string;
    roomDescription?: string;
    roomIcon?: string;
}

type RoomContextType = {
    roomCtx: Room | null;
    setRoomCtx: Dispatch<SetStateAction<Room | null>>;

    roomMetaInfo: RoomMetaInfo| null;
    setRoomMetaInfo: Dispatch<SetStateAction<RoomMetaInfo | null>>;

    roomId: string | null;
    setRoomId: Dispatch<SetStateAction<string | null>>;

    dataStream: LocalDataStream | undefined;
    setDataStream: Dispatch<SetStateAction<LocalDataStream | undefined>>;

    audioStream: MediaStream | undefined;
    setAudioStream: Dispatch<SetStateAction<MediaStream | undefined>>;

    videoStream: MediaStream | undefined;
    setVideoStream: Dispatch<SetStateAction<MediaStream | undefined>>;
};

export const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const useRoom = () => {
    const context = useContext(RoomContext);
    if (!context) {
        throw new Error('useRoom must be used within a RoomProvider');
    }
    return context;
};

export const RoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [roomId, setRoomId] = useState<string | null>(null);
    const [dataStream, setDataStream] = useState<LocalDataStream>();
    const [audioStream, setAudioStream] = useState<MediaStream>();
    const [videoStream, setVideoStream] = useState<MediaStream>();
    const [roomCtx, setRoomCtx] = useState<Room | null>(null);
    const [roomMetaInfo, setRoomMetaInfo] = useState<RoomMetaInfo | null>(null);

    const value = {
        roomCtx,
        setRoomCtx,
        
        roomMetaInfo,
        setRoomMetaInfo,

        roomId,
        setRoomId,
        
        audioStream,
        setAudioStream,
        
        videoStream,
        setVideoStream,
        
        dataStream,
        setDataStream
    };

    return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};
