import React, { useState, useEffect } from 'react'
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Box,
} from '@chakra-ui/react'
import { EmotionLabel } from './EmotionLabel'

type Props = {
  emotion: string
  pressure: string
}

export const PopoverComponent = (props: Props) => {
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (props) {
      setActive(true)

      const timer = setTimeout(() => {
        setActive(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [props])

  return (
    <Box>
      <Popover isOpen={active}>
        <PopoverTrigger>
          <Button></Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverBody>
            <EmotionLabel emotion={props.pressure} pressure={props.pressure} />
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  )
}
