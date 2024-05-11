import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createRoom, getAllActiveRooms, joinRoom } from '@/api/firebase/room';
import { Box, Button, Card, CardBody, CardFooter, CardHeader, Heading, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, SimpleGrid, Text, useDisclosure } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { uuidV4 } from '@skyway-sdk/token';

export const LoungeRoom = () => {
  const [activeRooms, setActiveRooms] = useState<any[]>([]);
  const [roomName, setRoomName] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  // 開催中の部屋一覧
  useEffect(() => {
    const fetchActiveRooms = async () => {
      setActiveRooms(await getAllActiveRooms());
    };
    fetchActiveRooms();
  }, []);

  const handleCreateRoom = async () => {
    const uuid = uuidV4();
    const pk = await createRoom(uuid, roomName);
    if (pk) {
      router.push(`/room/${pk}?roomId=${uuid}&name=${roomName}`);
    }else{
      alert('作成中にエラーが発生しました。');
    }
  };
  
  
  return (
    <div>
      <Box display="flex" justifyContent="center" flexDirection={'column'} gap={3} alignItems="center">
      <Heading textAlign={'center'} size={'xl'}>開催中のルーム一覧</Heading>
      <Button mx={'auto'} h={'60px'} w={'10%'} onClick={onOpen}>新規作成</Button>
      </Box>
      <SimpleGrid mx={50} mt={10} columns={[1, 2, 3]} spacing={4}>
        {activeRooms && activeRooms.map((room) => (
          <Card key={room.id}>
            <CardHeader>
              <Heading size='md'>
                {room.name || `Room ${room.id}`}
              </Heading>
            </CardHeader>
            <CardBody>
              <Text>Room ID: {room.roomId}</Text>
            </CardBody>
            <CardFooter>
              <Button as="a" href={`/room/${room.id}?roomId=${room.roomId}`}>参加する</Button>
            </CardFooter>
          </Card>
        ))}
      </SimpleGrid>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>ルームを作成する</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="部屋名を入力してください" 
              value={roomName} 
              onChange={(e) => setRoomName(e.target.value)} 
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleCreateRoom}>
              新規作成
            </Button>
            <Button variant="ghost" onClick={onClose}>キャンセル</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
