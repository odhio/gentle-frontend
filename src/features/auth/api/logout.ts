import { client } from '@/lib/api'

type Response = {
  success: boolean
}

const KEY = () => '/api/auth/logout'

export const logout = async () => {
  const { data } = await client.post<Response>(KEY())
  return data
}
