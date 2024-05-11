import { client } from '@/lib/api'

type Body = {
  id: string
}

type Response = {
  success: boolean
}

const KEY = () => '/api/auth/login'

export const login = async (body: Body) => {
  const { data } = await client.post<Response>(KEY(), body)
  return data
}
