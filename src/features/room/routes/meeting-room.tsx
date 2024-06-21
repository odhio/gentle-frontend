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
  useToast,
} from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'
import { createRoom, joinRoom } from '@/features/room/api/room'
import { useSession } from 'next-auth/react'
import { getToken } from '@/features/room/api/token'
import { API_URL } from '@/config/env'
import { useBeforeUnloadFunction } from '@/hooks/useBeforeUnloadFn'
import { useAudioRecorder } from '@/hooks/audio/useAudioRecorder'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import {
  audioEnabledState,
  chatAnnouncementState,
  participantsState,
  videoEnabledState,
  volumeState,
} from '@/recoil/atoms/media-atom'
import { ChatMessage } from '@/recoil/models'
import { ControlBar } from '../component/control-bar'
import { useRoom } from '@/contexts/RoomContext'
import { updateTextState } from '@/recoil/callbacks/datastream-callback'

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
  const [audioStream, setAudioStream] = useState<MediaStream>()
  const [videoStream, setVideoStream] = useState<MediaStream>()
  const [videoTrack, setVideoTrack] = useState<MediaStreamTrack>()
  const [audioTrack, setAudioTrack] = useState<MediaStreamTrack>()
  const setParticipantsState = useSetRecoilState(participantsState)
  const videoEnabled = useRecoilValue(videoEnabledState)
  const audioEnabled = useRecoilValue(audioEnabledState)
  useEffect(() => {
    if (!videoTrack) return
    videoEnabled ? (videoTrack.enabled = true) : (videoTrack.enabled = false)
  }, [videoEnabled, videoTrack])
  useEffect(() => {
    if (!audioTrack) return
    audioEnabled ? (audioTrack.enabled = true) : (audioTrack.enabled = false)
  }, [audioEnabled, audioTrack])

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
  const volume = useRecoilValue(volumeState)
  useEffect(() => {
    console.log('volume', gainNode)
    gainNode.gain.value = volume
  }, [volume, gainNode])

  // ユーザ画面
  const [userAreaDocuments, setUserAreaDocuments] = useState<HTMLElement[]>([])

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
  }, [information, toast])

  // チャット受信処理
  const { addText } = updateTextState()
  const [announce, setAnnounce] = useRecoilState(chatAnnouncementState)

  // SkyWay
  const [room, setRoom] = useState<P2PRoom>()
  const { me, setMe, setLocalDataStream } = useRoom()

  // ルーム退室 + タブ離脱処理
  const leaveBeacon = () => {
    if (me == null || room == null) return
    if (room.members.length !== 1) {
      return
    } else {
      const status = navigator.sendBeacon(
        `${API_URL}/api/rooms/close/${roomId}`,
      )
      return status
    }
  }

  useBeforeUnloadFunction(leaveBeacon)

  const onLeave = async () => {
    let status = true // エラー発生時はfalseに切り替えtoastの表示を切り替え
    let error_log = ''
    if (me == null || room == null) {
      console.error('SkyWayの設定にエラーが発生している可能性があります。')
      status = false
      return
    }
    setIsClosing(true)
    if (room.members.length == 1) {
      // ルームの最後のメンバーの場合
      try {
        leaveBeacon()
        for (const pub of me.publications) await me.unpublish(pub.id)
        await me.leave()

        videoStream?.getTracks().forEach((track) => {
          track.stop()
        })
        audioStream?.getTracks().forEach((track) => {
          track.stop()
        })

        setRoom(undefined)
        setMe(null)
      } catch (e: any) {
        status = false
        error_log = e.message

        console.error(e)
      }
    } else {
      // 通常の退室処理
      try {
        for (const pub of me.publications) {
          await me.unpublish(pub.id)
        }
        await me.leave()
        setRoom(undefined)
        setMe(null)
      } catch (e: any) {
        status = false
        error_log = e.message
      }
    }
    toast({
      title: status ? '退室しました' : '退室処理時にエラーが発生しました',
      status: status ? 'success' : 'error',
      description: status
        ? 'お疲れ様でした。記録はメンバーが全員退室したあとに確認することができます。'
        : `${error_log}`,
      duration: 5000,
      isClosable: true,
    })
    setIsClosing(false)
    router.push('/lounge')
  }

  const cleanup = () => {
    videoStream?.getTracks().forEach((track) => {
      track.stop()
    })
    audioStream?.getTracks().forEach((track) => {
      track.stop()
    })
  }

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
      console.log('video', _video[0])
      console.log('audio', _audio[0])

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
      if (setLocalDataStream !== undefined && SkyWayDataStream !== undefined)
        setLocalDataStream(SkyWayDataStream)

      const myVideoInputStream = new LocalVideoStream(_video[0])
      const myAudioqInputStream = new LocalAudioStream(_audio[0])

      if (_audio) await me.publish(myAudioqInputStream)
      if (_video) await me.publish(myVideoInputStream)

      await me.publish(SkyWayDataStream)

      const subscribeAndAttach = async (publication: RoomPublication) => {
        if (publication.publisher.id === me.id) {
          return
        }
        setParticipantsState(room.members.length)
        const remoteMediaArea = document.getElementById('remoteMediaArea')
        const remoteUserArea = document.createElement('div') as HTMLDivElement
        const { stream } = await me.subscribe(publication.id)
        switch (stream.contentType) {
          case 'video':
            {
              const videoMedia: HTMLVideoElement =
                document.createElement('video')
              videoMedia.playsInline = true
              videoMedia.autoplay = true
              videoMedia.muted = true
              stream.attach(videoMedia)
              if (remoteMediaArea != null && remoteUserArea != null) {
                remoteUserArea.appendChild(videoMedia)
              }
            }
            break
          case 'audio':
            {
              const audioMedia: HTMLAudioElement =
                document.createElement('audio')
              audioMedia.controls = false
              audioMedia.autoplay = true
              stream.attach(audioMedia)
              const source = ctx.createMediaElementSource(audioMedia)
              source.connect(gainNode)
              gainNode.connect(ctx.destination)
              if (remoteMediaArea != null && remoteUserArea != null) {
                remoteUserArea.appendChild(audioMedia)
              }
            }
            break
          case 'data':
            stream.onData.add((data) => {
              const chat = data as ChatMessage
              addText(chat['memberId'], chat['memberName'], chat['message'])
              if (announce !== undefined && announce === false) {
                setAnnounce(true)
              }
            })
            break
        }
        if (remoteUserArea.childNodes.length !== 0) {
          setUserAreaDocuments((prevAreas) => ({
            ...prevAreas,
            [publication.publisher.id]: remoteUserArea,
          }))
        }
      }
      room.publications.forEach(subscribeAndAttach)
      room.onStreamPublished.add((e) => subscribeAndAttach(e.publication))

      // メンバーが入室した際の処理
      room.onMemberJoined.once(() => {
        setInformation(`メンバーが入室しました.`)
        setParticipantsState(room.members.length)
      })

      // メンバーが退室した際の処理
      room.onMemberLeft.add((e) => {
        room.publications.forEach(async (publication) => {
          await me.unpublish(publication.id)
          if (publication.publisher.id !== me.id) {
            setInformation(`メンバーが退室しました.`)
          }
        })
        setParticipantsState(room.members.length)
        // 退室したメンバーの表示エリアを削除
        const displayArea = document.querySelector(
          `[data-publication-id="${e.member.id}"]`,
        )
        if (displayArea !== undefined && displayArea !== null)
          displayArea.remove()
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

  if (!isMediaAuthed) {
    return (
      <div>
        <Heading
          color={'white'}
          textAlign="center"
          size="lg"
          my={10}
          fontSize="30px"
        >
          入室待機中...
        </Heading>
        <Dialog alertTexts={alertTexts} handler={handler} />
      </div>
    )
  }

  return (
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
      <Flex
        p={'1rem'}
        flexWrap={'wrap'}
        color="white"
        direction={'row'}
        h={'100%'}
        alignItems={'center'}
        justifyContent={'center'}
        gap={'1%'}
        id="remoteMediaArea"
      >
        <Box
          overflow={'hidden'}
          minW={'400px'}
          minH={'350px'}
          h={'40%'}
          w={'30%'}
        >
          <video ref={localVideoRef} autoPlay playsInline muted />
          <audio ref={localAudioRef} autoPlay playsInline muted />
        </Box>
        {Object.keys(userAreaDocuments).map((publicationId) => {
          const remoteUserArea = userAreaDocuments[publicationId as any]
          return (
            <div
              data-publication-id={publicationId}
              key={publicationId}
              className="video-container"
              style={{
                overflow: 'hidden',
                height: '40%',
                width: '30%',
                minWidth: '400px',
                minHeight: '350px',
                aspectRatio: '16/9',
              }}
              ref={
                remoteUserArea &&
                ((node) => {
                  if (node && remoteUserArea) {
                    node.appendChild(remoteUserArea)
                  }
                })
              }
            ></div>
          )
        })}
      </Flex>
      <div>
        <Box h={'fit-content'} w={'100%'} position={'fixed'} bottom={'0'}>
          <ControlBar />
        </Box>
      </div>
    </>
  )
}
