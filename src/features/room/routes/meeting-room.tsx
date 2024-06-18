'use client'

import {
  LocalAudioStream,
  LocalP2PRoomMember,
  LocalVideoStream,
  P2PRoom,
  RoomPublication,
  SkyWayContext,
  SkyWayRoom,
  SkyWayStreamFactory,
} from '@skyway-sdk/room'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Dialog } from '@/components/Dialog'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  Textarea,
  useToast,
} from '@chakra-ui/react'
import { CloseIcon, EditIcon } from '@chakra-ui/icons'
import { ChatSpace } from '../component/chat/ChatSpace'
import { ChatMessage } from '@/types/types'
import { createRoom, joinRoom } from '@/features/room/api/room'
import { useSession } from 'next-auth/react'
import { getToken } from '@/features/room/api/token'
import { API_URL } from '@/config/env'
import { useBeforeUnloadFunction } from '@/hooks/useBeforeUnloadFn'
import { useAudioRecorder } from '@/hooks/audio/useAudioRecorder'
import { MediaController } from '../component/speech/media-controller'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import {
  mediaElementsIdState,
  mediaElementsState,
  videoTrackState,
} from '@/recoil/atoms/media-atom'
import { localDataStreamAtom } from '@/recoil/atoms/localstream-atom'
import { updateMediaElements } from '@/recoil/callbacks/media-callbacks'

export interface PopoverEmotions {
  member: string
  emotion: string
  pressure: string
}

interface ChatDataStreams {
  memberId: string
  memberName: string
  message: string
}

export const MeetingRoom = () => {
  const { data: session } = useSession()
  const user = session?.user ?? undefined

  // 入退室の遷移処理
  const params = useParams()
  const searchParams = useSearchParams()
  const roomName = searchParams.get('name')

  const router = useRouter()
  const roomId = params.slug as string
  const [isClosing, setIsClosing] = useState<boolean>(false)

  // メディアストリーム/メディアトラック
  const [dataStream, setDataStream] = useRecoilState(localDataStreamAtom)
  const [audioStream, setAudioStream] = useState<MediaStream>()
  const [videoStream, setVideoStream] = useState<MediaStream>()
  const setVideoTrack = useSetRecoilState(videoTrackState)
  const setAudioTrack = useSetRecoilState(videoTrackState)

  // 音声認識処理の制御
  const [isMediaAuthed, setIsMediaAuthed] = useState<boolean>(false)
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const localAudioRef = useRef<HTMLAudioElement>(null)
  useAudioRecorder({
    roomId: roomId,
    userId: user?.uuid,
    localAudioStream: audioStream,
  })

  // 音声操作用
  const ctx: AudioContext = useMemo(() => new AudioContext(), [])
  const gainNode: GainNode = useMemo(() => ctx.createGain(), [ctx])

  // ユーザ画面
  const {
    addMediaElementAtom,
    addAudioElement,
    addVideoElement,
    removeMediaElementAtom,
  } = updateMediaElements()
  const mediaElementsIds = useRecoilValue(mediaElementsIdState)
  const mediaElementAtoms = mediaElementsIds.map((id) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useRecoilValue(mediaElementsState(id))
  })

  const [information, setInformation] = useState<string>()
  const toast = useToast()
  useEffect(() => {
    if (information) {
      toast({
        title: information,
        status: 'info',
        duration: 5000,
        isClosable: true,
      })
    }
  }, [information])

  // チャットメッセージ等の管理
  const [inputMessage, setInputMessage] = useState<string>('')
  const [outputTextChat, setOutputTextChat] = useState<ChatMessage[]>([])

  // SkyWay
  const [room, setRoom] = useState<P2PRoom>()
  const [me, setMe] = useState<LocalP2PRoomMember>()

  // ルーム退室 + タブ離脱処理
  const leaveBeacon = () => {
    if (me == null || room == null) return
    if (room.members.length !== 1) return
    const status = navigator.sendBeacon(`${API_URL}/api/rooms/close/${roomId}`)

    setAudioStream(undefined)
    setVideoStream(undefined)
    videoStream?.getTracks().forEach((track) => {
      track.stop()
    })
    audioStream?.getTracks().forEach((track) => {
      track.stop()
    })
    return status
  }

  useBeforeUnloadFunction(leaveBeacon)
  const onLeave = async () => {
    if (me == null || room == null) return
    try {
      if (room.members.length == 1) {
        if (roomId == undefined) return
        setIsClosing(true)
        leaveBeacon()
        for (const pub of me.publications) await me.unpublish(pub.id)
        await me.leave()

        setRoom(undefined)
        setMe(undefined)
      } else {
        console.log('Failed to announce room leave')
      }
      for (const pub of me.publications) {
        await me.unpublish(pub.id)
      }
      await me.leave()
      setRoom(undefined)
      setMe(undefined)
    } catch (e) {
      console.error(e)
    } finally {
      setIsClosing(false)
      router.push('/lounge')
    }
  }

  // データの送信処理
  const sendMessage = () => {
    if (dataStream == (null || undefined)) return
    setOutputTextChat((prev) => [
      ...prev,
      {
        memberId: me?.id,
        memberName: user?.name ?? '名無し',
        message: inputMessage,
      } as ChatMessage,
    ])

    dataStream.write({
      memberId: me?.id ?? '',
      memberName: user?.name ?? '名無し',
      type: 'text',
      message: inputMessage,
    })
    setInputMessage('')
  }

  const cleanup = () => {
    videoStream?.getTracks().forEach((track) => {
      track.stop()
    })
    audioStream?.getTracks().forEach((track) => {
      track.stop()
    })
  }

  const MediaContrallerMemo = useMemo(() => {
    return <MediaController gainNode={gainNode} />
  }, [gainNode])
  const onJoinChannel = useCallback(async () => {
    // バックエンド処理
    if (roomId) {
      // ホストの処理
      if (searchParams.has('name') && roomName !== null && roomName !== '') {
        const res = await createRoom({ room_uuid: roomId, name: roomName })
        if (!res) {
          alert('ルームの作成に失敗しました。ルーム選択画面に戻ります')
          cleanup()
          router.push('/lounge')
          return
        }
      } else if (
        searchParams.has('name') &&
        roomName == null &&
        roomName == ''
      ) {
        alert('ルーム名が不正です。ルーム選択画面に戻ります')
        cleanup()
        router.push('/lounge')
        return
      }
    } else {
      alert('ルームIDが取得できませんでした。ルーム選択画面に戻ります')
      cleanup()
      router.push('/lounge')
      return
    }

    // ユーザ全般認証処理
    const token = (await getToken()).token
    if (token == undefined || user?.uuid == undefined) {
      alert('認証情報の取得に失敗しました。ルーム選択画面に戻ります')
      cleanup()
      router.push('/lounge')
      return
    }

    const swCxt = await SkyWayContext.Create(token)
    console.log(swCxt)

    if (swCxt) {
      const room = await SkyWayRoom.FindOrCreate(swCxt, {
        type: 'p2p',
        name: roomId,
      })
      const media = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })

      if (media == undefined) {
        alert(
          'デバイスアクセスを拒否したか正常に取得できませんでした。ルーム選択画面に戻ります',
        )
        router.push('/lounge')
        return
      }

      setIsMediaAuthed(true)

      const _video = media.getVideoTracks()
      const _audio = media.getAudioTracks()
      setVideoTrack(_video[0])
      setAudioTrack(_audio[0])

      const _videoStream = new MediaStream(_video)
      const _audioStream = new MediaStream(_audio)
      setVideoStream(_videoStream)
      setAudioStream(_audioStream)

      // SkyWayのRoomに参加
      const me: LocalP2PRoomMember = await room.join({
        name: user.uuid,
      })

      // BE側にルームへの参加を通知
      if (room !== undefined && me !== undefined) {
        setRoom(room)
        setMe(me)
        const body = {
          room_uuid: roomId,
          user_uuid: user.uuid,
        }
        await joinRoom(body)
      }

      // AudioStreamの配信
      const SkyWayDataStream = await SkyWayStreamFactory.createDataStream()
      if (setDataStream !== undefined && SkyWayDataStream !== undefined)
        setDataStream(SkyWayDataStream)

      const myVideoInputStream = new LocalVideoStream(_video[0])
      const myAudioqInputStream = new LocalAudioStream(_audio[0])

      if (_audio) await me.publish(myAudioqInputStream)
      if (_video) await me.publish(myVideoInputStream)

      await me.publish(SkyWayDataStream)

      const subscribeAndAttach = async (publication: RoomPublication) => {
        if (publication.publisher.id === me.id) {
          return
        }
        addMediaElementAtom(publication.id)
        const { stream } = await me.subscribe(publication.id)
        switch (stream.contentType) {
          case 'video':
            {
              const videoMedia: HTMLVideoElement =
                document.createElement('video')
              videoMedia.playsInline = true
              videoMedia.autoplay = true
              stream.attach(videoMedia)
              addVideoElement(publication.id, videoMedia)
            }
            break
          case 'audio':
            {
              const audioMedia: HTMLAudioElement =
                document.createElement('audio')
              audioMedia.autoplay = true
              stream.attach(audioMedia)
              const source = ctx.createMediaElementSource(audioMedia)
              addAudioElement(publication.id, audioMedia)
              if (gainNode && source) {
                source.connect(gainNode)
                gainNode.connect(ctx.destination)
              }
            }
            break
          case 'data':
            stream.onData.add((data) => {
              const chat = data as ChatDataStreams
              setOutputTextChat((prev) => [
                ...prev,
                {
                  memberId: chat['memberId'],
                  memberName: chat['memberName'] ?? '',
                  message: chat['message'],
                },
              ])
            })
            break
        }
      }
      room.publications.forEach(subscribeAndAttach)
      room.onStreamPublished.add((e) => subscribeAndAttach(e.publication))

      // メンバーが入室した際の処理
      room.onMemberJoined.once(() => {
        setInformation(`メンバーが入室しました.`)
      })

      // メンバーが退室した際の処理
      room.onMemberLeft.add((e) => {
        room.publications.forEach(async (publication) => {
          await me.unpublish(publication.id)
        })
        const displayArea = document.querySelector(
          `[data-publication-id="${e.member.id}"]`,
        )
        if (displayArea !== undefined && displayArea !== null)
          displayArea.remove()
        removeMediaElementAtom(e.member.id)
        setInformation(`メンバーが退室しました.`)
      })
    } else {
      alert(
        '通話システムの起動にエラーが発生しました。ルーム選択画面に戻ります。',
      )
      cleanup()
      router.push('/lounge')
      return
    }
  }, [])

  // ルーム入室時の処理
  const handler = {
    onYes: onJoinChannel,
    onCancel: () => router.push('/lounge'),
  }

  const alertTexts = {
    alertTexts: {
      header: `これから会議に参加します…`,
      body: `カメラとマイクへのアクセスを許可してください。`,
    },
    buttonTexts: {
      cancel: 'キャンセル',
      yes: '許可する',
    },
  }

  useEffect(() => {
    if (
      localVideoRef.current &&
      localAudioRef.current &&
      videoStream &&
      audioStream
    ) {
      localVideoRef.current.srcObject = videoStream
      localAudioRef.current.srcObject = audioStream
    }
  }, [audioStream, videoStream])

  const handleInputChange = (event: {
    target: { value: React.SetStateAction<string> }
  }) => {
    setInputMessage(event.target.value)
  }

  return (
    <>
      {!isMediaAuthed ? (
        <div>
          <Heading textAlign="center" size="lg" my={10} fontSize="30px">
            入室待機中...
          </Heading>
          <Dialog alertTexts={alertTexts} handler={handler} />
        </div>
      ) : (
        <>
          {isClosing && (
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
            <Box position={'relative'}>
              <Button
                position={'absolute'}
                right={'0'}
                w={'150px'}
                colorScheme="red"
                mt={2}
                onClick={onLeave}
              >
                退室する
                <CloseIcon mx={2} w={3} />
              </Button>
            </Box>
            <Box>
              <div id="chatArea">
                {me && <ChatSpace chatTexts={outputTextChat} me={me} />}
              </div>
            </Box>
            <Box overflow={'hidden'} minW={'300px'} h={'100%'}>
              <video ref={localVideoRef} autoPlay playsInline muted />
              <audio ref={localAudioRef} autoPlay playsInline muted />
            </Box>
            <Container>
              <Textarea
                p={'6'}
                bg={'gray.100'}
                value={inputMessage}
                onChange={handleInputChange}
                placeholder="ルームにメッセージを送信する"
                size="md"
                resize="none"
                h={'100%'}
              />
              <Button
                position={'absolute'}
                zIndex={'10'}
                bottom={'40px'}
                right={'50px'}
                w={'100px'}
                colorScheme="blue"
                mt={2}
                onClick={sendMessage}
                isDisabled={!inputMessage || inputMessage.length === 0}
              >
                送信
                <EditIcon mx={2} />
              </Button>
            </Container>
            <Flex
              flexWrap={'wrap'}
              color="white"
              direction={'column'}
              h={'100%'}
            >
              <Flex>
                <div id="remoteMediaArea">
                  {mediaElementAtoms.map((atom, index) => {
                    return (
                      <div
                        data-publication-id={atom?.publicationId}
                        key={index}
                        className="video-container"
                        style={{ position: 'relative' }}
                      >
                        {atom?.videoElement && atom?.audioElement ? (
                          <>
                            <div
                              ref={(node) => {
                                if (node && atom.videoElement) {
                                  node.appendChild(atom.videoElement)
                                }
                              }}
                            />
                            <div
                              ref={(node) => {
                                if (node && atom.videoElement) {
                                  node.appendChild(atom.audioElement)
                                }
                              }}
                            />
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                    )
                  })}
                </div>
              </Flex>
            </Flex>
            {MediaContrallerMemo}
          </div>
        </>
      )}
    </>
  )
}
