'use client'
import ChatBotDemo from './plan/components/ChatBotDemo'
import Contact from './plan/components/Contact'
import DemoList from './plan/components/DemoList'
import PlanDetail from './plan/components/PlanDetail'
import PlanHero from './plan/components/PlanHero'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <PlanHero />
      <PlanDetail />
      <ChatBotDemo />
      <DemoList />
      <Contact />
    </QueryClientProvider>
  )
}
