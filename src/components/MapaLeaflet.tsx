'use client'

import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, CircleMarker, Circle, Popup, Tooltip } from 'react-leaflet'
import {
  MANAUS_CENTRO,
  MANAUS_ZOOM,
  corPorTipo,
  type ZonaInfo,
} from '@/lib/ocorrencias'

interface ZonaConcentracao extends ZonaInfo {
  total: number
}

interface PontoMapa {
  id: number
  tipo: string
  zona: string
  bairro: string
  lat: number
  lng: number
  data: string
  status?: string
  descricao?: string
  hora?: number
}

export default function MapaLeaflet({
  ocorrencias,
  zonas,
  corResolver,
  center = MANAUS_CENTRO,
  zoom = MANAUS_ZOOM,
  raioPonto = 6,
  heatmap = false,
}: {
  ocorrencias: PontoMapa[]
  zonas: ZonaConcentracao[]
  corResolver?: (tipo: string) => string
  center?: [number, number]
  zoom?: number
  raioPonto?: number
  heatmap?: boolean
}) {
  const cores = corResolver ?? ((t: string) => corPorTipo(t as never))
  const maxZona = Math.max(1, ...zonas.map((z) => z.total))

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={false}
      style={{ height: '100%', width: '100%', background: '#0A1628' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Concentração por zona de Manaus (oculta no modo heatmap) */}
      {!heatmap &&
        zonas
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

      {/* Modo HEATMAP: glow radial sobreposto cria sensação de densidade */}
      {heatmap &&
        ocorrencias.map((o) => (
          <CircleMarker
            key={`heat-${o.id}`}
            center={[o.lat, o.lng]}
            radius={26}
            pathOptions={{
              stroke: false,
              fillColor: '#F97316',
              fillOpacity: 0.18,
            }}
          />
        ))}
      {heatmap &&
        ocorrencias.map((o) => (
          <CircleMarker
            key={`heat-core-${o.id}`}
            center={[o.lat, o.lng]}
            radius={11}
            pathOptions={{
              stroke: false,
              fillColor: '#FBBF24',
              fillOpacity: 0.35,
            }}
          />
        ))}

      {/* Ocorrências individuais (modo pontos) */}
      {!heatmap &&
        ocorrencias.map((o) => {
          const cor = cores(o.tipo)
          return (
            <CircleMarker
              key={o.id}
              center={[o.lat, o.lng]}
              radius={raioPonto}
              pathOptions={{ color: cor, weight: 1, fillColor: cor, fillOpacity: 0.85 }}
            >
              <Popup>
                <div style={{ fontSize: 13, lineHeight: 1.5 }}>
                  <strong>{o.tipo}</strong>
                  <br />
                  {o.bairro}
                  {o.zona ? ` · Zona ${o.zona}` : ''}
                  {o.descricao && (
                    <>
                      <br />
                      <span style={{ color: '#334155' }}>{o.descricao}</span>
                    </>
                  )}
                  {(o.data || o.status) && (
                    <>
                      <br />
                      <span style={{ color: '#64748B' }}>
                        {o.data ? new Date(o.data + 'T00:00:00').toLocaleDateString('pt-BR') : ''}
                        {o.data && typeof o.hora === 'number' ? ` · ${String(o.hora).padStart(2, '0')}h` : ''}
                        {o.status ? ` · ${o.status}` : ''}
                      </span>
                    </>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          )
        })}
    </MapContainer>
  )
}
