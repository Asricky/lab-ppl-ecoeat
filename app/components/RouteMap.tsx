"use client";

import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation } from 'lucide-react';

const customIconPickup = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const customIconDropoff = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const customIconCourier = new L.DivIcon({
  html: `<div style="background-color: #1e8932; width: 36px; height: 36px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; transform: translateY(-10px); transition: all 0.3s ease;">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
         </div>`,
  className: 'courier-live-marker',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

function MapController({ 
  center, 
  autoFollow, 
  setAutoFollow 
}: { 
  center: [number, number], 
  autoFollow: boolean,
  setAutoFollow: (val: boolean) => void 
}) {
  const map = useMap();

  useEffect(() => {
    if (autoFollow) {
      map.flyTo(center, 16, { animate: true, duration: 1.5 });
    }
  }, [center, autoFollow, map]);

  useMapEvents({
    dragstart: () => {
      setAutoFollow(false);
    }
  });

  return null;
}

export default function RouteMap({ 
  status = 'assigned', 
  currentLocation = null 
}: { 
  status?: string, 
  currentLocation?: [number, number] | null 
}) {
  const pickup: [number, number] = [-6.200000, 106.816666]; // Example
  const dropoff: [number, number] = [-6.210000, 106.820000];
  
  const [autoFollow, setAutoFollow] = useState(true);

  // If we have a live location and status is on_delivery, connect live to dropoff.
  const path: [number, number][] = (status === 'on_delivery' && currentLocation) 
    ? [currentLocation, dropoff] 
    : [pickup, dropoff];

  const lineColor = status === 'failed' ? '#dc2626' : '#1e8932';
  const showRoute = status !== 'assigned';

  const initialCenter = currentLocation || pickup;

  return (
    <div className="w-full h-full relative">
      <MapContainer 
        center={initialCenter} 
        zoom={14} 
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController center={currentLocation || pickup} autoFollow={autoFollow} setAutoFollow={setAutoFollow} />

        {status === 'assigned' && <Marker position={pickup} icon={customIconPickup} />}
        <Marker position={dropoff} icon={customIconDropoff} />
        
        {status === 'on_delivery' && currentLocation && (
          <Marker position={currentLocation} icon={customIconCourier} />
        )}

        {showRoute && (
          <Polyline positions={path} color={lineColor} weight={5} dashArray="8, 8" opacity={0.8} />
        )}
      </MapContainer>

      {/* Recenter Button overlay */}
      {!autoFollow && status === 'on_delivery' && (
        <button 
          onClick={() => setAutoFollow(true)}
          className="absolute top-6 right-6 z-[1000] bg-white text-ecoeat-primary px-4 py-3 rounded-xl font-bold shadow-lg border border-black/5 flex items-center gap-2 hover:bg-gray-50 transition-all animate-in fade-in"
        >
          <Navigation size={18} />
          Recenter
        </button>
      )}
    </div>
  );
}
