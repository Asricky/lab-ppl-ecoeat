'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Truck } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

const MapContainer = dynamic(
  () => import('react-leaflet').then((m) => m.MapContainer),
  { ssr: false, loading: () => <div className="h-56 w-full bg-gray-100 animate-pulse rounded-xl" /> }
);
const TileLayer = dynamic(() => import('react-leaflet').then((m) => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((m) => m.Marker), { ssr: false });
const CircleMarker = dynamic(() => import('react-leaflet').then((m) => m.CircleMarker), { ssr: false });
const Polyline = dynamic(() => import('react-leaflet').then((m) => m.Polyline), { ssr: false });

/** Simulated courier moving toward LKS (demo real-time tracking). */
export function CourierLiveMap({ dest, label }: { dest: [number, number]; label: string }) {
  const [courier, setCourier] = useState<[number, number]>(() => [
    dest[0] + 0.028,
    dest[1] - 0.026,
  ]);

  useEffect(() => {
    const start: [number, number] = [dest[0] + 0.028, dest[1] - 0.026];
    let t = 0;
    const id = setInterval(() => {
      t += 0.06;
      if (t > 1) t = 0;
      setCourier([
        start[0] + (dest[0] - start[0]) * t,
        start[1] + (dest[1] - start[1]) * t,
      ]);
    }, 1200);
    return () => clearInterval(id);
  }, [dest]);

  const center: [number, number] = [
    (courier[0] + dest[0]) / 2,
    (courier[1] + dest[1]) / 2,
  ];

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
      <div className="bg-[#F3F8F2] px-4 py-2 flex items-center gap-2 border-b border-[#E2EFE5]">
        <Truck size={18} className="text-[#1A5632]" />
        <span className="text-sm font-bold text-gray-800">{label}</span>
      </div>
      <div className="h-56 w-full isolate z-0">
        <MapContainer
          center={center}
          zoom={12}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            subdomains="abcd"
            maxZoom={20}
          />
          <Marker position={dest} />
          <CircleMarker
            center={courier}
            radius={11}
            pathOptions={{
              color: '#1d4ed8',
              fillColor: '#3b82f6',
              fillOpacity: 1,
              weight: 2,
            }}
          />
          <Polyline positions={[courier, dest]} pathOptions={{ color: '#1A5632', weight: 3, dashArray: '8 8' }} />
        </MapContainer>
      </div>
    </div>
  );
}
