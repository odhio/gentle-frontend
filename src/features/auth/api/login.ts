import { client } from '@/lib/api'

export interface LoginBody {
  name: string
}

type Response = {
  success: boolean
  jwt: string | null
  uuid: string
  name: string
  image: string
};

const KEY = () => '/api/auth/login'

export const login = async (body: LoginBody) => {
  const { data } = await client.post<Response>(KEY(), body )
  return data
}
