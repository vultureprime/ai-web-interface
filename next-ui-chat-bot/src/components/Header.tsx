import React from 'react'

interface HeaderProps {
  apiKey?: string
  isEdit: boolean
  onChangeInput: (value: string) => void
  onEditToggle: () => void
  errorAPIKey?: string
}

const Header: React.FC<HeaderProps> = ({
  apiKey,
  isEdit,
  onChangeInput,
  onEditToggle,
  errorAPIKey,
}) => {
  return (
    <div className='w-full flex flex-col bg-white py-8 gap-5 px-5'>
      <div className='flex items-start justify-end gap-x-2 max-w-screen-md w-full mx-auto'>
        {(isEdit || !apiKey) && (
          <div>
            <input
              type='text'
              value={apiKey}
              disabled={!isEdit && !!apiKey}
              onChange={(e) => onChangeInput(e.target.value)}
              placeholder='Please Enter your apiKey'
              className='outline-none w-[280px] border border-gray-200 rounded-full px-2 py-1'
            />
            {!!errorAPIKey && (
              <p className='text-sm text-rose-500'>{errorAPIKey}</p>
            )}
          </div>
        )}

        <button
          onClick={onEditToggle}
          className='bg-blue-600 text-white rounded-lg px-4 py-1'
        >
          {isEdit || !apiKey ? 'Save' : 'Add API Key'}
        </button>
      </div>
      <h1 className='text-center text-3xl md:text-5xl'>AI Chatbot</h1>
    </div>
  )
}

export default Header
