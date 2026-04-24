const WEEK_DAYS = ['', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì']
const DEFAULT_PHOTO = 'https://ui-avatars.com/api/?background=e2e8f0&color=64748b&size=128&name='

function DetailRow({ label, value }) {
    return (
        <div className="flex flex-col gap-1 py-2 border-b border-border">
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="text-sm">{value ?? '—'}</span>
        </div>
    )
}

export default function StaffDetail({ staff, onClose }) {
    const photoUrl = staff?.photo
        ? staff.photo
        : `${DEFAULT_PHOTO}${encodeURIComponent(staff?.name + ' ' + staff?.surname)}`

    const weekDay = WEEK_DAYS[staff?.week_shift] ?? '—'
    const isActive = staff?.status === undefined || staff?.status === null ? true : staff.status === 1
    const medicalExp = staff?.medical
        ? new Date(new Date(staff.medical).setFullYear(new Date(staff.medical).getFullYear() + 2))
            .toISOString().split('T')[0]
        : null

    return (
        <div className="rounded-md border overflow-y-auto mt-12 max-h-screen">
            {/* Header */}
            <div className="flex justify-between items-start p-4 border-b border-border">
                <div className="flex gap-4 items-center">
                    <img
                        src={photoUrl}
                        alt={`${staff?.name} ${staff?.surname}`}
                        className="w-16 h-16 rounded-full object-cover bg-muted"
                        onError={e => {
                            e.target.src = `${DEFAULT_PHOTO}${encodeURIComponent(staff?.name + ' ' + staff?.surname)}`
                        }}
                    />
                    <div>
                        <h2 className="text-lg font-bold">{staff?.name} {staff?.surname}</h2>
                        <p className={`text-m font-semibold ${staff?.role === 'CSV' ? 'text-red-600' : 'text-muted-foreground'}`}>
                            {staff?.role} · Radio {staff?.radio}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`text-sm font-semibold px-3 py-1 rounded-full ${isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {isActive ? 'ATTIVO' : 'RITIRATO'}
                        </span>
                    </div>
                </div>
                <div className="flex items-right gap-3">
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">✕</button>
                </div>
            </div>

            {/* 4 quadrant grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-6 p-4">

                {/* Top Left — Personale */}
                <div>
                    <p className="text-s font-semibold text-muted-foreground uppercase tracking-wide py-2">Personale</p>
                    <DetailRow label="Data di Nascita" value={staff?.birthday} />
                    <DetailRow label="Indirizzo" value={staff?.address} />
                    <DetailRow label="Cellulare" value={staff?.phone} />
                </div>

                {/* Top Right — Patente */}
                <div>
                    <p className="text-s font-semibold text-muted-foreground uppercase tracking-wide py-2">Patente</p>
                    <DetailRow label="Grado" value={staff?.license ? `${staff.license}° grado` : '—'} />
                    <DetailRow label="Scadenza" value={staff?.license_exp} />
                </div>

                {/* Bottom Left — Servizio */}
                <div>
                    <p className="text-s font-semibold text-muted-foreground uppercase tracking-wide py-2 mt-2">Servizio</p>
                    <DetailRow label="Inizio Servizio" value={staff?.start} />
                    <DetailRow label="Turno Settimanale" value={weekDay} />
                    <DetailRow label="Turno Weekend" value={staff?.weekend_shift} />
                </div>

                {/* Bottom Right — Visita Medica */}
                <div>
                    <p className="text-s font-semibold text-muted-foreground uppercase tracking-wide py-2 mt-2">Visita Medica</p>
                    <DetailRow label="Effettuata" value={staff?.medical} />
                    <DetailRow label="Scadenza" value={medicalExp} />
                </div>

            </div>
        </div>
    )
}