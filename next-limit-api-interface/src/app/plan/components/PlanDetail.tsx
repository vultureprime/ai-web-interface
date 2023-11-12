'use client'

import { useQuery } from '@tanstack/react-query'
import { Key, useState } from 'react'
import Alert from './Alert'
import { useRouter } from 'next/navigation'
import axios from 'axios'

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API

export default function PlanDetail() {
  const [open, setOpen] = useState(false)
  const [selectedTier, setSelectedTier] = useState('')
  const navigate = useRouter()
  const popularTier = 1
  const { data } = useQuery({
    queryKey: ['repoData'],
    queryFn: async () => {
      const { data } = await axios.get('/plan')
      return data
    },
  })

  const onTryIt = async (plan_name: string, contact: boolean) => {
    if (contact) {
      return navigate.push('#contact')
    }
    setSelectedTier(plan_name)
    setOpen(true)
  }

  return (
    <div id='plan' className='bg-white py-24 sm:py-32'>
      {open && (
        <Alert open={open} setOpen={setOpen} selectedTier={selectedTier} />
      )}
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        <div className='mx-auto max-w-4xl text-center'>
          <h2 className='text-base font-semibold leading-7 text-indigo-600'>
            API Rate Limits
          </h2>
          <p className='mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl'>
            Plans
          </p>
        </div>
        <p className='mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600'>
          This plan offers various options for monthly request
          limits,&quot;free-tier&quot; plan available, catering to different
          usage needs and preferences.
        </p>
        <div className='isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3'>
          {data?.map(
            (
              tier: {
                name: string
              },
              tierIdx: Key
            ) => (
              <div
                key={tierIdx}
                className={classNames(
                  tierIdx === popularTier
                    ? 'lg:z-10 lg:rounded-b-none'
                    : 'lg:mt-8',
                  tierIdx === 0 ? 'lg:rounded-r-none' : '',
                  tierIdx === data?.length - 1 ? 'lg:rounded-l-none' : '',
                  'flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10'
                )}
              >
                <div>
                  <div className='flex items-center justify-between gap-x-4'>
                    <h3
                      className={classNames(
                        tierIdx === popularTier
                          ? 'text-indigo-600'
                          : 'text-gray-900',
                        'text-lg font-semibold leading-8'
                      )}
                    >
                      {tier.name}
                    </h3>
                    {tierIdx === popularTier ? (
                      <p className='rounded-full bg-indigo-600/10 px-2.5 py-1 text-xs font-semibold leading-5 text-indigo-600'>
                        Most popular
                      </p>
                    ) : null}
                  </div>
                  <p className='mt-4 text-sm leading-6 text-gray-600'>
                    Feel the Enjoyment of Trying, Testing, and Clicking Through
                    Tiers.
                  </p>
                  <p className='mt-6 flex items-baseline gap-x-1'>
                    <span className='text-4xl font-bold tracking-tight text-gray-900'>
                      {tier.name
                        .replace('RequestPerDay', ' request')
                        .replace('free-tier', '5 request')}
                    </span>
                    <span className='text-sm font-semibold leading-6 text-gray-600'>
                      /day
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => onTryIt(tier.name, tierIdx === popularTier)}
                  className={classNames(
                    tierIdx === popularTier
                      ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-500'
                      : 'text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300',
                    'mt-8 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                  )}
                >
                  {tierIdx === popularTier ? 'Contact Us' : 'Try it'}
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}
