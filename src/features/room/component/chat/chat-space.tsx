import { useRoom } from '@/contexts/RoomContext'
import { stateTextData } from '@/recoil/atoms/localstream-atom'

import { updateTextState } from '@/recoil/callbacks/datastream-callback'
import { EditIcon } from '@chakra-ui/icons'
import { Box, Button, Text, Textarea } from '@chakra-ui/react'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import { useRecoilValue } from 'recoil'

export const ChatSpace = () => {
  const { me, localDataStream } = useRoom()
  const { data: session } = useSession()
  const user = session?.user ?? undefined
  const [inputMessage, setInputMessage] = useState<string>('')

  const { addText } = updateTextState()
  const chatTexts = useRecoilValue(stateTextData)

  const sendMessage = () => {
    if (localDataStream == (null || undefined)) return
    addText(me?.id ?? '', user?.name ?? '名無し', inputMessage)

    localDataStream.write({
      memberId: me?.id ?? '',
      memberName: user?.name ?? '名無し',
      type: 'text',
      message: inputMessage,
    })
    setInputMessage('')
  }

  const handleInputChange = (event: {
    target: { value: React.SetStateAction<string> }
  }) => {
    setInputMessage(event.target.value)
  }

  return (
    <>
      <Box
        h={'75%'}
        mb={3}
        p={3}
        py={'1rem'}
        borderRadius={'10px'}
        bg={'gray.600'}
      >
        {chatTexts !== null && chatTexts.length > 0 ? (
          chatTexts.map((chat, i) =>
            chat?.memberId === me?.id ? (
              <Text key={i} size="sm" color="blue.50">
                <span style={{ fontWeight: 'bold' }}>[自分]</span>
                {chat?.message}
              </Text>
            ) : (
              <Text size="sm" key={i} color="white">
                <span style={{ fontWeight: 'bold' }}>
                  [{chat?.memberName ?? '名無し'}]
                </span>
                {chat?.message}
              </Text>
            ),
          )
        ) : (
          <Text color={'white'}>メッセージはありません</Text>
        )}
      </Box>
      <Box h={'20%'} position={'relative'}>
        <Textarea
          p={'1rem 2rem'}
          color={'white'}
          bg={'gray.700'}
          border={'none'}
          value={inputMessage}
          onChange={handleInputChange}
          placeholder="ルームにメッセージを送信する"
          size="md"
          resize="none"
          w={'100%'}
          h={'100%'}
        />
        <Button
          position={'absolute'}
          zIndex={'10'}
          bottom={'15px'}
          right={'15px'}
          w={'100px'}
          colorScheme="blue"
          mt={2}
          onClick={sendMessage}
          isDisabled={!inputMessage || inputMessage.length === 0}
        >
          送信
          <EditIcon mx={2} />
        </Button>
      </Box>
    </>
  )
}
