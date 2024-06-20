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
  Text,
  VStack,
} from '@chakra-ui/react'
import { useRoomDetail } from '../../rooms/api/getRoomDetail'

type Props = {
  isOpen: boolean
  onClose: () => void
  roomUuid: string
}

export const RoomDetailModal = ({ isOpen, onClose, roomUuid }: Props) => {
  const { data, isLoading } = useRoomDetail(roomUuid)

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={'xl'}
        scrollBehavior={'inside'}
      >
        <ModalOverlay />
        <ModalContent bg="orange.50" borderRadius="lg" w={800}>
          <ModalHeader bg={'teal'} mb={3}>
            {isLoading ? (
              <Skeleton height="20px" />
            ) : (
              <Flex alignItems="center" gap={2} color={'white'}>
                主な会話内容：
              </Flex>
            )}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <>
              <Flex flexDirection={'column'} mb={3} gap={2}>
                <Heading size={'md'} color={'teal'}>
                  会議の要約
                </Heading>
                {isLoading ? (
                  <Skeleton height="20px" />
                ) : data?.summary ? (
                  <Text>{data?.summary}</Text>
                ) : (
                  <VStack gap={0}>
                    <Text
                      fontWeight={'bold'}
                      fontSize={'larger'}
                      color={'red.700'}
                    >
                      現在解析処理中です…
                    </Text>
                    <Text fontSize={'small'} color={'gray.500'}>
                      しばらくお待ちください。
                    </Text>
                  </VStack>
                )}
              </Flex>
              <Flex flexDirection={'column'} gap={2}>
                <Heading size={'sm'} color={'teal'}>
                  会話履歴
                </Heading>
                <TableContainer>
                  <Table variant="simple">
                    <TableCaption>
                      Imperial to metric conversion factors
                    </TableCaption>
                    <Thead>
                      <Tr>
                        <Th>発言者</Th>
                        <Th>内容</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {isLoading ? (
                        Array.from({ length: 5 }, (_, index) => (
                          <Tr key={index}>
                            <Td>
                              <Skeleton height="20px" />
                            </Td>
                            <Td>
                              <Skeleton height="20px" />
                            </Td>
                          </Tr>
                        ))
                      ) : data?.roomMembers ? (
                        data?.roomMembers?.map((member, i) => (
                          <Tr key={i}>
                            <Td>{member.name}</Td>
                            <Td>{member.summary}</Td>
                          </Tr>
                        ))
                      ) : (
                        <Tr>
                          <Td colSpan={2}>
                            <VStack gap={0} mx={'auto'} w={'100%'}>
                              <Text
                                fontWeight={'bold'}
                                fontSize={'larger'}
                                color={'red.700'}
                              >
                                現在解析処理中です…
                              </Text>
                              <Text fontSize={'small'} color={'gray.500'}>
                                しばらくお待ちください。
                              </Text>
                            </VStack>
                          </Td>
                        </Tr>
                      )}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Flex>
            </>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
