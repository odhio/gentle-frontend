import { client } from '@/lib/api'

type Body = {
  id: string
  password: string
  image: string
}

type Response = {
  success: boolean
}

const KEY = () => '/api/auth/sign-up'

export const signUp = async (body: Body) => {
  const { data } = await client.post<Response>(KEY(), body)
  return data
}
