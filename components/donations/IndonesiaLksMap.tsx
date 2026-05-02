'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { MapPin } from 'lucide-react';
import type { DonationLocation } from '@/lib/donationLocations';
import { MapRecenter } from '@/components/donations/MapRecenter';
import 'leaflet/dist/leaflet.css';

const MapContainer = dynamic(
  () => import('react-leaflet').then((m) => m.MapContainer),
  { ssr: false, loading: () => <div className="h-[min(480px,70vh)] w-full bg-gray-100 animate-pulse rounded-2xl" /> }
);
const TileLayer = dynamic(() => import('react-leaflet').then((m) => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((m) => m.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((m) => m.Popup), { ssr: false });
const Circle = dynamic(() => import('react-leaflet').then((m) => m.Circle), { ssr: false });
const CircleMarker = dynamic(() => import('react-leaflet').then((m) => m.CircleMarker), { ssr: false });

const INDONESIA_CENTER: [number, number] = [-2.5489, 118.0149];

function zoomFromRadiusKm(radiusKm: number): number {
  if (radiusKm <= 0) return 5;
  if (radiusKm <= 10) return 11;
  if (radiusKm <= 25) return 10;
  if (radiusKm <= 50) return 9.5;
  if (radiusKm <= 100) return 9;
  if (radiusKm <= 250) return 7.5;
  return 6.5;
}

type Props = {
  locations: DonationLocation[];
  /** Titik acuan untuk jarak & lingkaran radius */
  referencePoint: [number, number] | null;
  /** km; 0 = tampil peta nasional tanpa lingkaran */
  radiusKm: number;
  distancesById: Record<number, number>;
};

/**
 * Peta Indonesia — OpenStreetMap + CARTO Voyager (open data, detail jelas).
 */
export function IndonesiaLksMap({ locations, referencePoint, radiusKm, distancesById }: Props) {
  const center: [number, number] = referencePoint ?? INDONESIA_CENTER;
  const zoom = referencePoint ? zoomFromRadiusKm(radiusKm) : 5;

  const showRadius = referencePoint != null && radiusKm > 0;

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-md bg-white h-full min-h-[320px]">
      <div className="flex items-center gap-2 px-4 py-3 bg-[#F3F8F2] border-b border-[#E2EFE5]">
        <MapPin className="text-[#1A5632] shrink-0" size={20} />
        <p className="text-sm font-bold text-gray-900">Peta lokasi</p>
      </div>
      <div className="h-[min(480px,65vh)] w-full isolate z-0 [&_.leaflet-container]:font-sans">
        <MapContainer
          center={center}
          zoom={zoom}
          minZoom={4}
          maxZoom={19}
          scrollWheelZoom
          style={{ height: '100%', width: '100%' }}
        >
          <MapRecenter center={center} zoom={zoom} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            subdomains="abcd"
            maxZoom={20}
          />
          {showRadius && referencePoint && (
            <Circle
              center={referencePoint}
              radius={radiusKm * 1000}
              pathOptions={{
                color: '#1A5632',
                weight: 2,
                fillColor: '#1A5632',
                fillOpacity: 0.06,
              }}
            />
          )}
          {referencePoint && (
            <CircleMarker
              center={referencePoint}
              radius={8}
              pathOptions={{
                color: '#1d4ed8',
                fillColor: '#3b82f6',
                fillOpacity: 1,
                weight: 2,
              }}
            >
              <Popup>Referensi jarak Anda</Popup>
            </CircleMarker>
          )}
          {locations.map((p) => {
            const d = distancesById[p.id];
            const distLabel =
              d !== undefined ? `${d.toFixed(1).replace('.', ',')} km` : '—';
            return (
              <Marker key={p.id} position={p.coords}>
                <Popup>
                  <span className="font-bold text-gray-900">{p.name}</span>
                  <br />
                  <span className="text-xs text-[#1A5632] font-semibold">{p.category}</span>
                  <br />
                  <span className="text-xs text-gray-600">Jarak: {distLabel}</span>
                  <br />
                  <span className="text-xs text-gray-600">{p.address}</span>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
