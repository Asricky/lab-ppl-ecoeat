"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CourierLayout from '@/app/components/CourierLayout';
import { dummyOrders } from '@/lib/data';
import { Map, Clock, Wallet, Navigation, MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import RouteMap to avoid SSR issues with Leaflet
const RouteMap = dynamic(() => import('@/app/components/RouteMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center text-gray-400 font-semibold rounded-xl">
      Loading Map...
    </div>
  )
});

export default function TasksDashboard() {
  const router = useRouter();


  // Active delivery logic: find the first in_progress task
  const activeTask = dummyOrders.find(o => o.status === 'in_progress');

  return (
    <CourierLayout>
      <div className="max-w-6xl mx-auto py-2">
        <div className="mb-8">
          <p className="text-xs font-bold text-ecoeat-muted uppercase tracking-widest mb-1">TASK MANAGEMENT</p>
          <h1 className="text-3xl font-extrabold text-ecoeat-text">Current Tasks</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Active Delivery */}
            {activeTask ? (
              <div className="bg-white rounded-[24px] p-6 shadow-sm border border-black/5 relative overflow-hidden">
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <span className="bg-[#4caf50] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                    ON DELIVERY
                  </span>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-ecoeat-muted uppercase tracking-wider mb-0.5">ESTIMATED TIME</p>
                    <p className="font-extrabold text-ecoeat-primary text-xl leading-none">{activeTask.time}</p>
                  </div>
                </div>

                <div className="relative pl-6 mb-8 space-y-6 z-10">
                  {/* Vertical line connecting pickup and dropoff */}
                  <div className="absolute left-[11px] top-2 bottom-2 border-l-2 border-dotted border-gray-300"></div>
                  
                  {/* Pickup */}
                  <div className="relative">
                    <div className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-[#4caf50] border-[3px] border-white shadow-sm ring-1 ring-[#4caf50]"></div>
                    <p className="text-[10px] font-bold text-ecoeat-muted uppercase tracking-wider mb-1">PICKUP</p>
                    <p className="font-bold text-xl text-ecoeat-text leading-tight">{activeTask.pickupName}</p>
                    <p className="text-sm font-medium text-ecoeat-muted mt-1">{activeTask.pickupAddress}</p>
                  </div>

                  {/* Drop-off */}
                  <div className="relative">
                    <div className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-[#f44336] border-[3px] border-white shadow-sm ring-1 ring-[#f44336]"></div>
                    <p className="text-[10px] font-bold text-ecoeat-muted uppercase tracking-wider mb-1">DROP-OFF</p>
                    <p className="font-bold text-xl text-ecoeat-text leading-tight">{activeTask.destinationName}</p>
                    <p className="text-sm font-medium text-ecoeat-muted mt-1">{activeTask.destinationAddress}</p>
                  </div>
                </div>

                <div className="flex mt-auto relative z-10">
                  <Link href={`/dashboard/kurir/tasks/${activeTask.id}`} className="flex-1 bg-[#388e3c] text-white font-bold py-3.5 rounded-xl hover:bg-[#2e7d32] transition-colors shadow-md shadow-green-900/10 text-lg text-center block w-full">
                    View Route
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-[24px] p-12 shadow-sm border border-black/5 text-center flex flex-col items-center justify-center">
                <MapPin size={48} className="text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-500">No active delivery</h3>
                <p className="text-sm text-gray-400 mt-2">You don't have any tasks in progress.</p>
              </div>
            )}

            {/* Card Traffic (Maps) */}
            <div className="bg-white rounded-[24px] p-6 shadow-sm border border-black/5">
              <h2 className="text-lg font-bold text-ecoeat-text mb-4 flex items-center gap-2">
                <Map size={20} className="text-ecoeat-primary" /> Traffic & Network Map
              </h2>
              <div className="h-64 rounded-xl overflow-hidden border border-gray-100">
                 {/* Map without arrow button */}
                 <RouteMap status="in_progress" currentLocation={null} />
              </div>
            </div>

          </div>

          {/* Right Column */}
          <div className="space-y-6">
            
            {/* Card View Detailed History */}
            <div 
              onClick={() => router.push('/dashboard/kurir/history')}
              className="bg-white rounded-[24px] p-6 shadow-sm border border-black/5 hover:border-ecoeat-primary transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-[#eaf4eb] rounded-xl flex items-center justify-center text-[#1e8932]">
                  <Clock size={20} />
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-ecoeat-primary group-hover:text-white flex items-center justify-center text-gray-400 transition-colors">
                  <Navigation size={14} className="rotate-45" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-ecoeat-text mb-1">Detailed History</h3>
              <p className="text-sm font-medium text-ecoeat-muted">View past deliveries, stats, and records</p>
            </div>
            
          </div>

        </div>
      </div>
    </CourierLayout>
  );
}
