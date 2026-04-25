import { useQuery } from '@tanstack/react-query'
import { fetchShifts } from '@/api/shifts'
import { fetchCalendar } from '@/api/calendar'
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

    const year = new Date().getFullYear()

    const { data: calendarData } = useQuery({
        queryKey: ['calendar', year],
        queryFn: () => fetchCalendar(year),
    })

    if (isLoading) return <p className="p-8 text-muted-foreground">Loading...</p>
    if (error) return <p className="p-8 text-destructive">Error: {error.message}</p>

    const nextShift = calendarData
        ?.filter(e => new Date(e.date) >= new Date(new Date().toDateString()))
        ?.sort((a, b) => new Date(a.date) - new Date(b.date))?.[0]

    return (
        <div className="p-1">
            <h1 className="text-3xl font-bold mb-6">Turni</h1>

            <h2 className="text-xl font-semibold mb-3">Settimana</h2>
            <div className="grid grid-cols-3 gap-4 mb-8">
                {Object.entries(data.week).map(([name, members]) => (
                    < ShiftCard key={name} shiftName={DAYS[name] ?? name} members={members} />
                ))}
            </div>

            <h2 className="text-xl font-semibold mb-3">Weekend</h2>
            <div className="grid grid-cols-4 gap-4">
                {Object.entries(data.weekend).map(([name, members]) => (
                    <ShiftCard
                        key={name}
                        shiftName={"Turno " + name}
                        members={members}
                        nextShift={getNextShiftDate(calendarData, parseInt(name))}
                    />
                ))}
            </div>
        </div>
    )
}

function getNextShiftDate(calendarData, shiftNumber) {
    const today = new Date(new Date().toDateString())
    return calendarData
        ?.filter(e => e.shift === shiftNumber && new Date(e.date) >= today)
        ?.sort((a, b) => new Date(a.date) - new Date(b.date))?.[0]
}