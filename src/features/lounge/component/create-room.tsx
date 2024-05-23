'use client'
import { createRoom } from '@/features/room/api/room';
import { AddIcon } from '@chakra-ui/icons';
import { Button, Modal, Input, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, Box, Heading } from '@chakra-ui/react';
import { uuidV4 } from '@skyway-sdk/token';
import { useRouter } from 'next/navigation'
import { useState } from 'react';

export const CreateRoomButton = () => {
    const router = useRouter();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [roomName, setRoomName] = useState('')

    const handleCreateRoom = async () => {
        const uuid = uuidV4()
        const pk = await createRoom({ room_uuid: uuid, name: roomName })
        if (pk) {
            router.push(`/room/${uuid}`)
        } else {
            alert('作成中にエラーが発生しました。')
        }
    }

    return (
        <>
        <Box display="flex" justifyContent="center" flexDirection={'column'} gap={3} alignItems="center">
            <Heading textAlign={'center'} mt={5} size={'xl'}>{ }</Heading>
            <Button colorScheme="teal" mx={'auto'} h={'80px'} w={'fit-content'} px={10} onClick={onOpen} fontSize={18}>今日の会議を始める<AddIcon ml={5} /></Button>
        </Box>

        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent bg="orange.50" borderRadius="lg">
                <ModalHeader>今日の会議を始める</ModalHeader>
                <ModalCloseButton />
                <ModalBody></ModalBody>
                <ModalFooter>
                    <Input
                        placeholder="会議名を入力してください"
                        onChange={(e) => setRoomName(e.target.value)}
                    />
                    <Button colorScheme="blue" mr={3} onClick={handleCreateRoom}>
                        新規作成
                    </Button>
                    <Button variant="outline" onClick={onClose}>
                        キャンセル
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
        </>
    )
}