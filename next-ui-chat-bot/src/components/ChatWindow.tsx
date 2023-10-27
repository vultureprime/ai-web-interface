import { LegacyRef } from 'react'
import Image from 'next/image'
import { CopyClipboard } from '@/components/CopyClipboard'
import StreamingText from './StreamingText'

interface Message {
  role: 'user' | 'ai'
  message: string
  id: string
}

interface ChatWindowProps {
  messages: Message[]
  isLoading?: boolean
  error?: string
  chatWindowRef: LegacyRef<HTMLDivElement> | null
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  isLoading,
  error,
  chatWindowRef,
}) => {
  return (
    <div
      ref={chatWindowRef}
      className='flex-1 overflow-y-auto p-4 space-y-8'
      id='chatWindow'
    >
      {messages.map((item, index) => (
        <div key={item.id} className='max-w-screen-md mx-auto w-full'>
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
                <div className='flex justify-between mb-4 w-full'>
                  <p className='font-bold'>Ai</p>
                  <CopyClipboard content={item.message} />
                </div>
                <p>
                  <StreamingText
                    chatWindowRef={chatWindowRef}
                    text={item.message}
                    isTextStream={index === messages.length - 1}
                  />
                </p>
              </div>
            </div>
          )}
        </div>
      ))}
      {isLoading && (
        <div className='flex gap-x-8 max-w-screen-md mx-auto'>
          <div className='min-w-[48px] min-h-[48px]'>
            <Image src='/img/robot.png' width={48} height={48} alt='robot' />
          </div>
          <div>
            <p className='font-bold'>Ai</p>
            <p>Hang on a second ...</p>
          </div>
        </div>
      )}
      {error && (
        <div className='flex gap-x-8 max-w-screen-md mx-auto'>
          <div className='min-w-[48px] min-h-[48px]'>
            <Image src='/img/error.png' width={48} height={48} alt='error' />
          </div>
          <div>
            <p className='font-bold'>Ai</p>
            <p>Something went wrong</p>
          </div>
        </div>
      )}
    </div>
  )
}
