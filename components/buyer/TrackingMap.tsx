"use client";
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet marker icons
const iconSeller = L.divIcon({
  className: 'custom-icon',
  html: `<div style="background: white; border: 2px solid #15803d; border-radius: 8px; padding: 4px 8px; font-size: 10px; font-weight: bold; color: #15803d; display: flex; align-items: center; white-space: nowrap; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#15803d" stroke-width="2" style="margin-right:4px;"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg> SELLER<br/>Artisan Bakery Co.</div>`,
  iconAnchor: [50, 40]
});

const iconHome = L.divIcon({
  className: 'custom-icon',
  html: `<div style="background: white; border: 2px solid #15803d; border-radius: 8px; padding: 4px 8px; font-size: 10px; font-weight: bold; color: #15803d; display: flex; align-items: center; white-space: nowrap; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#15803d" stroke-width="2" style="margin-right:4px;"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg> DESTINATION<br/>Home</div>`,
  iconAnchor: [50, 40]
});

const iconCourier = L.divIcon({
  className: 'custom-icon',
  html: `<div style="background: #15803d; color: white; border-radius: 12px; padding: 4px 10px; font-size: 12px; font-weight: bold; display: flex; align-items: center; white-space: nowrap; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" style="margin-right:6px;"><path d="M5 12h14M12 5l7 7-7 7"></path></svg> Marco is here</div>`,
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
      <Marker position={sellerPos} icon={iconSeller} />
      
      {deliveryMethod === 'delivery' && (
        <>
          <Marker position={homePos} icon={iconHome} />
          <Marker position={courierPos} icon={iconCourier} />
          <Polyline positions={[sellerPos, courierPos, homePos]} color="#15803d" dashArray="5, 10" weight={3} />
        </>
      )}
    </MapContainer>
  );
}
