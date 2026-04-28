import { Shield, Truck, HardHat } from 'lucide-react'

const SHIFT_COLORS = {
    'Turno 1': 'bg-emerald-200 dark:bg-emerald-900',
    'Turno 2': 'bg-red-200 dark:bg-red-900',
    'Turno 3': 'bg-green-200 dark:bg-green-900',
    'Turno 4': 'bg-pink-200 dark:bg-pink-900',
}

function MemberList({ title, icon: Icon, members, titleClass }) {
    if (!members?.length) return null
    return (
        <div className="mb-3">
            <div className="flex items-center gap-1 mb-1">
                <Icon size={14} className={titleClass} />
                <p className={`text-xs font-semibold uppercase tracking-wide ${titleClass}`}>{title}</p>
            </div>
            {members.map(m => (
                <p key={m.id} className="text-sm pl-5">{m.surname} {m.name}</p>
            ))}
        </div>
    )
}

export default function ShiftCard({ shiftName, members, nextShift, isNext }) {
    const badgeColor = SHIFT_COLORS[shiftName] ?? 'bg-grey-100'
    return (
        <div className={`rounded-md border p-4 ${isNext ? 'ring-2 ring-red-600' : ''}`}>
            <div className="flex items-center gap-2 mb-3">
                <h3 className="text-lg font-bold">{shiftName}</h3>
                {nextShift && (
                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${badgeColor}`}>
                        {nextShift.day === 'sabato' ? 'Sab' : 'Dom'} {new Date(nextShift.date).getDate()}
                    </span>
                )}
            </div>
            <MemberList title="Capo Partenza"  icon={Shield}  titleClass="text-red-600"          members={members.capi_partenza} />
            <MemberList title="Autista"        icon={Truck}   titleClass="text-muted-foreground" members={members.autisti} />
            <MemberList title="Vigile"         icon={HardHat} titleClass="text-muted-foreground" members={members.vigili} />
        </div>
    )
}