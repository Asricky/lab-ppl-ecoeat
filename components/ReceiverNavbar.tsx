"use client";

import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';

interface ReceiverNavbarProps {
  onMenuClick: () => void;
}

export default function ReceiverNavbar({ onMenuClick }: ReceiverNavbarProps) {
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
            placeholder="Search donations or sellers..." 
            className="bg-transparent border-none outline-none text-sm w-full text-ecoeat-text placeholder-gray-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="hidden sm:flex items-center gap-3 border-l border-gray-200 pl-4 ml-2">
          <div className="text-right">
            <p className="text-sm font-bold text-ecoeat-text">Yayasan Berbagi</p>
            <p className="text-[10px] text-gray-500 font-medium">LKS / Panti Asuhan</p>
          </div>
          <div className="w-8 h-8 bg-ecoeat-primary text-white rounded-full flex items-center justify-center font-bold">
            YB
          </div>
        </div>
      </div>
    </header>
  );
}
