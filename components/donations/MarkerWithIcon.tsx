'use client';

import { useEffect, useState } from 'react';
import { Marker, Tooltip } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';

type Props = {
  position: LatLngExpression;
  type: 'seller' | 'lks' | 'courier';
  label: string;
};

export default function MarkerWithIcon({ position, type, label }: Props) {
  const [L, setL] = useState<typeof import('leaflet') | null>(null);

  useEffect(() => {
    import('leaflet').then((leaflet) => setL(leaflet));
  }, []);

  if (!L) return null;

  let iconHtml = '';
  if (type === 'courier') {
    iconHtml = `
      <div style="position:relative; width:36px; height:36px;">
        <div style="position:absolute; width:100%; height:100%; border-radius:50%; border:2px solid #1A5632; animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
        <div style="background:#1A5632; width:36px; height:36px; border-radius:50%; border:4px solid white; box-shadow:0 4px 8px rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center;">
          <div style="width:12px; height:12px; background:white; border-radius:50%;"></div>
        </div>
      </div>
      <style>@keyframes ping { 75%, 100% { transform:scale(1.5); opacity:0; } }</style>
    `;
  } else if (type === 'seller') {
    iconHtml = `
      <div style="background:#f59e0b; width:28px; height:28px; border-radius:50%; border:3px solid white; box-shadow:0 3px 6px rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center;">
        <div style="width:8px; height:8px; background:white; border-radius:50%;"></div>
      </div>
    `;
  } else {
    // lks
    iconHtml = `
      <div style="background:#16a34a; width:28px; height:28px; border-radius:50%; border:3px solid white; box-shadow:0 3px 6px rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center;">
        <div style="width:8px; height:8px; background:white; border-radius:50%;"></div>
      </div>
    `;
  }

  const icon = L.divIcon({
    className: 'custom-div-icon',
    html: iconHtml,
    iconSize: type === 'courier' ? [36, 36] : [28, 28],
    iconAnchor: type === 'courier' ? [18, 18] : [14, 14],
  });

  return (
    <Marker position={position} icon={icon}>
      <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
        <span className="text-xs font-bold">{label}</span>
      </Tooltip>
    </Marker>
  );
}
