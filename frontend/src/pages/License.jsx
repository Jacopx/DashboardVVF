import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchStaff } from '@/api/staff'
import LicenseTable from '@/components/LicenseTable'

export default function Staff() {

    const { data, isLoading, error } = useQuery({
        queryKey: ['staff'],
        queryFn: () => fetchStaff(),
    })

    if (isLoading) return <p className="p-8 text-muted-foreground">Loading...</p>
    if (error) return <p className="p-8 text-destructive">Error: {error.message}</p>

    return (
        <div className="p-1">
            <h1 className="text-3xl font-bold mb-6">Patenti</h1>
            <div className="w-full">
                <LicenseTable data={data} />
            </div>
        </div>
    )
}