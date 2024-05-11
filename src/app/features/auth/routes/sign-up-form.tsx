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
  useToast,
} from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { useForm } from 'react-hook-form'
import { useCallback } from 'react'
import { signUp } from '../api/sign-up'
import { useRouter } from 'next/navigation'


const Images = [
  '/asset/userassets/icon001.jpg',
  '/asset/userassets/icon002.jpg',
  '/asset/userassets/icon003.jpg',
  '/asset/userassets/icon004.jpg',
]

type SignUpFormData = {
  name: string
  image: string
}

export const SignUpForm = () => {
  const router = useRouter()
  const toast = useToast()

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid, errors },
  } = useForm<SignUpFormData>()
  const onSubmit = useCallback(async (data: SignUpFormData) => {
    try {
      const response = await signUp(data)
      if (response.success) {
        toast({
          description: '登録しました',
          status: 'success',
        })
        router.push('/')
      } else {
        throw new Error('Sign up failed')
      }
    } catch (error) {
      toast({
        description: '登録できませんでした',
        status: 'error',
      })
    } finally {
      reset()
    }
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
        <FormControl isInvalid={!!errors.name}>
          <FormLabel>ユーザー名</FormLabel>
          <Input
            {...register('name', { required: 'ユーザー名は必須です' })}
            background={'gray.50'}
            placeholder="ユーザー名を入力してください"
            variant="filled"
            type="text"
          />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
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
