import { Fragment, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/outline'
import { useMutation } from '@tanstack/react-query'
import { SubmitHandler, useForm } from 'react-hook-form'

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
    formState: { errors, isSubmitSuccessful },
  } = useForm<Inputs>({})

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const result = await mutateAsync({
      plan_name: selectedTier,
      user: data.email,
    })
    console.log(result)
  }

  const { mutateAsync } = useMutation({
    mutationFn: (plan: { plan_name: string; user: string }) => {
      return fetch(process.env.NEXT_PUBLIC_API_KEY_URL + '/create_key', {
        method: 'POST',
        body: JSON.stringify({
          plan_name: plan.plan_name,
          user: plan.user,
        }),
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
                        <form onSubmit={handleSubmit(onSubmit)}>
                          <input
                            type='email'
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
                          {errors.email && <span>This field is required</span>}
                        </form>
                      ) : (
                        <p className='text-sm text-gray-500'>
                          xxxxx-xxxxxxxx-xxxxx
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className='mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3'>
                  {isSubmitSuccessful ? (
                    <div> Go to Demo</div>
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
