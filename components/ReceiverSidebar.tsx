"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
<<<<<<<< HEAD:components/ReceiverSidebar.tsx
import { LayoutDashboard, Inbox, Map, History, User, Heart, X, PlusCircle } from 'lucide-react';
import Image from 'next/image';
========
import { LayoutDashboard, Inbox, History, User, Heart, X, Settings } from 'lucide-react';
>>>>>>>> a40049867a3233069c3043db95e7768a5b4a6029:components/kurir/ReceiverSidebar.tsx

interface ReceiverSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function ReceiverSidebar({ isOpen, setIsOpen }: ReceiverSidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/lks-panti/home' },
    { icon: History, label: 'Riwayat Donasi', href: '/lks-panti/history' },
    { icon: User, label: 'Profil LKS', href: '/lks-panti/profile' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-[#f8f9fa] border-r border-ecoeat-border transform transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:h-screen
      `}>
        {/* Header / Logo */}
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-3 text-ecoeat-primary">
            <Image
              src="/Logo EcoEat.png"
              alt="EcoEat — Delivery & Surplus Food"
              width={150}
              height={36}
              priority
              className="h-9 w-auto object-contain"
            />
          </div>
          <button 
            className="md:hidden text-ecoeat-text p-1 -mt-4 -mr-2"
            onClick={() => setIsOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="px-4 mt-4 space-y-1.5 flex-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={index}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 transition-all duration-200 ${
                  isActive 
                    ? 'bg-white text-[#1e8932] shadow-sm font-bold rounded-xl border border-black/5' 
                    : 'text-gray-500 hover:bg-white hover:text-[#1e8932] font-medium rounded-xl hover:shadow-sm'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-[#1e8932]' : 'text-gray-400'} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 mt-auto border-t border-black/5 text-xs text-gray-500 font-semibold">
          EcoEat LKS Panel
        </div>
      </aside>
    </>
  );
}
