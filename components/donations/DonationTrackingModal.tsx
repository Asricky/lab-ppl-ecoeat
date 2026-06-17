'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  X,
  CheckCircle2,
  MapPin,
  MessageCircle,
  Leaf,
  Package,
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';

/* ── Lazy-load react-leaflet pieces (no SSR) ── */
const MapContainer = dynamic(
  () => import('react-leaflet').then((m) => m.MapContainer),
  { ssr: false, loading: () => <div className="h-full w-full bg-[#e8f0e8] animate-pulse" /> }
);
const TileLayer = dynamic(() => import('react-leaflet').then((m) => m.TileLayer), { ssr: false });
const Polyline  = dynamic(() => import('react-leaflet').then((m) => m.Polyline),  { ssr: false });
const Tooltip   = dynamic(() => import('react-leaflet').then((m) => m.Tooltip),   { ssr: false });

/* Custom marker via DivIcon — loaded client-side only */
const MarkerWithIcon = dynamic(
  () => import('./MarkerWithIcon'),
  { ssr: false }
);

export type DonationTrackingRow = {
  id: string;
  productName: string;
  category?: string;
  expiry?: string;
  weight: string;
  recipient: string;
  recipientImage: string;
  date: string;
  status: string;
  image: string;
  /** LKS coords — injected from donationLocations catalog */
  lksCoords?: [number, number];
  lksAddress?: string;

  // Real DB fields
  deliveryId?: string;
  deliveryStatus?: string;
  distanceKm?: number;
  estimatedArrival?: string;
  courierName?: string;
  courierAvatar?: string;
  courierPhone?: string;
  trackingLogs?: Array<{
    status: string;
    notes: string;
    time: string;
    latitude: number | null;
    longitude: number | null;
  }>;
};

type Props = {
  donation: DonationTrackingRow;
  onClose: () => void;
};

/* Seller / pickup point — offset from LKS */
function sellerStart(lks: [number, number]): [number, number] {
  return [lks[0] + 0.028, lks[1] - 0.026];
}

const COURIER_NAMES = ['Budi', 'Andi', 'Reza', 'Dian', 'Fajar'];
const COURIER_AVATARS = [
  'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=80&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&q=80',
];

function seededIndex(id: string, len: number) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) & 0xffff;
  return h % len;
}

export function DonationTrackingModal({ donation, onClose }: Props) {
  const lksCoords: [number, number] = donation.lksCoords ?? [-6.2, 106.8167];
  const start = sellerStart(lksCoords);

  // Find the latest coordinate from logs
  const latestLogWithCoords = [...(donation.trackingLogs || [])]
    .reverse()
    .find(log => log.latitude !== null && log.longitude !== null);
  
  const initialCourierCoords: [number, number] = latestLogWithCoords 
    ? [Number(latestLogWithCoords.latitude), Number(latestLogWithCoords.longitude)]
    : start;

  const [courier, setCourier] = useState<[number, number]>(initialCourierCoords);
  const [progress, setProgress] = useState(0);

  /* Simulate real-time courier movement */
  useEffect(() => {
    if (latestLogWithCoords) {
      setCourier([Number(latestLogWithCoords.latitude), Number(latestLogWithCoords.longitude)]);
      return;
    }
    let t = 0;
    const id = setInterval(() => {
      t = (t + 0.015) % 1;
      setProgress(t);
      setCourier([
        start[0] + (lksCoords[0] - start[0]) * t,
        start[1] + (lksCoords[1] - start[1]) * t,
      ]);
    }, 1000);
    return () => clearInterval(id);
  }, [donation.id, start, lksCoords, latestLogWithCoords]);

  const mapCenter: [number, number] = [
    (courier[0] + lksCoords[0]) / 2,
    (courier[1] + lksCoords[1]) / 2,
  ];

  const courierName = donation.courierName || COURIER_NAMES[seededIndex(donation.id, COURIER_NAMES.length)];
  const courierAvatar = donation.courierAvatar || COURIER_AVATARS[seededIndex(donation.id, COURIER_AVATARS.length)];

  const pct = Math.round(progress * 100);
  const isDelivered = donation.status.toLowerCase() === 'delivered' || donation.status.toLowerCase() === 'completed';

  const status = (donation.deliveryStatus || 'available_for_courier').toLowerCase();
  const logs = donation.trackingLogs || [];
  const assignedTime = logs.find(l => l.status.toLowerCase() === 'assigned' || l.status.toLowerCase() === 'available_for_courier')?.time || '10:30 AM';
  const pickedUpTime = logs.find(l => l.status.toLowerCase() === 'picked_up')?.time || (['picked_up', 'in_transit', 'delivered'].includes(status) ? '10:45 AM' : null);
  const inTransitTime = logs.find(l => l.status.toLowerCase() === 'in_transit')?.time || null;
  const deliveredTime = logs.find(l => l.status.toLowerCase() === 'delivered' || l.status.toLowerCase() === 'completed')?.time || (isDelivered ? donation.date : 'EST. 11:15 AM');

  const timeline = [
    { 
      label: 'Assigned',   
      sub: 'Courier matched',          
      time: assignedTime, 
      done: ['assigned', 'picked_up', 'in_transit', 'delivered'].includes(status) 
    },
    { 
      label: 'Picked up',  
      sub: 'Seller location',           
      time: pickedUpTime, 
      done: ['picked_up', 'in_transit', 'delivered'].includes(status) 
    },
    { 
      label: 'In Transit', 
      sub: 'Moving towards destination', 
      time: inTransitTime,       
      current: status === 'in_transit', 
      done: ['in_transit', 'delivered'].includes(status) 
    },
    { 
      label: 'Delivered',  
      sub: 'Hand-off verification',      
      time: deliveredTime, 
      done: status === 'delivered' 
    },
  ];

  const co2Saved = (parseFloat(donation.weight) * 0.05).toFixed(1);

  return (
    <div className="fixed inset-0 z-[200] flex items-stretch">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal — full-screen split layout */}
      <div className="relative z-10 flex w-full h-full md:h-[92vh] md:max-h-[92vh] md:m-auto md:rounded-3xl overflow-hidden shadow-2xl border border-gray-200 max-w-6xl">

        {/* ── LEFT: MAP ── */}
        <div className="flex-1 relative min-h-[300px]">
          <MapContainer
            center={mapCenter}
            zoom={12}
            scrollWheelZoom
            style={{ height: '100%', width: '100%' }}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              subdomains="abcd"
              maxZoom={20}
            />

            {/* Dashed route line */}
            <Polyline
              positions={[start, lksCoords]}
              pathOptions={{ color: '#1A5632', weight: 3, dashArray: '10 8', opacity: 0.7 }}
            />

            {/* Seller marker (amber) */}
            <MarkerWithIcon
              position={start}
              type="seller"
              label="Seller (Pickup)"
            />

            {/* LKS marker (green) */}
            <MarkerWithIcon
              position={lksCoords}
              type="lks"
              label={donation.recipient}
            />

            {/* Courier marker (animated pulse) */}
            <MarkerWithIcon
              position={courier}
              type="courier"
              label={`${courierName} (In Transit)`}
            />

            {/* CO2 badge floating on map */}
            <div className="leaflet-top leaflet-left" style={{ pointerEvents: 'none' }}>
              <div className="leaflet-control m-4">
                <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-2 border border-gray-100">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1A5632] animate-pulse" />
                  <span className="text-sm font-bold text-gray-800">{co2Saved}kg CO₂ saved this delivery</span>
                </div>
              </div>
            </div>
          </MapContainer>
        </div>

        {/* ── RIGHT: TRACKING PANEL ── */}
        <div className="w-full md:w-[380px] bg-[#F9FAFB] flex flex-col overflow-y-auto border-l border-gray-200 shrink-0">
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-100 bg-white">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Track Donation</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {donation.id} · {isDelivered ? 'Delivered' : 'Delivery in progress'}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 px-6 py-5 space-y-5">
            {/* Product card */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={donation.image} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 leading-snug line-clamp-2">{donation.productName}</p>
                <p className="text-sm text-gray-500 mt-0.5">{donation.weight}</p>
                <span className="inline-block mt-1.5 bg-[#E8F3EB] text-[#1A5632] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  {isDelivered ? 'Delivered' : 'Reserved'}
                </span>
              </div>
            </div>

            {/* Progress bar */}
            {!isDelivered && (
              <div>
                <div className="flex justify-between text-xs font-bold text-gray-500 mb-1.5">
                  <span>Progress</span>
                  <span className="text-[#1A5632]">{pct}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#1A5632] to-[#4ade80] rounded-full transition-all duration-1000"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )}

            {/* Deliver to */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Deliver to</p>
              <div className="flex items-start gap-3">
                <CheckCircle2 size={20} className="text-[#1A5632] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-gray-900">{donation.recipient} <span className="text-xs font-semibold text-[#1A5632]">(Verified LKS)</span></p>
                  {donation.lksAddress && (
                    <p className="text-sm text-gray-500 mt-0.5">{donation.lksAddress}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <MapPin size={11} />
                    {donation.lksCoords
                      ? `${(Math.random() * 3 + 1).toFixed(1)} km away`
                      : 'Location tracked'}
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Status</p>
              <div className="relative pl-3 space-y-5">
                <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-200" />
                {timeline.map((step, i) => (
                  <div key={i} className="relative flex items-start gap-4">
                    <div className={`w-3 h-3 rounded-full mt-1 ring-4 ring-white z-10 shrink-0 ${
                      step.done
                        ? 'bg-[#1A5632]'
                        : (step as { current?: boolean }).current
                        ? 'bg-[#1A5632] animate-pulse'
                        : 'bg-gray-300'
                    }`} />
                    <div className="flex-1 flex justify-between items-start">
                      <div>
                        <p className={`font-bold text-sm ${
                          (step as { current?: boolean }).current ? 'text-[#1A5632]' : step.done ? 'text-gray-900' : 'text-gray-400'
                        }`}>{step.label}</p>
                        <p className={`text-xs mt-0.5 ${
                          (step as { current?: boolean }).current ? 'text-[#1A5632]' : 'text-gray-400'
                        }`}>{step.sub}</p>
                      </div>
                      {(step as { current?: boolean }).current ? (
                        <span className="text-[10px] font-bold text-[#1A5632] bg-[#E8F3EB] px-2 py-0.5 rounded uppercase">Current</span>
                      ) : step.time ? (
                        <span className="text-xs font-bold text-gray-400">{step.time}</span>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Courier footer */}
          <div className="mt-auto bg-white border-t border-gray-100 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={courierAvatar} alt={courierName} className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm" />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#1A5632] rounded-full border-2 border-white" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">{courierName}</p>
                <p className="text-xs font-bold text-[#1A5632] flex items-center gap-1">
                  <Leaf size={11} /> Eco-Courier
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => alert(`Opening chat with ${courierName}...`)}
              className="w-10 h-10 rounded-full bg-[#E8F3EB] hover:bg-[#D1E8D7] flex items-center justify-center text-[#1A5632] transition-colors shadow-sm"
              aria-label="Chat with courier"
            >
              <MessageCircle size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
