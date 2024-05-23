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
  Tooltip
} from '@chakra-ui/react'
import { useRoomDetail } from '../../rooms/api/getRoomDetail'
import { EmotionLabel } from '@/features/room/component/emotion/EmotionLabel'
import { CalendarIcon } from '@chakra-ui/icons'
import { useToggle } from 'react-use'
import { GoogleCalendarForm } from '@/features/calendar/google-calendar-form'

type Props = {
  isOpen: boolean
  onClose: () => void
  roomUuid: string
}

export const RoomDetailModal = ({ isOpen, onClose, roomUuid }: Props) => {
  const { data, isLoading } = useRoomDetail(roomUuid);
  const [ isCarendarSelected, setIsCarendarSelected ] = useToggle(false);

  return (
    <>
    <Modal isOpen={isOpen} onClose={onClose} size={'xl'} scrollBehavior={'inside'}>
      <ModalOverlay />
      <ModalContent bg="orange.50" borderRadius="lg" w={800}>
        <ModalHeader  bg={'teal'} mb={3}>
          {isLoading ? (
            <Skeleton height="20px" />
          ) : (
            <Flex alignItems="center" gap={2} color={'white'}>
              全体の雰囲気：<EmotionLabel emotion={data?.emotion || ''} pressure={''} />
              {data?.googleSchedule?(
                <>
                  <Tooltip
                    label={'カレンダーの登録候補があります'}
                    placement="top"
                  >
                  <CalendarIcon
                    onClick={setIsCarendarSelected}
                  />
                  </Tooltip>
                </>
                ):(
                <></>
                )}
            </Flex>
          )}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
        {isCarendarSelected && data?.googleSchedule !== (undefined || null) ?(
          <>
          {data?.googleSchedule &&
            <GoogleCalendarForm googleSchedule={data?.googleSchedule} toggle={setIsCarendarSelected}/>
          }
          </>
        ):(
          <>
          <Flex flexDirection={'column'} mb={3} gap={2}>
            <Heading size={'md'} color={'teal'}>
              会議の要約
            </Heading>
            {isLoading ? (
              <Skeleton height="20px" />
            ) : (
              <Text>{data?.summary}</Text>
            )}
          </Flex>
          <Flex flexDirection={'column'} gap={2}>
          <Heading size={'sm'} color={'teal'}>
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
                  : data?.roomMembers?.map((member, i) => (
                      <Tr key={i}>
                        <Td>{member.name}</Td>
                        <Td>{member.summary}</Td>
                      </Tr>
                    ))}
              </Tbody>
            </Table>
          </TableContainer>
          </Flex>
          </>
        )}
        </ModalBody>
      </ModalContent>
    </Modal>
    </>
  )
}