'use client'
import ChatBotDemo from './home/components/ChatBotDemo'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChatBotDemo />
    </QueryClientProvider>
  )
}
