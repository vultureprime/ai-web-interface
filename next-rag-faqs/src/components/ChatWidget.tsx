import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { ChatWindow } from '@/components/ChatWindow'
import Header from '@/components/Header'
import ChatInput from '@/components/ChatInput'
import { PATH_QUESTION } from '@/config'

type Role = 'user' | 'ai'

interface ChatProps {
  role: Role
  message: string
  id: string
}

export default function ChatWidget({ session }: { session: string }) {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState<ChatProps[]>([])
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState<string>()

  const chatWindowRef = useRef<HTMLDivElement>(null)

  const handleAsk = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setError(undefined)
    addToAnswers('user', question)
    setQuestion('')
    //Edit here for ask with RAG API
    try {
      const { data } = await axios.post(PATH_QUESTION, {
        message: question,
        uuid: session,
      })
      addToAnswers('ai', data.answer)
    } catch (error: any) {
      setError(error?.response?.data?.message ?? 'Something went wrong')
      console.error('Error fetching from API:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToAnswers = (role: Role, message: string) => {
    setAnswer((prevState) => [
      ...prevState,
      { role, message, id: prevState.length.toString() },
    ])
  }

  useEffect(() => {
    document.querySelector('input')?.focus()
  }, [])

  return (
    <div className='h-[700px] flex flex-col w-full'>
      <Header />
      <ChatWindow
        messages={answer}
        isLoading={isLoading}
        error={error}
        chatWindowRef={chatWindowRef}
      />
      <ChatInput
        question={question}
        isLoading={isLoading}
        onInputChange={(e) => setQuestion(e.target.value)}
        onSubmit={handleAsk}
      />
    </div>
  )
}
