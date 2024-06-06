'use client'
import {
  Button,
  Flex,
  Heading,
  Input,
  Link,
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { useForm } from 'react-hook-form'
import { useCallback } from 'react'
import { signIn } from 'next-auth/react'
import { Image } from '@chakra-ui/react'
import { HOST_URI } from '@/config/env'

type LoginFormData = {
  name: string
}

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid, isSubmitting, errors },
  } = useForm<LoginFormData>()
  const toast = useToast()

  const onSubmit = useCallback(async (data: LoginFormData) => {
    try {
      const response = await signIn('credentials', {
        callbackUrl: `${HOST_URI}/lounge`,
        name: data.name,
      });
      if (response) {
        toast({
          description: 'ログインしました',
          status: 'success',
        })
      } else {
        throw new Error('Login failed')
      }
    } catch (error) {
      toast({
        description: 'ログインに失敗しました',
        status: 'error',
      })
    } finally {
      reset()
    }
  }, [])

  const msSignin = async () => {
    await signIn('microsoft-entra-id', {
      callbackUrl: `${HOST_URI}/lounge`,
    })
  }

  return (
    <Flex
      direction="column"
      background={'gray.100'}
      padding={12}
      rounded={6}
      gap={6}
      maxW={'400px'}
      w={'100%'}
    >
      <Heading color={'gray.700'} fontSize={'xl'}>
        参加者名
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormControl isInvalid={!!errors.name}>
          <FormLabel>ユーザー名</FormLabel>
          <Input
            {...register('name', { required: 'ユーザー名を入力してください' })}
            background={'gray.50'}
            placeholder="ユーザ名を入力してください"
            variant="filled"
            type="text"
          />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>
        <Button
          type="submit"
          mt={6}
          colorScheme="teal"
          disabled={!isValid || isSubmitting}
          isLoading={isSubmitting}
        >
          ログイン
        </Button>
      </form>
      <VStack>
      <Button onClick={msSignin} w={'fit-content'} p={0} m={'auto'}>
        <Image src='/asset/ms-symbollockup_signin_light.svg' alt='ms oauth' _hover={{filter:'brightness(0.9)'}}></Image>
      </Button>
      </VStack>
      <Flex>
        <Text fontSize="xs">
          アカウントを作成する場合
          <Link color="teal.500" mx="2px" href="/sign-up">
            Sign up
            <ExternalLinkIcon />
          </Link>
        </Text>
      </Flex>
    </Flex>
  )
}
