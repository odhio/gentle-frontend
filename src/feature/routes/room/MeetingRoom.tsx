"use client";

import { LocalAudioStream, LocalDataStream, LocalP2PRoomMember, LocalRoomMember, LocalStream, LocalVideoStream, P2PRoom, RemoteAudioStream, RemoteDataStream, RemoteVideoStream, RoomPublication, SkyWayContext, SkyWayRoom, SkyWayStreamFactory } from "@skyway-sdk/room";
import { SkyWayAuthToken, nowInSec, uuidV4 } from "@skyway-sdk/token";
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { LocalAudioDisplay } from "./component/LocalAudioDisplay";
import { RoomContext, useRoom } from "@/contexts/RoomContext";
import { TransitionDialog } from "@/app/_component/Dialog";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Button, useColorModeValue, Alert, Flex, Grid, GridItem, Heading, Text, Textarea } from "@chakra-ui/react";
import { ChatIcon, CloseIcon, EditIcon } from "@chakra-ui/icons";
import { LoginUserContext } from "@/contexts/UserInfoContext";
import { ChatSpace } from "./component/datastream/ChatSpace";
import { ChatMessage } from "@/types/DataModel";
import { closeRoom, joinRoom } from "@/api/db/room";

interface RemoteMediaArea {
    [key: string]: HTMLElement;
}
interface RenderItem {
    docs?: RemoteMediaArea;
    labels?: { member: String, emotion: string, pressure: string }
    chat?: { member: string, data: string }
}
interface UserRenderArea {
    [key: string]: RenderItem
}

export interface PopoverEmotions {

    member: string;
    emotion: string;
    pressure: string;
}

const getEmotionByPublicationId = (emotions: PopoverEmotions[], publicationId: string): PopoverEmotions | undefined => {
    return emotions.find(emo => emo.member === publicationId);

};


export const MeetingRoom = ({ params }) => {

    const [localStream, setLocalStream] = useState<MediaStream>();
    //const { loginUser, setLoginUser } = useContext(LoginUserContext) || {};

    const searchParams = useSearchParams();
    const roomId = searchParams.get("roomId");
    const customName = searchParams.get("name");


    const { dataStream, setDataStream } = useContext(RoomContext) || {};

    const [audioStream, setAudioStream] = useState<MediaStream>();
    const [videoStream, setVideoStream] = useState<MediaStream>();

    // 入退室の遷移処理
    const router = useRouter();

    // 音声認識処理の制御
    const [isMediaAuthed, setIsMediaAuthed] = useState<boolean>(false);
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const localAudioRef = useRef<HTMLAudioElement>(null);

    // ルームインフォメーションメッセージ
    const [information, setInformation] = useState<string>();

    useEffect(() => {
        if (information !== '' && information !== undefined) {
          const timer = setTimeout(() => {
            setInformation(undefined);
          }, 3000);
        return () => clearTimeout(timer);
        }
      }, [information]);

    // チャットメッセージ等の管理
    const [inputMessage, setInputMessage] = useState<string>("");
    const [outputTextChat, setOutputTextChat] = useState<ChatMessage[]>([]);

    const [userAreaDocuments, setUserAreaDocuments] = useState<HTMLElement[]>([]);

    const [roomName, setRoomName] = useState<string>();
    const [room, setRoom] = useState<P2PRoom>();
    const [me, setMe] = useState<LocalP2PRoomMember>();
    const [emotion, setEmotion] = useState<PopoverEmotions[]>([]);
    const [memberTranscript, setMemberTranscript] = useState<{ member: string, data: string }>();

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

        console.log(room, me, params);
        if (me == null || room == null) return;
        try {
            if (room.members.length == 1) {
                if (roomId == undefined) return;
                await closeRoom({room_uuid:roomId});
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
            router.push('/lounge');
        }
    }

    // データの送信処理
    const sendMessage = () => {
        if (dataStream == (null || undefined)) return;
        if (inputMessage == "") return;
        setOutputTextChat(prev => [...prev, { memberId: me?.id , memberName: userInfo?.name ?? "名無し", message: inputMessage } as ChatMessage]);
        dataStream.write({ memberId: me?.id ?? "", memberName: userInfo?.name ?? "名無し", type: "text", message: inputMessage });
        setInputMessage("");
    }

    const onJoinChannel = useCallback(async () => {
        if (roomId == undefined || token == undefined) return;
        const swCxt = await SkyWayContext.Create(token);

        if (swCxt) {
            const room = await SkyWayRoom.FindOrCreate(swCxt, {
                type: 'p2p',
                name: roomId,
            });
            const video = await navigator.mediaDevices.getUserMedia({ video: true });
            const audio = await navigator.mediaDevices.getUserMedia({ audio: true });

            if (video == undefined || audio == undefined) {
                alert("デバイスアクセスを拒否したか正常に取得できませんでした。ルーム選択画面に戻ります");
                router.push('/lounge'); return;
            };
            setIsMediaAuthed(true);
            setAudioStream(audio); 
            setVideoStream(video);

            const me: LocalP2PRoomMember = await room.join({
                name: loginUser?.id
            });

            if (room !== undefined && me !== undefined && roomId !== undefined) {
                setRoom(room);
                setMe(me);
                await joinRoom({room_uuid:roomId, user_uuid: loginUser.id})
            }

            // AudioStreamの配信
            const SkyWayDataStream = await SkyWayStreamFactory.createDataStream();

            if (setDataStream !== undefined && SkyWayDataStream !== undefined) setDataStream(SkyWayDataStream);

            const myVideoInputStream = new LocalVideoStream(video.getVideoTracks()[0]);
            const myAudioqInputStream = new LocalAudioStream(audio.getAudioTracks()[0]);
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
                            switch (data["type"]) {
                                case "text":
                                    setOutputTextChat(prev => [...prev, { memberId: data["memberId"], memberName: data["memberName"] ?? "", message: data["message"] }]);
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
    }, [roomName, token, localStream]);

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
                            position={"absolute"}
                            status={"success"}
                            w={"50%"}
                            left={"50%"}
                            transform={"translateX(-50%)"}
                            variant={"left-accent"}
                            rounded={"5px"}
                            mt={"2rem"}
                            zIndex={10}>
                            <ChatIcon />
                            <Text ml={'2rem'} fontSize='xl'>{information}</Text>
                        </Alert>
                    ) : (<></>)}
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
                                            退室する<CloseIcon mx={2} w={3} />
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
                                                    <LocalAudioDisplay roomId={roomId} userId={me?.id} localStream={audioStream} />
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
                                        {Object.keys(userAreaDocuments).map((publicationId) => {
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