'use client';

import { LocalAudioStream, LocalP2PRoomMember, LocalVideoStream, P2PRoom, RoomPublication, SkyWayContext, SkyWayRoom, SkyWayStreamFactory } from "@skyway-sdk/room";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { RoomContext } from "@/contexts/RoomContext";
import { Dialog } from "@/components/Dialog";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Box, Button, Flex, Grid, GridItem, Heading, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Spinner, Text, Textarea, useToast } from "@chakra-ui/react";
import { CloseIcon, EditIcon } from "@chakra-ui/icons";
import { ChatSpace } from "../component/chat/ChatSpace";
import { ChatMessage } from "@/types/types";
import { createRoom, joinRoom } from "@/features/room/api/room";
import { LocalAudioDisplay } from "../component/speech/LocalAudioDisplay";
import { useSession } from "next-auth/react";
import { getToken } from "@/features/room/api/token";
import { API_URL } from "@/config/env";
import { useBeforeUnloadFunction } from "@/hooks/useBeforeUnloadFn";
import { useAudioRecorder } from "@/hooks/audio/useAudioRecorder";


export interface PopoverEmotions {
    member: string;
    emotion: string;
    pressure: string;
}

interface ChatDataStreams {
    memberId: string;
    memberName: string;
    message: string;
}


export const MeetingRoom = () => {
    const { data: session } = useSession();
    const user = session?.user ?? undefined;
    
    
    // 入退室の遷移処理
    const params = useParams();
    const searchParams = useSearchParams();
    const roomName = searchParams.get('name');
    

    const router = useRouter();
    const roomId = params.slug as string;
    const [isClosing, setIsClosing] = useState<boolean>(false);
    
    const { dataStream, setDataStream } = useContext(RoomContext) || {};
    const [ audioStream, setAudioStream ] = useState<MediaStream>();
    const [ videoStream, setVideoStream ] = useState<MediaStream>();

    // 音声認識処理の制御
    const [isMediaAuthed, setIsMediaAuthed] = useState<boolean>(false);
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const localAudioRef = useRef<HTMLAudioElement>(null);
    useAudioRecorder({roomId: roomId, userId: user?.uuid, localDataStream: dataStream, localAudioStream: audioStream});

    const [information, setInformation] = useState<string>();
    const toast = useToast();
    useEffect(() => {
        if (information) {
            toast({
                title: information,
                status: "info",
                duration: 5000,
                isClosable: true,
            });
        }
    }, [information]);

    // チャットメッセージ等の管理
    const [inputMessage, setInputMessage] = useState<string>("");
    const [outputTextChat, setOutputTextChat] = useState<ChatMessage[]>([]);
    const [userAreaDocuments, setUserAreaDocuments] = useState<HTMLElement[]>([]);

    // SkyWay
    const [room, setRoom] = useState<P2PRoom>();
    const [me, setMe] = useState<LocalP2PRoomMember>();

    // ルーム退室 + タブ離脱処理
    const leaveBeacon = () => {
        //TODO: ルームメンバーの人数をstateで管理してここの条件分岐にも含める
        const status = navigator.sendBeacon(`${API_URL}/api/rooms/close/${roomId}`);
        
        setAudioStream(undefined);
        setVideoStream(undefined);
        videoStream?.getTracks().forEach((track) => {
            track.stop();
        });
        audioStream?.getTracks().forEach((track) => {
            track.stop();
        });
        return status;
    }
    useBeforeUnloadFunction(leaveBeacon);
    const onLeave = (async () => {
        if (me == null || room == null) return;
        try {
            if (room.members.length == 1) {
                if (roomId == undefined) return;
                setIsClosing(true);
                leaveBeacon();
                for (const pub of me.publications) await me.unpublish(pub.id);
                await me.leave();

                setRoom(undefined);
                setMe(undefined);
            } else {
                console.log("Failed to announce room leave");
            }
            for (const pub of me.publications) {
                await me.unpublish(pub.id)
            };
            await me.leave();
            setRoom(undefined);
            setMe(undefined);
        } catch (e) {
            console.error(e);
        } finally {
            setIsClosing(false);
            router.push('/lounge');
        }
    })

    // データの送信処理
    const sendMessage = () => {
        if (dataStream == (null || undefined)) return;
        setOutputTextChat(prev => [...prev,{
            memberId: me?.id,
            memberName: user?.name ?? "名無し",
            message: inputMessage 
        } as ChatMessage]);

        dataStream.write({
            memberId: me?.id ?? "",
            memberName: user?.name ?? "名無し",
            type: "text",
            message: inputMessage
        });
        setInputMessage("");
    }

    const cleanup = () => {
        videoStream?.getTracks().forEach((track) => {
            track.stop();
        });
        audioStream?.getTracks().forEach((track) => {
            track.stop();
        });
    }
    

    const onJoinChannel = useCallback(async () => {
        // バックエンド処理
        if (roomId) {
            // ホストの処理
            if (searchParams.has('name') && roomName !== null && roomName !== '') {
                const res = await createRoom({ room_uuid: roomId, name: roomName })
                if (!res) {
                    alert("ルームの作成に失敗しました。ルーム選択画面に戻ります");
                    cleanup();
                    router.push('/lounge');
                }
            }else if(searchParams.has('name') && roomName == null && roomName == ''){
                alert("ルーム名が不正です。ルーム選択画面に戻ります");
                cleanup();
                router.push('/lounge');
            }
        }else{
            alert("ルームIDが取得できませんでした。ルーム選択画面に戻ります");
            cleanup();
            router.push('/lounge');
        }

        const token = (await getToken()).token;
        if (token == undefined || user?.uuid == undefined) return;
        const swCxt = await SkyWayContext.Create(token);

        if (swCxt) {
            const room = await SkyWayRoom.FindOrCreate(swCxt, {
                type: 'p2p',
                name: roomId,
            });
            const media = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

            if (media == undefined) {
                alert("デバイスアクセスを拒否したか正常に取得できませんでした。ルーム選択画面に戻ります");
                router.push('/lounge'); return;
            };
            setIsMediaAuthed(true);
            const video = media.getVideoTracks();
            const audio = media.getAudioTracks();

            const videoStream = new MediaStream(video);
            const audioStream = new MediaStream(audio);
            setVideoStream(videoStream);
            setAudioStream(audioStream);

            // SkyWayのRoomに参加
            const me: LocalP2PRoomMember = await room.join({
                name: user.uuid
            });

            // BE側にルームへの参加を通知
            if (room !== undefined && me !== undefined) {
                setRoom(room);
                setMe(me);
                const body = {
                    room_uuid: roomId,
                    user_uuid: user.uuid
                }
                await joinRoom(body);
            }

            // AudioStreamの配信
            const SkyWayDataStream = await SkyWayStreamFactory.createDataStream();
            if (setDataStream !== undefined && SkyWayDataStream !== undefined) setDataStream(SkyWayDataStream);

            const myVideoInputStream = new LocalVideoStream(video[0]);
            const myAudioqInputStream = new LocalAudioStream(audio[0]);
            if (audio) await me.publish(myAudioqInputStream);
            if (video) await me.publish(myVideoInputStream);

            await me.publish(SkyWayDataStream);

            const subscribeAndAttach = async (publication: RoomPublication) => {
                if (publication.publisher.id === me.id) {
                    return;
                }

                const remoteMediaArea = document.getElementById("remoteMediaArea");
                const remoteUserArea = document.createElement("div") as HTMLDivElement;
                const { stream } = await me.subscribe(publication.id);
                switch (stream.contentType) {
                    case "video":{
                        const videoMedia: HTMLVideoElement =
                            document.createElement("video");
                        videoMedia.playsInline = true;
                        videoMedia.autoplay = true;
                        stream.attach(videoMedia);
                        if (remoteMediaArea != null && remoteUserArea != null) {
                            remoteUserArea.appendChild(videoMedia);
                        }}
                        break;
                    case "audio":{
                        const audioMedia: HTMLAudioElement =
                            document.createElement("audio");
                        audioMedia.controls = true;
                        audioMedia.autoplay = true;
                        stream.attach(audioMedia);
                        if (remoteMediaArea != null && remoteUserArea != null) {
                            remoteUserArea.appendChild(audioMedia);
                        }}
                        break;
                    case "data":
                        stream.onData.add((data) => {
                            const chat = data as ChatDataStreams;
                            setOutputTextChat(prev => [...prev,
                                {
                                    memberId: chat["memberId"],
                                    memberName: chat["memberName"] ?? "",
                                    message: chat["message"]
                                }
                            ]);
                        });
                        break;
                }
                setUserAreaDocuments(prevAreas => ({
                    ...prevAreas,
                    [publication.publisher.id]: remoteUserArea
                }));
            };
            room.publications.forEach(subscribeAndAttach);
            room.onStreamPublished.add((e) => subscribeAndAttach(e.publication));
            
            // メンバーが入室した際の処理
            room.onMemberJoined.once(() => {
                setInformation(`メンバーが入室しました.`);
            });
            
            // メンバーが退室した際の処理
            room.onMemberLeft.add((e) => {
                room.publications.forEach(async (publication) => {
                    await me.unpublish(publication.id);
                });
                const displayArea = document.querySelector(`[data-publication-id="${e.member.id}"]`);
                if (displayArea !== undefined && displayArea !== null) displayArea.remove();
                setInformation(`メンバーが退室しました.`);
            })
        };
    }, []);

    useEffect(() => {
        if (videoStream == null || audioStream == null) return;
        if (localVideoRef.current && localAudioRef.current) {
            localVideoRef.current.srcObject = videoStream ?? null;
            localAudioRef.current.srcObject = audioStream ?? null;
        }
    }, [audioStream, videoStream]);


    // ルーム入室時の処理
    const handler = {
        onYes: onJoinChannel,
        onCancel: (() => router.push('/lounge'))
    }

    const alertTexts = {
        alertTexts: {
            header: `これから会議に参加します…`,
            body: `カメラとマイクへのアクセスを許可してください。`,
        },
        buttonTexts: {
            cancel: "キャンセル",
            yes: "許可する",
        }
    };

    const handleInputChange = (event: { target: {value: React.SetStateAction<string>}}) => {
        setInputMessage(event.target.value);
    };

    return (
        <>
            {!isMediaAuthed ? (
                <div>
                    <Heading textAlign='center' size='lg' my={10} fontSize='30px'>
                        入室待機中...
                    </Heading>
                    <Dialog alertTexts={alertTexts} handler={handler} />
                </div>
            ) : (
                <>
                {isClosing&&(
                    <Modal isOpen={isClosing} onClose={() => setIsClosing(false)}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>退室処理中です</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                <Text>しばらくお待ちください...</Text>
                                <Spinner />
                            </ModalBody>
                        </ModalContent>
                    </Modal>
                )}
                <div>
                    <Grid
                        templateAreas={{
                            base: `"heading"
                                    "member"
                                    "chat"
                                    "myvideo"`, // モバイル表示
                            md: `"heading member"
                                "chat member"
                                "myvideo member"` // デスクトップ表示
                        }}
                        gridTemplateRows={{
                            base: '10vh 10vh 45vh 35vh', // モバイル表示
                            md: '5vh 60vh 28vh' // デスクトップ表示
                        }}
                        gridTemplateColumns={{
                            base: '100%', // モバイル表示
                            md: '75% 25%' // デスクトップ表示
                        }}
                        h='calc(100vh - 70px)'
                    >
                        <GridItem area={'heading'}>
                            <Grid
                                templateAreas={
                                    `"headingItem""metaItem"`
                                }
                                gridTemplateRows={'1fr'}
                                gridTemplateColumns={{
                                    base: '100%',
                                    md: '90% 10%'
                                }}
                            >
                                <GridItem area={'metaItem'}>
                                    <Box position={'relative'}>
                                        <Button
                                            position={'absolute'}
                                            right={'0'}
                                            w={'150px'}
                                            colorScheme='red'
                                            mt={2}

                                            onClick={onLeave}
                                        >
                                            退室する<CloseIcon mx={2} w={3} />
                                        </Button>
                                    </Box>
                                </GridItem>
                            </Grid>
                        </GridItem>
                        <GridItem area={'chat'} w={'100%'}>
                            <Box h={'95%'} my={1} mx={3} p={3}>
                                <div id="chatArea">
                                    {me &&
                                    <ChatSpace chatTexts={outputTextChat} me={me} />
                                    }
                                </div>
                            </Box>
                        </GridItem>
                        <GridItem area={'myvideo'}>
                            <Grid
                                templateAreas={`"video inputChat"`}
                                gridTemplateRows={'100%'}
                                gridTemplateColumns={'25% 75%'}
                                h={'100%'}
                            >
                                <GridItem area={`"video"`}>
                                    <Box overflow={'hidden'} minW={'300px'} h={'100%'}>
                                        <video ref={localVideoRef} autoPlay playsInline muted />
                                        <audio ref={localAudioRef} autoPlay playsInline muted />
                                        <div>
                                            {user && 
                                                (roomId !== undefined && user.uuid !== undefined && audioStream !== undefined && dataStream !== undefined) ? (
                                                    <LocalAudioDisplay roomId={roomId} userId={user?.uuid} localDataStream={dataStream} localAudioStream={audioStream} />
                                                ) : (<></>)
                                            }
                                        </div>
                                    </Box>
                                </GridItem>
                                <GridItem area={`"inputChat"`} position={'relative'} w={'90%'} h={'90%'} m={'auto'} bg={'gray.50'}>
                                    <Textarea
                                        p={'6'}
                                        bg={'gray.100'}
                                        value={inputMessage}
                                        onChange={handleInputChange}
                                        placeholder='ルームにメッセージを送信する'
                                        size='md'
                                        resize='none'
                                        h={'100%'}
                                    />
                                    <Button
                                        position={'absolute'}
                                        zIndex={'10'}
                                        bottom={'40px'}
                                        right={'50px'}
                                        w={'100px'}
                                        colorScheme='blue'
                                        mt={2}
                                        onClick={sendMessage}
                                        isDisabled={!inputMessage || inputMessage.length === 0}
                                    >
                                        送信<EditIcon mx={2} />
                                    </Button>
                                </GridItem>
                            </Grid>
                        </GridItem>
                        <GridItem area={'member'}>
                            <Flex flexWrap={'wrap'} color='white' direction={'column'} h={'100%'}>
                                <div className="videoBox">
                                    <div id="remoteMediaArea">
                                        {Object.keys(userAreaDocuments).map((publicationId) => {
                                            const remoteUserArea = userAreaDocuments[publicationId as any];
                                            return (
                                                <div data-publication-id={publicationId} key={publicationId} className="video-container" style={{ position: 'relative' }}>
                                                    {userAreaDocuments[publicationId as any] && (
                                                        <div
                                                            className="popup"
                                                            style={{
                                                                position: 'absolute',
                                                                top: '0',
                                                                left: '-15px',
                                                                margin: '0',
                                                                color: 'white',
                                                                padding: '5px',
                                                                zIndex: 10
                                                            }}
                                                        >
                                                        </div>
                                                    )}
                                                    <div>
                                                        {remoteUserArea &&(
                                                            <div ref={node => {
                                                            if(node && remoteUserArea){
                                                                node.appendChild(remoteUserArea)
                                                            }}} />
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </Flex>
                        </GridItem>
                    </Grid>
                </div>
                </>
            )}
        </>
    );

}