import ChatWidget, { ChatProps, Role } from '@/components/ChatWidget'
import DataGrid, { DataRow } from '@/components/DataGrid'
import FormProvider from '@/components/hook-form/FormProvider'
import RHFTextField from '@/components/hook-form/RHFTextField'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueries } from '@tanstack/react-query'
import axios from 'axios'
import { Inter } from 'next/font/google'
import { useEffect, useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod'

const inter = Inter({ subsets: ['latin'] })

const api_url = process.env.NEXT_PUBLIC_API
axios.defaults.baseURL = api_url

export const askScheme = z.object({
  apiKey: z.string().optional(),
  query: z.string(),
  bot: z.string({}).optional(),
})

enum TabState {
  chatState,
  tableState,
}

export interface IOpenAIForm extends z.infer<typeof askScheme> {}

export default function Home() {
  const [isEdit, setIsEdit] = useState(false)
  const [state, setState] = useState<TabState>(TabState.tableState)
  const [
    { isLoading, data: column, refetch: refetchColum },
    { isLoading: isLoadAlldata, data: allData, refetch: refetchAllData },
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

  const { mutateAsync: queryPromt } = useMutation({
    mutationFn: ({ query_str }: { query_str: string }) => {
      return axios.post(`/query`)
    },
    onError: () => {
      setError('bot', {
        message: 'There was an error fetching the response.',
      })
    },
  })

  const { mutateAsync: randomData } = useMutation({
    mutationFn: () => {
      return axios.get(`/addRandomData`)
    },
  })

  const [answer, setAnswer] = useState<ChatProps[]>([])

  const methods = useForm<IOpenAIForm>({
    resolver: zodResolver(askScheme),
    mode: 'onChange',
    shouldFocusError: true,
    defaultValues: {
      apiKey: '',
      query: 'Write SQL in PostgresSQL format. Get average hight of student.',
    },
  })

  const {
    handleSubmit,
    setError,
    setValue,
    control,
    formState: { errors },
  } = methods

  const apiKey = useWatch({ name: 'apiKey', control })

  const onSetTab = (selectedTab: TabState) => {
    setState(selectedTab)
  }

  const addToAnswers = (role: Role, message: string, sql?: string) => {
    setAnswer((prevState) => [
      ...prevState,
      { role, sql, message, id: prevState.length.toString() },
    ])
  }

  const onEditapiKey = () => {
    setIsEdit(true)
  }

  const onSaveapiKey = () => {
    if (!!errors.apiKey?.message) {
      return
    }
    if (apiKey?.length !== 40) {
      setError('apiKey', {
        message: 'There was an error fetching the response.',
      })
    }

    axios.defaults.headers.common['x-api-key'] = apiKey
    localStorage.apiKey = apiKey
    setIsEdit(false)
  }
  const onRandomData = async () => {
    await randomData()
    refetchColum()
    refetchAllData()
  }
  const onSubmit = async (data: IOpenAIForm) => {
    try {
      addToAnswers('user', data.query)
      const result = await queryPromt({ query_str: data.query })
      if (result) {
        setValue('query', '')
        return addToAnswers(
          'ai',
          result.data?.result as string,
          result.data?.['SQL Query'] as string
        )
      }
    } catch (error) {
      console.error(error)
    }
  }

  const columns = useMemo(() => {
    if (typeof column?.attr === 'undefined') {
      return []
    }
    return Object.keys(column.attr).map((x) => ({
      field: x,
      headerName: `${column.attr[x].name} (${column.attr[x].type})`,
    }))
  }, [column])

  const gridData = useMemo(() => {
    if (typeof allData === 'undefined') {
      return []
    }
    return Object.values(allData) as DataRow[]
  }, [allData])

  useEffect(() => {
    if (window && localStorage?.apiKey) {
      setValue('apiKey', localStorage.apiKey)
      axios.defaults.headers.common['x-api-key'] = localStorage.apiKey
    }
  }, [])

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between  p-5 md:p-10 lg:p-24 bg-slate-50 ${inter.className}`}
    >
      <div className='border border-slate-200 bg-slate-100 rounded-xl p-6 w-full'>
        <div className='flex gap-x-6 xl:hidden'>
          <ul className='flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400'>
            <li className='mr-2'>
              <button
                type='button'
                onClick={() => onSetTab(TabState.tableState)}
                className={twMerge(
                  'inline-block p-4  bg-gray-100 rounded-t-lg ',
                  state === TabState.tableState && 'text-blue-600'
                )}
              >
                Table
              </button>
            </li>
            <li className='mr-2'>
              <button
                type='button'
                onClick={() => onSetTab(TabState.chatState)}
                className={twMerge(
                  'inline-block p-4  bg-gray-100 rounded-t-lg ',
                  state === TabState.chatState && 'text-blue-600'
                )}
              >
                Chat
              </button>
            </li>
          </ul>
        </div>
        <div className=' grid grid-cols-1 xl:grid-cols-2  gap-x-32  p-4 rounded-lg w-full'>
          <div
            className={twMerge(
              state === TabState.chatState && 'hidden xl:block'
            )}
          >
            {isLoading || isLoadAlldata ? (
              <p>Loading</p>
            ) : (
              <div>
                <div className='flex justify-end w-full'>
                  <button
                    type='button'
                    className='bg-blue-600 text-white rounded-lg px-6 py-2 text-sm h-fit whitespace-nowrap'
                    onClick={onRandomData}
                  >
                    Add Random Data
                  </button>
                </div>
                <DataGrid
                  title={column?.table_name}
                  columns={columns}
                  rows={gridData}
                ></DataGrid>
              </div>
            )}
          </div>

          <FormProvider
            methods={methods}
            onSubmit={handleSubmit(onSubmit)}
            className={twMerge(
              state === TabState.tableState && 'hidden xl:block '
            )}
          >
            <div className='mt-5 mx-auto flex justify-center flex-col items-center bg-white border border-gray-50 w-full xl:w-[540px] p-8 rounded-3xl'>
              <div className='flex justify-between items-end w-full gap-x-8 mb-5'>
                {isEdit && (
                  <RHFTextField
                    label='API key'
                    name='apiKey'
                    placeholder='Please Enter your API Key'
                    className='outline-none w-full border border-gray-200 rounded-lg px-2 py-1'
                  />
                )}
                <div className='flex-1' />
                <button
                  type='button'
                  className='bg-blue-600 text-white rounded-lg px-6 py-2 text-sm h-fit whitespace-nowrap'
                  onClick={isEdit ? onSaveapiKey : onEditapiKey}
                >
                  {isEdit ? 'Save' : 'Add API key'}
                </button>
              </div>
              <div className='flex gap-x-2 w-full'>
                <ChatWidget answer={answer} />
              </div>
            </div>
          </FormProvider>
        </div>
      </div>
    </main>
  )
}
