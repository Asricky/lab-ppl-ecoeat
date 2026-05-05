"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, Search, User, LogOut } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import { dummyOrders, dummyNotifications } from '@/lib/data';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useTaskStore } from '@/store/taskStore';
import { getCreditedBalance } from '@/lib/dashboardData';

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();
  const { searchQuery, setSearchQuery } = useTaskStore();
  
  const hasUnreadNotif = dummyNotifications.some(n => !n.isRead);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Basic logout redirect
    setIsProfileOpen(false);
    router.push('/login');
  };

  return (
    <nav className="bg-ecoeat-bg px-6 py-4 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={onMenuClick}
          className="p-2 rounded-md hover:bg-black/5 text-ecoeat-text md:hidden"
          aria-label="Toggle Menu"
        >
          <Menu size={24} />
        </button>
        
        {/* Search Bar */}
        <div className="hidden md:flex items-center bg-black/5 rounded-full px-4 py-2.5 w-full max-w-xl">
          <Search size={18} className="text-ecoeat-muted mr-3" />
          <input 
            type="text" 
            placeholder="Search tasks or locations..." 
            className="bg-transparent border-none outline-none text-sm text-ecoeat-text placeholder-ecoeat-muted w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-6 ml-4">
        {/* Notifications & Messages */}
        <div className="flex items-center gap-4 text-ecoeat-text relative">
          <div className="relative">
            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative hover:text-ecoeat-primary transition-colors"
            >
              <Bell size={20} />
              {hasUnreadNotif && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              )}
            </button>
            <NotificationDropdown isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
          </div>
        </div>

        {/* User Profile */}
        <div className="relative" ref={profileRef}>
          <div 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 pl-6 border-l border-ecoeat-border cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="hidden sm:flex flex-col items-end">
              <span className="font-bold text-sm text-ecoeat-text leading-tight">{user?.name || 'Alex Green'}</span>
              <span className="text-xs text-ecoeat-muted">Senior Courier</span>
            </div>
            <div className="h-10 w-10 rounded-full bg-gray-300 overflow-hidden border-2 border-white shadow-sm">
              <img 
                src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"} 
                alt={user?.name || 'Alex Green'}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border border-black/5 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
              <div className="py-2">
                <Link 
                  href="/kurir/profile" 
                  onClick={() => setIsProfileOpen(false)}
                  className="px-4 py-2.5 flex items-center gap-3 text-sm font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
                >
                  <User size={16} /> Profile
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 flex items-center gap-3 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} /> Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
