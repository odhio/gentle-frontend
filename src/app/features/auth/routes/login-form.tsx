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
} from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { useForm } from 'react-hook-form'
import { useCallback } from 'react'

type LoginFormData = {
  id: string
}

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { isValid, isSubmitting, errors },
  } = useForm<LoginFormData>()

  const onSubmit = useCallback((data: LoginFormData) => {
    console.log(data)
  }, [])
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
        <FormControl isInvalid={!!errors.id}>
          <FormLabel>ID</FormLabel>
          <Input
            {...register('id', { required: 'IDを入力してください' })}
            background={'gray.50'}
            placeholder="ユーザ名またはメールアドレスを入力してください"
            variant="filled"
            type="text"
          />
          <FormErrorMessage>{errors.id?.message}</FormErrorMessage>
        </FormControl>
        <Button
          type="submit"
          mb={4}
          colorScheme="teal"
          disabled={!isValid || isSubmitting}
          isLoading={isSubmitting}
        >
          ログイン
        </Button>
      </form>

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
