"use client";

import React, { useState, useEffect } from 'react';
import { Leaf, CheckCircle2, Navigation, MessageCircle, MapPin, ArrowLeft } from 'lucide-react';
import dynamic from 'next/dynamic';

const MapContainer = dynamic(() => import('@/app/components/MapContainer'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-100 animate-pulse flex items-center justify-center">
      <p className="text-gray-400 font-bold">Loading Interactive Map...</p>
    </div>
  )
});

export default function OrderTrackingPage() {
  const [courierLocation, setCourierLocation] = useState({ lat: -6.200000, lng: 106.816666 });

  useEffect(() => {
    // Simulate courier movement from Seller to LKS
    const start = { lat: -6.200000, lng: 106.816666 };
    const end = { lat: -6.210000, lng: 106.826666 };
    let progress = 0;

    const interval = setInterval(() => {
      progress += 0.02; // Slower progress for smoother animation
      if (progress > 1) progress = 1;
      
      setCourierLocation({
        lat: start.lat + (end.lat - start.lat) * progress,
        lng: start.lng + (end.lng - start.lng) * progress
      });

      if (progress === 1) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-[calc(100vh-64px)] -m-8 flex flex-col md:flex-row overflow-hidden">
      {/* Map Area (Left) */}
      <div className="md:w-2/3 relative flex-1 h-full z-0">
        <MapContainer locations={[
          {lat: -6.200000, lng: 106.816666, type: 'seller', name: 'Verdant Bakery'},
          {lat: -6.210000, lng: 106.826666, type: 'lks', name: 'Hope Kitchen'},
          {lat: courierLocation.lat, lng: courierLocation.lng, type: 'courier', name: 'Marcus (Courier)', description: 'On the way to destination'}
        ]} />
        
        {/* Map UI Elements (Floating) */}
        <div className="absolute top-6 left-6 flex space-x-2 z-10 pointer-events-auto">
          <button onClick={() => window.history.back()} className="bg-white rounded-full px-4 py-2 shadow-md flex items-center space-x-2 text-gray-700 hover:text-[#1A5632] hover:bg-gray-50 transition-colors font-bold text-sm cursor-pointer">
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
          <div className="bg-white rounded-full px-4 py-2 shadow-md flex items-center space-x-2 pointer-events-none">
            <Leaf size={16} className="text-[#1A5632]" />
            <span className="text-sm font-bold text-gray-900">Est. Arrival: 15 Mins</span>
          </div>
        </div>
      </div>

      {/* Tracking Panel (Right) */}
      <div className="md:w-1/3 bg-[#F9FAFB] border-l border-gray-200 flex flex-col h-full overflow-y-auto">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Track Harvest Distribution</h1>
          <p className="text-sm text-gray-500 mb-8 font-medium">Order #OP-88291 • Delivery in progress</p>

          {/* Product Card */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center space-x-4 mb-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100&q=80" alt="Sourdough" className="w-16 h-16 rounded-xl object-cover" />
            <div>
              <h3 className="font-bold text-gray-900">Artisan Sourdough Loaves</h3>
              <p className="text-sm text-gray-500 mb-1">5 units (Bulk Salvage)</p>
              <span className="inline-block bg-[#E8F3EB] text-[#1A5632] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Reserved</span>
            </div>
          </div>

          {/* Deliver To */}
          <div className="mb-8">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Deliver To</h4>
            <div className="flex items-start space-x-3">
              <div className="mt-0.5">
                <CheckCircle2 size={20} className="text-[#1A5632]" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Hope Kitchen (Verified LKS)</h3>
                <p className="text-sm text-gray-500 mb-1">4221 Heritage Way, North District</p>
                <div className="flex items-center text-xs font-medium text-gray-400">
                  <MapPin size={12} className="mr-1" /> 2.4 km away
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Stepper */}
          <div className="relative pl-3 space-y-8 mb-12">
            <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-200"></div>
            
            <div className="relative flex items-start space-x-4">
              <div className="w-3 h-3 bg-[#1A5632] rounded-full mt-1.5 ring-4 ring-white z-10"></div>
              <div className="flex-1 flex justify-between">
                <div>
                  <h4 className="font-bold text-gray-900">Assigned</h4>
                  <p className="text-xs text-gray-500">Courier matched</p>
                </div>
                <span className="text-xs font-bold text-gray-400">10:30 AM</span>
              </div>
            </div>

            <div className="relative flex items-start space-x-4">
              <div className="w-3 h-3 bg-[#1A5632] rounded-full mt-1.5 ring-4 ring-white z-10"></div>
              <div className="flex-1 flex justify-between">
                <div>
                  <h4 className="font-bold text-gray-900">Picked up</h4>
                  <p className="text-xs text-gray-500">Verdant Bakery</p>
                </div>
                <span className="text-xs font-bold text-gray-400">10:45 AM</span>
              </div>
            </div>

            <div className="relative flex items-start space-x-4">
              <div className="w-3 h-3 bg-[#1A5632] rounded-full mt-1.5 ring-4 ring-[#E8F3EB] z-10 animate-pulse"></div>
              <div className="flex-1 flex justify-between">
                <div>
                  <h4 className="font-bold text-[#1A5632]">In Transit</h4>
                  <p className="text-xs text-[#1A5632]">Moving towards destination</p>
                </div>
                <span className="text-[10px] font-bold text-[#1A5632] bg-[#E8F3EB] px-2 py-0.5 rounded uppercase">Current</span>
              </div>
            </div>

            <div className="relative flex items-start space-x-4">
              <div className="w-3 h-3 bg-gray-300 rounded-full mt-1.5 ring-4 ring-white z-10"></div>
              <div className="flex-1 flex justify-between">
                <div>
                  <h4 className="font-bold text-gray-400">Delivered</h4>
                  <p className="text-xs text-gray-400">Hand-off verification</p>
                </div>
                <span className="text-xs font-bold text-gray-400">EST. 11:15 AM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Courier Profile */}
        <div className="mt-auto bg-white border-t border-gray-100 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80" alt="Marcus" className="w-12 h-12 rounded-full object-cover" />
            <div>
              <h4 className="font-bold text-gray-900">Marcus</h4>
              <p className="text-xs font-bold text-[#1A5632] flex items-center">
                <span className="w-1.5 h-1.5 bg-[#1A5632] rounded-full mr-1.5"></span>
                Eco-Courier
              </p>
            </div>
          </div>
          <button 
            onClick={() => alert("Opening chat with Marcus...")}
            className="w-10 h-10 rounded-full bg-[#E8F3EB] hover:bg-[#D1E8D7] flex items-center justify-center text-[#1A5632] transition-colors shadow-sm"
          >
            <MessageCircle size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
