'use client'
import {
  audioEnabledState,
  videoEnabledState,
  volumeState,
} from '@/recoil/atoms/media-atom'
import {
  Box,
  Button,
  HStack,
  Image,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
} from '@chakra-ui/react'
import React, { useCallback, useState } from 'react'
import { useRecoilState } from 'recoil'

export const MediaController = () => {
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useRecoilState(volumeState)
  const [mikeEnable, setMikeEnable] = useRecoilState(audioEnabledState)
  const [videoEnabled, setVideoEnabled] = useRecoilState(videoEnabledState)
  console.log('')

  const handleSpeakerVolume = (volume: number) => {
    setVolume(volume)
    if (volume === 0) {
      setMuted(true)
    } else if (muted) {
      setMuted(false)
    }
  }

  const handleSpeakerMute = () => {
    if (muted) {
      setVolume(1)
    } else {
      setVolume(0)
    }
    setMuted(!muted)
  }

  const handleMikeMute = useCallback(() => {
    setMikeEnable(!mikeEnable)
  }, [mikeEnable, setMikeEnable])

  const handleVideoEnabled = useCallback(() => {
    setVideoEnabled(!videoEnabled)
  }, [setVideoEnabled, videoEnabled])

  return (
    <>
      <HStack w={'fit-content'} rounded={5}>
        <HStack>
          <Box mr={'10px'}>
            <Popover placement="top">
              <PopoverTrigger>
                <Button
                  w={'60px'}
                  h={'60px'}
                  bg={'gray.700'}
                  _hover={{ bg: 'gray.500' }}
                  color={'white'}
                  display={'flex'}
                  flexDirection={'column'}
                >
                  <Image src="/assets/speaker-on.png" alt="volume" w={'40px'} />
                  <Text fontSize={'8px'}>音量</Text>
                </Button>
              </PopoverTrigger>
              <Portal>
                <PopoverContent
                  bg={'gray.700'}
                  w={'fit-content'}
                  minH={'150px'}
                  px={2}
                  position="relative"
                  zIndex={100}
                >
                  <PopoverBody h={'100%'}>
                    <Image
                      src="/assets/speaker-on.png"
                      alt="volume"
                      ml={2}
                      w={5}
                      h={5}
                    />
                    <Slider
                      aria-label="slider-ex-4"
                      min={0}
                      max={2}
                      defaultValue={1.0}
                      orientation="vertical"
                      value={volume}
                      step={0.1}
                      onChange={handleSpeakerVolume}
                      position="absolute"
                      bottom="0"
                      left="50%"
                      transform="translateX(-50%)"
                      h="150px"
                    >
                      <SliderTrack bg="green.100" w={'10px'}>
                        <SliderFilledTrack bg="green.500" />
                      </SliderTrack>
                      <SliderThumb w={'18px'} />
                    </Slider>
                    <Image
                      src="/assets/speaker-off.png"
                      alt="volume"
                      ml={2}
                      w={5}
                      h={5}
                    />
                  </PopoverBody>
                  <PopoverArrow bg={'gray.800'} />
                </PopoverContent>
              </Portal>
            </Popover>
          </Box>
          <Box>
            <Button
              w={'60px'}
              h={'60px'}
              bg={'gray.700'}
              _hover={{ bg: 'gray.500' }}
              color={'white'}
              display={'flex'}
              flexDirection={'column'}
              onClick={handleSpeakerMute}
            >
              {muted ? (
                <>
                  <Image
                    src="/assets/speaker-on.png"
                    alt="ミュート解除"
                    w={'40px'}
                  />
                  <Text fontSize={'8px'}>ミュート解除</Text>
                </>
              ) : (
                <>
                  <Image
                    src="/assets/speaker-off.png"
                    alt="ミュート"
                    w={'40px'}
                  />
                  <Text fontSize={'8px'}>ミュート</Text>
                </>
              )}
            </Button>
          </Box>
        </HStack>
        <Box mr={'10px'}>
          <HStack w={'fit-content'} px={10} py={3} rounded={5} gap={'20px'}>
            <Button
              w={'60px'}
              h={'60px'}
              bg={'gray.700'}
              _hover={{ bg: 'gray.500' }}
              color={'white'}
              display={'flex'}
              flexDirection={'column'}
              gap={1}
              onClick={handleMikeMute}
            >
              {mikeEnable ? (
                <>
                  <Image
                    src="/assets/mike-off.png"
                    alt="マイクオフ"
                    w={'40px'}
                  />
                  <Text fontSize={'8px'}>マイクオフ</Text>
                </>
              ) : (
                <>
                  <Image
                    src="/assets/mike-on.png"
                    alt="マイクオン"
                    w={'40px'}
                  />
                  <Text fontSize={'8px'}>マイクオン</Text>
                </>
              )}
            </Button>
            <Button
              w={'60px'}
              h={'60px'}
              p={'3px'}
              bg={'gray.700'}
              _hover={{ bg: 'gray.500' }}
              color={'white'}
              display={'flex'}
              flexDirection={'column'}
              gap={2}
              onClick={handleVideoEnabled}
            >
              {videoEnabled ? (
                <>
                  <Image
                    src="/assets/camera-off.png"
                    alt="カメラオフ"
                    w={'35px'}
                  />
                  <Text fontSize={'8px'}>カメラオフ</Text>
                </>
              ) : (
                <>
                  <Image
                    src="/assets/camera-on.png"
                    alt="カメラオン"
                    ml={2}
                    w={5}
                    h={'5'}
                  />
                  <Text fontSize={'8px'}>カメラオン</Text>
                </>
              )}
            </Button>
          </HStack>
        </Box>
      </HStack>
    </>
  )
}
