'use client'

import {
  Avatar,
  Button,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Center,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { FiHome } from 'react-icons/fi';
import { logout } from '@/features/auth/api/logout';
import { signOut } from 'next-auth/react';

export const UserProfileIcon = ({user}: {user: any}) => {
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await logout()
      if (response.success) {
        toast({
          description: 'ログアウトしました',
          status: 'success',
        })
        signOut({callbackUrl: '/login'})
      } else {
        throw new Error('Logout failed')
      }
    } catch (error) {
      toast({
        description: 'ログアウトに失敗しました',
        status: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }, [])

  if (!user) return null

  return (
    <Menu>
      <MenuButton
        as={Button}
        rounded={'full'}
        variant={'link'}
        cursor={'pointer'}
        minW={0}
      >
        <Avatar as={'span'} size={'sm'} src={user.image} />
      </MenuButton>
      <MenuList alignItems={'center'} p={4} gap={4}>
        <Center gap={2} flexDirection={'column'}>
          <Avatar size={'md'} src={user.image} />
          <Text>{user.name}</Text>
        </Center>
        <MenuDivider />
        <MenuItem gap={2} rounded={'md'}>
          <FiHome />
          <Text fontSize={'sm'}>HOME</Text>
        </MenuItem>
        <MenuItem onClick={handleLogout} rounded={'md'}>
          <Text fontSize={'sm'}>
            {isLoading ? <Spinner /> : ''}
            ログアウト
          </Text>
        </MenuItem>
      </MenuList>
    </Menu>
  )
}
