"use client";

import React, { useState, useEffect } from 'react';
import { User, Shield, Bell, Upload, CheckCircle2, AlertCircle, X, Info, Save, Key } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);

  const [activeTab, setActiveTab] = useState('profile');

  // Profile Form States
  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [email, setEmail] = useState("");
  const [picName, setPicName] = useState("");
  const [avatar, setAvatar] = useState("");

  // Password States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Notification Preferences States (Mock)
  const [orderAlerts, setOrderAlerts] = useState(true);
  const [stockDepletion, setStockDepletion] = useState(true);

  // Toast Notification State
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

  // Load user data on mount / update
  useEffect(() => {
    if (user) {
      setStoreName((user as any).businessName || user.name || "Green Valley Farms");
      setStoreDescription((user as any).storeDescription || "Local organic farm dedicated to sustainable agriculture. We provide fresh produce directly to the community.");
      setEmail(user.email || "seller@ecoeat.com");
      setPicName(user.name || "Alex Rivers");
      setAvatar((user as any).avatar || "https://i.pravatar.cc/150?u=a042581f4e29026704d");
    }
  }, [user]);

  // Handler for Profile Update
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName || !email || !picName) {
      return showToast("Harap isi semua kolom wajib!", "error");
    }

    updateUser({
      name: picName,
      email: email,
      businessName: storeName,
      storeDescription,
      avatar,
    } as any);

    showToast("Profil Toko berhasil diperbarui!", "success");
  };

  // Handler for Avatar Change (Mock Dynamic)
  const handleChangePhoto = () => {
    const randomSeed = Math.random().toString(36).substring(2, 7);
    const newAvatar = `https://i.pravatar.cc/150?u=${randomSeed}`;
    setAvatar(newAvatar);
    
    // Save photo automatically to store
    updateUser({
      avatar: newAvatar
    } as any);
    
    showToast("Foto profil berhasil diperbarui!", "success");
  };

  // Handler for Password Update
  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      return showToast("Password lama dan baru wajib diisi!", "error");
    }
    if (newPassword.length < 6) {
      return showToast("Password baru minimal harus 6 karakter!", "error");
    }

    // Simulate API delay
    showToast("Memperbarui kata sandi...", "info");
    setTimeout(() => {
      showToast("Kata sandi berhasil diperbarui!", "success");
      setCurrentPassword("");
      setNewPassword("");
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pengaturan</h1>
        <p className="text-gray-500">Kelola profil toko, preferensi notifikasi, dan keamanan akun penjual Anda.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Tabs Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex items-center space-x-3 px-6 py-4 text-left font-bold transition-colors border-l-4 ${activeTab === 'profile' ? 'border-[#1A5632] bg-[#E8F3EB] text-[#1A5632]' : 'border-transparent text-gray-600 hover:bg-gray-50'}`}
            >
              <User size={20} />
              <span>Store Profile</span>
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`flex items-center space-x-3 px-6 py-4 text-left font-bold transition-colors border-l-4 ${activeTab === 'security' ? 'border-[#1A5632] bg-[#E8F3EB] text-[#1A5632]' : 'border-transparent text-gray-600 hover:bg-gray-50'}`}
            >
              <Shield size={20} />
              <span>Security & Alerts</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile}>
              <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Store Profile</h2>
              
              <div className="flex items-center space-x-6 mb-8">
                <div className="w-24 h-24 bg-gray-100 rounded-full border border-gray-200 flex items-center justify-center overflow-hidden shadow-inner">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={avatar || "https://i.pravatar.cc/150?u=a042581f4e29026704d"} alt="Store Avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <button 
                    type="button"
                    onClick={handleChangePhoto}
                    className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-xl font-bold text-sm shadow-sm hover:bg-gray-50 mb-2 flex items-center gap-1.5 transition-colors"
                  >
                    <Upload size={14} /> Ubah Foto
                  </button>
                  <p className="text-xs text-gray-500 font-medium">Ubah foto dengan avatar acak beresolusi tinggi secara otomatis.</p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Nama Toko (Business Name)</label>
                    <input 
                      type="text" 
                      required
                      value={storeName} 
                      onChange={e => setStoreName(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1A5632] focus:border-[#1A5632] outline-none transition-colors font-medium text-gray-800" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Nama Pemilik / PIC</label>
                    <input 
                      type="text" 
                      required
                      value={picName} 
                      onChange={e => setPicName(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1A5632] focus:border-[#1A5632] outline-none transition-colors font-medium text-gray-800" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Email Bisnis</label>
                  <input 
                    type="email" 
                    required
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1A5632] focus:border-[#1A5632] outline-none transition-colors font-medium text-gray-800" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi Toko</label>
                  <textarea 
                    rows={4} 
                    value={storeDescription} 
                    onChange={e => setStoreDescription(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1A5632] focus:border-[#1A5632] outline-none transition-colors font-medium text-gray-800"
                  ></textarea>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    className="bg-[#1A5632] hover:bg-[#0F351F] text-white px-6 py-3 rounded-xl font-bold shadow-sm hover:shadow transition-all flex items-center gap-2"
                  >
                    <Save size={16} /> Simpan Perubahan
                  </button>
                </div>
              </div>
            </form>
          )}

          {activeTab === 'security' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Security & Alerts</h2>
              
              <div className="space-y-8">
                {/* Password Form */}
                <form onSubmit={handleUpdatePassword}>
                  <h3 className="text-md font-bold text-gray-900 mb-4 inline-flex items-center gap-2">
                    <Key size={18} className="text-[#1A5632]" /> Ubah Kata Sandi
                  </h3>
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Kata Sandi Saat Ini</label>
                      <input 
                        type="password" 
                        required
                        placeholder="••••••••" 
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1A5632] focus:border-[#1A5632] outline-none transition-colors" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Kata Sandi Baru</label>
                      <input 
                        type="password" 
                        required
                        placeholder="••••••••" 
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1A5632] focus:border-[#1A5632] outline-none transition-colors" 
                      />
                    </div>
                    <button 
                      type="submit"
                      className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2.5 rounded-xl font-bold shadow-sm transition-colors mt-2"
                    >
                      Perbarui Kata Sandi
                    </button>
                  </div>
                </form>

                {/* Notifications Panel */}
                <div className="border-t border-gray-100 pt-8">
                  <h3 className="text-md font-bold text-gray-900 mb-4 inline-flex items-center gap-2">
                    <Bell size={18} className="text-[#1A5632]" /> Preferensi Notifikasi
                  </h3>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                      <div>
                        <p className="font-bold text-gray-900 text-sm">Notifikasi Pesanan Baru</p>
                        <p className="text-xs font-medium text-gray-500 mt-0.5">Kirim email / alerts setiap ada pesanan masuk.</p>
                      </div>
                      <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input 
                          type="checkbox" 
                          checked={orderAlerts} 
                          onChange={() => {
                            setOrderAlerts(!orderAlerts);
                            showToast(`Notifikasi pesanan ${!orderAlerts ? 'diaktifkan' : 'dimatikan'}`, 'info');
                          }}
                          className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-[#1A5632] right-0" 
                          style={{ right: orderAlerts ? 0 : 'auto', left: orderAlerts ? 'auto' : 0 }} 
                        />
                        <label className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${orderAlerts ? 'bg-[#1A5632]' : 'bg-gray-300'}`}></label>
                      </div>
                    </label>

                    <label className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                      <div>
                        <p className="font-bold text-gray-900 text-sm">Pemberitahuan Stok Menipis</p>
                        <p className="text-xs font-medium text-gray-500 mt-0.5">Beri tahu saya jika persediaan produk turun di bawah 10%.</p>
                      </div>
                      <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input 
                          type="checkbox" 
                          checked={stockDepletion} 
                          onChange={() => {
                            setStockDepletion(!stockDepletion);
                            showToast(`Peringatan stok ${!stockDepletion ? 'diaktifkan' : 'dimatikan'}`, 'info');
                          }}
                          className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-[#1A5632] right-0"
                          style={{ right: stockDepletion ? 0 : 'auto', left: stockDepletion ? 'auto' : 0 }}
                        />
                        <label className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${stockDepletion ? 'bg-[#1A5632]' : 'bg-gray-300'}`}></label>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

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
            {notification.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#1A5632] shrink-0" />}
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
    </div>
  );
}
