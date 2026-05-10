import React from 'react';
import { Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function ActiveTaskCard() {
  return (
    <div className="bg-white rounded-[24px] p-6 shadow-sm border border-black/5 flex flex-col h-full relative overflow-hidden">
      {/* Decorative gradient blur (optional, to match some modern UIs) */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      <div className="flex justify-between items-start mb-8 relative z-10">
        <span className="bg-[#4caf50] text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
          ON DELIVERY
        </span>
        <div className="text-right">
          <p className="text-[10px] font-bold text-ecoeat-muted uppercase tracking-wider mb-0.5">ESTIMATED TIME</p>
          <p className="font-extrabold text-ecoeat-primary text-xl leading-none">12 mins</p>
        </div>
      </div>

      <div className="relative pl-6 mb-8 space-y-6 flex-1 z-10">
        {/* Vertical line connecting pickup and dropoff */}
        <div className="absolute left-[11px] top-2 bottom-2 border-l-2 border-dotted border-gray-300"></div>
        
        {/* Pickup */}
        <div className="relative">
          <div className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-[#4caf50] border-[3px] border-white shadow-sm ring-1 ring-[#4caf50]"></div>
          <p className="text-[10px] font-bold text-ecoeat-muted uppercase tracking-wider mb-1">PICKUP</p>
          <p className="font-bold text-xl text-ecoeat-text leading-tight">Green Grocers</p>
          <p className="text-sm font-medium text-ecoeat-muted mt-1">42nd Market Street, East Wing</p>
        </div>

        {/* Drop-off */}
        <div className="relative">
          <div className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-[#f44336] border-[3px] border-white shadow-sm ring-1 ring-[#f44336]"></div>
          <p className="text-[10px] font-bold text-ecoeat-muted uppercase tracking-wider mb-1">DROP-OFF</p>
          <p className="font-bold text-xl text-ecoeat-text leading-tight">Community Kitchen</p>
          <p className="text-sm font-medium text-ecoeat-muted mt-1">78 Pine Valley Road</p>
        </div>
      </div>

      <div className="flex gap-3 mt-auto relative z-10">
        <Link
          href="/kurir/ORD-1"
          className="flex-1 bg-[#388e3c] text-white font-bold py-3.5 rounded-xl hover:bg-[#2e7d32] transition-colors shadow-md shadow-green-900/10 text-lg text-center"
        >
          View Route
        </Link>
        <button className="w-14 bg-[#eaf4eb] text-[#388e3c] flex items-center justify-center rounded-xl hover:bg-[#d4ecd7] transition-colors shadow-sm">
          <Phone size={20} />
        </button>
      </div>
    </div>
  );
}
