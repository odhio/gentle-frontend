
'use client'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Skeleton,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Flex,
  Heading,
  Text
} from '@chakra-ui/react'
import { useRoomDetail } from '../api/getRoomDetail'
import { EmotionLabel } from '@/feature/routes/room/component/emotion/EmotionLabel'

type Props = {
  isOpen: boolean
  onClose: () => void
  roomUuid: string
}

export const RoomDetailModal = ({ isOpen, onClose, roomUuid }: Props) => {
  const { data, isLoading } = useRoomDetail(roomUuid)
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="orange.50" borderRadius="lg">
        <ModalHeader>
          {isLoading ? (
            <Skeleton height="20px" />
          ) : (
            <Flex alignItems="center" gap={2}>
              <EmotionLabel emotion={data?.emotion || ''} pressure={''} />
            </Flex>
          )}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex flexDirection={'column'} gap={2}>
            <Heading size={'sm'}>
              会議の要約
            </Heading>
            {isLoading ? (
              <Skeleton height="20px" />
            ) : (
              <Text >{data?.summary}</Text>
            )}
          </Flex>
          <Flex flexDirection={'column'} gap={2}>
          <Heading size={'sm'}>
              会話履歴
            </Heading>
          <TableContainer>
            <Table variant="simple">
              <TableCaption>Imperial to metric conversion factors</TableCaption>
              <Thead>
                <Tr>
                  <Th>発言者</Th>
                  <Th>内容</Th>
                </Tr>
              </Thead>
              <Tbody>
                {isLoading
                  ? Array.from({ length: 5 }, (_, index) => (
                      <Tr key={index}>
                        <Td>
                          <Skeleton height="20px" />
                        </Td>
                        <Td>
                          <Skeleton height="20px" />
                        </Td>
                      </Tr>
                    ))
                  : data?.room_members?.map((member) => (
                      <Tr key={member.summary}>
                        <Td>{member.name}</Td>
                        <Td>{member.summary}</Td>
                      </Tr>
                    ))}
              </Tbody>
            </Table>
          </TableContainer>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}