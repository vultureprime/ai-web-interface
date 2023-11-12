import React, { FC } from 'react'

interface ChatInputProps {
  question: string
  isLoading: boolean
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

const ChatInput: FC<ChatInputProps> = ({
  question,
  isLoading,
  onInputChange,
  onSubmit,
}) => {
  return (
    <div className='border-t border-gray-300  p-4 flex items-center justify-center bg-white py-8'>
      <form
        onSubmit={onSubmit}
        className='flex items-center w-full justify-center bg-white max-w-screen-md w-[calc(100%-64px)] px-8 py-4 rounded-full shadow-md'
      >
        <input
          type='text'
          value={question}
          onChange={onInputChange}
          placeholder='Ask a question...'
          className='outline-none w-full'
        />
        <button
          type='submit'
          disabled={isLoading}
          className='text-gray-400 disabled:text-gray-200'
        >
          {isLoading ? (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
            >
              <circle cx='4' cy='12' r='3' fill='currentColor'>
                <animate
                  id='svgSpinners3DotsFade0'
                  fill='freeze'
                  attributeName='opacity'
                  begin='0;svgSpinners3DotsFade1.end-0.25s'
                  dur='0.75s'
                  values='1;.2'
                />
              </circle>
              <circle cx='12' cy='12' r='3' fill='currentColor' opacity='.4'>
                <animate
                  fill='freeze'
                  attributeName='opacity'
                  begin='svgSpinners3DotsFade0.begin+0.15s'
                  dur='0.75s'
                  values='1;.2'
                />
              </circle>
              <circle cx='20' cy='12' r='3' fill='currentColor' opacity='.3'>
                <animate
                  id='svgSpinners3DotsFade1'
                  fill='freeze'
                  attributeName='opacity'
                  begin='svgSpinners3DotsFade0.begin+0.3s'
                  dur='0.75s'
                  values='1;.2'
                />
              </circle>
            </svg>
          ) : (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
            >
              <path
                fill='none'
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='m5 12l-.604-5.437C4.223 5.007 5.825 3.864 7.24 4.535l11.944 5.658c1.525.722 1.525 2.892 0 3.614L7.24 19.465c-1.415.67-3.017-.472-2.844-2.028L5 12Zm0 0h7'
              />
            </svg>
          )}
        </button>
      </form>
    </div>
  )
}

export default ChatInput
