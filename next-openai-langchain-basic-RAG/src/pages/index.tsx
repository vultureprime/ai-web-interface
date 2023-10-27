import ChatWidget, { ChatProps, Role } from '@/components/ChatWidget'
import FormProvider from '@/components/hook-form/FormProvider'
import RHFTextField from '@/components/hook-form/RHFTextField'
import {
  PATH_QUERY_WITHOUT_RETRIEVAL,
  PATH_QUERY_WITH_RETRIEVAL,
  PATH_UPLOAD,
  defaultValues,
  stepInfo,
} from '@/config'
import { zodResolver } from '@hookform/resolvers/zod'
import { Icon } from '@iconify/react'
import axios from 'axios'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod'

const inter = Inter({ subsets: ['latin'] })

export const endpointScheme = z.object({
  endpoint: z.string({
    required_error: 'Invalid endpoint',
    invalid_type_error: 'Invalid endpoint',
  }),
})

export const collectionScheme = z.object({
  url: z.string({
    required_error: 'Invalid url',
    invalid_type_error: 'Invalid url',
  }),
  chunk_size: z.number({
    required_error: 'Invalid Chunk Size',
    invalid_type_error: 'Invalid Chunk Size',
  }),
  chunk_overlap: z.number({
    required_error: 'Invalid Chunk Overlap',
    invalid_type_error: 'Invalid Chunk Overlap',
  }),
  collection_name: z.string({
    required_error: 'Invalid Collection Name',
    invalid_type_error: 'Invalid Collection Name',
  }),
})
export const askScheme = z.object({
  query: z.string({
    required_error: '',
    invalid_type_error: '',
  }),
  bot: z.string({}).optional(),
})
enum State {
  endpointState,
  loadStoreState,
  chatState,
}
export interface IOpenAIForm
  extends z.infer<typeof endpointScheme>,
    z.infer<typeof collectionScheme>,
    z.infer<typeof askScheme> {}

export default function Home() {
  const [step, setStep] = useState<State>(State.endpointState)
  const [answer, setAnswer] = useState<ChatProps[]>([])
  const [isRetrieval, setIsRetrieval] = useState(true)
  const videoEl = useRef<any>(null)
  const validate = [endpointScheme, collectionScheme, askScheme]

  const methods = useForm<IOpenAIForm>({
    resolver: zodResolver(validate[step]),
    defaultValues: defaultValues,
    shouldFocusError: true,
  })

  const {
    handleSubmit,
    setError,
    setValue,
    formState: { isSubmitting },
  } = methods

  const handleCheckboxChange = () => {
    setIsRetrieval(!isRetrieval)
  }

  const addToAnswers = (role: Role, message: string) => {
    setAnswer((prevState) => [
      ...prevState,
      { role, message, id: prevState.length.toString() },
    ])
  }

  const onReload = () => {
    return window.location.reload()
  }

  const handleNext = async () => {
    return setStep(step + 1)
  }

  const onSubmit = async (data: IOpenAIForm) => {
    switch (step) {
      case State.endpointState:
        //set collection and endpoint
        //TODO Edit anything here
        axios.defaults.baseURL = data.endpoint
        return handleNext()
      case State.loadStoreState:
        //set load and store
        //TODO Edit anything here
        await axios.post(PATH_UPLOAD, {
          chuck_size: data.chunk_size,
          chunk_overlap: data.chunk_overlap,
          url: data.url,
          collection_name: data.collection_name,
        })

        return handleNext()
      case State.chatState:
        addToAnswers('user', data.query)
        //set up search query
        try {
          //TODO Edit anything here
          const response = await axios.post(
            isRetrieval
              ? PATH_QUERY_WITH_RETRIEVAL
              : PATH_QUERY_WITHOUT_RETRIEVAL,
            {
              query: data.query,
              collection_name: data.collection_name,
            }
          )
          setValue('query', '')
          return addToAnswers(
            'ai',
            isRetrieval
              ? response.data.result?.answer
              : response.data.result ?? ''
          )
        } catch (error) {
          setError('bot', {
            message: 'There was an error fetching the response.',
          })
          console.error('Error fetching from API:', error)
        }
        return
      default:
        break
    }
  }

  const attemptPlay = () => {
    videoEl &&
      videoEl.current &&
      videoEl.current.play().catch((error: any) => {
        console.error('Error attempting to play', error)
      })
  }

  const state = () => {
    switch (step) {
      case State.endpointState:
        return (
          <div className='flex justify-center flex-col items-center'>
            <video
              className='w-[240px] h-[240px]'
              playsInline
              loop
              muted
              src='/animation/connect.mp4'
              ref={videoEl}
            />
            <RHFTextField
              label='Endpoint'
              name='endpoint'
              placeholder='Please Enter your endpoint'
              className='outline-none w-full max-w-[320px] lg:w-[320px] border border-gray-200 rounded-lg px-2 py-1'
            />
            <div className='flex justify-center flex-col items-end mt-6 w-full'>
              <button
                className='bg-blue-600 text-white rounded-lg px-6 py-1 text-xl'
                type='submit'
              >
                Next
              </button>
            </div>
          </div>
        )
      case State.loadStoreState:
        return (
          <div
            className={twMerge(
              'relative flex justify-center flex-col items-center gap-y-4',
              isSubmitting && 'opacity-50'
            )}
          >
            {isSubmitting && (
              <div
                role='status'
                className='absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2'
              >
                <svg
                  aria-hidden='true'
                  className='w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600'
                  viewBox='0 0 100 101'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                    fill='currentColor'
                  />
                  <path
                    d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                    fill='currentFill'
                  />
                </svg>
                <span className='sr-only'>Loading...</span>
              </div>
            )}
            <RHFTextField
              label='URL'
              name='url'
              placeholder='Please Enter your url document'
              className='outline-none w-full max-w-[320px] lg:w-[320px] border border-gray-200 rounded-lg px-2 py-1'
            />
            <RHFTextField
              label='Chunk Size'
              name='chunk_size'
              placeholder='Please Enter your Chunk Size'
              className='outline-none w-full max-w-[320px] lg:w-[320px] border border-gray-200 rounded-lg px-2 py-1'
            />
            <RHFTextField
              label='Chunk Overlap'
              name='chunk_overlap'
              placeholder='Please Enter your Chunk Overlap'
              className='outline-none w-full max-w-[320px] lg:w-[320px] border border-gray-200 rounded-lg px-2 py-1'
            />
            <RHFTextField
              label='Collection Name'
              name='collection_name'
              placeholder='Please Enter your Collection Name'
              className='outline-none w-full max-w-[320px] lg:w-[320px] border border-gray-200 rounded-lg px-2 py-1'
            />
            <div className='flex justify-center flex-col items-end mt-6 w-full'>
              <button
                disabled={isSubmitting}
                className='bg-blue-600 text-white rounded-lg px-6 py-1 text-xl'
                type='submit'
              >
                Next
              </button>
            </div>
          </div>
        )
      case State.chatState:
        return (
          <div className='flex justify-center flex-col items-center'>
            <div className='flex justify-center flex-col items-end w-full'>
              <button
                type='button'
                className='bg-blue-600 text-white rounded-lg px-6 py-1 text-xl'
                onClick={onReload}
              >
                End Chat
              </button>
            </div>
            <div className='flex gap-x-2'>
              <ChatWidget answer={answer} />
              <div>
                <label className='mt-10 relative inline-flex cursor-pointer select-none items-center'>
                  <input
                    type='checkbox'
                    name='autoSaver'
                    className='sr-only'
                    checked={isRetrieval}
                    onChange={handleCheckboxChange}
                  />
                  <span
                    className={`slider mr-3 flex h-[26px] w-[50px] items-center rounded-full p-1 duration-200 ${
                      isRetrieval ? 'bg-blue-50' : 'bg-[#CCCCCE]'
                    }`}
                  >
                    <span
                      className={`dot h-[18px] w-[18px] rounded-full bg-blue-600 duration-200 ${
                        isRetrieval ? 'translate-x-4' : 'bg-gray-600'
                      }`}
                    ></span>
                  </span>
                  <span className='label flex items-center text-sm font-medium text-black'>
                    {isRetrieval ? 'On retrieval' : 'Off retrieval'}
                  </span>
                </label>
              </div>
            </div>
          </div>
        )

      default:
        break
    }
  }

  useEffect(() => {
    attemptPlay()
  }, [])

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between  p-5 md:p-10 lg:p-24 bg-slate-50 ${inter.className}`}
    >
      <div className='border border-slate-200 bg-slate-100 rounded-xl p-6 w-full'>
        <div className='z-10  w-full items-start justify-between text-sm flex'>
          <div>
            <p className='text-xl font-semibold '>Openai Langchain Basic RAG</p>
            <p className='text-sm max-w-xl mt-2'>
              RAG (Retrieval Augmented Generation) is an intelligent system that
              provides instant, accurate answers to common questions. It
              understands natural language and offers personalized guidance,
              making it a versatile tool for improving user experiences across
              various platforms
            </p>
            <a
              className='font-medium underline text-blue-700'
              href='https://github.com/vultureprime/deploy-ai-model/tree/main/paperspace-example/openai-langchain-basic-RAG'
              target='_blank'
              rel='noopener noreferrer'
            >
              Read more
            </a>
          </div>
          <div className='hidden lg:block h-auto w-auto bg-none'>
            <a
              className='inline-flex gap-x-2 pointer-events-auto p-0'
              href='https://www.vultureprime.com/'
              target='_blank'
              rel='noopener noreferrer'
            >
              By{' '}
              <Image
                src='/vulture.svg'
                alt='Vercel Logo'
                className='dark:invert'
                width={100}
                height={24}
                priority
              />
            </a>
          </div>
        </div>
        <div className='flex justify-between'>
          <div>
            <p className='text-xl font-semibold mt-12 mb-8 '>
              How to use Openai Langchain Basic RAG
            </p>
            <div className='gap-12 grid  max-w-3xl w-full mb-0 grid-cols-1 lg:grid-cols-3 text-left'>
              {stepInfo.map((item, index) => (
                <div key={index} className='flex flex-col gap-y-1'>
                  <Icon icon={item.icon} width={24} />
                  <p className=' text-sm font-semibold  rounded-full w-fit text-blue-900 mt-2'>
                    Step {index + 1}
                  </p>
                  <p className='text-lg font-semibold  mt-2 text-blue-700'>
                    {item.title}
                  </p>
                  <p className='text-sm text-gray-700'>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className='flex  flex-col gap-y-6 my-32 bg-white border border-gray-50 p-4 rounded-lg'>
          <p className='text-xl font-semibold'>Step {step + 1}</p>
          <p className='text-sm mt-2 mb-12 text-gray-600'>
            {stepInfo[step].desc}
          </p>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            {state()}
          </FormProvider>
        </div>
      </div>
    </main>
  )
}
