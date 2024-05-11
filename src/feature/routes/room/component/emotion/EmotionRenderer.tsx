// components/EmotionRenderer.js
import { useState, useEffect } from 'react'
import { Box, VStack, Text, Button } from '@chakra-ui/react'
import { EmotionLabel } from './EmotionLabel'
import { PopoverEmotions } from '../../MeetingRoom'

type Props = {
  emotion: string
  pressure: string
}

export const EmotionRenderer = (props: Props) => {
  return (
    <VStack bg={'transparent'} marginTop={0} spacing={4} align="center" mt={10}>
      {props && (
        <Box
          p={4}
          bg="teal.500"
          color="white"
          borderRadius="md"
          boxShadow="md"
          transition="opacity 0.5s ease"
        >
          <Text>
            <EmotionLabel
              emotion={{ emotion: props.emotion, pressure: props.pressure }}
            />
          </Text>
        </Box>
      )}
    </VStack>
  )
}
