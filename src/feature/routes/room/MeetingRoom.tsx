"use client";

import { LocalAudioStream, LocalDataStream, LocalP2PRoomMember, LocalRoomMember, LocalStream, LocalVideoStream, P2PRoom, RemoteAudioStream, RemoteDataStream, RemoteVideoStream, RoomPublication, SkyWayContext, SkyWayRoom, SkyWayStreamFactory } from "@skyway-sdk/room";
import { SkyWayAuthToken, nowInSec, uuidV4 } from "@skyway-sdk/token";
import React, { createElement, use, useCallback, useContext, useEffect, useMemo,useReducer, useRef, useState } from "react"
import { announceRoomLeave } from "@/api/room/api";
import { LocalAudioDisplay } from "./component/LocalAudioDisplay";
import { RoomContext, useRoom } from "@/contexts/RoomContext";
import { getCookie } from "cookies-next";
import { createRoom, joinRoom, toggleRoomState } from "@/api/firebase/room";
import { TransitionDialog } from "@/app/component/Dialog";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Box, Button, useColorModeValue, Alert, Flex, Grid, GridItem, Heading, Square, Text, Textarea } from "@chakra-ui/react";
import { ChatIcon, CloseIcon, EditIcon } from "@chakra-ui/icons";
import { get } from "http";
import { LoginUserContext } from "@/contexts/UserInfoContext";
import { EmotionRenderer } from "./component/emotion/EmotionRenderer";
import { ChatSpace } from "./component/datastream/ChatSpace";
import { ChatMessage } from "@/types/DataModel";
import { set } from "firebase/database";
import { log } from "console";
import { on } from "events";

interface RemoteMediaArea{
    [key: string]: HTMLElement;
}
interface RenderItem{
    docs?: RemoteMediaArea;
    labels?: { member: String, emotion: string, pressure: string }
    chat? : { member: string, data: string }
}
interface UserRenderArea{
    [key: string]: RenderItem
}

export interface PopoverEmotions{
    member: string;
    emotion: string;
    pressure: string;
}

const getEmotionByPublicationId = (emotions: PopoverEmotions[], publicationId: string): PopoverEmotions | undefined => {
    return emotions.find(emo => emo.member === publicationId);
  };

export const MeetingRoom = ({pk}) => {
    const [localStream, setLocalStream] = useState<MediaStream>();
    const { loginUser, setLoginUser } = useContext(LoginUserContext) || {};

    // URLから取得するルームのメタデータ
    // TODO: 現在ここのメタデータ取得でこけててユーザ間連携切れてます
    // 意図としては、FBの/rooms/ pkはslugで、その他skywayに渡すroom.join({name:${name}})などの値はparam等で持って
    // 各コンポーネント間の接続を容易にしようというものです。
    const searchParams = useSearchParams();
    const roomId = searchParams.get("roomId");
    const customName = searchParams.get("name");
    console.log(pk, roomId, customName);
    
    const {dataStream, setDataStream } = useContext(RoomContext) || {};
    const [audioStream, setAudioStream] = useState<MediaStream>();
    const [videoStream, setVideoStream] = useState<MediaStream>();
    const [FBRoomPK, setFBRoomPK] = useState<string>(); // 上記URLへのパラメータ移行ができればここは不要です

    // 入退室の遷移処理
    const router = useRouter();

    // 音声認識処理の制御
    const [isMediaAuthed, setIsMediaAuthed] = useState<boolean>(false);
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const localAudioRef = useRef<HTMLAudioElement>(null);

    // ルームインフォメーションメッセージ
    const [information, setInformation] = useState<string>('');

    // チャットメッセージ等の管理
    const [inputMessage, setInputMessage] = useState<string>("");
    const [outputTextChat, setOutputTextChat] = useState<ChatMessage[]>([]);
    
    // ルーム名とユーザの情報 
    const [userAreaDocuments , setUserAreaDocuments] = useState<HTMLElement[]>([]);
    const [roomName, setRoomName] = useState<string>();
    const [room, setRoom] = useState<P2PRoom>();
    const [me, setMe] = useState<LocalP2PRoomMember>();
    const [emotion, setEmotion] = useState<PopoverEmotions[]>([]);
    const [memberTranscript, setMemberTranscript] = useState<{ member: string, data: string }>();

    useEffect(() => {

    },[]);

    // カラーモードの設定
    const InputBoxBGColor = useColorModeValue('gray.200', 'blackAlpha.500');


    const appId = useMemo(() => process.env.NEXT_PUBLIC_SKYWAY_APP_ID, []);
    const secretKey = useMemo(() => process.env.NEXT_PUBLIC_SKYWAY_SECRET_KEY, []);

    const token = useMemo(() => {
        if (appId == null || secretKey == null) return undefined;

        return new SkyWayAuthToken({
            jti: uuidV4(),
            iat: nowInSec(),
            exp: nowInSec() + 60 * 60 * 24,
            scope: {
                app: {
                    id: appId,
                    turn: true,
                    actions: ["read"],
                    channels: [
                        {
                            id: "*",
                            name: "*",
                            actions: ["write"],
                            members: [
                                {
                                    id: "*",
                                    name: "*",
                                    actions: ["write"],
                                    publication: {
                                        actions: ["write"],
                                    },
                                    subscription: {
                                        actions: ["write"],
                                    },
                                },
                            ],
                            sfuBots: [
                                {
                                    actions: ["write"],
                                    forwardings: [
                                        {
                                            actions: ["write"],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            },
        }).encode(secretKey);
    }, [appId, secretKey]);

    // ルーム退室処理
    const onLeave = async () => {
        console.log(room, me, pk);
        
        if (me == null || room == null) return;
        try {
            if (room.members.length == 1) {
                if(pk !== undefined)  await toggleRoomState(pk); // FIXME: 現在PK連携が切れてるのでここのSwitchが機能してません。ロジック自体は動作確認済みです。
                const res = await announceRoomLeave(room.id);
                if (res) {
                    for (const pub of me.publications) await me.unpublish(pub.id);
                    await me.leave();
                    setRoom(undefined);
                    setMe(undefined);

                } else {
                    console.log("Failed to announce room leave");
                }
            } else {
                for (const pub of me.publications) {
                    await me.unpublish(pub.id)
                };
                await me.leave();
                setRoom(undefined);
                setMe(undefined);
            }
        } catch (e) {
            console.log(e);
        } finally {
            router.push('/lounge');
        }
    }

    // データの送信処理
    const sendMessage = () => {
        if (dataStream == (null || undefined)) return;
        if (inputMessage == "") return;
        setOutputTextChat(prev => [...prev, { memberId: me?.id ?? "名無し", memberName: me?.metadata?.name ?? "", message: inputMessage } as ChatMessage]);
        dataStream.write({memberId: me?.id ?? "", memberName: me?.metadata?.name ?? "名無し", type: "text", message: inputMessage });
        setInputMessage("");
    }

    const canJoin = useMemo(() => {
        return roomName !== "" && audioStream != null && videoStream != null && me == null;
    }, [roomName, audioStream, videoStream, me]);

    // ルーム入室処理
    const mediaInitialize = useCallback(async () => {
        try {
            if (token == null) return;
            // NOTE: BEへ接続するデータを音声に限定するため分けてます。ビデオデータが送られると音声ストリームを処理できずエラーになります。
            // ユーザビリティが悪いので一回の承認で済むように改善できないか検討中です。
            const video = await navigator.mediaDevices.getUserMedia({ video: true });
            const audio = await navigator.mediaDevices.getUserMedia({ audio: true });
            if (video == undefined || audio == undefined) { 
                alert ("デバイスアクセスを拒否したか正常に取得できませんでした。ルーム選択画面に戻ります");
                router.push('/lounge'); return;
            };
            console.log(audio, video);
            
            setAudioStream(audio);
            setVideoStream(video);

            onJoinChannel();
        } catch (error) {
            console.error('Error accessing the camera:', error);
        }
    }, []);

    const onJoinChannel = useCallback(async () => {
        if (roomId == undefined || token == undefined) return;
        const swCxt = await SkyWayContext.Create(token);
        
        if (swCxt) {
            const room = await SkyWayRoom.FindOrCreate(swCxt, {
                type: 'p2p',
                name: roomId,
            });

            // TODO: クライアントサイドでのログインユーザ情報の受け渡し方法を見直しています。
            const me:LocalP2PRoomMember = await room.join({
                name: loginUser?.name ?? "annonimus", // 全角はエラーになります
            });

            if (room !== undefined) {
                setRoom(room);
                setMe(me);

                if (pk !== null && pk !== undefined) {
                    await room.updateMetadata( customName?? "" );
                    
                    if(loginUser !== undefined && loginUser !== null ){await joinRoom(pk, loginUser.id)}
                }
            }

            // AudioStreamの配信
            const SkyWayDataStream = await SkyWayStreamFactory.createDataStream();
            console.log(audioStream, videoStream);
            
            if (setDataStream !== undefined && SkyWayDataStream !== undefined) setDataStream(SkyWayDataStream);
            
            // TODO: Stateの更新タイミングの問題でここが実行されない
            if ( videoStream == undefined || audioStream == undefined) return;
            const myVideoInputStream = new LocalVideoStream(videoStream.getVideoTracks()[0]);
            const myAudioqInputStream = new LocalAudioStream(audioStream.getAudioTracks()[0]);
            if (audioStream) await me.publish(myAudioqInputStream);
            if (videoStream) await me.publish(myVideoInputStream);
            await me.publish(SkyWayDataStream);

            const subscribeAndAttach = async (publication: RoomPublication) => {
                if (publication.publisher.id === me.id) {
                    return;
                }
            
            const remoteMediaArea = document.getElementById("remoteMediaArea");
            const remoteUserArea = document.createElement("div") as HTMLDivElement;
            const { stream } = await me.subscribe(publication.id);
            switch (stream.contentType) {
                case "video":
                    const videoMedia: HTMLVideoElement =
                        document.createElement("video");
                    videoMedia.playsInline = true;
                    videoMedia.autoplay = true;
                    stream.attach(videoMedia);
                    if (remoteMediaArea != null && remoteUserArea != null) {
                        remoteUserArea.appendChild(videoMedia);
                    }
                    break;
                case "audio":
                    const audioMedia: HTMLAudioElement =
                        document.createElement("audio");
                    audioMedia.controls = true;
                    audioMedia.autoplay = true;
                    stream.attach(audioMedia);
                    if (remoteMediaArea != null && remoteUserArea != null) {
                        remoteUserArea.appendChild(audioMedia);
                    }
                    break;
                case "data":
                    stream.onData.add((data) => {
                        console.log(data);
                        switch (data["type"]) {
                            case "text":
                                setOutputTextChat(prev => [...prev, {memberId: data["memberId"],memberName: data["memberName"]?? "",message: data["message"]}]);
                                break;
                            case "emotion":
                                setEmotion(prev => [...prev, { member: data["member_id"], emotion: data["emotion"], pressure: data["pressure"] }]);
                                break;
                            case "transcript":
                                setMemberTranscript({ member: data["member_id"], data: data["transcript"] });
                                break;
                        }
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
        room.onMemberJoined.once((e) => {
            setInformation(`User ${e.member.id} さんが入室しました.`);
        });
        // メンバーが退室した際の処理
        room.onMemberLeft.add((e) => {
            room.publications.forEach(async (publication) => {
                await me.unpublish(publication.id);
            });
            const displayArea = document.querySelector(`[data-publication-id="${e.member.id}"]`);
            if (displayArea !== undefined && displayArea !== null) displayArea.remove();
            setInformation(`User ${e.member.id} さんが退室しました.`);
        })
      };
}, [roomName, token, localStream]);

useEffect(() => {
    console.log("userInfo", getCookie("userInfo"));

    if (videoStream == null || audioStream == null) return;
    if (localVideoRef.current && localAudioRef.current) {
        localVideoRef.current.srcObject = videoStream ?? null;
        localAudioRef.current.srcObject = audioStream ?? null;
    }
}, [audioStream, videoStream]);


// ルーム入室時の処理
const handler = {
    onYes: mediaInitialize,
    // デバイスアクセスを拒否した場合ルーム選択画面に戻す
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

const handleInputChange = (event) => {
    setInputMessage(event.target.value);
};

return (
    <>
        {!isMediaAuthed ? (
            <div>
                <Heading textAlign='center' size='lg' my={10} fontSize='30px'>
                    入室待機中...
                </Heading>
                <h1>{roomName ?? ""}</h1>
                <TransitionDialog alertTexts={alertTexts} handler={handler} />
            </div>
        ) : (
            <div>
                {information !== "" ? (
                <Alert
                  position={"absolute" }
                  status={"success" }
                  w={"50%" }
                  left={"50%"} 
                  transform={"translateX(-50%)"} 
                  variant={"left-accent" }
                  rounded={"5px" }
                  mt={"2rem"}
                  zIndex={10}>
                    <ChatIcon />
                    <Text ml={'2rem'} fontSize='xl'>{information}</Text>
                </Alert>
                    ): (<></>)}
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
                            <GridItem area={'headingItem'}>
                                {memberTranscript != undefined ? (<p>{memberTranscript.member}:{memberTranscript.data}</p>) : (<></>)}
                            </GridItem>
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
                                    退室する<CloseIcon mx={2} w={3}/>
                                </Button>
                            </Box>
                            </GridItem>
                        </Grid>
                    </GridItem>
                    <GridItem area={'chat'} w={'100%'}>
                        <Box h={'95%'} my={1} mx={3} p={3} bg={InputBoxBGColor}>
                            <div id="chatArea">
                                <ChatSpace outputTextChat={outputTextChat} me={me} />
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
                                    <video ref={localVideoRef} autoPlay playsInline />
                                    <audio ref={localAudioRef} autoPlay playsInline></audio>
                                    <div>
                                        {
                                            (audioStream !== undefined && dataStream !== undefined) ? (
                                                <LocalAudioDisplay userId={me?.id} localStream={audioStream} />
                                            ) : (<></>)
                                        }
                                    </div>
                                </Box>
                            </GridItem>
                            <GridItem area={`"inputChat"`} position={'relative'} w={'90%'} h={'90%'} m={'auto'} bg={InputBoxBGColor}>
                                <Textarea
                                    p={'6'}
                                    bg={InputBoxBGColor}
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
                                {Object.keys(userAreaDocuments).map((publicationId ) => {
                                    const remoteUserArea = userAreaDocuments[publicationId];
                                    const sortedEmotion = getEmotionByPublicationId(emotion, publicationId);

                                    return (
                                        <div data-publication-id={publicationId} key={publicationId} className="video-container" style={{ position: 'relative' }}>
                                            {userAreaDocuments[publicationId] && (
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
                                                    {/* FIXME: ユーザ毎に分けるところまではできているのですが、レンダリングタイミングに課題有です
                                                    {sortedEmotion?.emotion !== undefined && sortedEmotion?.pressure ? (
                                                        <EmotionRenderer emotion={sortedEmotion?.emotion} pressure={sortedEmotion?.pressure}/>
                                                    ):(
                                                        <></>
                                                    )}*/}
                                                </div>
                                            )}
                                          <div>
                                            {remoteUserArea && <div ref={node => node && node.appendChild(remoteUserArea)} />}
                                          </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                            {/*<><RemoteMediaDisplay me={me} publications={otherUserPublications} /></>*/}
                        </Flex>
                    </GridItem>
                </Grid>
            </div>
        )}
    </>
);
}