import { useEffect, useRef } from 'react'
import { ChatWindow } from './ChatWindow'
import Header from './Header'
import ChatInput from './ChatInput'
import { useFormContext } from 'react-hook-form'

export type Role = 'user' | 'ai'
export interface ChatProps {
  role: Role
  message: string
  id: string
}

export default function ChatWidget({
  answer,
  streamText,
}: {
  answer: ChatProps[]
  streamText: string
}) {
  const chatWindowRef = useRef<HTMLDivElement>(null)
  const {
    formState: { isLoading, errors },
  } = useFormContext()
  useEffect(() => {
    document.querySelector('input')?.focus()
  }, [])

  return (
    <div className='h-[700px] flex flex-col w-full'>
      <Header />
      <ChatWindow
        messages={answer}
        streamText={streamText}
        isLoading={isLoading}
        error={errors?.bot?.message as string}
        chatWindowRef={chatWindowRef}
      />
      <ChatInput isLoading={isLoading} />
    </div>
  )
}
