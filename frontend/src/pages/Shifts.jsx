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

    const comingWeekend = getComingWeekend() // returns [saturdayDate, sundayDate]

    const nextShift = calendarData
        ?.filter(e => new Date(e.date) >= new Date(new Date().toDateString()))
        ?.sort((a, b) => new Date(a.date) - new Date(b.date))?.[0]

    const todayNumber = new Date().getDay() // 1=Monday, 5=Friday

    return (
        <div className="p-1">
            <h1 className="text-3xl font-bold mb-6">Turni</h1>

            <h2 className="text-xl font-semibold mb-3">Settimana</h2>
            <div className="grid grid-cols-5 gap-4 mb-8">
                {Object.entries(data.week).map(([name, members]) => (
                    < ShiftCard key={name} shiftName={DAYS[name] ?? name} members={members} isNext={parseInt(name) === todayNumber}/>
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
                        isNext={isComingWeekend(getNextShiftDate(calendarData, parseInt(name))?.date)}
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

function getComingWeekend() {
    const today = new Date()
    const day = today.getDay()
    const daysToSat = (6 - day + 7) % 7
    const sat = new Date(today)
    sat.setDate(today.getDate() + daysToSat)
    const sun = new Date(sat)
    sun.setDate(sat.getDate() + 1)
    return [sat, sun]
}

function isComingWeekend(date) {
    if (!date) return false
    const [sat, sun] = getComingWeekend()
    const d = new Date(date)
    return d.toDateString() === sat.toDateString() || d.toDateString() === sun.toDateString()
}