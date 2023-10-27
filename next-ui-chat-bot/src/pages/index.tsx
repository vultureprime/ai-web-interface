import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { ChatWindow } from '@/components/ChatWindow'
import Header from '@/components/Header'
import ChatInput from '@/components/ChatInput'

type Role = 'user' | 'ai'
interface ChatProps {
  role: Role
  message: string
  id: string
}

export default function Chat() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState<ChatProps[]>([])
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [endpoint, setEndpoint] = useState<string>()
  const [isEdit, setEdit] = useState(true)
  const chatWindowRef = useRef<HTMLDivElement>(null)

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setError(undefined)
    addToAnswers('user', question)
    setQuestion('')

    try {
      const { data } = await axios.post('/api/chatbot', { question, endpoint })
      addToAnswers('ai', data)
    } catch (error) {
      setError('There was an error fetching the response.')
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
  const onEditToggle = () => setEdit(!isEdit)
  const onEndpointChange = (value: string) => {
    setEndpoint(value)
  }

  useEffect(() => {
    document.querySelector('input')?.focus()
  }, [])

  return (
    <div className='h-screen flex flex-col  mx-auto pt-[40px]'>
      <Header
        endpoint={endpoint}
        isEdit={isEdit}
        onEndpointChange={onEndpointChange}
        onEditToggle={onEditToggle}
      />
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
        onSubmit={handleSubmit}
      />
    </div>
  )
}
