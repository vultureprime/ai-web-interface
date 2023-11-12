export default function Contact() {
  return (
    <div id='contact' className='bg-white py-24 sm:py-32'>
      <div className='mx-auto max-w-7xl px-6 lg:px-8'>
        <div className='mx-auto max-w-2xl space-y-16 divide-y divide-gray-100 lg:mx-0 lg:max-w-none'>
          <div className='grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3'>
            <div>
              <h2 className='text-3xl font-bold tracking-tight text-gray-900'>
                Get in touch
              </h2>
              <p className='mt-4 leading-7 text-gray-600'>
                Let&apos;s chat with us,It won&apos;t cost you a dime! It&apos;s
                absolutely free! 😄
              </p>
            </div>
            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-2 lg:gap-8'>
              <div className='rounded-2xl bg-gray-50 p-10'>
                <h3 className='text-base font-semibold leading-7 text-gray-900'>
                  Contact
                </h3>
                <dl className='mt-3 space-y-1 text-sm leading-6 text-gray-600'>
                  <div>
                    <dt className='sr-only'>Email</dt>
                    <dd>
                      <a
                        className='font-semibold text-indigo-600'
                        href='mailto:collaborate@Contact.com'
                      >
                        business@vultureprime.com
                      </a>
                    </dd>
                  </div>
                  <div className='mt-1'>
                    <dt className='sr-only'>Phone number</dt>
                    <dd>+66 804934501</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
