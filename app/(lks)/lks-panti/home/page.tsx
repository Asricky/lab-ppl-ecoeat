"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PackageCheck, Route, HeartPulse, Store, Clock, CheckCircle2 } from 'lucide-react';
import { useDonationStore } from '@/store/donationStore';

export default function LksHomePage() {
  const router = useRouter();
  const { donations, acceptDonation, fetchDonations } = useDonationStore();
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch donations on mount
  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);

  const filteredDonations = donations.filter(row => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return row.product.toLowerCase().includes(q) || 
           row.donor.toLowerCase().includes(q) || 
           row.id.toLowerCase().includes(q);
  });

  const totalReceivedKg = donations
    .filter(d => d.status === 'Completed' || d.status === 'Accepted')
    .reduce((sum, d) => sum + d.amountKg, 0);

  const inTransitCount = donations
    .filter(d => d.status === 'Assigned' || d.status === 'In Progress')
    .length;

  const mealsSaved = totalReceivedKg * 4;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-emerald-700 font-bold">LKS Panel</p>
        <h1 className="text-3xl font-extrabold text-emerald-950">Incoming Donations</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-[24px] border border-black/5 shadow-sm p-6 flex items-start gap-4 h-full">
          <div className="w-12 h-12 bg-[#F2F6F0] rounded-xl flex items-center justify-center shrink-0 border border-[#D4ECD7] text-emerald-700">
             <PackageCheck size={24} />
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1">TOTAL DONASI DITERIMA</p>
            <p className="text-3xl font-extrabold text-emerald-950">{totalReceivedKg} <span className="text-sm text-slate-500">kg</span></p>
          </div>
        </div>
        
        <div className="bg-white rounded-[24px] border border-black/5 shadow-sm p-6 flex items-start gap-4 h-full">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 border border-blue-100 text-blue-600">
             <Route size={24} />
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1">DALAM PERJALANAN</p>
            <p className="text-3xl font-extrabold text-emerald-950">{inTransitCount} <span className="text-sm text-slate-500">donasi</span></p>
          </div>
        </div>
        
        <div className="bg-[#1A5632] rounded-[24px] border border-emerald-900 shadow-sm p-6 flex items-start gap-4 text-white h-full">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0 border border-white/20">
             <HeartPulse size={24} />
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-emerald-200 uppercase tracking-widest mb-1">DAMPAK SOSIAL (PBI#19)</p>
            <p className="text-3xl font-extrabold">{mealsSaved} <span className="text-sm text-emerald-200">porsi diselamatkan</span></p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDonations.map((row) => (
          <div
            key={row.id}
            onClick={() => router.push(`/lks-panti/tracking/${row.id}`)}
            className="bg-white rounded-[24px] overflow-hidden border border-emerald-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col group"
          >
            {/* Photo Header */}
            <div className="h-44 bg-slate-200 relative overflow-hidden">
              <img 
                src={`https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?q=80&w=400&auto=format&fit=crop&sig=${row.id}`} 
                alt={row.product}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-extrabold text-emerald-950 shadow-sm border border-white/20">
                {row.amountKg} kg
              </div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col relative">
              <div className="absolute -top-6 left-5 w-12 h-12 bg-white rounded-2xl shadow-md border border-emerald-50 flex items-center justify-center text-emerald-600">
                <Store size={24} />
              </div>
              
              <div className="mt-5 mb-4">
                <h3 className="font-extrabold text-emerald-950 text-lg mb-1 leading-tight line-clamp-1">{row.product}</h3>
                <p className="text-sm font-semibold text-slate-500 flex items-center gap-1.5">
                   {row.donor}
                </p>
              </div>
              
              <div className="flex items-center gap-3 mb-6 mt-auto bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div className="flex-1">
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">STATUS</p>
                  <p className="text-xs font-bold text-emerald-700 bg-emerald-100/50 inline-block px-2 py-0.5 rounded-md">{row.status}</p>
                </div>
                <div className="w-px h-8 bg-slate-200"></div>
                <div className="flex-1 text-right">
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">ETA</p>
                  <p className="text-xs font-bold text-emerald-950 flex items-center justify-end gap-1.5"><Clock size={14} className="text-emerald-600"/> {row.eta}</p>
                </div>
              </div>
              
              {row.status !== 'Completed' && row.status !== 'Accepted' ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    acceptDonation(row.id);
                  }}
                  className="w-full py-3.5 bg-emerald-600 text-white font-extrabold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <PackageCheck size={18} /> Terima Donasi
                </button>
              ) : (
                <div className="w-full py-3.5 bg-[#eaf4eb] text-emerald-800 font-extrabold rounded-xl border border-[#d4ecd7] flex items-center justify-center gap-2">
                  <CheckCircle2 size={18} /> {row.status === 'Completed' ? 'Selesai' : 'Diterima'}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
