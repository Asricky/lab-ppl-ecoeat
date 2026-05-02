"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  HeartHandshake, 
  BarChart3, 
  Settings,
  Search,
  Bell,
  HelpCircle,
  Plus,
  Wallet,
  Star,
  User
} from 'lucide-react';

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '';

  const navItems = [
    { name: 'Dashboard', href: '/dashboard/seller', icon: LayoutDashboard },
    { name: 'Products', href: '/dashboard/seller/products', icon: Package },
    { name: 'Orders', href: '/dashboard/seller/orders', icon: ShoppingCart },
    { name: 'Donations', href: '/dashboard/seller/donations', icon: HeartHandshake },
    { name: 'Analytics', href: '/dashboard/seller/analytics', icon: BarChart3 },
    { name: 'Reviews', href: '/dashboard/seller/reviews', icon: Star },
    { name: 'Settings', href: '/dashboard/seller/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#F9FAFB] overflow-hidden font-sans text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-[#F3F8F2] border-r border-[#E2EFE5] flex flex-col flex-shrink-0">
        <div className="p-6 pb-2">
          <Link href="/dashboard/seller" className="flex items-center mb-4">
            {/* Prefer /public/logo-ecoeat.png; repo ships SVG fallback as logo-ecoeat.svg */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-ecoeat.svg"
              alt="EcoEat — Delivery & Surplus Food"
              className="h-10 w-auto max-w-[200px] object-contain object-left"
            />
          </Link>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  isActive 
                    ? 'bg-white text-[#1A5632] shadow-sm' 
                    : 'text-gray-600 hover:bg-[#E2EFE5] hover:text-[#1A5632]'
                }`}
              >
                <item.icon size={20} className={isActive ? 'text-[#1A5632]' : 'text-gray-500'} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-[#E2EFE5] space-y-2">
          <Link href="/dashboard/seller/products/create" className="flex items-center justify-center space-x-2 w-full bg-[#1A5632] hover:bg-[#0F351F] text-white px-4 py-3 rounded-xl font-bold transition-colors shadow-sm">
            <Plus size={20} />
            <span>Add product</span>
          </Link>
          <button onClick={() => alert("Opening Help Center...")} className="flex items-center justify-center space-x-2 w-full bg-transparent hover:bg-[#E2EFE5] text-gray-600 px-4 py-3 rounded-xl font-medium transition-colors">
            <HelpCircle size={20} />
            <span className="text-sm">Help Center</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0 gap-6">
          <Link href="/dashboard/seller" className="shrink-0 hidden sm:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-ecoeat.svg"
              alt="EcoEat — Delivery & Surplus Food"
              className="h-9 w-auto max-w-[180px] object-contain object-left"
            />
          </Link>
          <div className="flex-1 flex items-center min-w-0">
            <div className="relative w-full max-w-lg">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products, orders, or analytics..."
                className="block w-full pl-10 pr-12 py-2 border border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 focus:bg-white focus:ring-2 focus:ring-[#1A5632] focus:border-transparent text-sm transition-all outline-none text-gray-700"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    alert(`Searching for: ${(e.target as HTMLInputElement).value}`);
                  }
                }}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-[10px] font-bold text-gray-400 border border-gray-200 rounded px-1.5 py-0.5 bg-white shadow-sm">Ctrl K</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-5">
            {/* EcoPay Wallet Display */}
            <Link href="/dashboard/seller/wallet" className="bg-[#E8F3EB] px-4 py-1.5 rounded-full flex items-center space-x-2 border border-[#D1E8D7] shadow-sm">
              <Wallet size={16} className="text-[#1A5632]" />
              <span className="text-sm font-bold text-[#1A5632]">Rp 50.000</span>
            </Link>
            <button onClick={() => alert("No new notifications")} className="text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="h-6 w-6" />
            </button>
            <button onClick={() => alert("Opening Settings...")} className="text-gray-400 hover:text-gray-600 transition-colors">
              <Settings className="h-6 w-6" />
            </button>
            <button onClick={() => alert("Opening User Profile...")} className="text-gray-400 hover:text-gray-600 transition-colors">
              <User className="h-6 w-6" />
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-8 print:p-0 print:overflow-visible">
          {children}
        </main>
      </div>

      {/* Global Print Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #pdf-report-content, #pdf-report-content * {
            visibility: visible;
          }
          #pdf-report-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
          }
          @page {
            size: A4;
            margin: 1cm;
          }
        }
      `}} />
    </div>
  );
}
