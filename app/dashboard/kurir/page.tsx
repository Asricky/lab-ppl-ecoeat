"use client";

import { useState } from 'react';
import CourierModal from '@/components/CourierModal';
import { MapPin, Package, Clock } from 'lucide-react';

export default function KurirDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Kurir Dashboard</h1>
      
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-6 max-w-2xl">
        <div className="flex items-center justify-between mb-4 border-b border-gray-50 pb-4">
          <h2 className="text-lg font-bold text-gray-800 flex items-center">
            <Package className="w-5 h-5 mr-2 text-blue-600" />
            Tugas Pengiriman Aktif
          </h2>
          <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1" />
            Sedang Jalan
          </span>
        </div>
        
        <div className="space-y-4 mb-6 relative">
          <div className="flex">
            <div className="mt-1 flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center border-2 border-white shadow-sm relative z-10">
                <MapPin className="w-4 h-4 text-amber-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Pickup Point</p>
              <p className="text-sm font-bold text-gray-800">Warung Bu Ani</p>
              <p className="text-xs text-gray-500">Jl. Margonda Raya No. 100</p>
            </div>
          </div>
          
          <div className="absolute top-8 left-4 bottom-8 w-0.5 bg-gray-200 z-0"></div>
          
          <div className="flex">
            <div className="mt-1 flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center border-2 border-white shadow-sm relative z-10">
                <MapPin className="w-4 h-4 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">Dropoff Point</p>
              <p className="text-sm font-bold text-gray-800">Panti Asuhan Berkah</p>
              <p className="text-xs text-gray-500">Jl. Nusantara No. 45</p>
            </div>
          </div>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-5 rounded-xl shadow-md shadow-blue-200 transition-all active:scale-[0.98]"
        >
          Proses Handover
        </button>
      </div>

      <CourierModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={(data: { otp: string; file: File }) => {
          console.log('Handover confirmed:', data);
          alert('Handover Berhasil diverifikasi!');
        }}
      />
    </div>
  );
}
