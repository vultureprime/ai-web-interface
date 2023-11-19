'use client'
import ChatBotDemo from './home/components/ChatBotDemo'
import Hero from './home/components/Hero'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <Hero />
      <ChatBotDemo />
    </QueryClientProvider>
  )
}
