import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix default marker icon path issue with Vite bundler
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom colored markers
function makeIcon(color) {
  return L.divIcon({
    className: '',
    html: `
      <div style="
        width: 32px; height: 40px;
        display: flex; align-items: center; justify-content: center;
        filter: drop-shadow(0 3px 6px rgba(0,0,0,0.35));
      ">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 30" width="32" height="40">
          <path d="M12 0C7.589 0 4 3.589 4 8c0 6.5 8 18 8 18s8-11.5 8-18c0-4.411-3.589-8-8-8z"
            fill="${color}" stroke="white" stroke-width="1.5"/>
          <circle cx="12" cy="8" r="3.5" fill="white"/>
        </svg>
      </div>`,
    iconSize:   [32, 40],
    iconAnchor: [16, 40],
    popupAnchor:[0, -40],
  });
}

const URGENCY_COLORS = {
  Baixa:   '#38bdf8',
  Média:   '#f59e0b',
  Alta:    '#f97316',
  Crítica: '#ef4444',
};

const STATUS_COLORS = {
  Aberto:      '#f97316',
  'Em Análise':'#f59e0b',
  Resolvido:   '#10b981',
};

// Click handler inner component
function ClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
}

// Pulsing marker for the clicked (pending) position
function PendingMarker({ latlng }) {
  return (
    <Marker
      position={latlng}
      icon={L.divIcon({
        className: '',
        html: `
          <div style="position:relative; width:20px; height:20px;">
            <div style="
              position:absolute; inset:0; border-radius:50%;
              background:#059669; opacity:0.35;
              animation: ping 1.2s cubic-bezier(0,0,0.2,1) infinite;
            "/>
            <div style="
              position:absolute; inset:3px; border-radius:50%;
              background:#059669; border:2px solid white;
            "/>
          </div>
          <style>
            @keyframes ping {
              75%,100% { transform:scale(2.5); opacity:0; }
            }
          </style>`,
        iconSize:   [20, 20],
        iconAnchor: [10, 10],
      })}
    />
  );
}

export default function MapView({ reports = [], onMapClick, clickedPos }) {
  // Center on Gama Campus (FGA-UnB) by default
  const defaultCenter = [-15.9896, -48.0443];
  const defaultZoom   = 18;

  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      style={{ height: '100%', width: '100%', minHeight: '100dvh' }}
      zoomControl={false}
    >
      <TileLayer
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Existing reports as pins */}
      {reports.map(r => (
        <Marker
          key={r.id}
          position={[r.lat, r.lng]}
          icon={makeIcon(STATUS_COLORS[r.status] || URGENCY_COLORS[r.urgency] || '#f97316')}
        >
          <Popup>
            <div style={{ minWidth: 180 }}>
              {r.image && (
                <img
                  src={r.image}
                  alt={r.title}
                  style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }}
                />
              )}
              <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{r.title}</p>
              <p style={{ fontSize: 11, color: '#6b7280' }}>📂 {r.category}</p>
              <p style={{ fontSize: 11, color: '#6b7280' }}>⚡ {r.urgency} — {r.status}</p>
              <p style={{ fontSize: 11, color: '#6b7280' }}>👍 {r.likes} confirmações</p>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Pending click marker */}
      {clickedPos && <PendingMarker latlng={clickedPos} />}

      <ClickHandler onMapClick={onMapClick} />
    </MapContainer>
  );
}
