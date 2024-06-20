'use client'
import { Wrap, WrapItem } from '@chakra-ui/react'
import { MediaController } from './media-controller'
import { ComunicateController } from './comunicate-controller'

export const ControlBar = () => {
  return (
    <Wrap w={'100%'} h={'80px'} bg={'gray.800'} justify={'center'}>
      <WrapItem alignItems={'baseline'} w={'40%'}>
        <MediaController />
      </WrapItem>
      <WrapItem alignItems={'center'} w={'40%'} justifyContent={'center'}>
        <ComunicateController />
      </WrapItem>
    </Wrap>
  )
}
