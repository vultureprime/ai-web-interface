import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'

const Header: React.FC = () => {
  return (
    <div className='w-full flex flex-col bg-white py-8 gap-5 px-5 border-b  border-b-slate-200'>
      <h1 className='text-center text-xl flex items-center gap-2'>
        <Icon icon='mingcute:chat-1-fill' width={48} color='#8E8FFA' />
        LLMs Agent
      </h1>
    </div>
  )
}

export default Header
