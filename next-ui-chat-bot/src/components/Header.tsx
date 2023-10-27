import React from 'react'

interface HeaderProps {
  endpoint?: string
  isEdit: boolean
  onEndpointChange: (value: string) => void
  onEditToggle: () => void
}

const Header: React.FC<HeaderProps> = ({
  endpoint,
  isEdit,
  onEndpointChange,
  onEditToggle,
}) => {
  return (
    <div className='w-full flex flex-col bg-white py-8 gap-5 px-5'>
      <div className='flex items-center justify-end gap-x-2 max-w-screen-md w-full mx-auto'>
        <input
          type='text'
          value={endpoint}
          disabled={!isEdit && !!endpoint}
          onChange={(e) => onEndpointChange(e.target.value)}
          placeholder='Please Enter your endpoint'
          className='outline-none w-[280px] border border-gray-200 rounded-full px-2 py-1'
        />

        <button
          onClick={onEditToggle}
          className='bg-blue-600 text-white rounded-lg px-4 py-1'
        >
          {isEdit || !endpoint ? 'Save' : 'Edit'}
        </button>
      </div>
      <h1 className='text-center text-3xl md:text-5xl'>AI Chatbot</h1>
    </div>
  )
}

export default Header
