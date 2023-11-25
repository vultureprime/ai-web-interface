import ChatWidget, { ChatProps } from '@@/app/components/ChatWidget'
import FormProvider from '@@/app/components/hook-form/FormProvider'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const askScheme = z.object({
  query: z.string().trim().min(1, { message: 'Please enter your message' }),
  bot: z.string({}).optional(),
})

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API

export interface IOpenAIForm extends z.infer<typeof askScheme> {}

export default function ChatBotDemo() {
  const [answer, setAnswer] = useState<ChatProps[]>([])

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
        `/query?question=${data.query}`,
        undefined,
        {
          headers: {
            Accept: 'text/event-stream',
          },
        }
      )
      setAnswer((prevState) => [
        ...prevState,
        {
          id: (prevState.length + 1).toString(),
          role: 'ai',
          message: result.raw,
          raw: result.json.customer_need,
        },
      ])
    } catch (error: any) {
      setError('bot', {
        message: error?.response?.data?.message ?? 'Something went wrong',
      })
    }
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <div className='flex justify-center flex-col items-center bg-white mx-auto max-w-7xl h-screen '>
        <ChatWidget answer={answer} />
      </div>
    </FormProvider>
  )
}
