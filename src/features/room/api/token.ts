'use server'

import { nextClient } from "@/lib/api";

export interface TokenResponse {
    token: string | null
}

const getTokenKey=()=> '/api/skyway';

export const getToken = async () => {
    const res = await nextClient.get<TokenResponse>(getTokenKey());
    const token = res.data;
    return token;
}
