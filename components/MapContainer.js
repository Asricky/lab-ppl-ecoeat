"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Dynamically import Leaflet components to avoid SSR issues
const Map = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

export default function MapContainer({ locations }) {
  const [L, setL] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    import('leaflet').then((leaflet) => {
      // Fix leaflet marker icon issue
      delete leaflet.Icon.Default.prototype._getIconUrl;
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });
      setL(leaflet);
    });
  }, []);

  if (!L) return (
    <div className="h-[450px] w-full bg-gray-50 animate-pulse rounded-3xl flex flex-col items-center justify-center text-gray-400 border border-gray-100">
      <svg className="w-10 h-10 mb-3 animate-spin text-green-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
      Loading Map...
    </div>
  );

  const defaultCenter = [-6.200000, 106.816666]; // Jakarta

  const getCustomIcon = (type) => {
    const isSeller = type === 'seller';
    const color = isSeller ? '#f59e0b' : '#16a34a'; // Amber for seller, Green for LKS
    return L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; box-shadow: 0 3px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
          <div style="width: 8px; height: 8px; background-color: white; border-radius: 50%;"></div>
        </div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });
  };

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 1500);
  };

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-sm border border-gray-200 group">
      <Map center={defaultCenter} zoom={13} style={{ height: '450px', width: '100%', zIndex: 1 }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" // Cleaner map style
        />
        {locations?.map((loc, idx) => (
          <Marker key={idx} position={[loc.lat, loc.lng]} icon={getCustomIcon(loc.type)}>
            <Popup className="custom-popup">
              <div className="p-1">
                <div className="font-bold text-gray-800 text-sm mb-1">{loc.name}</div>
                <div className="text-xs px-2 py-0.5 rounded-full inline-block font-medium mb-2" style={{
                  backgroundColor: loc.type === 'seller' ? '#fef3c7' : '#dcfce3',
                  color: loc.type === 'seller' ? '#d97706' : '#166534'
                }}>
                  {loc.type === 'seller' ? 'Penjual' : 'Lembaga (LKS)'}
                </div>
                <button className="w-full text-xs bg-gray-900 text-white py-1.5 rounded-md mt-1 hover:bg-gray-800 transition-colors">
                  Lihat Detail
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </Map>
      
      {/* Floating UI over map */}
      <div className="absolute top-5 left-1/2 transform -translate-x-1/2 z-[400]">
        <button 
          onClick={handleSearch}
          className="bg-white/95 backdrop-blur-md px-6 py-2.5 rounded-full shadow-lg text-sm font-semibold text-gray-700 hover:text-green-600 hover:shadow-xl hover:scale-105 transition-all border border-gray-100 flex items-center group-hover:translate-y-1"
        >
          {isSearching ? (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          ) : (
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 mr-2.5 animate-pulse"></span>
          )}
          {isSearching ? 'Mencari...' : 'Search in this area'}
        </button>
      </div>

      <div className="absolute bottom-5 right-5 z-[400] bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-lg border border-gray-100 text-xs font-medium space-y-2">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-amber-500 mr-2 border border-white shadow-sm"></div>
          <span className="text-gray-600">Seller Surplus</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-600 mr-2 border border-white shadow-sm"></div>
          <span className="text-gray-600">Lembaga LKS</span>
        </div>
      </div>
    </div>
  );
}
