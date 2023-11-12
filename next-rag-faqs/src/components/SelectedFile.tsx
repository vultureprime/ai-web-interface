import { Icon } from '@iconify/react/dist/iconify.js'
import React, { ChangeEvent, useEffect, useRef } from 'react'

interface SelectedFileProps {
  selectedFile: File | null
  handleFileChange: (file: File | null) => void
  isLoading?: boolean
}

const SelectedFile: React.FC<SelectedFileProps> = ({
  selectedFile,
  handleFileChange,
  isLoading,
}) => {
  const uploadEL = useRef<any>(null)
  const attemptPlay = () => {
    uploadEL &&
      uploadEL.current &&
      uploadEL.current.play().catch((error: any) => {
        console.error('Error attempting to play', error)
      })
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    handleFileChange(file)
  }

  useEffect(() => {
    attemptPlay()
  }, [isLoading])

  return (
    <div className='relative text-center'>
      <label
        htmlFor='fileInput'
        className={isLoading ? 'cursor-none' : 'cursor-pointer'}
      >
        <div className='bg-white border px-12  border-blue-300 rounded-xl p-4 shadow-md'>
          {!isLoading ? (
            <Icon
              icon='ep:upload-filled'
              className='text-blue-500 mx-auto'
              width={200}
            />
          ) : (
            <video
              className='w-[200px] h-[200px] mx-auto'
              playsInline
              loop
              muted
              src='/animation/upload.mp4'
              ref={uploadEL}
            />
          )}
          <p className='text-lg font-semibold text-blue-500'>Select PDF File</p>
        </div>
      </label>
      <input
        id='fileInput'
        type='file'
        accept='.pdf'
        className='hidden'
        disabled={isLoading}
        onChange={handleInputChange}
      />
      {selectedFile && (
        <p className='mt-2 text-gray-600 max-w-[200px] truncate'>
          Selected file: {selectedFile.name}
        </p>
      )}
    </div>
  )
}

export default SelectedFile
