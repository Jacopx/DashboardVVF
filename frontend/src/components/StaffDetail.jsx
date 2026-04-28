import { useState, useMemo, useEffect } from 'react'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { Pencil, Check, X } from 'lucide-react'
import { toast } from 'sonner'
import { updateStaff } from '@/api/staff'
import { DatePicker } from '@/components/ui/datepicker'

const DEFAULT_PHOTO = 'https://ui-avatars.com/api/?background=e2e8f0&color=64748b&size=128&name='

function DetailRow({ label, value }) {
    return (
        <div className="flex flex-col gap-1 py-2 border-b border-border">
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="text-sm">{value ?? '—'}</span>
        </div>
    )
}

export default function StaffDetail({ starts, staff, onClose }) {

    const [editing, setEditing] = useState(false)

    const toDateString = (d) => d ? new Date(d).toISOString().split('T')[0] : ''

    const [draft, setDraft] = useState({
        medical: toDateString(staff.medical),
        license_exp: toDateString(staff.license_exp)
    })
    useEffect(() => {
        setDraft({
            medical: toDateString(staff.medical),
            license_exp: toDateString(staff.license_exp)
        })
        setEditing(false)
    }, [staff.id])

    const queryClient = useQueryClient()

    const { mutate, isPending } = useMutation({
        mutationFn: () => updateStaff(staff.id, draft),
        onSuccess: (updated) => {
            queryClient.invalidateQueries(['staff'])
            setEditing(false)
            toast.success('Dati aggiornati')
        },
        onError: (err) => {
            toast.error(err.message, { duration: 5000 })
        }
    })

    const photoUrl = staff?.photo
        ? staff.photo
        : `${DEFAULT_PHOTO}${encodeURIComponent(staff?.name + ' ' + staff?.surname)}`

    const statusColor = {
        'ATTIVO': 'bg-green-900/40 text-green-400',
        'PERMANENTE': 'bg-orange-900/40 text-orange-400',
        'RITIRATO': 'bg-red-900/40 text-red-400',
    }

    const badgeClass = statusColor[staff?.status_label] ?? statusColor['ATTIVO']

    const countBossStarts = useMemo(() => {
        if (!starts || !staff) return 0
        const bossKey = `${staff?.surname.toUpperCase()} ${staff?.name.slice(0, 3).toUpperCase()}.`
        return starts.filter(s => s.boss === bossKey).length
    }, [starts, staff])

    function EditableRow({ label, value, onChange }) {
        return (
            <div className="flex flex-col gap-1 py-2 border-b border-border">
                <span className="text-xs text-muted-foreground">{label}</span>
                <div className="ring-1 ring-primary rounded-md px-2 py-1">
                    <DatePicker value={value} onChange={onChange} />
                </div>
            </div>
        )
    }

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
                    <span className="text-sm font-semibold px-3 py-1 rounded-full bg-blue-900/40 text-blue-400">
                        CP: {countBossStarts} interventi
                    </span>
                    <div className="flex items-center gap-6">
                        <span className={`text-sm font-semibold px-3 py-1 rounded-full ${badgeClass}`}>
                            {staff?.status_label ?? 'ATTIVO'}
                        </span>
                    </div>
                    <div className="flex items-right gap-3">
                        {editing ? (
                            <>
                                <button onClick={() => mutate()} disabled={isPending} className="text-green-600 hover:text-green-500">
                                    <Check size={16} />
                                </button>
                                <button onClick={() => { setEditing(false) }} className="text-muted-foreground hover:text-foreground">
                                    <X size={16} />
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => setEditing(true)} className="text-muted-foreground hover:text-foreground">
                                    <Pencil size={16} />
                                </button>
                                <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                                    <X size={16} />
                                </button>
                            </>
                        )}
                    </div>
                </div>
                {/* <div className="flex items-right gap-3">
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">✕</button>
                </div> */}
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
                    {editing ? (
                        <EditableRow label="Scadenza" value={draft.license_exp} onChange={v => setDraft(d => ({ ...d, license_exp: v }))} />
                    ) : (
                        <DetailRow label="Scadenza" value={staff?.license_exp} />
                    )}
                </div>

                {/* Bottom Left — Servizio */}
                <div>
                    <p className="text-s font-semibold text-muted-foreground uppercase tracking-wide py-2 mt-2">Servizio</p>
                    <DetailRow label="Inizio Servizio" value={staff?.start} />
                    <DetailRow label="Settimana" value={staff?.week_shift} />
                    <DetailRow label="Weekend" value={staff?.weekend_shift} />
                </div>

                {/* Bottom Right — Visita Medica */}
                <div>
                    <p className="text-s font-semibold text-muted-foreground uppercase tracking-wide py-2 mt-2">Visita Medica</p>
                    {editing ? (
                        <EditableRow label="Effettuata" value={draft.medical} onChange={v => setDraft(d => ({ ...d, medical: v }))} />
                    ) : (
                        <DetailRow label="Effettuata" value={staff?.medical} />
                    )}
                    <DetailRow label="Scadenza" value={staff?.medical_exp} />
                </div>

            </div>
        </div>
    )
}