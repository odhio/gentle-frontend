"use client"

import React, { useState, useEffect } from 'react'

type Props = {
  emotion: string
  pressure: string
}
export const EmotionLabel = (props: Props) => {
  const [emoji, setEmoji] = useState('')

  const updateEmoji = (emotion) => {
    let emoji
    switch (props.emotion) {
      case 'happy':
        if (props.pressure === 'low') {
          emoji = '😊'
        } else if (props.pressure === 'medium') {
          emoji = '😄'
        } else {
          emoji = '😁'
        }
        break
      case 'sad':
        if (props.pressure === 'low') {
          emoji = '😐'
        } else if (props.pressure === 'medium') {
          emoji = '😢'
        } else {
          emoji = '😭'
        }
        break
      case 'anger':
        if (props.pressure === 'low') {
          emoji = '😠'
        } else if (props.pressure === 'medium') {
          emoji = '😤'
        } else {
          emoji = '😡'
        }
        break
      case 'disgust':
        if (props.pressure === 'low') {
          emoji = '😒'
        } else if (props.pressure === 'medium') {
          emoji = '😖'
        } else {
          emoji = '🤢'
        }
        break
      case 'fear':
        if (props.pressure === 'low') {
          emoji = '😨'
        } else if (props.pressure === 'medium') {
          emoji = '😰'
        } else {
          emoji = '😱'
        }
        break
      default:
        emoji = '😐' // デフォルトの絵文字
    }
    setEmoji(emoji)
  }

  useEffect(() => {
    updateEmoji(props)
  }, [props])

  return <>{emoji}</>
}
