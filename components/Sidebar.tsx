"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CheckSquare, Map, DollarSign, Settings, LogOut, HelpCircle, Leaf, Power, X, Clock } from 'lucide-react';
import Image from 'next/image';
import { useCourier } from './CourierLayout';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const { isOnline, setIsOnline } = useCourier();
  const pathname = usePathname();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/kurir' },
    { icon: CheckSquare, label: 'Tasks', href: '/kurir' },
    { icon: Clock, label: 'History', href: '/kurir/history' },
    { icon: Map, label: 'Routes', href: '#' },
    { icon: DollarSign, label: 'Earnings', href: '#' },
    { icon: Settings, label: 'Settings', href: '#' },
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
        fixed inset-y-0 left-0 z-40 w-64 bg-ecoeat-bg border-r border-ecoeat-border transform transition-transform duration-300 ease-in-out flex flex-col
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
        <nav className="px-4 mt-6 space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={index}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 transition-all duration-200 ${
                  isActive 
                    ? 'bg-white text-ecoeat-primary shadow-sm font-bold rounded-xl' 
                    : 'text-ecoeat-muted hover:bg-white/40 hover:text-ecoeat-text font-medium rounded-xl'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-ecoeat-primary' : 'text-ecoeat-muted'} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 mt-auto space-y-4">
          <button 
            onClick={() => setIsOnline(!isOnline)}
            className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-bold transition-colors shadow-sm ${
              isOnline 
                ? 'bg-[#e5ddd5] text-[#b03021] hover:bg-[#d6ccc2]' 
                : 'bg-ecoeat-primary text-white hover:bg-ecoeat-accent'
            }`}
          >
            <Power size={18} /> 
            <span>{isOnline ? 'Go Offline' : 'Go Online'}</span>
          </button>

          <div className="space-y-1 pt-2">
            <button className="flex items-center justify-between px-4 py-2.5 w-full text-left text-ecoeat-muted font-medium hover:bg-white/40 hover:text-ecoeat-text rounded-xl transition-all">
              <div className="flex items-center gap-3">
                <HelpCircle size={20} />
                <span>Support</span>
              </div>
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                1 Issue <X size={10} className="opacity-70" />
              </span>
            </button>
            <button className="flex items-center gap-3 px-4 py-2.5 w-full text-left text-ecoeat-muted font-medium hover:bg-white/40 hover:text-ecoeat-text rounded-xl transition-all">
              <LogOut size={20} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
