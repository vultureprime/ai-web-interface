import React from 'react'

interface APIInputProps {
  endpoint?: string
  onEndpointChange: (value: string) => void
}

const APIInput: React.FC<APIInputProps> = ({ endpoint, onEndpointChange }) => {
  return (
    <div className='flex items-center  gap-x-2'>
      <input
        type='text'
        value={endpoint}
        onChange={(e) => onEndpointChange(e.target.value)}
        placeholder='Please Enter your endpoint'
        className='outline-none w-full max-w-[320px] lg:w-[320px] border border-gray-200 rounded-lg px-2 py-1'
      />
    </div>
  )
}

export default APIInput
