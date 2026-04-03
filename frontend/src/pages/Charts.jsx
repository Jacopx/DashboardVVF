import { useQuery } from '@tanstack/react-query'
import { fetchAllOperations } from '@/api/operations'

import YearMonthTable from '@/components/charts/YearMonthTable'
import YearProgressChart from '@/components/charts/YearProgressChart'

export default function Charts() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['operations-all'],
    queryFn:  fetchAllOperations,
  })

  if (isLoading) return <p className="px-8 pt-4 text-muted-foreground">Loading...</p>
  if (error)     return <p className="px-8 pt-4 text-destructive">Error: {error.message}</p>

  return (
    <div className="px-8 pt-4 pb-8 space-y-8">
      <h1 className="text-3xl font-bold">Charts</h1>
      <YearMonthTable data={data} />
      <YearProgressChart data={data} />
    </div>
  )
}