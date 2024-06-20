'use client'

import { Flex, Tooltip, Box, Spinner, Text, Heading } from '@chakra-ui/react'
import { useRoomList } from '../api/getRooms'
import { useState } from 'react'
import { DogFootPrint } from '../assets/dog-foot-print'
import { FootPrint } from '../assets/footprint'
import { generateRangeSteps } from '@/utils/steps'
import { DisplayGraph } from '../components/analytics/display'
import { RoomHistory } from '../components/room-history'

const Palette: { [key: string]: string } = {
  happy: '#EFA000',
  sad: '#474799',
  anger: '#CD1F43',
  fear: '#7B3380',
  disgust: '#AA2763',
  neutral: '#A3B300',
}

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
  const datetime = new Date().toLocaleString('ja-JP', {
    timeZone: 'Asia/Tokyo',
  })
  const date = datetime.split(' ')[0]
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
      <>
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
      </>
    )
  }
  const rotate = generateRangeSteps({
    start: 80,
    end: 120,
    step: 20,
    length: data.rooms.length,
  })
  return (
    <>
      <Flex w={'100%'} flexDirection={'row'}>
        <Box w={'45%'} mb={6}>
          <Box
            bg={'teal'}
            h={'45px'}
            w={'100%'}
            mb={6}
            rounded={'md'}
            position={'relative'}
          >
            <Heading
              as="h2"
              size="md"
              mb={4}
              color={'white'}
              position={'absolute'}
              top={'50%'}
              left={'50%'}
              transform={'translate(-50%,-50%)'}
            >
              会議の足跡
              <Text fontSize={'8px'}>
                ※足跡をクリックすると内容を振り返ることができます。
              </Text>
            </Heading>
          </Box>
          <Flex flexDirection="row" flexWrap="wrap" gap={3} mb={3}>
            {data.rooms.map((room, i) => (
              <Tooltip
                key={i}
                label={
                  room.closedAt
                    ? `${format(room.closedAt)}` + ' 終了'
                    : '会議中'
                }
                placement="top"
              >
                <Box
                  key={i}
                  _hover={{
                    cursor: 'pointer',
                    opacity: 0.6,
                  }}
                  onClick={() => setRoomUuid(room.uuid)}
                >
                  {date.split('/').slice(1).includes('1') ? (
                    /*🐶*/
                    <DogFootPrint
                      key={i}
                      fill={room.emotion ? Palette[room.emotion] : '#e5e5e5'}
                      transform={rotate ? `rotate(${rotate[i]})` : ''}
                    />
                  ) : (
                    <FootPrint
                      key={i}
                      fill={room.emotion ? Palette[room.emotion] : '#e5e5e5'}
                      transform={rotate ? `rotate(${rotate[i]})` : ''}
                    />
                  )}
                </Box>
              </Tooltip>
            ))}
          </Flex>
          <Box w={'100%'} h={'100%'}>
            {roomUuid !== '' && <RoomHistory roomUuid={roomUuid} />}
          </Box>
        </Box>
        <Box w={'55%'}>
          {roomUuid !== '' && (
            <>
              <Flex gap={10} w={'100%'} h={'fit-content'}>
                <DisplayGraph roomUuid={roomUuid} />
              </Flex>
            </>
          )}
        </Box>
      </Flex>
    </>
  )
}
