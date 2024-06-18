'use client'
import {
  audioTrackState,
  mikeEnabledState,
  videoEnabledState,
  videoTrackState,
} from '@/recoil/atoms/media-atom'
import {
  Box,
  Button,
  Container,
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
} from '@chakra-ui/react'
import { useCallback, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

export const MediaController = ({ gainNode }: { gainNode: GainNode }) => {
  const [volume, setVolume] = useState(1.0)
  const [muted, setMuted] = useState(false)
  const [mikeMute, setMikeMuted] = useRecoilState(mikeEnabledState)
  const [videoEnabled, setVideoEnabled] = useRecoilState(videoEnabledState)
  const audioTrack = useRecoilValue(audioTrackState)
  const videoTrack = useRecoilValue(videoTrackState)

  const handleSpeakerVolume = (volume: number) => {
    setVolume(volume)
    if (gainNode) {
      gainNode.gain.value = volume
    }
    if (volume === 0) {
      setMuted(true)
    } else if (muted) {
      setMuted(false)
    }
  }

  const handleSpeakerMute = () => {
    if (muted) {
      setVolume(1)
      gainNode.gain.value = volume
    } else {
      setVolume(0)
      gainNode.gain.value = 0
    }
    setMuted(!muted)
  }

  const handleMikeMute = () => {
    setMikeMuted(!mikeMute)
    if (audioTrack) {
      audioTrack.enabled = !mikeMute
    }
  }

  const handleVideoEnabled = useCallback(() => {
    if (videoTrack) {
      videoTrack.enabled = !videoEnabled
      setVideoEnabled(!videoEnabled)
    }
    console.log('videoEnabled', videoEnabled)
  }, [videoEnabled, videoTrack, setVideoEnabled])

  return (
    <Container
      position={'fixed'}
      bottom={5}
      left={'50%'}
      transform={'translateX(-50%)'}
      zIndex={10}
    >
      <HStack bg={'gray.400'} w={'fit-content'} px={10} py={3} rounded={5}>
        <HStack>
          <Box>
            <Popover placement="top">
              <PopoverTrigger>
                <Button bg={'gray.800'} color={'white'}>
                  音量
                  <Image
                    src="/assets/speaker-on.png"
                    alt="volume"
                    ml={2}
                    w={5}
                    h={5}
                  />
                </Button>
              </PopoverTrigger>
              <Portal>
                <PopoverContent
                  bg={'gray.800'}
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
                      <SliderTrack bg="green.100">
                        <SliderFilledTrack bg="green.500" />
                      </SliderTrack>
                      <SliderThumb />
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
            <Button bg={'gray.800'} color={'white'} onClick={handleSpeakerMute}>
              {muted ? (
                <>
                  ミュート解除
                  <Image
                    src="/assets/speaker-on.png"
                    alt="ミュート解除"
                    ml={2}
                    w={5}
                    h={5}
                  />
                </>
              ) : (
                <>
                  ミュート
                  <Image
                    src="/assets/speaker-off.png"
                    alt="ミュート"
                    ml={2}
                    w={5}
                    h={5}
                  />
                </>
              )}
            </Button>
          </Box>
        </HStack>
        <HStack>
          <Button bg={'gray.800'} color={'white'} onClick={handleMikeMute}>
            {mikeMute ? (
              <>
                マイクオン{' '}
                <Image
                  src="/assets/mike-on.png"
                  alt="マイクオン"
                  ml={2}
                  w={5}
                  h={5}
                />
              </>
            ) : (
              <>
                マイクオフ{' '}
                <Image
                  src="/assets/mike-off.png"
                  alt="マイクオフ"
                  ml={2}
                  w={5}
                  h={5}
                />
              </>
            )}
          </Button>
          <Button bg={'gray.800'} color={'white'} onClick={handleVideoEnabled}>
            {videoEnabled ? (
              <>
                カメラオフ
                <Image
                  src="/assets/camera-off.png"
                  alt="カメラオフ"
                  ml={2}
                  w={5}
                  h={'5'}
                />
              </>
            ) : (
              <>
                カメラオン
                <Image
                  src="/assests/camera-on.png"
                  alt="カメラオン"
                  ml={2}
                  w={5}
                  h={'5'}
                />
              </>
            )}
          </Button>
        </HStack>
      </HStack>
    </Container>
  )
}
