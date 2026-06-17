"use client";

import { useDonationStore } from '@/store/donationStore';
import { useEffect } from 'react';

export default function LksHistoryPage() {
  const { donations, searchQuery, fetchDonations } = useDonationStore();

  useEffect(() => {
    fetchDonations();
  }, [fetchDonations]);
  
  const historyDonations = donations.filter(row => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return row.product.toLowerCase().includes(q) || 
           row.donor.toLowerCase().includes(q) || 
           row.id.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-emerald-700 font-bold">LKS Panel</p>
        <h1 className="text-3xl font-extrabold text-emerald-950">History</h1>
      </div>

      <div className="bg-white rounded-3xl border border-emerald-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-5 py-4">Nama Donor</th>
              <th className="px-5 py-4">Nama Produk</th>
              <th className="px-5 py-4">Jumlah (kg)</th>
              <th className="px-5 py-4">Tanggal Diterima</th>
              <th className="px-5 py-4">Nama Kurir</th>
            </tr>
          </thead>
          <tbody>
            {historyDonations.map((row) => (
              <tr key={row.id} className="border-b last:border-none border-slate-100 hover:bg-slate-50">
                <td className="px-5 py-4 font-bold text-emerald-950">{row.donor}</td>
                <td className="px-5 py-4 text-sm text-slate-700">{row.product}</td>
                <td className="px-5 py-4 text-sm font-semibold text-emerald-700">{row.amountKg} kg</td>
                <td className="px-5 py-4 text-sm text-slate-700">{row.dateReceived}</td>
                <td className="px-5 py-4 text-sm text-slate-700 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-700">
                    {row.courierName?.substring(0, 2).toUpperCase()}
                  </div>
                  {row.courierName}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
