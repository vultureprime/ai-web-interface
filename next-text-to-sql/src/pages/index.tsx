import ChatWidget, { ChatProps, Role } from '@/components/ChatWidget'
import DataGrid, { DataGridColumn } from '@/components/DataGrid'
import FormProvider from '@/components/hook-form/FormProvider'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueries, useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Inter } from 'next/font/google'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const inter = Inter({ subsets: ['latin'] })
axios.defaults.baseURL =
  'https://zig9eowuy3.execute-api.ap-southeast-1.amazonaws.com/uat/'

export const askScheme = z.object({
  query: z.string({
    required_error: '',
    invalid_type_error: '',
  }),
  bot: z.string({}).optional(),
})

export interface IOpenAIForm extends z.infer<typeof askScheme> {}

export default function Home() {
  const [
    { isLoading, error, data },
    { isLoading: isLoadAlldata, error: errorAllData, data: allData },
  ] = useQueries({
    queries: [
      {
        queryKey: ['getInfo'],
        queryFn: () => axios.get('/getInfo').then((res) => res.data),
      },
      {
        queryKey: ['getAllData'],
        queryFn: () => axios.get('/getAllData').then((res) => res.data),
      },
    ],
  })
  console.log(data)
  console.log(allData)
  const [answer, setAnswer] = useState<ChatProps[]>([])
  const methods = useForm<IOpenAIForm>({
    resolver: zodResolver(askScheme),
    shouldFocusError: true,
  })

  const columns = useMemo(() => {
    if (typeof data?.attr === 'undefined') {
      return []
    }
    return Object.keys(data.attr).map((x) => ({
      field: x,
      headerName: `${data.attr[x].name} (${data.attr[x].type})`,
    }))
  }, [data?.attr])

  const gridData = useMemo(() => {
    if (typeof allData === 'undefined') {
      return []
    }
    return Object.values(allData)
  }, [allData])

  console.log(columns)
  console.log(gridData)

  const {
    handleSubmit,
    setError,
    setValue,
    formState: { isSubmitting },
  } = methods

  const addToAnswers = (role: Role, message: string) => {
    setAnswer((prevState) => [
      ...prevState,
      { role, message, id: prevState.length.toString() },
    ])
  }

  const onReload = () => {
    return window.location.reload()
  }

  const onSubmit = async (data: IOpenAIForm) => {
    addToAnswers('user', data.query)
    //set up search query
    try {
      //TODO Edit anything here
      const response = await axios.post('/queryWithPrompt', {
        query: data.query,
      })
      setValue('query', '')
      return addToAnswers('ai', response.data.result ?? '')
    } catch (error) {
      setError('bot', {
        message: 'There was an error fetching the response.',
      })
      console.error('Error fetching from API:', error)
    }
    return
  }

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between  p-5 md:p-10 lg:p-24 bg-slate-50 ${inter.className}`}
    >
      <div className='border border-slate-200 bg-slate-100 rounded-xl p-6 w-full'>
        <div className='flex  flex-col gap-y-6 my-32 bg-white border border-gray-50 p-4 rounded-lg'>
          <DataGrid
            title={data?.table_name}
            columns={columns}
            rows={gridData}
          ></DataGrid>
          <p className='text-sm mt-2 mb-12 text-gray-600'>Text to SQL</p>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <div className='flex justify-center flex-col items-center'>
              <div className='flex justify-center flex-col items-end w-full'>
                <button
                  type='button'
                  className='bg-blue-600 text-white rounded-lg px-6 py-1 text-xl'
                  onClick={onReload}
                >
                  End Chat
                </button>
              </div>
              <div className='flex gap-x-2'>
                <ChatWidget answer={answer} />
              </div>
            </div>
          </FormProvider>
        </div>
      </div>
    </main>
  )
}
