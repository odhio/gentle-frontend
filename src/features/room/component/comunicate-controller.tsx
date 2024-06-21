'use client'
import {
  chatAnnouncementState,
  participantsState,
} from '@/recoil/atoms/media-atom'
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Image,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { ChatSpace } from './chat/chat-space'

export const ComunicateController = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [announce, setAnnounce] = useRecoilState(chatAnnouncementState)
  const participants = useRecoilValue(participantsState)
  const openDrawer = () => {
    if (isOpen) {
      onClose()
    } else {
      if (announce) {
        setAnnounce(false)
      }
      onOpen()
    }
  }
  return (
    <>
      <HStack gap={'30px'}>
        <Box>
          <Button
            w={'60px'}
            h={'60px'}
            p={3}
            bg={isOpen ? 'gray.500' : 'gray.700'}
            _hover={{ bg: 'gray.500' }}
            color={'white'}
            display={'flex'}
            flexDirection={'column'}
            onClick={openDrawer}
          >
            <Image src="/assets/chat.png" alt="volume" w={'40px'} />
            {announce && (
              <span
                style={{
                  position: 'absolute',
                  top: 7,
                  right: 10,
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: 'red',
                }}
              ></span>
            )}
            <Text fontSize={'8px'}>チャット</Text>
          </Button>
        </Box>
        <Box
          position={'relative'}
          w={'60px'}
          h={'60px'}
          display={'flex'}
          flexDirection={'column'}
          justifyContent={'center'}
          gap={1}
        >
          <Text
            position={'absolute'}
            color={'white'}
            fontSize={'medium'}
            fontWeight={'bold'}
            top={0}
            right={0}
          >
            {participants}
          </Text>
          <Image
            display={'block'}
            src="/assets/users.png"
            alt="setting"
            w={'40px'}
            margin={'auto'}
          />
          <Text color={'white'} textAlign={'center'} fontSize={'8px'}>
            参加人数
          </Text>
        </Box>
        <Tooltip label="開発中です">
          <Button
            w={'60px'}
            h={'60px'}
            bg={'gray.700'}
            _hover={{ bg: 'gray.500' }}
            color={'white'}
            display={'flex'}
            flexDirection={'column'}
            gap={3}
          >
            <Image src="/assets/invitation.png" alt="volume" w={'40px'} />
            <Text fontSize={'8px'}>招待通知</Text>
          </Button>
        </Tooltip>
      </HStack>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size={'lg'}>
        <DrawerOverlay />
        <DrawerContent bg={'gray.800'}>
          <DrawerCloseButton color={'white'} />
          <DrawerHeader color={'white'}>chat</DrawerHeader>
          <DrawerBody>
            <ChatSpace />
          </DrawerBody>
          <DrawerFooter>
            <Button
              variant="outline"
              mr={3}
              bg={'gray.600'}
              border={'none'}
              onClick={onClose}
              color={'white'}
            >
              閉じる
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
