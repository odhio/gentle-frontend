import { useContext, useEffect } from 'react'
import firebase from 'firebase/app'
import {
  ref,
  child,
  get,
  onValue,
  query,
  equalTo,
  orderByChild,
  set,
  push,
} from 'firebase/database'
import { db } from '@/lib/firebase/firebase'
import { v4 } from 'uuid'
import { UserInformation } from '@/types/DataModel'

export const getUsers = async () => {
  const dbRef = ref(db, 'users/')
  const dbUserQuery = query(dbRef)
  const snapshot = await get(dbUserQuery)
  if (snapshot.exists()) {
    console.log(snapshot.val())
  }
  return null
}
export const getUserByUsername = async (username: string) => {
  const dbRef = ref(db, 'users/')
  const dbUserQuery = query(dbRef, orderByChild('name'), equalTo(username))
  const snapshot = await get(dbUserQuery)
  if (snapshot.exists()) {
    return snapshot.val()
  }
  return null
}

export const setUser = async (username: string, image: string) => {
  const dbRef = ref(db, 'users/')
  const newUserValue: UserInformation = {
    id: v4(),
    name: username,
    joined: [],
    image: image,
  }
  const snapshot = await push(dbRef, newUserValue)
  return snapshot
}
