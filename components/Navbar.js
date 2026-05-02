"use client";

import { useEcoPayStore } from '../store/ecoPayStore';
import { Wallet, Bell, User } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  const balance = useEcoPayStore((state) => state.balance);

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-green-700 tracking-tight flex items-center">
                <svg className="w-8 h-8 mr-2 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                  <path d="M12 6c-3.31 0-6 2.69-6 6h12c0-3.31-2.69-6-6-6z"/>
                </svg>
                ECOEAT
              </span>
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
            <button className="text-gray-500 hover:text-green-600 transition-colors">
              <User className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
