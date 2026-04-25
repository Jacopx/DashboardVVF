import { useQuery } from '@tanstack/react-query'
import { fetchShifts } from '@/api/shifts'
import ShiftCard from '@/components/ShiftCard'

export default function Shifts() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['shifts'],
        queryFn: fetchShifts,
    })

    const DAYS = {
        '1': 'Lunedì', '2': 'Martedì', '3': 'Mercoledì',
        '4': 'Giovedì', '5': 'Venerdì'
    }

    if (isLoading) return <p className="p-8 text-muted-foreground">Loading...</p>
    if (error) return <p className="p-8 text-destructive">Error: {error.message}</p>

    return (
        <div className="p-1">
            <h1 className="text-3xl font-bold mb-6">Turni</h1>

            <h2 className="text-xl font-semibold mb-3">Settimana</h2>
            <div className="grid grid-cols-3 gap-4 mb-8">
                {Object.entries(data.week).map(([name, members]) => (
                    < ShiftCard key = { name } shiftName = { DAYS[name] ?? name } members = { members } />
                ))}
            </div>

            <h2 className="text-xl font-semibold mb-3">Weekend</h2>
            <div className="grid grid-cols-4 gap-4">
                {Object.entries(data.weekend).map(([name, members]) => (
                    <ShiftCard key={name} shiftName={name} members={members} />
                ))}
            </div>
        </div>
    )
}