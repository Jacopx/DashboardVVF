import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchOperations } from '@/api/operations'
import OperationsTable from '@/components/OperationsTable'
import OperationDetail from '@/components/OperationDetail'

export default function Operations() {
  const [selectedOperation, setSelectedOperation] = useState(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ['operations'],
    queryFn:  () => fetchOperations(),
  })

  if (isLoading) return <p className="p-8 text-muted-foreground">Loading...</p>
  if (error)     return <p className="p-8 text-destructive">Error: {error.message}</p>

return (
  <div className="p-1">
    <h1 className="text-3xl font-bold mb-6">Operations</h1>
    <div className="flex gap-6">
      <div className={selectedOperation ? 'w-3/5' : 'w-full'}>
        <OperationsTable
          data={data}
          onRowClick={setSelectedOperation}
        />
      </div>
      {selectedOperation && (
        <div className="w-2/5 sticky top-0 self-start">
          <OperationDetail
            operation={selectedOperation}
            onClose={() => setSelectedOperation(null)}
          />
        </div>
      )}
    </div>
  </div>
)
}