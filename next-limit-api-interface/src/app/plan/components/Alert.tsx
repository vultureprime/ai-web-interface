import { Fragment, useEffect, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/outline'
import { useMutation } from '@tanstack/react-query'
import { CopyClipboard } from '../../copy/components/CopyClipboard'
import { SubmitHandler, useForm } from 'react-hook-form'
import axios from 'axios'

type Inputs = {
  email: string
}

export default function Alert({
  open,
  setOpen,
  selectedTier,
}: {
  open: boolean
  setOpen: any
  selectedTier: string
}) {
  const cancelButtonRef = useRef(null)
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm<Inputs>({})
  const [APIkey, setAPIkey] = useState<string>()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const result = await mutateAsync({
        plan_name: selectedTier,
        user: data.email,
      })
      setAPIkey(result?.data.value)
    } catch (error: any) {
      console.error(error)
      if (error?.response.data.detail) {
        return setError('email', { message: error?.response.data.detail })
      }
    }
  }

  const { mutateAsync } = useMutation({
    mutationFn: (plan: { plan_name: string; user: string }) => {
      return axios.post('/create_key', {
        plan_name: plan.plan_name,
        user: plan.user,
      })
    },
  })

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-10'
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
          <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6'>
                <div>
                  {isSubmitSuccessful && (
                    <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100'>
                      <CheckIcon
                        className='h-6 w-6 text-green-600'
                        aria-hidden='true'
                      />
                    </div>
                  )}
                  <div className='mt-3 text-center sm:mt-5'>
                    <Dialog.Title
                      as='h3'
                      className='text-base font-semibold leading-6 text-gray-900'
                    >
                      {selectedTier}
                    </Dialog.Title>
                    <div className='mt-2'>
                      {!isSubmitSuccessful ? (
                        <form
                          onSubmit={handleSubmit(onSubmit)}
                          className='flex flex-col items-start w-full my-8'
                        >
                          <input
                            type='email'
                            className='border border-gray-200 rounded-lg px-4 py-2 w-full'
                            placeholder='email'
                            {...register('email', {
                              required: true,
                              pattern: {
                                value:
                                  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'invalid email address',
                              },
                            })}
                          />
                          {/* errors will return when field validation fails  */}
                          {errors.email && (
                            <span className='text-rose-500 text-sm'>
                              {errors.email.message}
                            </span>
                          )}
                        </form>
                      ) : (
                        <div className='flex gap-x-2'>
                          <p className='text-sm text-gray-500'>
                            API Key: {APIkey}
                          </p>
                          <CopyClipboard content={APIkey ?? ''} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className='mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3'>
                  {isSubmitSuccessful ? (
                    <>
                      <a
                        href='#demo'
                        className='inline-flex w-full justify-center  rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2'
                        ref={cancelButtonRef}
                        onClick={() => setOpen(false)}
                      >
                        Go to Demo
                      </a>
                      <button
                        type='button'
                        className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0'
                        onClick={() => setOpen(false)}
                        ref={cancelButtonRef}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type='button'
                        className='inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2'
                        onClick={handleSubmit(onSubmit)}
                      >
                        Confirm
                      </button>
                      <button
                        type='button'
                        className='mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0'
                        onClick={() => setOpen(false)}
                        ref={cancelButtonRef}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
