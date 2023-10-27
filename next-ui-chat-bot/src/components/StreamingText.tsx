import React, { useState, useEffect } from 'react'

interface Props {
  text: string
  interval?: number
  isTextStream?: boolean
  chatWindowRef: any
}

const StreamingText: React.FC<Props> = ({
  text,
  interval = 5,
  isTextStream = false,
  chatWindowRef,
}) => {
  const [displayedText, setDisplayedText] = useState('')
  useEffect(() => {
    if (chatWindowRef.current && isTextStream) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight
    }
  }, [displayedText])

  useEffect(() => {
    if (isTextStream && text.length < 120) {
      let i = 0

      const timer = setInterval(() => {
        if (i < text.length - 1) {
          setDisplayedText((prevText) => prevText + text[i])
          i++
        } else {
          clearInterval(timer)
        }
      }, interval)

      return () => clearInterval(timer)
    } else {
      setDisplayedText(text)
    }
  }, [text, interval])

  return <>{displayedText}</>
}

export default StreamingText
