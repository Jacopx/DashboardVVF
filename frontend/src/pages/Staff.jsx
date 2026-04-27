import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchStaff } from '@/api/staff'
import { fetchAllStarts } from '@/api/starts'
import StaffTable from '@/components/StaffTable'
import StaffDetail from '@/components/StaffDetail'

export default function Staff() {

    const [selectedStaff, setSelectedStaff] = useState(null)

    const { data: dataStaff, isLoading: isLoadingStaff, error: errorStaff } = useQuery({
        queryKey: ['staff'],
        queryFn: () => fetchStaff(),
    })

    const { data: dataStarts, isLoading: isLoadingStarts, error: errorStarts } = useQuery({
        queryKey: ['starts'],
        queryFn: () => fetchAllStarts(),
    })

    if (isLoadingStaff || isLoadingStarts) return <p className="p-8 text-muted-foreground">Loading...</p>
    if (errorStaff || errorStarts) return <p className="p-8 text-destructive">Error: {errorStaff.message}</p>

    return (
        <div className="p-1">
            <h1 className="text-3xl font-bold mb-6">Personale</h1>
            <div className="flex gap-6">
                <div className={selectedStaff ? 'w-1/2' : 'w-full'}>
                    <StaffTable
                        data={dataStaff}
                        onRowClick={setSelectedStaff}
                    />
                </div>
                {selectedStaff && (
                    <div className="w-1/2 sticky top-0 self-start">
                        <StaffDetail
                            starts={dataStarts}
                            staff={selectedStaff}
                            onClose={() => setSelectedStaff(null)}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}