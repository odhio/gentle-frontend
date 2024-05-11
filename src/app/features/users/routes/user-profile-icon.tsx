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
} from '@chakra-ui/react'
import { useCallback, useState } from 'react'
import { FiHome } from 'react-icons/fi'
import { logout } from '../../auth/api/logout'
import { useRouter } from 'next/navigation'

const MOCK_USER = {
  name: 'John Doe',
  image: '/assets/userassets/icon001.jpg',
}

export const UserProfileIcon = () => {
  const router = useRouter()
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await logout()
      if (response.success) {
        toast({
          description: 'ログインしました',
          status: 'success',
        })
        router.push('/')
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
  return (
    <Menu>
      <MenuButton
        as={Button}
        rounded={'full'}
        variant={'link'}
        cursor={'pointer'}
        minW={0}
      >
        <Avatar as={'span'} size={'sm'} src={MOCK_USER.image} />
      </MenuButton>
      <MenuList alignItems={'center'} p={4} gap={4}>
        <Center gap={2} flexDirection={'column'}>
          <Avatar size={'md'} src={MOCK_USER.image} />
          <Text>{MOCK_USER.name}</Text>
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
