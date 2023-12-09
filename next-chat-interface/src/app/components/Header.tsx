import { Icon } from '@iconify/react/dist/iconify.js'
import axios from 'axios'
import React, { useState } from 'react'
import { twMerge } from 'tailwind-merge'

export interface OptionChatProps {
  hasRag: boolean
  handleChangeRag: () => void
}

const Header: React.FC<OptionChatProps> = ({ hasRag, handleChangeRag }) => {
  const [isShow, setIsShow] = useState(false)
  const [isError, setIsError] = useState(false)
  const onAlert = () => {
    setIsShow(true)
    setTimeout(() => {
      setIsShow(false)
    }, 500)
  }
  const handleReset = async () => {
    try {
      await axios.post('/resetChat', undefined)
      setIsError(false)
      onAlert()
      setTimeout(() => {
        window.location.reload()
      }, 500)
    } catch (error) {
      setIsError(true)
      onAlert()
    }
  }
  return (
    <>
      {isShow && (
        <div
          className={twMerge(
            'fixed top-20 right-8 p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50',
            isError && 'bg-red-50 text-rose-800'
          )}
          role='alert'
        >
          <span className='font-medium'>
            {isError ? 'Failed !' : 'Success!'}
          </span>{' '}
          Reset Chat
        </div>
      )}

      <div className='w-full flex flex-col bg-white py-2 gap-5 px-5 border-b  border-b-slate-200'>
        <div className='flex items-center justify-between'>
          <h1 className='text-center text-xl flex items-center gap-2'>
            <Icon icon='mingcute:chat-1-fill' width={48} color='#8E8FFA' />
            Chat
          </h1>
          <button
            onClick={handleReset}
            type='button'
            className='text-white bg-rose-700 hover:bg-rose-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2'
          >
            Reset
          </button>
        </div>
        <label className='relative inline-flex items-center cursor-pointer'>
          <input
            type='checkbox'
            checked={hasRag}
            onChange={handleChangeRag}
            className='sr-only peer'
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span className='ms-3 text-sm font-medium text-gray-900 dark:text-gray-300'>
            {`Chat ${hasRag ? 'with' : 'without'} Rag`}
          </span>
        </label>
      </div>
    </>
  )
}

export default Header
