import { useQuery } from '@tanstack/react-query'
import { fetchCalendar } from '@/api/calendar'
import { fetchShifts } from '@/api/shifts'
import CalendarDay from '@/components/CalendarDay'

const MONTHS = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre']

const WEEKDAY_SHIFTS = { 1: 'Lunedì', 2: 'Martedì', 3: 'Mercoledì', 4: 'Giovedì', 5: 'Venerdì' }

function buildYearMap(calendarData) {
    // weekend days from backend, keyed by date string
    const map = {}
    for (const entry of calendarData) {
        map[entry.date] = entry
    }
    return map
}

function getDaysInMonth(year, month) {
    const days = []
    const d = new Date(year, month, 1)
    while (d.getMonth() === month) {
        days.push(new Date(d))
        d.setDate(d.getDate() + 1)
    }
    return days
}

function MonthGrid({ year, month, yearMap, shifts }) {
    const days = getDaysInMonth(year, month)
    const firstDow = (days[0].getDay() + 6) % 7 // Monday=0

    return (
        <div>
            <p className="text-sm font-semibold mb-2">{MONTHS[month]}</p>
            <div className="grid grid-cols-7 gap-px text-center mb-1">
                {['L', 'M', 'M', 'G', 'V', 'S', 'D'].map((d, i) => (
                    <p key={i} className="text-xs text-muted-foreground">{d}</p>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-px">
                {Array(firstDow).fill(null).map((_, i) => <div key={`e-${i}`} />)}
                {days.map(d => {
                    const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
                    const dow = d.getDay() === 0 ? 7 : d.getDay() // 1=Mon, 7=Sun

                    if (dow === 6 || dow === 7) {
                        const entry = yearMap[dateStr]
                        if (!entry) return <div key={dateStr} />
                        return <CalendarDay key={dateStr} data={entry} shifts={shifts} />
                    }

                    const shiftName = WEEKDAY_SHIFTS[dow]
                    const entry = { date: dateStr, day: shiftName.toLowerCase(), shift_name: String(dow) }
                    return <CalendarDay key={dateStr} data={entry} shifts={shifts} />
                })}
            </div>
        </div>
    )
}

export default function Calendar() {
    const year = new Date().getFullYear()

    const { data: calendarData, isLoading: calLoad } = useQuery({
        queryKey: ['calendar', year],
        queryFn: () => fetchCalendar(year),
    })

    const { data: shifts, isLoading: shiftLoad } = useQuery({
        queryKey: ['shifts'],
        queryFn: fetchShifts,
    })

    if (calLoad || shiftLoad) return <p className="p-8 text-muted-foreground">Loading...</p>

    const yearMap = buildYearMap(calendarData)

    return (
        <div className="p-1">
            <h1 className="text-3xl font-bold mb-6">Calendario {year}</h1>
            <div className="grid grid-cols-4 gap-6 p-15">
                {Array.from({ length: 12 }, (_, i) => (
                    <MonthGrid key={i} year={year} month={i} yearMap={yearMap} shifts={shifts} />
                ))}
            </div>
        </div>
    )
}