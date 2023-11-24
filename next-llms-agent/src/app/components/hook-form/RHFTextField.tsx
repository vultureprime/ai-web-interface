// form
import { InputHTMLAttributes } from 'react'
import { useFormContext, Controller } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'

// ----------------------------------------------------------------------

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  helperText?: string
  label?: string
}

const RHFTextField = ({
  name,
  helperText,
  label,
  className,
  ...other
}: IProps) => {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div className='w-full flex flex-col gap-y-2 '>
          {label && <label className='text-sm font-semibold'>{label}</label>}
          <input
            {...field}
            {...other}
            className={twMerge(
              'outline-none w-full  border border-gray-200 rounded-lg px-2 py-1',
              className
            )}
          />
          {(!!error || helperText) && (
            <div className={twMerge(error?.message && 'text-rose-500 text-sm')}>
              {error?.message || helperText}
            </div>
          )}
        </div>
      )}
    />
  )
}
export default RHFTextField
