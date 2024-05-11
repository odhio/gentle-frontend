'use client'
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  RadioGroup,
  Radio,
  Stack,
  Image,
  Heading,
  Flex,
  Text,
  Link,
  FormErrorMessage,
} from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { useForm } from 'react-hook-form'
import { useCallback } from 'react'

const Images = [
  '/asset/userassets/icon001.jpg',
  '/asset/userassets/icon002.jpg',
  '/asset/userassets/icon003.jpg',
  '/asset/userassets/icon004.jpg',
]

type SignUpFormData = {
  id: string
  password: string
  image: string
}

export const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isValid, errors },
  } = useForm<SignUpFormData>()
  const onSubmit = useCallback((data: SignUpFormData) => {
    console.log(data)
  }, [])

  return (
    <Flex
      direction="column"
      background={'gray.100'}
      padding={12}
      rounded={6}
      gap={6}
      maxW={'480px'}
      w={'100%'}
    >
      <Heading color={'gray.700'} fontSize={'xl'}>
        サインアップ
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormControl isInvalid={!!errors.id}>
          <FormLabel>ID</FormLabel>
          <Input
            {...register('id', { required: 'IDは必須です' })}
            background={'gray.50'}
            placeholder="ユーザ名またはメールアドレスを入力してください"
            variant="filled"
            type="text"
          />
          <FormErrorMessage>{errors.id?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.password}>
          <FormLabel>パスワード</FormLabel>
          <Input
            {...register('password', { required: 'パスワードは必須です' })}
            background={'gray.50'}
            placeholder="パスワードを入力してください"
            variant="filled"
            type="password"
          />
          <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.image}>
          <FormLabel as="legend">画像</FormLabel>
          <RadioGroup>
            <Stack spacing={4} direction="row">
              {Images.map((image) => (
                <Radio
                  value={image}
                  key={image}
                  {...register('image', { required: '画像を選択してください' })}
                  flexShrink={0}
                >
                  {/* eslint-disable-next-line jsx-a11y/alt-text */}
                  <Image src={image} boxSize="50px" rounded={'full'} />
                </Radio>
              ))}
            </Stack>
          </RadioGroup>
          <FormErrorMessage>{errors.image?.message}</FormErrorMessage>
        </FormControl>
        <Button
          type="submit"
          mb={4}
          colorScheme="teal"
          disabled={!isValid || isSubmitting}
          isLoading={isSubmitting}
        >
          登録
        </Button>
      </form>

      <Flex>
        <Text fontSize="xs">
          アカウントをお持ちの場合
          <Link color="teal.500" mx="2px" href="/login">
            ログイン
            <ExternalLinkIcon />
          </Link>
        </Text>
      </Flex>
    </Flex>
  )
}
