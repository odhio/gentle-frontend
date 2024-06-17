'use server'
import { Button, SimpleGrid, Text } from '@chakra-ui/react'
import { getAllRooms } from '@/features/room/api/room'
import { Room } from '@/types/types'
import { GetServerSideProps } from 'next'
import { CreateRoomButton } from '../component/create-room'
import { RoomCard } from '../component/room-card'
import Link from 'next/link'
import { auth } from '@/auth'

export const LoungeRoom = async () => {
  const rooms: Room[] = await getAllRooms()

  const user = await auth()
  console.log('user:', user)

  return (
    <>
      <CreateRoomButton />
      <Link href={'/room/history'}>
        <Button
          bg={'teal.600'}
          _hover={{ bg: 'teal.400' }}
          color={'white'}
          py={8}
          px={12}
          position={'fixed'}
          bottom={'2%'}
          right={'2%'}
          zIndex={1000}
        >
          ミーティング分析
        </Button>
      </Link>
      <SimpleGrid mx={50} mt={10} columns={[1, 2, 3, 4, 5, 6, 7]} spacing={4}>
        {rooms?.length > 0 ? (
          <>
            {rooms.map((room) => (
              <RoomCard room={room} key={room.uuid} />
            ))}
          </>
        ) : (
          <Text textAlign={'center'} fontSize={'sm'} color={'gray.500'}>
            表示できる会議室がありません
          </Text>
        )}
      </SimpleGrid>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const rooms: Room[] = await getAllRooms()
  return {
    props: { rooms },
  }
}
