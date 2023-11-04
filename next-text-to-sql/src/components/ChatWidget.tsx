import { useEffect, useRef } from 'react'
import { ChatWindow } from '@/components/ChatWindow'
import Header from '@/components/Header'
import ChatInput from '@/components/ChatInput'
import { useFormContext } from 'react-hook-form'

export type Role = 'user' | 'ai'
export interface ChatProps {
  role: Role
  message: string
  id: string
}

export default function ChatWidget({ answer }: { answer: ChatProps[] }) {
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
        isLoading={isLoading}
        error={errors?.bot?.message as string}
        chatWindowRef={chatWindowRef}
      />
      <ChatInput isLoading={isLoading} />
    </div>
  )
}
