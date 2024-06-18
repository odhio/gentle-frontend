'use client'
import { Button, Flex, Text, VStack } from '@chakra-ui/react'
import { signIn } from 'next-auth/react'
import { Image } from '@chakra-ui/react'
import { HOST_URI } from '@/config/env'

export const LoginForm = () => {
  const msSignin = async () => {
    await signIn('microsoft-entra-id', {
      callbackUrl: `${HOST_URI}/lounge`,
    })
  }

  return (
    <Flex
      direction="column"
      background={'gray.700'}
      padding={12}
      rounded={6}
      gap={6}
      maxW={'400px'}
      w={'100%'}
    >
      <VStack>
        <Button
          onClick={msSignin}
          w={'fit-content'}
          p={0}
          mx={'auto'}
          mb={'15px'}
        >
          <Image
            src="/assets/ms-symbollockup_signin_light.svg"
            alt="ms oauth"
            _hover={{ filter: 'brightness(0.9)' }}
          ></Image>
        </Button>
        <Text fontSize={'sm'} color={'white'}>
          ※本サービスは認証済みユーザのみ利用可能です。
        </Text>
      </VStack>
    </Flex>
  )
}
