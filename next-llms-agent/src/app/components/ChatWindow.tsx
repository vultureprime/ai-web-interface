import { useEffect } from 'react'
import Image from 'next/image'
import { CopyClipboard } from './CopyClipboard'

interface Message {
  role: 'user' | 'ai'
  message: string
  id: string
  raw: string
}

interface ChatWindowProps {
  messages: Message[]
  isLoading?: boolean
  error?: string
  chatWindowRef: any | null
  streamText?: string
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  isLoading,
  error,
  chatWindowRef,
  streamText = '',
}) => {
  useEffect(() => {
    if (
      chatWindowRef !== null &&
      chatWindowRef?.current &&
      messages.length > 0
    ) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight
    }
  }, [streamText, messages.length, chatWindowRef])

  return (
    <div
      ref={chatWindowRef}
      className='flex-1 overflow-y-auto p-4 space-y-8'
      id='chatWindow'
    >
      {messages.map((item, index) => (
        <div key={item.id} className='w-full'>
          {item.role === 'user' ? (
            <div className='flex gap-x-8 '>
              <div className='min-w-[48px] min-h-[48px]'>
                <Image
                  src='/img/chicken.png'
                  width={48}
                  height={48}
                  alt='user'
                />
              </div>
              <div>
                <p className='font-bold'>User</p>
                <p>{item.message}</p>
              </div>
            </div>
          ) : (
            <div className='flex gap-x-8 w-full'>
              <div className='min-w-[48px] min-h-[48px]'>
                <Image
                  src='/img/robot.png'
                  width={48}
                  height={48}
                  alt='robot'
                />
              </div>
              <div className='w-full'>
                <div className='flex justify-between mb-1 w-full '>
                  <p className='font-bold'>Ai</p>
                  <div />
                  <CopyClipboard content={item.raw} />
                </div>

                <div
                  className='prose whitespace-pre-line'
                  dangerouslySetInnerHTML={{ __html: item.message }}
                />
              </div>
            </div>
          )}
        </div>
      ))}
      {!!streamText && (
        <div className='flex gap-x-8 w-full mx-auto'>
          <div className='min-w-[48px] min-h-[48px]'>
            <Image src='/img/robot.png' width={48} height={48} alt='robot' />
          </div>
          <div>
            <p className='font-bold'>Ai</p>
            <p>{streamText}</p>
          </div>
        </div>
      )}
      {isLoading && (
        <div className='flex gap-x-8 w-full mx-auto'>
          <div className='min-w-[48px] min-h-[48px]'>
            <Image src='/img/robot.png' width={48} height={48} alt='robot' />
          </div>
          <div>
            <p className='font-bold'>Ai</p>

            <div className='mt-4 flex space-x-2 items-center '>
              <p>Hang on a second </p>
              <span className='sr-only'>Loading...</span>
              <div className='h-2 w-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]'></div>
              <div className='h-2 w-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]'></div>
              <div className='h-2 w-2 bg-blue-600 rounded-full animate-bounce'></div>
            </div>
          </div>
        </div>
      )}
      {error && (
        <div className='flex gap-x-8 w-full mx-auto'>
          <div className='min-w-[48px] min-h-[48px]'>
            <Image src='/img/error.png' width={48} height={48} alt='error' />
          </div>
          <div>
            <p className='font-bold'>Ai</p>
            <p className='text-rose-500'>{error}</p>
          </div>
        </div>
      )}
    </div>
  )
}
