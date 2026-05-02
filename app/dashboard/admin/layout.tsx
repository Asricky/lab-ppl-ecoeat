"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  AlertTriangle, 
  Receipt, 
  BarChart2, 
  Settings,
  Search,
  Bell,
  HelpCircle,
  Leaf
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard },
    { name: 'Users', href: '/dashboard/admin/users', icon: Users },
    { name: 'Verification', href: '/dashboard/admin/verification', icon: ShieldCheck },
    { name: 'Transactions', href: '/dashboard/admin/transactions', icon: Receipt },
    { name: 'Reports', href: '/dashboard/admin/reports', icon: BarChart2 },
    { name: 'Settings', href: '/dashboard/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#F4F8EC]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#F4F8EC] flex flex-col justify-between border-r border-[#E2EAD8]">
        <div>
          {/* Logo */}
          <div className="p-6 flex flex-col items-center justify-center">
            {/* Temporary Logo placeholder using icon since image is not uploaded yet */}
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="bg-[#1A5632] p-3 rounded-full text-white">
                <Leaf size={32} />
              </div>
              <div className="text-center">
                <h1 className="text-xl font-black text-[#1A5632] tracking-wider uppercase">EcoEat</h1>
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Admin Console</p>
              </div>
            </div>
            {/* When image is ready, replace above block with: */}
            {/* <img src="/WhatsApp Image 2026-04-16 at 19.55.54 4.jpg" alt="EcoEat Logo" className="w-24 object-contain" /> */}
          </div>

          {/* Navigation */}
          <nav className="mt-6 px-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
                    isActive
                      ? 'bg-white text-[#1A5632] shadow-sm'
                      : 'text-gray-500 hover:bg-[#EAF3E1] hover:text-[#1A5632]'
                  }`}
                >
                  <Icon size={20} className={isActive ? 'text-[#1A5632]' : ''} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Profile */}
        <div className="p-4 m-4 bg-[#EAF3E1] rounded-2xl flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#1A5632] font-bold shrink-0 shadow-sm overflow-hidden">
            <img src="https://ui-avatars.com/api/?name=Marcus+Chen&background=fff&color=1A5632" alt="Marcus Chen" className="w-full h-full object-cover" />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-gray-900 truncate">Marcus Chen</p>
            <p className="text-xs text-gray-500 font-medium truncate">System Manager</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#FAFCF8]">
        {/* Topbar */}
        <header className="h-20 px-8 flex items-center justify-between border-b border-gray-100 bg-[#FAFCF8] shrink-0">
          <div className="flex items-center">
            <div className="bg-[#EAF3E1] text-[#1A5632] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Admin Control
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Quick search ledger..."
                className="pl-10 pr-4 py-2 bg-[#F3F8F2] border-none rounded-full text-sm font-medium focus:ring-2 focus:ring-[#1A5632] outline-none w-64 transition-all"
              />
            </div>
            <div className="flex items-center space-x-3 text-gray-500">
              <button className="p-2 hover:bg-[#EAF3E1] hover:text-[#1A5632] rounded-full transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 hover:bg-[#EAF3E1] hover:text-[#1A5632] rounded-full transition-colors">
                <HelpCircle size={20} />
              </button>
            </div>
            <div className="w-9 h-9 rounded-full bg-gray-200 border border-gray-300 overflow-hidden shrink-0">
              <img src="https://ui-avatars.com/api/?name=Marcus+Chen&background=1A5632&color=fff" alt="Profile" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
