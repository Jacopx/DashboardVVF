import { useQuery } from '@tanstack/react-query'
import { fetchOperations } from '@/api/operations'
import { fetchStarts } from '@/api/operations'

import TotalOperations from '@/components/dashboard/TotalOperations'
import MonthlyDistribution from '@/components/dashboard/MonthlyDistribution'
import YearHeatmap from '@/components/dashboard/YearHeatmap'
import AverageDuration from '@/components/dashboard/AverageDuration'
import TypologyDistribution from '@/components/dashboard/TypologyDistribution'
import LocalityDistribution from '@/components/dashboard/LocalityDistribution'
import TopVehicles from '@/components/dashboard/TopVehicles'
import WorstDay from '@/components/dashboard/WorstDay'

import OperationsTable from '@/components/OperationsTable'

export default function Dashboard() {
  const currentYear = new Date().getFullYear().toString()

  const { data, isLoading, error } = useQuery({
    queryKey: ['operations', currentYear],
    queryFn: () => fetchOperations({ year: currentYear }),
  })

  const { data: starts } = useQuery({
    queryKey: ['starts', currentYear],
    queryFn: () => fetchStarts(currentYear),
  })

  if (isLoading) return <p className="px-8 pt-4 text-muted-foreground">Loading...</p>
  if (error) return <p className="px-8 pt-4 text-destructive">Error: {error.message}</p>

  return (
    <div className="px-8 pt-4 pb-4 min-h-screen flex flex-col gap-4">
      <h1 className="text-3xl font-bold shrink-0">Dashboard {currentYear}</h1>

      <div className="grid grid-cols-3 gap-4 auto-rows-[250px]">
        <TotalOperations data={data} />
        <div className="col-span-2">
          <YearHeatmap data={data} year={currentYear} />
        </div>
        <MonthlyDistribution data={data} />
        <AverageDuration data={data} />
        <TypologyDistribution data={data} />
        <LocalityDistribution data={data} />
        <WorstDay data={data} />
        {starts && <TopVehicles starts={starts} />}
      </div>

      <OperationsTable data={data} hideInput/>

    </div>
  )
}