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
} from '@chakra-ui/react'
import { FiHome } from 'react-icons/fi'

const MOCK_USER = {
  name: 'John Doe',
  image: '/assets/userassets/icon001.jpg',
}

export const UserProfileIcon = () => {
  const handleLogout = () => {
    console.log('logout')
  }
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
          <Text fontSize={'sm'}>ログアウト</Text>
        </MenuItem>
      </MenuList>
    </Menu>
  )
}
