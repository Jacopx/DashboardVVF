import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchVehicles } from '@/api/vehicles'
import { fetchAllStarts } from '@/api/starts'
import VehicleTable from '@/components/VehiclesTable'
import VehicleDetail from '@/components/VehicleDetail'

export default function Vehicles() {
    const [selectedVehicle, setSelectedVehicle] = useState(null)

    const { data: dataVehicles,  isLoading: isLoadingVehicles, error: errorVehicles } = useQuery({
        queryKey: ['vehicles'],
        queryFn: () => fetchVehicles(),
    })

    const { data: dataStarts, isLoading: isLoadingStarts, error: errorStarts } = useQuery({
        queryKey: ['starts'],
        queryFn: () => fetchAllStarts(),
    })

    if (isLoadingVehicles || isLoadingStarts) return <p className="p-8 text-muted-foreground">Loading...</p>
    if (errorVehicles || errorStarts) return <p className="p-8 text-destructive">Error: {errorVehicles.message}</p>

    return (
        <div className="p-1">
            <h1 className="text-3xl font-bold mb-6">Mezzi</h1>
            <div className="flex gap-6">
                <div className={selectedVehicle ? 'w-1/2' : 'w-full'}>
                    <VehicleTable
                        data={dataVehicles}
                        onRowClick={setSelectedVehicle}
                    />
                </div>
                {selectedVehicle && (
                    <div className="w-1/2 sticky top-0 self-start">
                        <VehicleDetail
                            starts={dataStarts}
                            vehicle={selectedVehicle}
                            onClose={() => setSelectedVehicle(null)}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}