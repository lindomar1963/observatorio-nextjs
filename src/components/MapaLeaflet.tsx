'use client'

import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, CircleMarker, Circle, Popup, Tooltip } from 'react-leaflet'
import {
  MANAUS_CENTRO,
  MANAUS_ZOOM,
  corPorTipo,
  type Ocorrencia,
  type ZonaInfo,
} from '@/lib/ocorrencias'

interface ZonaConcentracao extends ZonaInfo {
  total: number
}

export default function MapaLeaflet({
  ocorrencias,
  zonas,
}: {
  ocorrencias: Ocorrencia[]
  zonas: ZonaConcentracao[]
}) {
  const maxZona = Math.max(1, ...zonas.map((z) => z.total))

  return (
    <MapContainer
      center={MANAUS_CENTRO}
      zoom={MANAUS_ZOOM}
      scrollWheelZoom
      style={{ height: '100%', width: '100%', background: '#0A1628' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Concentração por zona de Manaus */}
      {zonas
        .filter((z) => z.total > 0)
        .map((z) => (
          <Circle
            key={z.zona}
            center={z.centro}
            radius={900 + (z.total / maxZona) * 2600}
            pathOptions={{
              color: '#C9963B',
              weight: 1,
              fillColor: '#C9963B',
              fillOpacity: 0.12 + (z.total / maxZona) * 0.18,
            }}
          >
            <Tooltip direction="center" permanent className="zona-tooltip">
              {`${z.zona} · ${z.total}`}
            </Tooltip>
          </Circle>
        ))}

      {/* Ocorrências individuais */}
      {ocorrencias.map((o) => {
        const cor = corPorTipo(o.tipo)
        return (
          <CircleMarker
            key={o.id}
            center={[o.lat, o.lng]}
            radius={6}
            pathOptions={{ color: cor, weight: 1, fillColor: cor, fillOpacity: 0.85 }}
          >
            <Popup>
              <div style={{ fontSize: 13, lineHeight: 1.5 }}>
                <strong>{o.tipo}</strong>
                <br />
                {o.bairro} · Zona {o.zona}
                <br />
                <span style={{ color: '#64748B' }}>
                  {new Date(o.data + 'T00:00:00').toLocaleDateString('pt-BR')}
                </span>
              </div>
            </Popup>
          </CircleMarker>
        )
      })}
    </MapContainer>
  )
}
