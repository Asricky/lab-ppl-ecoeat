"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Truck,
  User,
  MessageCircle,
  Phone,
  Clock,
  Package,
} from 'lucide-react';
import { useProductStore } from '@/store/productStore';
import { DONATION_LOCATIONS } from '@/lib/donationLocations';
import 'leaflet/dist/leaflet.css';

const MapContainer = dynamic(
  () => import('react-leaflet').then((m) => m.MapContainer),
  { ssr: false, loading: () => <div className="h-full w-full bg-gray-100 animate-pulse" /> }
);
const TileLayer = dynamic(() => import('react-leaflet').then((m) => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((m) => m.Marker), { ssr: false });
const CircleMarker = dynamic(() => import('react-leaflet').then((m) => m.CircleMarker), { ssr: false });
const Polyline = dynamic(() => import('react-leaflet').then((m) => m.Polyline), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((m) => m.Popup), { ssr: false });

export default function DonationTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const { donations } = useProductStore();
  const donationId = params.id as string;

  const donation = donations.find((d: { id: string }) => d.id === donationId);
  const lksLocation = DONATION_LOCATIONS.find((loc) => loc.name === donation?.recipient);

  // Simulated seller location (Jakarta area)
  const sellerLocation: [number, number] = [-6.2, 106.816666];
  const lksCoords: [number, number] = lksLocation?.coords ?? [-6.21, 106.826666];

  // Simulated courier movement
  const [courierLocation, setCourierLocation] = useState<[number, number]>(sellerLocation);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 0.015;
        if (next > 1) return 1;
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setCourierLocation([
      sellerLocation[0] + (lksCoords[0] - sellerLocation[0]) * progress,
      sellerLocation[1] + (lksCoords[1] - sellerLocation[1]) * progress,
    ]);
  }, [progress, lksCoords]);

  const center: [number, number] = [
    (sellerLocation[0] + lksCoords[0]) / 2,
    (sellerLocation[1] + lksCoords[1]) / 2,
  ];

  const deliveryStatus = progress < 0.3 ? 'Picked up' : progress < 0.7 ? 'In Transit' : progress < 1 ? 'Arriving' : 'Delivered';

  if (!donation) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-500 font-medium mb-4">Donasi tidak ditemukan</p>
          <button
            onClick={() => router.back()}
            className="text-[#1A5632] font-bold hover:underline"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen -m-8 flex flex-col md:flex-row overflow-hidden bg-gray-50">
      {/* Map Area (Left/Main) */}
      <div className="md:w-2/3 relative flex-1 h-full z-0 bg-white">
        <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            subdomains="abcd"
            maxZoom={20}
          />

          {/* Seller location */}
          <Marker position={sellerLocation}>
            <Popup>
              <div className="text-center">
                <p className="font-bold text-gray-900">Verdant Bakery</p>
                <p className="text-xs text-gray-500">Lokasi Penjual</p>
              </div>
            </Popup>
          </Marker>

          {/* LKS location */}
          <Marker position={lksCoords}>
            <Popup>
              <div className="text-center">
                <p className="font-bold text-gray-900">{donation.recipient}</p>
                <p className="text-xs text-gray-500">Lokasi Penerima</p>
              </div>
            </Popup>
          </Marker>

          {/* Courier location (animated) */}
          <CircleMarker
            center={courierLocation}
            radius={12}
            pathOptions={{
              color: '#1A5632',
              fillColor: '#4ade80',
              fillOpacity: 1,
              weight: 3,
            }}
          >
            <Popup>
              <div className="text-center">
                <p className="font-bold text-gray-900">Marcus (Kurir)</p>
                <p className="text-xs text-[#1A5632]">{deliveryStatus}</p>
              </div>
            </Popup>
          </CircleMarker>

          {/* Route line */}
          <Polyline
            positions={[sellerLocation, lksCoords]}
            pathOptions={{ color: '#f59e0b', weight: 4, opacity: 0.6 }}
          />
          <Polyline
            positions={[sellerLocation, courierLocation]}
            pathOptions={{ color: '#1A5632', weight: 4 }}
          />
        </MapContainer>

        {/* Floating UI over map */}
        <div className="absolute top-6 left-6 z-[400]">
          <button
            onClick={() => router.back()}
            className="bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-xl shadow-lg text-sm font-bold text-gray-700 hover:text-[#1A5632] hover:shadow-xl transition-all border border-gray-100 flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Kembali
          </button>
        </div>

        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-[400]">
          <div className="bg-white/95 backdrop-blur-md px-5 py-3 rounded-xl shadow-lg border border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">
              CO₂ Saved
            </p>
            <p className="text-lg font-extrabold text-[#1A5632]">1.2kg</p>
          </div>
        </div>
      </div>

      {/* Tracking Panel (Right) */}
      <div className="md:w-1/3 bg-white border-l border-gray-200 flex flex-col h-full overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Track Harvest Distribution</h1>
          <p className="text-sm text-gray-500 font-medium">
            Order #{donation.id} • {deliveryStatus}
          </p>
        </div>

        {/* Product Card */}
        <div className="p-6 border-b border-gray-100">
          <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-4 border border-gray-100">
            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-white border border-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={donation.image}
                alt={donation.productName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 text-sm leading-tight">{donation.productName}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{donation.weight}</p>
              <span className="inline-block bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mt-1">
                {donation.status}
              </span>
            </div>
          </div>
        </div>

        {/* Deliver To */}
        <div className="p-6 border-b border-gray-100">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Deliver To</h4>
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <CheckCircle2 size={20} className="text-[#1A5632]" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900">{donation.recipient}</h3>
              <p className="text-xs text-gray-500 mt-1">{lksLocation?.address || 'Alamat tidak tersedia'}</p>
              <div className="flex items-center text-xs font-medium text-gray-400 mt-2">
                <MapPin size={12} className="mr-1" />
                {lksLocation ? '2.4 km away' : 'Jarak tidak tersedia'}
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Stepper */}
        <div className="p-6 flex-1">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Delivery Status</h4>
          <div className="relative pl-3 space-y-6">
            <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-200"></div>

            {/* Assigned */}
            <div className="relative flex items-start gap-4">
              <div className="w-3 h-3 bg-[#1A5632] rounded-full mt-1.5 ring-4 ring-white z-10"></div>
              <div className="flex-1 flex justify-between">
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Assigned</h4>
                  <p className="text-xs text-gray-500">Courier matched</p>
                </div>
                <span className="text-xs font-bold text-gray-400">10:30 AM</span>
              </div>
            </div>

            {/* Picked up */}
            <div className="relative flex items-start gap-4">
              <div className={`w-3 h-3 rounded-full mt-1.5 ring-4 ring-white z-10 ${progress >= 0.1 ? 'bg-[#1A5632]' : 'bg-gray-300'}`}></div>
              <div className="flex-1 flex justify-between">
                <div>
                  <h4 className={`font-bold text-sm ${progress >= 0.1 ? 'text-gray-900' : 'text-gray-400'}`}>Picked up</h4>
                  <p className="text-xs text-gray-500">Verdant Bakery</p>
                </div>
                <span className="text-xs font-bold text-gray-400">10:45 AM</span>
              </div>
            </div>

            {/* In Transit */}
            <div className="relative flex items-start gap-4">
              <div className={`w-3 h-3 rounded-full mt-1.5 ring-4 z-10 ${progress >= 0.3 && progress < 1 ? 'bg-[#1A5632] ring-[#E8F3EB] animate-pulse' : progress >= 1 ? 'bg-[#1A5632] ring-white' : 'bg-gray-300 ring-white'}`}></div>
              <div className="flex-1 flex justify-between">
                <div>
                  <h4 className={`font-bold text-sm ${progress >= 0.3 ? 'text-[#1A5632]' : 'text-gray-400'}`}>In Transit</h4>
                  <p className={`text-xs ${progress >= 0.3 ? 'text-[#1A5632]' : 'text-gray-400'}`}>Moving towards destination</p>
                </div>
                {progress >= 0.3 && progress < 1 && (
                  <span className="text-[10px] font-bold text-[#1A5632] bg-[#E8F3EB] px-2 py-0.5 rounded uppercase">CURRENT</span>
                )}
              </div>
            </div>

            {/* Delivered */}
            <div className="relative flex items-start gap-4">
              <div className={`w-3 h-3 rounded-full mt-1.5 ring-4 ring-white z-10 ${progress >= 1 ? 'bg-[#1A5632]' : 'bg-gray-300'}`}></div>
              <div className="flex-1 flex justify-between">
                <div>
                  <h4 className={`font-bold text-sm ${progress >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>Delivered</h4>
                  <p className={`text-xs ${progress >= 1 ? 'text-gray-500' : 'text-gray-400'}`}>Hand-off verification</p>
                </div>
                <span className="text-xs font-bold text-gray-400">EST. 11:15 AM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Courier Profile */}
        <div className="mt-auto bg-gray-50 border-t border-gray-100 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 border-2 border-white shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80"
                alt="Marcus"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Marcus</h4>
              <p className="text-xs font-bold text-[#1A5632] flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-[#1A5632] rounded-full"></span>
                Eco-Courier
              </p>
            </div>
          </div>
          <button
            onClick={() => alert('Opening chat with Marcus...')}
            className="w-10 h-10 rounded-full bg-[#E8F3EB] hover:bg-[#D1E8D7] flex items-center justify-center text-[#1A5632] transition-colors shadow-sm"
          >
            <MessageCircle size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
