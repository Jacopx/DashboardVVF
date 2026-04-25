import { useState } from 'react'
import { Shield, Truck, HardHat } from 'lucide-react'

const WEEKDAY_COLORS = {
    'lunedì': 'bg-blue-200 dark:bg-blue-900',
    'martedì': 'bg-orange-200 dark:bg-orange-900',
    'mercoledì': 'bg-teal-200 dark:bg-teal-900',
    'giovedì': 'bg-yellow-200 dark:bg-yellow-900',
    'venerdì': 'bg-purple-200 dark:bg-purple-900',
}

const WEEKEND_COLORS = {
    1: 'bg-emerald-200 dark:bg-emerald-900',
    2: 'bg-red-200 dark:bg-red-900',
    3: 'bg-green-200 dark:bg-green-900',
    4: 'bg-pink-200 dark:bg-pink-900',
}

function Popup({ data, shifts, isWeekend }) {
    const team = shifts?.[isWeekend ? 'weekend' : 'week']?.[
        isWeekend ? String(data.shift) : data.shift_name
    ]
    if (!team) return null

    return (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 rounded-md border bg-popover shadow-lg p-3 text-popover-foreground">
            <p className="text-xs font-bold mb-2">{isWeekend ? `Turno ${data.shift}` : data.shift_name}</p>
            {!!team.capi_partenza?.length && (
                <div className="mb-1">
                    <div className="flex items-center gap-1"><Shield size={11} className="text-red-600" /><p className="text-xs font-semibold text-red-600 uppercase">Capo</p></div>
                    {team.capi_partenza.map(m => <p key={m.id} className="text-xs pl-4">{m.surname} {m.name}</p>)}
                </div>
            )}
            {!!team.autisti?.length && (
                <div className="mb-1">
                    <div className="flex items-center gap-1"><Truck size={11} className="text-muted-foreground" /><p className="text-xs font-semibold text-muted-foreground uppercase">Autista</p></div>
                    {team.autisti.map(m => <p key={m.id} className="text-xs pl-4">{m.surname} {m.name}</p>)}
                </div>
            )}
            {!!team.vigili?.length && (
                <div className="mb-1">
                    <div className="flex items-center gap-1"><HardHat size={11} className="text-muted-foreground" /><p className="text-xs font-semibold text-muted-foreground uppercase">Vigile</p></div>
                    {team.vigili.map(m => <p key={m.id} className="text-xs pl-4">{m.surname} {m.name}</p>)}
                </div>
            )}
        </div>
    )
}

export default function CalendarDay({ data, shifts }) {
    const [hovered, setHovered] = useState(false)
    const isWeekend = data.day === 'sabato' || data.day === 'domenica'
    const color = isWeekend
        ? WEEKEND_COLORS[data.shift]
        : WEEKDAY_COLORS[data.day?.toLowerCase()]

    return (
        <div
            className={`relative rounded text-center py-1 cursor-default ${color}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <p className="text-xs font-medium">{new Date(data.date).getDate()}</p>
            {hovered && <Popup data={data} shifts={shifts} isWeekend={isWeekend} />}
        </div>
    )
}