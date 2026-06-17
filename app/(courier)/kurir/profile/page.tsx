"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Camera, Edit2, Check, X, Car, Hash, Info, User as UserIcon, CheckCircle2, AlertCircle } from 'lucide-react';

export default function KurirProfilePage() {
  const { user, updateUser } = useAuthStore();
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(user?.name || 'Alex Green');
  
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ message, type });
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveName = () => {
    updateUser({ name: editName });
    setIsEditingName(false);
    showToast("Profil berhasil diperbarui!", "success");
  };

  const handleCancelEdit = () => {
    setEditName(user?.name || 'Alex Green');
    setIsEditingName(false);
  };

  const handlePhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate file upload by creating a local object URL
      const imageUrl = URL.createObjectURL(file);
      updateUser({ avatar: imageUrl });
      showToast("Foto profil berhasil diperbarui!", "success");
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Premium Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-[9999] animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl border backdrop-blur-md ${
            notification.type === 'success'
              ? 'bg-[#EAF3E1]/95 border-[#1A5632]/20 text-[#1A5632]'
              : notification.type === 'error'
                ? 'bg-red-50/95 border-red-200 text-red-950'
                : 'bg-blue-50/95 border-blue-200 text-blue-950'
          }`}>
            {notification.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />}
            {notification.type === 'error' && <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />}
            {notification.type === 'info' && <Info className="w-5 h-5 text-blue-600 shrink-0" />}
            <p className="text-sm font-bold">{notification.message}</p>
            <button
              onClick={() => setNotification(null)}
              className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-emerald-700 font-extrabold mb-1">COURIER HUB</p>
        <h1 className="text-3xl font-extrabold text-emerald-950">Profil Saya</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6 items-start">
        {/* Left Column: Avatar & Basic Action */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-[24px] border border-emerald-100 p-8 flex flex-col items-center text-center shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-emerald-50"></div>
            
            <div className="relative mb-6">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-md">
                <img 
                  src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"} 
                  alt={user?.name || "Profile"} 
                  className="w-full h-full object-cover"
                />
              </div>
              <button 
                onClick={handlePhotoClick}
                className="absolute bottom-0 right-0 w-10 h-10 bg-[#1e8932] text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white hover:bg-emerald-700 transition-colors"
                aria-label="Ubah Foto"
              >
                <Camera size={18} />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            <h2 className="text-xl font-extrabold text-emerald-950 mb-6">{user?.name || 'Alex Green'}</h2>

            <button 
              onClick={handlePhotoClick}
              className="w-full py-2.5 rounded-xl border-2 border-emerald-100 text-emerald-700 font-bold hover:bg-emerald-50 transition-colors"
            >
              Ubah Foto
            </button>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Account Information Card */}
          <div className="bg-white rounded-[24px] border border-emerald-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-emerald-50 flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                <UserIcon size={20} />
              </div>
              <div>
                <h3 className="font-extrabold text-emerald-950 text-lg">Informasi Akun</h3>
                <p className="text-xs text-slate-500 font-medium">Detail personal dan kontak</p>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2">Nama Lengkap</label>
                
                {isEditingName ? (
                  <div className="flex items-center gap-3">
                    <input 
                      type="text" 
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-emerald-950 focus:outline-none focus:border-[#1e8932] focus:ring-1 focus:ring-[#1e8932]"
                      autoFocus
                    />
                    <button 
                      onClick={handleSaveName}
                      className="w-12 h-12 bg-[#1e8932] text-white rounded-xl flex items-center justify-center shadow-sm hover:bg-emerald-700 transition-colors"
                    >
                      <Check size={20} />
                    </button>
                    <button 
                      onClick={handleCancelEdit}
                      className="w-12 h-12 bg-white border border-slate-200 text-slate-500 rounded-xl flex items-center justify-center shadow-sm hover:bg-slate-50 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-[#F8FAF9] px-4 py-3 rounded-xl border border-slate-100 group">
                    <p className="text-emerald-950 font-bold">{user?.name || 'Alex Green'}</p>
                    <button 
                      onClick={() => {
                        setEditName(user?.name || 'Alex Green');
                        setIsEditingName(true);
                      }}
                      className="text-slate-400 hover:text-emerald-600 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Edit2 size={18} />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2">Email</label>
                <div className="flex items-center justify-between bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
                  <p className="text-slate-600 font-semibold">{user?.email || 'alex.green@ecoeat.com'}</p>
                  <Info size={16} className="text-slate-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Information Card */}
          <div className="bg-white rounded-[24px] border border-emerald-100 shadow-sm overflow-hidden relative">
            <div className="absolute top-4 right-4 text-[10px] uppercase font-extrabold tracking-wider bg-slate-100 text-slate-500 px-3 py-1 rounded-full flex items-center gap-1">
              Read-Only
            </div>
            
            <div className="p-6 border-b border-emerald-50 flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-50 text-slate-500 rounded-xl flex items-center justify-center shrink-0">
                <Car size={20} />
              </div>
              <div>
                <h3 className="font-extrabold text-emerald-950 text-lg">Informasi Kendaraan</h3>
                <p className="text-xs text-slate-500 font-medium">Hubungi admin untuk mengubah</p>
              </div>
            </div>
            
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Jenis Motor/Kendaraan</label>
                <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 opacity-80 cursor-not-allowed">
                  <Car size={18} className="text-slate-400" />
                  <p className="text-slate-600 font-semibold">EcoBike - Listrik</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2">Nomor Plat</label>
                <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 opacity-80 cursor-not-allowed">
                  <Hash size={18} className="text-slate-400" />
                  <p className="text-slate-600 font-semibold uppercase">B 1420 ECO</p>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
