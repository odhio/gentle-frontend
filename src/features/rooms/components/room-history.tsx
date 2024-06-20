'use client'
import {
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
  Box,
} from '@chakra-ui/react'
import { useRoomDetail } from '../api/getRoomDetail'

type Props = {
  roomUuid: string
}

export const RoomHistory = ({ roomUuid }: Props) => {
  const { data, isLoading } = useRoomDetail(roomUuid)

  return (
    <>
      {isLoading ? (
        <Skeleton height="20px" />
      ) : (
        <>
          <Flex
            bg={'teal'}
            h={'45px'}
            w={'100%'}
            mb={6}
            rounded={'sm'}
            position={'relative'}
          >
            <Heading
              display={'inline-flex'}
              as="h2"
              size="md"
              mb={4}
              color={'white'}
              position={'absolute'}
              top={'50%'}
              left={'50%'}
              transform={'translate(-50%,-50%)'}
            >
              主な会話内容:
            </Heading>
          </Flex>
        </>
      )}
      <Box>
        <Flex
          bg={'teal.50'}
          rounded={'xl'}
          p={10}
          flexDirection={'column'}
          mb={10}
          gap={2}
        >
          <Heading size={'md'} fontWeight={'bold'} mb={2} color={'teal'}>
            会議の要約
          </Heading>
          {isLoading ? (
            <Skeleton height="20px" />
          ) : (
            <Text
              color={'teal'}
              fontSize={'sm'}
              fontWeight={'bold'}
              pl={'1.5rem'}
              lineHeight={2}
            >
              {data?.summary}
            </Text>
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
                        <Td lineHeight={1.5} whiteSpace={'wrap'}>
                          {member.summary}
                        </Td>
                      </Tr>
                    ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Flex>
      </Box>
    </>
  )
}
