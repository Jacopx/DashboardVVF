import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchAllOperations } from '@/api/operations'
import { lazy, Suspense } from 'react'
const MapView = lazy(() => import('@/components/MapView'))

export default function Map() {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())

    const { data, isLoading, error } = useQuery({
        queryKey: ['operations-all'],
        queryFn: fetchAllOperations,
    })

    const years = useMemo(() =>
        [...new Set(data?.map(op => op.year))].sort().reverse()
        , [data])

    const visible = useMemo(() => {
        const ops = selectedYear === 'all' ? data : data?.filter(op => op.year === selectedYear)
        return ops?.filter(op => !isNaN(parseFloat(op.y)) && !isNaN(parseFloat(op.x))) ?? []
    }, [data, selectedYear])

    if (isLoading) return <p className="p-8 text-muted-foreground">Loading...</p>
    if (error) return <p className="p-8 text-destructive">Error: {error.message}</p>

    return (
        <div className="p-1">
            <h1 className="text-3xl font-bold mb-6">Mappa</h1>
            <div className="flex gap-2 mb-4">
                {['all', ...years].map(y => (
                    <button
                        key={y}
                        onClick={() => setSelectedYear(y)}
                        className={`px-3 py-1 rounded-md text-sm font-medium border transition-colors ${selectedYear === y
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-background text-muted-foreground border-border hover:bg-muted'
                            }`}
                    >
                        {y === 'all' ? 'Tutti' : y}
                    </button>
                ))}
            </div>
            <Suspense fallback={<p className="text-muted-foreground">Loading map...</p>}>
                <MapView operations={visible} />
            </Suspense>
            <p className="text-sm text-muted-foreground mt-2">{visible.length} interventi</p>
        </div>
    )
}