"use client";

import { useAuthStore } from '../store/authStore';
import { Wallet, Bell, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { user } = useAuthStore();
  const balance = user?.ecoPayBalance || 0;
  const pathname = usePathname();

  if (
    pathname?.startsWith('/admin') || 
    pathname?.startsWith('/buyer') || 
    pathname?.startsWith('/kurir') || 
    pathname?.startsWith('/seller') ||
    pathname?.startsWith('/dashboard')
  ) {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <div className="flex flex-col items-center justify-center">
                <svg className="w-8 h-8 md:w-10 md:h-10" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Pin Outline */}
                  <path d="M50 5C25.147 5 5 25.147 5 50C5 82.5 50 115 50 115C50 115 95 82.5 95 50C95 25.147 74.853 5 50 5ZM50 16C68.778 16 84 31.222 84 50C84 72 50 97.5 50 97.5C50 97.5 16 72 16 50C16 31.222 31.222 16 50 16Z" fill="#144226"/>
                  {/* Leaf Pattern */}
                  <path d="M50 22C50 22 25 32 25 57C25 72 45 82 50 87C55 82 75 72 75 57C75 32 50 22 50 22Z" fill="#2A7A4A"/>
                  <path d="M50 25 V85" stroke="#1A5632" strokeWidth="2"/>
                  <path d="M50 40 L35 30" stroke="#1A5632" strokeWidth="2"/>
                  <path d="M50 55 L32 45" stroke="#1A5632" strokeWidth="2"/>
                  <path d="M50 70 L35 60" stroke="#1A5632" strokeWidth="2"/>
                  <path d="M50 40 L65 30" stroke="#1A5632" strokeWidth="2"/>
                  <path d="M50 55 L68 45" stroke="#1A5632" strokeWidth="2"/>
                  <path d="M50 70 L65 60" stroke="#1A5632" strokeWidth="2"/>
                  {/* Spoon Cutout */}
                  <path d="M50 35C44 35 40 42 40 49C40 54.5 45 58 47 59V83C47 84.6 48.4 86 50 86C51.6 86 53 84.6 53 83V59C55 58 60 54.5 60 49C60 42 56 35 50 35Z" fill="white"/>
                </svg>
                <div className="flex flex-col items-center mt-1">
                  <span className="text-xl md:text-2xl font-black text-[#144226] tracking-widest leading-none">ECOEAT</span>
                  <span className="text-[0.4rem] md:text-[0.5rem] font-bold text-[#144226] tracking-widest mt-0.5 whitespace-nowrap">DELIVERY & SURPLUS FOOD</span>
                </div>
              </div>
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center bg-green-50 px-4 py-2 rounded-full border border-green-100 cursor-pointer hover:bg-green-100 transition-colors">
              <Wallet className="h-5 w-5 text-green-600 mr-2" />
              <span className="font-semibold text-green-800">
                Rp {balance.toLocaleString('id-ID')}
              </span>
            </div>
            <button className="text-gray-500 hover:text-green-600 transition-colors">
              <Bell className="h-6 w-6" />
            </button>
            <button className="flex items-center text-gray-500 hover:text-green-600 transition-colors">
              <User className="h-6 w-6" />
              {user && <span className="ml-2 font-medium text-sm">{user.name}</span>}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
