import ChatWidget, { ChatProps, Role } from '@@/app/components/ChatWidget'
import FormProvider from '@@/app/components/hook-form/FormProvider'
import RHFTextField from '@@/app/components/hook-form/RHFTextField'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'

export const askScheme = z.object({
  apiKey: z.string().optional(),
  query: z.string(),
  bot: z.string({}).optional(),
})

const API_BOT = 'http://13.229.123.142:8005'
export interface IOpenAIForm extends z.infer<typeof askScheme> {}

export default function ChatBotDemo() {
  const [isEdit, setIsEdit] = useState(false)
  const [streamText, setStreamText] = useState('')

  useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_BOT}/session`)
      return data
    },
    enabled: !localStorage?.session,
    select({ data }) {
      localStorage.session = data.uuid
    },
  })

  const { mutateAsync: queryPromt } = useMutation({
    mutationFn: ({ query_str }: { query_str: string }) => {
      return axios.post(`${API_BOT}/query`, {
        message: query_str,
        uuid: localStorage.session,
      })
    },
    onError: (error: any) => {
      console.log(error)
      setError('bot', {
        message: error?.response?.data?.message ?? 'Something went wrong',
      })
    },
  })

  const [answer, setAnswer] = useState<ChatProps[]>([])

  const methods = useForm<IOpenAIForm>({
    resolver: zodResolver(askScheme),
    mode: 'onChange',
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
    control,
    formState: { errors },
  } = methods

  const apiKey = useWatch({ name: 'apiKey', control })

  const onEditapiKey = () => {
    setIsEdit(true)
  }

  const onSaveapiKey = () => {
    if (!!errors.apiKey?.message) {
      return
    }
    if (apiKey?.length !== 40) {
      setError('apiKey', {
        message: 'There was an error fetching the response.',
      })
    }
    axios.defaults.headers.common['x-api-key'] = apiKey
    localStorage.apiKey = apiKey
    setIsEdit(false)
  }

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
      const response = await queryPromt({ query_str: data.query })
      console.log(response)
      if (response) {
        setValue('query', '')
        const streamReader = response.data.getReader()
        let result = ''
        while (true) {
          const { done, value } = await streamReader.read()
          if (done) {
            setAnswer((prevState) => [
              ...prevState,
              {
                id: (id + 1).toString(),
                role: 'ai',
                message: result,
              },
            ])
            setStreamText('')
          }
          result += value
          setStreamText(result)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (window && localStorage?.apiKey) {
      setValue('apiKey', localStorage.apiKey)
      axios.defaults.headers.common['x-api-key'] = localStorage.apiKey
    }
  }, [])

  return (
    <div id='demo' className='bg-white py-24 sm:py-32'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        <div className='mx-auto max-w-2xl text-center'>
          <h2 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
            Demo
          </h2>
          <p className='mt-2 text-lg leading-8 text-gray-600'>
            Join us to explore and experience its versatile features. Let&apos;s
            make learning enjoyable together!
          </p>
        </div>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <div className='mt-10 mx-auto flex justify-center flex-col items-center bg-white  w-full xl:w-[540px] p-8 rounded-3xl border border-blue-500'>
            <div className='flex justify-between items-end w-full gap-x-8 mb-5'>
              {isEdit && (
                <RHFTextField
                  label='API key'
                  name='apiKey'
                  placeholder='Please Enter your API Key'
                  className='outline-none w-full border border-gray-200 rounded-lg px-2 py-1'
                />
              )}
              <div className='flex-1' />
              <button
                type='button'
                className='bg-blue-600 text-white rounded-lg px-6 py-2 text-sm h-fit whitespace-nowrap'
                onClick={isEdit ? onSaveapiKey : onEditapiKey}
              >
                {isEdit ? 'Save' : 'Add API key'}
              </button>
            </div>
            <div className='flex gap-x-2 w-full'>
              <ChatWidget answer={answer} streamText={streamText} />
            </div>
          </div>
        </FormProvider>
      </div>
    </div>
  )
}
