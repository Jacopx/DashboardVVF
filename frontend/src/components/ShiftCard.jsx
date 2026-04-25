import { Shield, Truck, HardHat } from 'lucide-react'

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

export default function ShiftCard({ shiftName, members }) {
    return (
        <div className="rounded-md border p-4">
            <h3 className="text-lg font-bold mb-3">{shiftName}</h3>
            <MemberList title="Capo Partenza" icon={Shield}  titleClass="text-red-600"           members={members.capi_partenza} />
            <MemberList title="Autista"        icon={Truck}   titleClass="text-muted-foreground"  members={members.autisti} />
            <MemberList title="Vigile"         icon={HardHat} titleClass="text-muted-foreground"  members={members.vigili} />
        </div>
    )
}