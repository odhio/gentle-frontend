'use server'
import { client } from '@/lib/api'

interface RequestModel {
    name: string | null | undefined
    image: string | null | undefined
}

interface ResponseModel {
    success : boolean
    uuid: string | null
}

const KEY = () => '/api/auth/oauth2/me'

export const oauthMe = async (body: RequestModel) => {
    if (body.name === undefined || body.name === null || body.image === undefined || body.image === null) {
        return { success: false, uuid: null }
    }
    const { data } = await client.post<ResponseModel>(KEY(), body)
    return data
}