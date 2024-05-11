import { Box, Flex, Button, Link, Stack, Image, Text } from '@chakra-ui/react'
import { FiHome } from 'react-icons/fi'
import { FaRegBell } from 'react-icons/fa'
import { UserProfileIcon } from '@/features/users/routes/user-profile-icon'

const isLoggedIn = false

export const Header = () => {
  return (
    <Box bg={'gray.100'} px={4}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <Box>
          <Link href="/">
            <Image w={180} src="/asset/logo_transparent.png" alt="" />
          </Link>
        </Box>
        <Text fontSize={'medium'} fontWeight={'bold'}>
          参加を待っています
        </Text>
        <Flex alignItems={'center'}>
          <Stack direction={'row'} spacing={3}>
            <Button>{<FaRegBell />}</Button>
            {isLoggedIn ? (
              <UserProfileIcon />
            ) : (
              <Button
                colorScheme="teal"
                variant="solid"
                display={'inline-flex'}
                gap={2}
              >
                <FiHome />
                <Link href="/login">Login</Link>
              </Button>
            )}
          </Stack>
        </Flex>
      </Flex>
    </Box>
  )
}
