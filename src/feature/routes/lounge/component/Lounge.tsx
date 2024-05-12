import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  HStack,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { uuidV4 } from '@skyway-sdk/token'
import { Rooms } from '@/types/DataModel'
import { ResGetAllRooms, ResRoom, createRoom, getAllRooms } from '@/api/db/room'

export const LoungeRoom = () => {
  const [roomName, setRoomName] = useState('')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const router = useRouter()
  const [roomData, setRoomData] = useState<ResRoom[]>([])

  useEffect(() => {
    const fetchRoomData = async () => {
      const rooms = await getAllRooms()
      if (rooms) {
        setRoomData(rooms)
      } else {
      }
    }
    fetchRoomData()
  }, [])

  const handleCreateRoom = async () => {
    const uuid = uuidV4()
    const pk = await createRoom(uuid, roomName)
    if (pk) {
      router.push(`/room/${pk}?roomId=${uuid}&name=${roomName}`)
    } else {
      alert('作成中にエラーが発生しました。')
    }
  }

  return (
    <div>
      <Box
        display="flex"
        justifyContent="center"
        flexDirection={'column'}
        gap={3}
        alignItems="center"
      >
        <Heading textAlign={'center'} mt={5} size={'xl'}>
          {}
        </Heading>
        <Button
          mx={'auto'}
          h={'60px'}
          w={'fit-content'}
          px={'15px'}
          onClick={onOpen}
        >
          今日の会議を始める
        </Button>
      </Box>
      <SimpleGrid mx={50} mt={10} columns={[1, 2, 3, 4, 5, 6, 7]} spacing={4}>
        {roomData &&
          roomData.map((room: ResRoom) => (
            <Card
              bg={room?.closed_at ? 'gray.100' : 'white'}
              p={4} // Padding inside the Box
              borderRadius="md" // Rounded corners
              transition="background 0.3s, opacity 0.3s" // Smooth transition
              key={room.id}
            >
              <CardHeader>
                <Heading size="md" mb={3} display={'inline-block'}>
                  {room.createdAt ? room.createdAt : ''} {/*仮置き*/}
                </Heading>
              </CardHeader>
              <CardBody>
                <Text>{/*room.summary ? () : ()*/}</Text>
              </CardBody>
              <CardFooter>
                {room.closedAt ? (
                  <></>
                ) : (
                  <HStack spacing={4}>
                    <Text>今日の会議を始めましょう</Text>
                    <Button as="a" href={`/room/${room?.id}`}>
                      参加
                    </Button>
                  </HStack>
                )}
              </CardFooter>
            </Card>
          ))}
      </SimpleGrid>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="orange.50" borderRadius="lg">
          <ModalHeader>今日の会議を始める</ModalHeader>
          <ModalCloseButton />
          <ModalBody></ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCreateRoom}>
              新規作成
            </Button>
            <Input
              placeholder="会議名を入力してください"
              onChange={(e) => setRoomName(e.target.value)}
            />
            <Button variant="outline" onClick={onClose}>
              キャンセル
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}
