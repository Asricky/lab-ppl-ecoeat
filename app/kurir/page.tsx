import { redirect } from 'next/navigation';

<<<<<<< HEAD:app/kurir/page.tsx
import React, { useState } from 'react';
import CourierLayout from '@/components/CourierLayout';
import ActiveTaskCard from '@/components/ActiveTaskCard';
import AssignedDeliveryList from '@/components/AssignedDeliveryList';
import ImpactWidget from '@/components/ImpactWidget';
import { useAuthStore } from "@/store/authStore";

export default function KurirDashboardPage() {
  const [isOnline, setIsOnline] = useState(true);
  const { user } = useAuthStore();
  
  return (
    <CourierLayout>
      <div className="max-w-6xl mx-auto py-2">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-xs font-bold text-ecoeat-muted uppercase tracking-widest mb-1">CURRENT STATUS</p>
            <h1 className="text-4xl font-extrabold text-ecoeat-text mb-1">Hello, {user?.name || 'Courier'}</h1>
            <p className="text-ecoeat-muted font-medium">EcoPay Balance: Rp {(user?.ecoPayBalance || 0).toLocaleString()}</p>
          </div>
          
          <div className="flex items-center bg-white rounded-full p-1 shadow-sm border border-black/5">
            <button 
              onClick={() => setIsOnline(true)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                isOnline ? 'bg-[#006824] text-white shadow-md' : 'text-ecoeat-muted hover:text-ecoeat-text'
              }`}
            >
              Online
            </button>
            <button 
              onClick={() => setIsOnline(false)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                !isOnline ? 'bg-gray-200 text-ecoeat-text shadow-md' : 'text-ecoeat-muted hover:text-ecoeat-text'
              }`}
            >
              Offline
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Active Task & Assigned List */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div>
              <ActiveTaskCard />
            </div>
            <AssignedDeliveryList />
          </div>

          {/* Right Column: Map & Impact Widget */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            {/* Map Placeholder */}
            <div className="bg-[#bce6ef] h-[320px] rounded-[24px] relative overflow-hidden shadow-sm border border-black/5 flex items-center justify-center">
              {/* Fake Map Image (using a solid color or gradient for now, can be replaced with real Leaflet map later) */}
              <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
              
              {/* Traffic Overlay */}
              <div className="absolute top-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 flex items-center gap-3 shadow-md z-10">
                <div className="w-10 h-10 bg-[#1e8932] rounded-full flex items-center justify-center text-white shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div>
                  <p className="font-bold text-ecoeat-text text-sm">Traffic: Light</p>
                  <p className="text-[10px] font-semibold text-ecoeat-muted">Optimized via Eco-Path</p>
                </div>
                <div className="ml-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ecoeat-primary"><circle cx="12" cy="12" r="10"/><path d="m12 16 4-4-4-4"/><path d="M8 12h8"/></svg>
                </div>
              </div>

              <div className="text-[#1e8932] font-bold opacity-70 z-0">
                [ Map Area ]
              </div>
            </div>

            <ImpactWidget />
          </div>

        </div>
      </div>
    </CourierLayout>
  );
=======
export default function CourierRoot() {
  redirect('/dashboard/kurir/home');
>>>>>>> origin/Alya:app/dashboard/kurir/page.tsx
}
