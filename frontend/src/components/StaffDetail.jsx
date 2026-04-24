function DetailRow({ label, value }) {
    return (
        <div className="flex flex-col gap-1 py-2 border-b border-border">
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="text-sm">{value ?? '—'}</span>
        </div>
    )
}

export default function StaffDetail({ staff, onClose }) {

    return (
        <div className="rounded-md border overflow-y-auto mt-12 max-h-screen">
            {/* Header */}
            <div className="flex justify-between items-start p-4 border-b border-border">
                <div>
                    <h2 className="text-lg font-bold">{staff?.surname} {staff?.name}</h2>
                    <p className="text-sm text-muted-foreground">{staff?.role} - #{staff?.radio}</p>
                </div>
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>


            <>
                {/* Details + Shifts side by side */}
                <div className="flex gap-4 p-4 border-b border-border">

                    {/* Left — staff details */}
                    <div className="flex-1">
                        <DetailRow label="Radio" value={staff?.radio} />
                        <DetailRow label="Nascita" value={staff?.birthday} />
                        <DetailRow label="Inizio Servizio" value={staff?.start} />
                        <DetailRow label="Patente" value={staff?.license} />
                        <DetailRow label="Scadenza Patente" value={staff?.license_exp} />
                        <DetailRow label="Visita Medica" value={staff?.medical} />
                        <DetailRow label="Indirizzo" value={staff?.address} />
                    </div>

                    {/* Right — Shifts */}
                    <div className="w-40 shrink-0">
                        <p className="text-xs text-muted-foreground mb-2">Turni</p>
                        <DetailRow label="Turni Settimanali" value={staff?.week_shift} />
                        <DetailRow label="Turni Weekend" value={staff?.weekend_shift} />
                    </div>
                </div>
            </>
        </div>
    )
}