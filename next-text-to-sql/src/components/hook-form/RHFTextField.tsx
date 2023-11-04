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
        <div className='w-full flex flex-col gap-y-2 max-w-[380px]'>
          {label && <label className='text-sm font-semibold'>{label}</label>}
          <input
            {...field}
            {...other}
            className={twMerge(
              'outline-none w-full max-w-[320px] lg:w-[320px] border border-gray-200 rounded-lg px-2 py-1',
              className
            )}
          />
          {(!!error || helperText) && <div>{error?.message || helperText}</div>}
        </div>
      )}
    />
  )
}
export default RHFTextField
