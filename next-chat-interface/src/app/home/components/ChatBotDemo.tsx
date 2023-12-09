import ChatWidget, { ChatProps } from '@@/app/components/ChatWidget'
import FormProvider from '@@/app/components/hook-form/FormProvider'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const askScheme = z.object({
  query: z.string().trim().min(1, { message: 'Please enter your message' }),
  bot: z.string({}).optional(),
})

export enum ChatType {
  Basic,
  WithoutRag,
}

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API

export interface IOpenAIForm extends z.infer<typeof askScheme> {}

export default function ChatBotDemo() {
  const [answer, setAnswer] = useState<ChatProps[]>([])
  const [hasRag, setHasRag] = useState(true)

  const methods = useForm<IOpenAIForm>({
    resolver: zodResolver(askScheme),
    shouldFocusError: true,
    defaultValues: {
      query: '',
    },
  })

  const { handleSubmit, setError, setValue } = methods

  const onSubmit = async (data: IOpenAIForm) => {
    try {
      const id = answer.length
      setAnswer((prevState) => [
        ...prevState,
        {
          id: id.toString(),
          role: 'user',
          message: data.query,
          raw: '',
        },
      ])
      setValue('query', '')
      const { data: result } = await axios.post(
        `${hasRag ? '/chat' : '/chatWithoutRAG'}`,
        {
          query: data.query,
        }
      )
      setAnswer((prevState) => [
        ...prevState,
        {
          id: (prevState.length + 1).toString(),
          role: 'ai',
          message: result.answer,
          raw: result.answer,
        },
      ])
    } catch (error) {
      const err = error as AxiosError<{ detail: string }>
      setError('bot', {
        message: err?.response?.data?.detail ?? 'Something went wrong',
      })
    }
  }
  const handleChangeRag = () => {
    setHasRag(!hasRag)
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <div className='flex justify-center flex-col items-center bg-white mx-auto max-w-7xl h-screen '>
        <ChatWidget answer={answer} option={{ hasRag, handleChangeRag }} />
      </div>
    </FormProvider>
  )
}
