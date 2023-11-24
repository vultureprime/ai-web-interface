import ChatWidget, { ChatProps } from '@@/app/components/ChatWidget'
import FormProvider from '@@/app/components/hook-form/FormProvider'
import RHFTextField from '@@/app/components/hook-form/RHFTextField'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueries } from '@tanstack/react-query'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'

export const askScheme = z.object({
  apiKey: z.string().optional(),
  query: z.string().trim().min(1, { message: 'Please enter your message' }),
  bot: z.string({}).optional(),
})

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API
const API_URL = process.env.NEXT_PUBLIC_API

export interface IOpenAIForm extends z.infer<typeof askScheme> {}

export default function ChatBotDemo() {
  const [streamText, setStreamText] = useState('')

  const [answer, setAnswer] = useState<ChatProps[]>([])

  const methods = useForm<IOpenAIForm>({
    resolver: zodResolver(askScheme),

    shouldFocusError: true,
    defaultValues: {
      apiKey: '',
      query: '',
    },
  })

  const {
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { isSubmitSuccessful, submitCount },
  } = methods

  const onSubmit = async (data: IOpenAIForm) => {
    try {
      const id = answer.length
      setAnswer((prevState) => [
        ...prevState,
        {
          id: id.toString(),
          role: 'user',
          message: data.query,
        },
      ])
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    const message = { query: watch('query') }
    const getData = async () => {
      try {
        setValue('query', '')
        const { body } = await fetch(
          `/query?uuid=${localStorage?.session}&message=${message.query}`,
          {
            method: 'GET',
            headers: {
              Accept: 'text/event-stream',
            },
          }
        )

        const reader = body!.getReader()
        let result = ''
        while (true) {
          const { done, value } = await reader?.read()
          if (done) {
            setStreamText('')
            setAnswer((prevState) => [
              ...prevState,
              {
                id: (prevState.length + 1).toString(),
                role: 'ai',
                message: result,
              },
            ])
            break
          }
          result += new TextDecoder().decode(value)
          setStreamText(result)
        }
      } catch (error: any) {
        console.error(error)
        setError('bot', {
          message: error?.response?.data?.message ?? 'Something went wrong',
        })
      }
    }
    if (isSubmitSuccessful && localStorage) {
      getData()
    }
  }, [submitCount, isSubmitSuccessful])

  return (
    <div id='demo' className='bg-white py-24 sm:py-32'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        <div className='mx-auto max-w-2xl text-center'>
          <h2 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
            Chatbot with Guardrail
          </h2>
          <p className='mt-2 text-lg leading-8 text-gray-600'>
            Let&apos;s make learning enjoyable together!
          </p>
        </div>
        \
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <div className='mt-10 mx-auto flex justify-center flex-col items-center bg-white  w-full xl:w-[540px] p-8 rounded-3xl border border-blue-500'>
            <div className='flex gap-x-2 w-full'>
              <ChatWidget answer={answer} streamText={streamText} />
            </div>
          </div>
        </FormProvider>
      </div>
    </div>
  )
}
