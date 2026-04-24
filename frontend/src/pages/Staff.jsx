import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchStaff } from '@/api/staff'
import StaffTable from '@/components/StaffTable'
import StaffDetail from '@/components/StaffDetail'

export default function Staff() {
    const [selectedStaff, setSelectedStaff] = useState(null)

    const { data, isLoading, error } = useQuery({
        queryKey: ['staff'],
        queryFn: () => fetchStaff(),
    })

    if (isLoading) return <p className="p-8 text-muted-foreground">Loading...</p>
    if (error) return <p className="p-8 text-destructive">Error: {error.message}</p>

    return (
        <div className="p-1">
            <h1 className="text-3xl font-bold mb-6">Personale</h1>
            <div className="flex gap-6">
                <div className={selectedStaff ? 'w-1/2' : 'w-full'}>
                    <StaffTable
                        data={data}
                        onRowClick={setSelectedStaff}
                    />
                </div>
                {selectedStaff && (
                    <div className="w-1/2 sticky top-0 self-start">
                        <StaffDetail
                            staff={selectedStaff}
                            onClose={() => setSelectedStaff(null)}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}