import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useDisclosure,
} from '@chakra-ui/react'
import React, { useEffect } from 'react'

type Texts = {
  alertTexts: {
    header: string
    body: string
    footer?: string
  }
  buttonTexts: {
    cancel: string
    yes: string
  }
}
type Props = {
  alertTexts: Texts
  handler: {
    onYes: () => void
    onCancel: () => void
  }
}
export const TransitionDialog = (props: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef()

  useEffect(() => {
    onOpen()
  }, [])

  const texts = props.alertTexts

  const onYes = () => {
    props.handler.onYes()
    onClose()
  }
  const onCancel = () => {
    props.handler.onCancel()
    onClose()
  }

  return (
    <>
      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent py={6} px={3}>
          <AlertDialogHeader>{texts.alertTexts.header}</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>{texts.alertTexts.body}</AlertDialogBody>
          <AlertDialogFooter>
            {texts.alertTexts.footer ? texts.alertTexts.footer : null}
            <Button ref={cancelRef} onClick={onCancel}>
              {texts.buttonTexts.cancel}
            </Button>
            <Button colorScheme="red" ml={3} onClick={onYes}>
              {texts.buttonTexts.yes}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
