"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, CheckCircle2, Clock, Truck, Store, Map } from 'lucide-react';
import { useDonationStore } from '@/store/donationStore';
import { useTaskStore } from '@/store/taskStore';
import dynamic from 'next/dynamic';

const MapContainer = dynamic(() => import('@/components/kurir/MapContainer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center text-gray-400 font-semibold rounded-xl">
      Loading Live Tracking...
    </div>
  )
});

export default function LksTrackingDetail() {
  const params = useParams();
  const { tasks } = useTaskStore();
  const { donations } = useDonationStore();
  const [donationData, setDonationData] = useState<any>(null);
  const [courierStatus, setCourierStatus] = useState<any>(null);
  
  useEffect(() => {
    const resolvedId = Array.isArray(params.id) ? params.id[0] : params.id;
    if (resolvedId) {
      const foundDonation = donations.find(d => d.id === resolvedId);
      if (foundDonation) setDonationData(foundDonation);

      const foundCourierTask = tasks.find(t => t.id === resolvedId);
      if (foundCourierTask) setCourierStatus(foundCourierTask);
    }
  }, [params, tasks]);

  if (!donationData) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <p className="text-emerald-950 font-bold text-xl">Donation Not Found</p>
        <Link href="/lks-panti/home" className="px-6 py-2 bg-emerald-900 text-white font-bold rounded-xl">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  // Simulated map points for the courier tracking
  const mapPoints = [
    { lat: -6.2, lng: 106.816, type: 'seller', name: donationData.donor },
    { lat: -6.206, lng: 106.822, type: 'courier', name: 'Courier' },
    { lat: -6.21, lng: 106.826, type: 'lks', name: 'Yayasan Berbagi' },
  ];

  return (
    <div className="space-y-6 relative">
      {/* Main Content */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/lks-panti/home" className="p-2 bg-white rounded-full border border-black/5 hover:bg-emerald-50 text-emerald-950 transition-colors shadow-sm">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1">REAL-TIME COURIER TRACKING</p>
          <h1 className="text-3xl font-extrabold text-emerald-950">
            Donation #{donationData.id}
          </h1>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map Column */}
        <div className="lg:col-span-2 bg-white rounded-[24px] border border-black/5 p-2 shadow-sm min-h-[500px] relative">
          {courierStatus?.status === 'completed' && (
            <div className="absolute inset-0 z-20 bg-white/70 backdrop-blur-md rounded-[24px] flex flex-col items-center justify-center animate-in fade-in">
              <div className="w-24 h-24 bg-[#eaf4eb] rounded-full flex items-center justify-center border-4 border-white shadow-xl mb-4">
                <CheckCircle2 size={48} className="text-[#388e3c]" />
              </div>
              <h2 className="text-3xl font-extrabold text-emerald-950">Donasi Telah Tiba!</h2>
              <p className="text-emerald-700 font-bold mt-2">Kurir telah berhasil menyelesaikan pengantaran.</p>
            </div>
          )}
          <div className="h-full rounded-2xl overflow-hidden relative">
             <MapContainer locations={mapPoints} showRoute={true} />
          </div>
        </div>
        
        {/* Info Column */}
        <div className="bg-white rounded-[24px] shadow-sm border border-black/5 p-6 space-y-6">
          {/* Driver Panel */}
          <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl flex items-center gap-4">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="Driver" className="w-12 h-12 bg-white rounded-full shadow-sm border border-emerald-100" />
            <div>
              <p className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider mb-0.5">KURIR PENGANTAR</p>
              <p className="font-extrabold text-emerald-950 text-base leading-tight">Alex Green</p>
              <p className="text-xs font-medium text-slate-600 mt-1">Honda Beat • <span className="text-emerald-700 font-extrabold">B 1420 ECO</span></p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-extrabold text-emerald-950 flex items-center gap-2">
              <Map size={20} className="text-emerald-700" /> Detail Donasi
            </h2>
          </div>
          
          <div className="space-y-4 border-b border-gray-100 pb-6">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Produk Makanan</p>
              <p className="font-extrabold text-emerald-950 text-lg">{donationData.product}</p>
            </div>
            <div className="flex gap-4">
              <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Jumlah</p>
                <p className="font-bold text-emerald-950">{donationData.amountKg} kg</p>
              </div>
              <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Status</p>
                <p className="font-bold text-emerald-700">
                  {courierStatus?.status === 'completed' ? 'Completed' : 'On Delivery'}
                </p>
              </div>
            </div>
          </div>

          <div className="relative pl-6 space-y-8 pb-4">
            <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gray-200"></div>
            
            {/* Pickup Node */}
            <div className="relative">
              <div className="absolute -left-[27px] top-1 w-4 h-4 rounded-full bg-emerald-100 border border-emerald-500 flex items-center justify-center">
                 <div className="w-2 h-2 rounded-full bg-emerald-700"></div>
              </div>
              <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">DARI (DONOR)</p>
              <p className="font-bold text-emerald-950 text-sm leading-tight flex items-center gap-2">
                <Store size={14} className="text-emerald-600" /> {donationData.donor}
              </p>
            </div>
            
            {/* Destination Node */}
            <div className="relative">
              <div className="absolute -left-[27px] top-1 w-4 h-4 rounded-full bg-gray-100 border border-gray-400 flex items-center justify-center">
                 <div className="w-2 h-2 rounded-full bg-gray-600"></div>
              </div>
              <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">TUJUAN</p>
              <p className="font-bold text-emerald-950 text-sm leading-tight">Yayasan Berbagi (LKS)</p>
            </div>
          </div>
          
          <div className="pt-6 border-t border-gray-100">
             <div className="bg-[#F2F6F0] p-4 rounded-xl border border-emerald-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-emerald-600 shadow-sm">
                    <Truck size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider mb-0.5">STATUS KURIR</p>
                    <p className="font-extrabold text-emerald-950">
                      {courierStatus?.status === 'completed' ? 'Tiba di Lokasi' : donationData.status === 'Accepted' ? 'Sedang Dijemput' : 'Menunggu Konfirmasi'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider mb-0.5">ETA</p>
                  <p className="font-extrabold text-emerald-950 text-lg flex items-center gap-1">
                    <Clock size={16} className="text-emerald-600" /> {donationData.eta}
                  </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
