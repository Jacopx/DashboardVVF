import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import L from 'leaflet'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

export default function MapView({ operations }) {
    return (
        <MapContainer
            center={[45.65275, 8.18035]}
            zoom={12}
            style={{ height: '75vh', width: '100%' }}
            className="rounded-md border"
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            {operations.map(op => (
                <CircleMarker
                    key={`${op.year}-${op.id}`}
                    center={[parseFloat(op.y), parseFloat(op.x)]}
                    radius={4}
                    pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.8 }}
                >
                    <Popup minWidth={200} maxWidth={200}>
                    <div style={{ background: '#000000', color: '#f8fafc', padding: '8px', borderRadius: '6px' }}>
                        <p style={{ fontWeight: 'bold', fontSize: '13px', margin: '0 0 4px' }}>#{op.id} — {op.year}</p>
                        <p style={{ fontWeight: 'bold', fontSize: '13px', margin: '0 0 6px' }}>{op.typology}</p>
                        <p style={{ color: '#94a3b8', fontSize: '12px', margin: '2px 0' }}>{op.loc}</p>
                        <p style={{ color: '#94a3b8', fontSize: '12px', margin: '2px 0' }}>{op.address}</p>
                        <div style={{ borderTop: '1px solid #334155', marginTop: '6px', paddingTop: '4px' }}>
                            <p style={{ fontSize: '12px', margin: '2px 0' }}>👤 {op.caller ?? '—'}</p>
                            <p style={{ fontSize: '12px', margin: '2px 0' }}>⭐ {op.boss ?? '—'}</p>
                        </div>
                        <div style={{ borderTop: '1px solid #334155', marginTop: '6px', paddingTop: '4px' }}>
                            <p style={{ fontSize: '12px', margin: '2px 0' }}>🟢 {op.dt_exit ? op.dt_exit.replace('T', ' ').slice(0, 16) : '—'}</p>
                            <p style={{ fontSize: '12px', margin: '2px 0' }}>🔴 {op.dt_close ? op.dt_close.replace('T', ' ').slice(0, 16) : '—'}</p>
                        </div>
                    </div>
                </Popup>
                </CircleMarker>
            ))}
        </MapContainer>
    )
}