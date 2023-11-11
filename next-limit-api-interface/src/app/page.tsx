'use client'
import PlanDetail from './plan/components/PlanDetail'
import PlanHero from './plan/components/PlanHero'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <PlanHero />
      <PlanDetail />
    </QueryClientProvider>
  )
}
