"use client";

import React, { useState } from 'react';
import { Shield, Bell, HelpCircle, FileText, LogOut, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function KurirSettingsPage() {
  const router = useRouter();
  const { logout } = useAuthStore();
  
  const [notifNewOrder, setNotifNewOrder] = useState(true);
  const [notifWithdraw, setNotifWithdraw] = useState(true);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-emerald-700 font-extrabold mb-1">COURIER HUB</p>
        <h1 className="text-3xl font-extrabold text-emerald-950">Pengaturan</h1>
      </div>

      <div className="space-y-6">
        
        {/* Notifikasi */}
        <section className="bg-white rounded-[24px] border border-emerald-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-emerald-50 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
              <Bell size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-emerald-950 text-lg">Notifikasi</h3>
              <p className="text-xs text-slate-500 font-medium">Pilih pemberitahuan yang ingin diterima</p>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-700">Notifikasi Order Baru</p>
                <p className="text-xs text-slate-500 mt-0.5">Dapatkan peringatan saat ada pesanan masuk</p>
              </div>
              <button 
                onClick={() => setNotifNewOrder(!notifNewOrder)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${notifNewOrder ? 'bg-[#1e8932]' : 'bg-slate-200'}`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${notifNewOrder ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            <div className="h-px bg-slate-100 w-full" />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-700">Update Status Pembayaran</p>
                <p className="text-xs text-slate-500 mt-0.5">Notifikasi penarikan (Withdraw) berhasil</p>
              </div>
              <button 
                onClick={() => setNotifWithdraw(!notifWithdraw)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${notifWithdraw ? 'bg-[#1e8932]' : 'bg-slate-200'}`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${notifWithdraw ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        </section>

        {/* Log Out */}
        <section className="pt-4">
          <button 
            onClick={handleLogout}
            className="w-full bg-white border border-red-200 hover:bg-red-50 text-red-600 p-5 rounded-[24px] shadow-sm flex items-center justify-center gap-3 transition-colors group"
          >
            <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-extrabold text-lg">Keluar (Log Out)</span>
          </button>
        </section>

      </div>
    </div>
  );
}
