'use client'

import { EmotionLabel } from '@/feature/routes/room/component/emotion/EmotionLabel'
import { Flex, Tooltip, Box, Spinner, Text } from '@chakra-ui/react'
import { useRoomList } from '../api/getRooms'
import { useState } from 'react'
import { RoomDetailModal } from '../components/room-detail-modal'

const format = (data: Date | string | null) => {
  if (!data) {
    return ''
  }
  try {
    const _date = typeof data == 'string' ? new Date(data) : data
    return `${_date.getFullYear()}年${_date.getMonth() + 1}月${_date.getDate()}日  ${_date.getHours()}:${_date.getMinutes() < 10 ? '0' : ''}${_date.getMinutes()}`
  } catch {
    return ''
  }
}

export const EmotionHeatMap = () => {
  const { data, isLoading } = useRoomList()
  const [roomUuid, setRoomUuid] = useState('')

  if (isLoading) {
    return (
      <Box
        maxWidth={'80%'}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Spinner />
      </Box>
    )
  }

  if (!data || data.rooms.length === 0) {
    return (
      <Box
        maxWidth={'80%'}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
      >
        <Text fontSize={'medium'} color={'black'}>
          会議の履歴がありません
        </Text>
      </Box>
    )
  }

  return (
    <>
      <Flex
        flexDirection="column"
        flexWrap="wrap-reverse"
        gap={1}
        maxWidth={'80%'}
      >
        {data.rooms.map((room) => (
          <Tooltip
            key={room.uuid}
            label={
              room.closed_at ? `${format(room.closed_at)}` + ' 終了' : '会議中'
            }
            placement="top"
          >
            <Box
              w={5}
              h={5}
              rounded="md"
              bg="gray.100"
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
              onClick={() => setRoomUuid(room.uuid)}
            >
              <EmotionLabel emotion={room.emotion || ''} pressure={''} />
            </Box>
          </Tooltip>
        ))}
      </Flex>
      <RoomDetailModal
        roomUuid={roomUuid}
        isOpen={roomUuid !== ''}
        onClose={() => setRoomUuid('')}
      />
    </>
  )
}
