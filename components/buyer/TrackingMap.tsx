"use client";
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet marker icons to match the circular green/orange design
const iconSeller = L.divIcon({
  className: 'custom-div-icon-seller',
  html: `
    <div style="background:#f59e0b; width:28px; height:28px; border-radius:50%; border:3px solid white; box-shadow:0 3px 6px rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center;">
      <div style="width:8px; height:8px; background:white; border-radius:50%;"></div>
    </div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const iconHome = L.divIcon({
  className: 'custom-div-icon-home',
  html: `
    <div style="background:#16a34a; width:28px; height:28px; border-radius:50%; border:3px solid white; box-shadow:0 3px 6px rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center;">
      <div style="width:8px; height:8px; background:white; border-radius:50%;"></div>
    </div>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const iconCourier = L.divIcon({
  className: 'custom-div-icon-courier',
  html: `
    <div style="position:relative; width:36px; height:36px;">
      <div style="position:absolute; width:100%; height:100%; border-radius:50%; border:2px solid #1A5632; animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
      <div style="background:#1A5632; width:36px; height:36px; border-radius:50%; border:4px solid white; box-shadow:0 4px 8px rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center;">
        <div style="width:12px; height:12px; background:white; border-radius:50%;"></div>
      </div>
    </div>
    <style>@keyframes ping { 75%, 100% { transform:scale(1.5); opacity:0; } }</style>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

export default function TrackingMap({ deliveryMethod }: { deliveryMethod: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-full h-full bg-[#e1e8d5] animate-pulse"></div>;

  const sellerPos: [number, number] = [-6.200, 106.816];
  const homePos: [number, number] = [-6.210, 106.820];
  const courierPos: [number, number] = [-6.205, 106.818];

  return (
    <MapContainer center={[-6.205, 106.818]} zoom={14} style={{ height: '100%', width: '100%', zIndex: 1 }} zoomControl={false}>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      <Marker position={sellerPos} icon={iconSeller}>
        <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
          <span className="text-xs font-bold">Seller (Artisan Bakery Co.)</span>
        </Tooltip>
      </Marker>
      
      {deliveryMethod === 'delivery' && (
        <>
          <Marker position={homePos} icon={iconHome}>
            <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
              <span className="text-xs font-bold">Destination (Home)</span>
            </Tooltip>
          </Marker>
          <Marker position={courierPos} icon={iconCourier}>
            <Tooltip direction="top" offset={[0, -10]} opacity={0.9}>
              <span className="text-xs font-bold">Marco (In Transit)</span>
            </Tooltip>
          </Marker>
          <Polyline positions={[sellerPos, courierPos, homePos]} color="#15803d" dashArray="5, 10" weight={3} />
        </>
      )}
    </MapContainer>
  );
}
