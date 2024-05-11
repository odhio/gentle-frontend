import axios from 'axios'

import { API_URL } from '@/config/env'

export const client = axios.create({
  baseURL: `${API_URL}`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})
