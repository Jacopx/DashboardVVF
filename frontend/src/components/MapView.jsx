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
                    radius={3}
                    pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.8 }}
                >
                    <Popup>
                        <div style={{ background: '#000000', color: '#f8fafc', padding: '8px', borderRadius: '6px', minWidth: '180px' }}>
                            <p style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '6px' }}>#{op.id} — {op.year}</p>
                            <p style={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '8px' }}>{op.typology}</p>
                            <p style={{ color: '#94a3b8', fontSize: '11px' }}>{op.loc}</p>
                            <p style={{ color: '#94a3b8', fontSize: '11px' }}>{op.address}</p>
                            <div style={{ borderTop: '1px solid #334155', marginTop: '8px', paddingTop: '6px' }}>
                                <p style={{ fontSize: '11px' }}>👤 {op.caller ?? '—'}</p>
                                <p style={{ fontSize: '11px' }}>⭐ {op.boss ?? '—'}</p>
                            </div>
                            <div style={{ borderTop: '1px solid #334155', marginTop: '8px', paddingTop: '6px' }}>
                                <p style={{ fontSize: '11px' }}>🕐 {op.dt_exit ?? '—'}</p>
                                <p style={{ fontSize: '11px' }}>🔒 {op.dt_close ?? '—'}</p>
                            </div>
                        </div>
                    </Popup>
                </CircleMarker>
            ))}
        </MapContainer>
    )
}