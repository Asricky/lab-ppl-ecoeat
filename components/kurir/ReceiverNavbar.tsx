"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Menu, User, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useDonationStore } from '@/store/donationStore';
import { dummyLksNotifications } from '@/lib/data';

interface ReceiverNavbarProps {
  onMenuClick: () => void;
}

export default function ReceiverNavbar({ onMenuClick }: ReceiverNavbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const router = useRouter();
  const { searchQuery, setSearchQuery } = useDonationStore();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-ecoeat-border h-16 flex items-center justify-between px-4 md:px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden text-ecoeat-text hover:bg-gray-100 p-2 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
        
        <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-80">
          <Search size={18} className="text-gray-400" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search donations or sellers..." 
            className="bg-transparent border-none outline-none text-sm w-full text-ecoeat-text placeholder-gray-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className={`relative p-2 rounded-full transition-colors ${isNotifOpen ? 'bg-emerald-50 text-emerald-600' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {/* Notifications Dropdown */}
          {isNotifOpen && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-extrabold text-emerald-950">Notifikasi</h3>
                <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700">Tandai dibaca</button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {dummyLksNotifications.map((notif) => (
                  <div key={notif.id} className={`p-4 border-b border-gray-50 hover:bg-slate-50 transition-colors cursor-pointer ${!notif.isRead ? 'bg-emerald-50/30' : ''}`}>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className={`text-sm ${!notif.isRead ? 'font-extrabold text-emerald-950' : 'font-bold text-slate-700'}`}>{notif.title}</p>
                      <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">{notif.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2">{notif.message}</p>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-slate-50 text-center border-t border-gray-100">
                <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700">Lihat Semua Notifikasi</button>
              </div>
            </div>
          )}
        </div>
        <div className="hidden sm:flex items-center gap-3 border-l border-gray-200 pl-4 ml-2 relative" ref={dropdownRef}>
          <div 
            className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-1.5 rounded-xl transition-colors"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="text-right">
              <p className="text-sm font-bold text-ecoeat-text">Yayasan Berbagi</p>
              <p className="text-[10px] text-gray-500 font-medium">LKS / Panti Asuhan</p>
            </div>
            <div className="w-8 h-8 bg-ecoeat-primary text-white rounded-full flex items-center justify-center font-bold">
              YB
            </div>
          </div>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="p-1.5">
                <button 
                  onClick={() => {
                    setIsDropdownOpen(false);
                    router.push('/lks-panti/profile');
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-colors"
                >
                  <User size={16} /> Profil LKS
                </button>
                <div className="h-px bg-gray-100 my-1 mx-2"></div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-3 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
