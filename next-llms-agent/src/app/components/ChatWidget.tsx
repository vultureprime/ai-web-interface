import { useRef } from 'react'
import { ChatWindow } from './ChatWindow'
import Header from './Header'
import ChatInput from './ChatInput'
import { useFormContext } from 'react-hook-form'

export type Role = 'user' | 'ai'
export interface ChatProps {
  role: Role
  message: string
  id: string
  raw: string
}

export default function ChatWidget({
  answer,
  streamText,
}: {
  answer: ChatProps[]
  streamText?: string
}) {
  const chatWindowRef = useRef<HTMLDivElement>(null)
  const {
    formState: { isSubmitting, errors },
  } = useFormContext()

  return (
    <div className='h-full  flex flex-col w-full'>
      <Header />
      <ChatWindow
        messages={answer}
        streamText={streamText}
        isLoading={isSubmitting}
        error={errors?.bot?.message as string}
        chatWindowRef={chatWindowRef}
      />
      <ChatInput isLoading={isSubmitting} />
    </div>
  )
}
