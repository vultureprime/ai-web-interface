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

export const ruleScheme = z.object({
  rule: z.string().trim().min(1, { message: 'Please enter your message' }),
})

export const endpointScheme = z.object({
  endpoint: z.string().url().optional(),
})

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API
const API_URL = process.env.NEXT_PUBLIC_API

export interface IOpenAIForm extends z.infer<typeof askScheme> {}
export interface IRuleForm extends z.infer<typeof ruleScheme> {}
export interface IEndPointForm extends z.infer<typeof endpointScheme> {}

export default function ChatBotDemo() {
  const [isEdit, setIsEdit] = useState(false)
  const [streamText, setStreamText] = useState('')
  const [isEditAPIUrl, setEditAPIUrl] = useState(false)

  const [answer, setAnswer] = useState<ChatProps[]>([])

  const methodRule = useForm<IRuleForm>({
    resolver: zodResolver(ruleScheme),
    mode: 'onChange',
    shouldFocusError: true,
  })

  const methodsEndpoint = useForm<IEndPointForm>({
    resolver: zodResolver(endpointScheme),
    mode: 'onChange',
    shouldFocusError: true,
  })

  const methods = useForm<IOpenAIForm>({
    resolver: zodResolver(askScheme),
    mode: 'onChange',
    shouldFocusError: true,
    defaultValues: {
      apiKey: '',
      query: '',
    },
  })

  const { handleSubmit: handleSubmitEndpoint, control: controlEndpoint } =
    methodsEndpoint
  const { handleSubmit: handleSubmitRule, setValue: setValueRule } = methodRule
  const {
    handleSubmit,
    setError,
    setValue,
    control,
    watch,
    formState: { errors, isSubmitSuccessful, submitCount },
  } = methods

  const endPoint = useWatch({ name: 'endpoint', control: controlEndpoint })
  const apiKey = useWatch({ name: 'apiKey', control })

  const [
    { data: session, refetch: refreshSession },
    { data: rule, refetch: refetchRule },
  ] = useQueries({
    queries: [
      {
        queryKey: ['session', endPoint],
        queryFn: async () => {
          const { data } = await axios.get(`/session`)
          return data
        },
        enabled: typeof window !== 'undefined' && !localStorage?.session,
      },
      {
        queryKey: ['rule', endPoint],
        queryFn: async () => {
          const { data } = await axios.get(`/rule`)
          return data
        },
      },
    ],
  })

  const { mutateAsync: createRule } = useMutation({
    mutationFn: (rule: string) => {
      return axios.post('/create_rule', { rule })
    },
    onSuccess: () => {
      refetchRule()
    },
  })

  const { mutateAsync: clearRule } = useMutation({
    mutationFn: () => {
      return axios.get('/clear_collection')
    },
    onSuccess: () => {
      refetchRule()
    },
  })

  const onEditAPIUrl = () => {
    setEditAPIUrl(true)
  }

  const onSaveAPIUrl = (data: IEndPointForm) => {
    if (!!data.endpoint) {
      axios.defaults.baseURL = data.endpoint
    }

    setEditAPIUrl(false)
  }

  const onEditapiKey = () => {
    setIsEdit(true)
  }

  const onSaveapiKey = () => {
    if (!!errors.apiKey?.message) {
      return
    }
    if (apiKey?.length === 0) {
      setIsEdit(false)
      return
    }
    if (apiKey?.length !== 40) {
      setError('apiKey', {
        message: 'There was an error fetching the response.',
      })
    }
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
    } catch (error) {
      console.error(error)
    }
  }

  const onSubmitRule = async (data: IRuleForm) => {
    await createRule(data.rule)
    setValueRule('rule', '')
  }

  useEffect(() => {
    if (typeof session?.uuid === 'string') {
      localStorage.session = session.uuid
    }
  }, [session])

  useEffect(() => {
    const message = { query: watch('query') }
    const getData = async () => {
      try {
        setValue('query', '')
        const response = await fetch(
          `${endPoint ?? API_URL}/query?uuid=${localStorage?.session}&message=${
            message.query
          }`,
          {
            method: 'GET',
            headers: {
              Accept: 'text/event-stream',
              'x-api-key': localStorage?.apiKey,
            },
          }
        )
        const reader = response.body!.getReader()
        if (response.status === 200) {
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
            setStreamText(
              (prevData) => prevData + new TextDecoder().decode(value)
            )
          }
        } else {
          if (response.status === 404) {
            localStorage.removeItem('session')
            refreshSession()
            setError('bot', {
              message: 'Something went wrong, please try again',
            })
            return
          }

          setError('bot', {
            message: 'Something went wrong',
          })
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
  }, [submitCount, isSubmitSuccessful, setValue, watch, setError, endPoint])

  useEffect(() => {
    if (window && localStorage?.apiKey) {
      setValue('apiKey', localStorage.apiKey)
    }
  }, [setValue])

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
          <FormProvider
            methods={methodsEndpoint}
            onSubmit={handleSubmitEndpoint(onSaveAPIUrl)}
          >
            {isEditAPIUrl ? (
              <div className='flex justify-between items-center w-full gap-x-8  my-8'>
                <RHFTextField
                  name='endpoint'
                  placeholder='Please Enter your API Url'
                  className='outline-none w-full border border-gray-200 rounded-lg px-2 py-1'
                />

                <button
                  type='submit'
                  className='text-blue-600 font-semibold text-sm whitespace-nowrap place-self-center'
                >
                  Set API
                </button>
              </div>
            ) : (
              <button
                type='button'
                className='text-blue-600 font-semibold text-sm whitespace-nowrap place-self-center'
                onClick={onEditAPIUrl}
              >
                Already have own API URL
              </button>
            )}
          </FormProvider>
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-2'>
          <div className='flex flex-col gap-y-2 p-5 border border-blue-500 rounded-xl mt-10'>
            <div className='flex items-center justify-between'>
              <h2 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl '>
                Rule
              </h2>
              <button
                className='bg-blue-600 text-white rounded-lg px-6 py-2 text-sm h-fit whitespace-nowrap'
                onClick={() => clearRule()}
              >
                Clear All
              </button>
            </div>
            <p className='mt-2 text-lg leading-8 text-gray-600 mb-5'>
              Let&apos;s make the rule
            </p>
            <ol className='list-decimal ml-5 flex flex-col gap-y-2 mb-5'>
              {rule?.result?.map((x: string, index: number) => (
                <li key={index} className='text-start ml-5'>
                  {x}
                </li>
              ))}
            </ol>
            <FormProvider
              methods={methodRule}
              onSubmit={handleSubmitRule(onSubmitRule)}
            >
              <div className='flex gap-x-5'>
                <RHFTextField
                  name='rule'
                  placeholder='Add the Rule'
                  className='w-full'
                />
                <button
                  type='submit'
                  className='bg-blue-600 text-white rounded-lg px-6 py-2 text-sm h-fit whitespace-nowrap'
                >
                  Add Rule
                </button>
              </div>
            </FormProvider>
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
    </div>
  )
}
