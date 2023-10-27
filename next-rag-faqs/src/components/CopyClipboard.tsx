import { useState } from 'react'

export const CopyClipboard = ({ content }: { content: string }) => {
  const [isCopyClipboard, setCopyClipboard] = useState(false)
  return (
    <div className='group relative'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        className='cursor-pointer'
        onClick={() => {
          navigator.clipboard.writeText(content)
          setCopyClipboard(true)
          setTimeout(() => {
            setCopyClipboard(false)
          }, 1000)
        }}
      >
        <g fill='rgba(34, 34, 34, 0.13333333333333333)'>
          <path d='M6.6 11.397c0-2.726 0-4.089.843-4.936c.844-.847 2.201-.847 4.917-.847h2.88c2.715 0 4.072 0 4.916.847c.844.847.844 2.21.844 4.936v4.82c0 2.726 0 4.089-.844 4.936c-.843.847-2.201.847-4.916.847h-2.88c-2.716 0-4.073 0-4.917-.847c-.843-.847-.843-2.21-.843-4.936v-4.82Z' />
          <path
            d='M4.172 3.172C3 4.343 3 6.229 3 10v2c0 3.771 0 5.657 1.172 6.828c.617.618 1.433.91 2.62 1.048c-.192-.84-.192-1.996-.192-3.66v-4.819c0-2.726 0-4.089.843-4.936c.844-.847 2.201-.847 4.917-.847h2.88c1.652 0 2.8 0 3.638.19c-.138-1.193-.43-2.012-1.05-2.632C16.657 2 14.771 2 11 2C7.229 2 5.343 2 4.172 3.172Z'
            opacity='.5'
          />
        </g>
      </svg>
      <div className='hidden group-hover:block absolute z-10 bottom-0 translate-y-full right-0 bg-[#2f2f2f] text-white rounded px-2 py-1 text-sm whitespace-nowrap'>
        {isCopyClipboard ? 'Copied' : 'Copy'}
      </div>
    </div>
  )
}
