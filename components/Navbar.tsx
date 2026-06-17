"use client";

import React, { useState } from 'react';
import { Menu, Bell, Search } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import { dummyOrders, dummyNotifications } from '@/lib/data';

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  
  const hasUnreadNotif = dummyNotifications.some(n => !n.isRead);

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
        <div className="flex items-center gap-3 pl-6 border-l border-ecoeat-border">
          <div className="hidden sm:flex flex-col items-end">
            <span className="font-bold text-sm text-ecoeat-text leading-tight">Alex Green</span>
            <span className="text-xs text-ecoeat-muted">Senior Courier</span>
          </div>
          <div className="h-10 w-10 rounded-full bg-gray-300 overflow-hidden border-2 border-white shadow-sm">
            {/* Avatar placeholder */}
            <img 
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" 
              alt="Alex Green"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
