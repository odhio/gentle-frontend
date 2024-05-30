import axios from 'axios'

import { API_URL, HOST_URI } from '@/config/env'

export const client = axios.create({
  baseURL: `${API_URL}`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const nextClient = axios.create({
  baseURL: `${HOST_URI}`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})