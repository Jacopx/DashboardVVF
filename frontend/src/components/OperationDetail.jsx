import { useQuery } from '@tanstack/react-query'
import { fetchOperationDetail } from '@/api/operations'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { useMap } from 'react-leaflet'
import { useEffect } from 'react'

// Fix Leaflet's default marker icon broken by bundlers
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function DetailRow({ label, value }) {
  return (
    <div className="flex flex-col gap-1 py-2 border-b border-border">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm">{value ?? '—'}</span>
    </div>
  )
}

function RecenterMap({ lat, lng }) {
  const map = useMap()
  useEffect(() => {
    map.setView([lat, lng], 15)
  }, [lat, lng])
  return null
}

export default function OperationDetail({ operation, onClose }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['operation', operation?.year, operation?.id],
    queryFn: () => fetchOperationDetail(operation.year, operation.id),
    enabled: !!operation,
  })

  const lat = parseFloat(data?.y)
  const lng = parseFloat(data?.x)
  const hasCoords = !isNaN(lat) && !isNaN(lng)
  const duration = (data?.dt_exit && data?.dt_close) ? (() => {
    const diff = new Date(data.dt_close) - new Date(data.dt_exit)
    const hours = Math.floor(diff / 3600000)
    const minutes = Math.round((diff % 3600000) / 60000)
    return { hours, minutes }
  })() : { hours: '—', minutes: '' }

  return (
    <div className="rounded-md border overflow-y-auto mt-12 max-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start p-4 border-b border-border">
        <div>
          <h2 className="text-lg font-bold">Intervento #{operation?.id} — {operation?.year}</h2>
          <p className="text-sm text-muted-foreground">{operation?.typology}</p>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">✕</button>
      </div>

      {isLoading && <p className="text-muted-foreground p-4">Loading...</p>}
      {error && <p className="text-destructive p-4">Error: {error.message}</p>}

      {data && (
        <>
          {/* Details + Vehicles side by side */}
          <div className="flex gap-4 p-4 border-b border-border">

            {/* Left — operation details */}
            <div className="flex-1">
              <DetailRow label="Data" value={data.date} />
              <DetailRow label="Intervento provinciale" value={data.opn} />
              <DetailRow label="Richiedente" value={data.caller} />
              <DetailRow label="Indirizzo" value={data.address} />
              <DetailRow label="Comune" value={data.loc} />
              <DetailRow label="Chiamata" value={data.dt_exit} />
              <DetailRow label="Chiusura" value={data.dt_close} />
              <DetailRow label="Durata" value={`${duration.hours}h ${duration.minutes}m`} />
              <DetailRow label="Capo partenza" value={data.boss} />
              <DetailRow label="Operatore" value={data.operator} />
            </div>

            {/* Right — vehicle dispatches */}
            <div className="w-40 shrink-0">
              <p className="text-xs text-muted-foreground mb-2">Veicoli</p>
              {data.starts.length === 0 && (
                <p className="text-sm text-muted-foreground">None</p>
              )}
              {data.starts.map((start, i) => (
                <div key={i} className="rounded-md border p-2 mb-2 text-xs space-y-1">
                  <p className="font-medium">{start.vehicle}</p>
                  <p className="text-muted-foreground">{start.boss ?? '—'}</p>
                  <p className="text-muted-foreground">↑ {start.exit_dt ?? '—'}</p>
                  <p className="text-muted-foreground">● {start.inplace_dt ?? '—'}</p>
                  <p className="text-muted-foreground">↓ {start.back_dt ?? '—'}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Map */}
          {hasCoords ? (
            <MapContainer
              center={[lat, lng]}
              zoom={15}
              style={{ height: '350px', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              <RecenterMap lat={lat} lng={lng} />
              <Marker position={[lat, lng]}>
                <Popup>{data.loc ?? 'Operation location'}</Popup>
              </Marker>
            </MapContainer>
          ) : (
            <div className="h-32 flex items-center justify-center text-sm text-muted-foreground">
              No coordinates available
            </div>
          )}
        </>
      )}
    </div>
  )
}