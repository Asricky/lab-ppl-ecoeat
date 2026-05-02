"use client";

import React from 'react';
import { Package, TrendingUp, Truck, CheckCircle, MapPin, Clock } from 'lucide-react';
import { dummyOrders } from '@/lib/data';

export default function Home() {
  const donations = dummyOrders.filter(order => order.type === 'donation');
  
  // Dummy statistics
  const totalDonasiHariIni = donations.length + 46; // e.g. 48
  const totalBeratDiterima = 1240;
  const sedangDiantar = donations.filter(o => o.status === 'in_progress').length + 6; // e.g. 7
  const sudahDiterima = donations.filter(o => o.status === 'completed').length + 40; // e.g. 41

  const StatCard = ({ title, value, subtitle, icon: Icon, colorClass }: any) => (
    <div className="bg-white rounded-[24px] p-6 shadow-sm border border-black/5 flex flex-col justify-between relative overflow-hidden group hover:border-ecoeat-primary transition-colors">
      <div className="flex justify-between items-start mb-6">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass}`}>
          <Icon size={24} />
        </div>
      </div>
      <div>
        <h3 className="text-3xl font-extrabold text-ecoeat-text mb-1">{value}</h3>
        <p className="text-sm font-bold text-ecoeat-muted">{title}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-1 font-medium">{subtitle}</p>}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs font-bold text-ecoeat-muted uppercase tracking-widest mb-1">Overview</p>
        <h1 className="text-3xl font-extrabold text-ecoeat-text">Dashboard Donasi</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Donasi Hari Ini" 
          value={totalDonasiHariIni} 
          subtitle="+12% from yesterday"
          icon={Package} 
          colorClass="bg-blue-50 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors" 
        />
        <StatCard 
          title="Total Berat Diterima" 
          value={`${totalBeratDiterima} kg`} 
          subtitle="This week's recovery"
          icon={TrendingUp} 
          colorClass="bg-[#eaf4eb] text-[#388e3c] group-hover:bg-[#388e3c] group-hover:text-white transition-colors" 
        />
        <StatCard 
          title="Sedang Diantar" 
          value={sedangDiantar} 
          icon={Truck} 
          colorClass="bg-orange-50 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors" 
        />
        <StatCard 
          title="Sudah Diterima" 
          value={sudahDiterima} 
          subtitle="85% progress today"
          icon={CheckCircle} 
          colorClass="bg-teal-50 text-teal-500 group-hover:bg-teal-500 group-hover:text-white transition-colors" 
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Table Section */}
        <div className="lg:col-span-3 bg-white rounded-[24px] shadow-sm border border-black/5 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-black/5 flex justify-between items-center">
            <h2 className="text-xl font-extrabold text-ecoeat-text">Incoming Donations</h2>
            <button className="text-sm font-bold text-[#388e3c] bg-[#eaf4eb] px-4 py-2 rounded-xl hover:bg-[#d4ecd7] transition-colors">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-black/5">
                  <th className="px-6 py-4 text-xs font-bold text-ecoeat-muted uppercase tracking-wider">Seller</th>
                  <th className="px-6 py-4 text-xs font-bold text-ecoeat-muted uppercase tracking-wider">Product Type</th>
                  <th className="px-6 py-4 text-xs font-bold text-ecoeat-muted uppercase tracking-wider">Amount (kg)</th>
                  <th className="px-6 py-4 text-xs font-bold text-ecoeat-muted uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {[...donations, ...dummyOrders].slice(0, 5).map((order, i) => {
                  let statusBadge = "";
                  let statusText = "";
                  if (order.status === 'completed') {
                    statusBadge = "bg-[#eaf4eb] text-[#388e3c]";
                    statusText = "Diterima";
                  } else if (order.status === 'in_progress') {
                    statusBadge = "bg-blue-100 text-blue-700";
                    statusText = "Dalam Perjalanan";
                  } else if (order.status === 'assigned') {
                    statusBadge = "bg-orange-100 text-orange-700";
                    statusText = "Menunggu Kurir";
                  } else {
                    statusBadge = "bg-gray-100 text-gray-700";
                    statusText = "Incoming Donation";
                  }

                  return (
                    <tr key={`${order.id}-${i}`} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img src={order.pickupAvatar} alt="" className="w-8 h-8 rounded-full bg-gray-200" />
                          <span className="font-bold text-sm text-ecoeat-text">{order.pickupName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">{order.productName}</td>
                      <td className="px-5 py-4 text-sm font-medium text-gray-900">{(i * 7 + 10) % 25 + 5} kg</td>
                      <td className="px-5 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusBadge}`}>
                          {statusText}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
