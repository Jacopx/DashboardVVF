import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchVehicles } from '@/api/vehicles'
import VehicleTable from '@/components/VehiclesTable'
import VehicleDetail from '@/components/VehicleDetail'

export default function Vehicles() {
    const [selectedVehicle, setSelectedVehicle] = useState(null)

    const { data, isLoading, error } = useQuery({
        queryKey: ['vehicles'],
        queryFn: () => fetchVehicles(),
    })

    if (isLoading) return <p className="p-8 text-muted-foreground">Loading...</p>
    if (error) return <p className="p-8 text-destructive">Error: {error.message}</p>

    return (
        <div className="p-1">
            <h1 className="text-3xl font-bold mb-6">Mezzi</h1>
            <div className="flex gap-6">
                <div className={selectedVehicle ? 'w-1/2' : 'w-full'}>
                    <VehicleTable
                        data={data}
                        onRowClick={setSelectedVehicle}
                    />
                </div>
                {selectedVehicle && (
                    <div className="w-1/2 sticky top-0 self-start">
                        <VehicleDetail
                            vehicle={selectedVehicle}
                            onClose={() => setSelectedVehicle(null)}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}