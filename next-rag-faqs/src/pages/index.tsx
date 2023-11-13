import APIInput from '@/components/APIInput'
import ChatWidget from '@/components/ChatWidget'
import SelectedFile from '@/components/SelectedFile'
import { PATH_SESSION, PATH_UPLOAD, stepInfo } from '@/config'
import { Icon } from '@iconify/react'
import axios from 'axios'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

const inter = Inter({ subsets: ['latin'] })
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API

export default function Home() {
  const [step, setStep] = useState<number>(0)
  const [endpoint, setEndpoint] = useState<string>()
  const [error, setError] = useState<string>()
  const [session, setSession] = useState<string>('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const videoEl = useRef<any>(null)

  const onReload = () => {
    return window.location.reload()
  }

  const onEndpointChange = (value: string) => {
    setEndpoint(value)
  }

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file)
  }

  //set upload file and call api
  const handleUpload = async (e: any) => {
    e.preventDefault()
    if (!selectedFile) {
      alert('Please select a file')
      return
    }
    setIsUploading(true)
    //Edit here for upload file
    const formData = new FormData()
    formData.append('file', selectedFile)
    formData.append('uuid', session)

    try {
      await axios.post(PATH_UPLOAD, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      handleNext()
    } catch (error) {
      alert('Error uploading file')
    } finally {
      setIsUploading(false)
    }
  }

  const handleNext = async () => {
    return setStep(step + 1)
  }

  const handleSession = async () => {
    //set your base endpoint api  and get session for using request upload and ask
    if (step === 0 && typeof endpoint !== 'undefined' && endpoint !== '') {
      try {
        const validateEndpoint = new URL(endpoint)
        console.log(validateEndpoint)
        axios.defaults.baseURL = validateEndpoint.href
        const { data } = await axios.get(PATH_SESSION)
        setSession(data.uuid)
        handleNext()
      } catch (error) {
        if (endpoint.length !== 40) {
          return setError('invalid Endpoint or API Key ')
        }
        localStorage.apiKey = endpoint
        axios.defaults.headers.common['x-api-key'] = endpoint
        const { data } = await axios.get(PATH_SESSION)
        setSession(data.uuid)
        handleNext()
      }
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
      case 0:
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
            <div>
              <APIInput
                endpoint={endpoint}
                onEndpointChange={onEndpointChange}
              />
              {!!error && <p className='text-sm text-rose-500 mt-2'>{error}</p>}
            </div>
            <div className='flex justify-center flex-col items-end mt-6 w-full'>
              <button
                className='bg-blue-600 text-white rounded-lg px-6 py-1 text-xl'
                onClick={handleSession}
              >
                Next
              </button>
            </div>
          </div>
        )
      case 1:
        return (
          <div className='flex justify-center flex-col items-center'>
            <SelectedFile
              selectedFile={selectedFile}
              handleFileChange={handleFileChange}
              isLoading={isUploading}
            />
            {!isUploading && (
              <button
                className='bg-blue-600 text-white rounded-lg px-6 py-1 text-xl mt-6'
                onClick={handleUpload}
              >
                Upload file
              </button>
            )}
          </div>
        )
      case 2:
        return (
          <div className='flex justify-center flex-col items-center'>
            <div className='flex justify-center flex-col items-end w-full'>
              <button
                className='bg-blue-600 text-white rounded-lg px-6 py-1 text-xl'
                onClick={onReload}
              >
                End Chat
              </button>
            </div>
            <ChatWidget session={session} />
          </div>
        )

      default:
        break
    }
  }

  useEffect(() => {
    attemptPlay()
  }, [])

  useEffect(() => {
    if (window && localStorage.apiKey) setEndpoint(localStorage.apiKey)
  }, [])

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between  p-5 md:p-10 lg:p-24 bg-slate-50 ${inter.className}`}
    >
      <div className='border border-slate-200 bg-slate-100 rounded-xl p-6 w-full'>
        <div className='z-10  w-full items-start justify-between text-sm flex'>
          <div>
            <p className='text-xl font-semibold '>RAG Q&A Document</p>
            <p className='text-sm max-w-xl mt-2'>
              RAG (Retrieval Augmented Generation) is an intelligent system that
              provides instant, accurate answers to common questions. It
              understands natural language and offers personalized guidance,
              making it a versatile tool for improving user experiences across
              various platforms
            </p>
            <a
              className='font-medium underline text-blue-700'
              href='https://www.vultureprime.com/blogs/rag-internal-knowledge'
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
              How to use RAG Q&A Document
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
          <div>
            <p className='text-xl font-semibold'>Step {step + 1}</p>
            <p className='text-sm mt-2 mb-12 text-gray-600'>
              {stepInfo[step].desc}
            </p>
          </div>
          {state()}
        </div>
      </div>
    </main>
  )
}
