const DEFAULT_PHOTO = 'https://ui-avatars.com/api/?background=e2e8f0&color=64748b&size=128&name='

function DetailRow({ label, value }) {
    return (
        <div className="flex flex-col gap-1 py-2 border-b border-border">
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="text-sm">{value ?? '—'}</span>
        </div>
    )
}

export default function VehicleDetail({ vehicle, onClose }) {
    const photoUrl = vehicle?.photo
        ? vehicle.photo
        : `${DEFAULT_PHOTO}${encodeURIComponent(vehicle?.name)}`

    const isActive = vehicle?.status_label === 'ATTIVO'

    return (
        <div className="rounded-md border overflow-y-auto mt-12 max-h-screen">
            {/* Header */}
            <div className="flex justify-between items-start p-4 border-b border-border">
                <div className="flex gap-4 items-center">
                    <img
                        src={photoUrl}
                        alt={vehicle?.name}
                        className="w-16 h-16 rounded-full object-cover bg-muted"
                        onError={e => {
                            e.target.src = `${DEFAULT_PHOTO}${encodeURIComponent(vehicle?.name)}`
                        }}
                    />
                    <div>
                        <h2 className="text-lg font-bold">{vehicle?.name}</h2>
                        <p className="text-m font-semibold text-muted-foreground">
                            {vehicle?.brand} {vehicle?.model} · {vehicle?.type}
                        </p>
                    </div>
                    <span className={`text-sm font-semibold px-9 py-1 rounded-full ${isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                        {vehicle?.status_label}
                    </span>
                </div>
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>

            {/* 4 quadrant grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-6 p-4">

                {/* Top Left — Identificazione */}
                <div>
                    <p className="text-s font-semibold text-muted-foreground uppercase tracking-wide py-2">Identificazione</p>
                    <DetailRow label="Targa" value={vehicle?.plate} />
                    <DetailRow label="Nome" value={vehicle?.name} />
                    <DetailRow label="Tipo" value={vehicle?.type} />
                </div>

                {/* Top Right — Caratteristiche */}
                <div>
                    <p className="text-s font-semibold text-muted-foreground uppercase tracking-wide py-2">Caratteristiche</p>
                    <DetailRow label="Massa" value={vehicle?.weight ? `${vehicle.weight} kg` : '—'} />
                    <DetailRow label="Posti" value={vehicle?.seats} />
                    <DetailRow label="Limitazioni" value={vehicle?.limitations} />
                </div>

                {/* Bottom Left — Registrazione */}
                <div>
                    <p className="text-s font-semibold text-muted-foreground uppercase tracking-wide py-2 mt-2">Registrazione</p>
                    <DetailRow label="Data Immatricolazione" value={vehicle?.data_reg} />
                    <DetailRow label="Data Acquisizione" value={vehicle?.data_acquire} />
                </div>

                {/* Bottom Right — Note */}
                <div>
                    <p className="text-s font-semibold text-muted-foreground uppercase tracking-wide py-2 mt-2">Note</p>
                    <DetailRow label="Descrizione" value={vehicle?.description} />
                </div>

            </div>
        </div>
    )
}