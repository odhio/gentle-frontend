'use server'
import { Box, Flex, Button, Link, Stack, Image } from '@chakra-ui/react'
import { FiHome } from 'react-icons/fi'
import { FaRegBell } from 'react-icons/fa'
import { UserProfileIcon } from '@/features/users/routes/user-profile-icon'
import { auth } from '@/auth'

export const Header = async () => {
  const session = await auth()
  const user = session?.user ?? null

  return (
    <Box bg={'gray.100'} px={4} h={'70px'}>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <Box>
          <Link href="/">
            <Image w={180} src="/asset/logo_transparent.png" alt="" />
          </Link>
        </Box>
        <Flex alignItems={'center'}>
          <Stack direction={'row'} spacing={3}>
            <Button>{<FaRegBell />}</Button>
            {user !== null ? (
              <>
                <UserProfileIcon user={user} />
              </>
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
