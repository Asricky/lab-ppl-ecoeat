"use client";

import React, { useState } from 'react';
import { ShoppingCart, HeartHandshake, CheckCircle2, Leaf, Bell, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useProductStore } from '@/store/productStore';

export default function SellOrDonateDecision() {
  const { draftProduct, setDraftProduct } = useProductStore();
  const [selectedOption, setSelectedOption] = useState<'sell' | 'donate'>(
    draftProduct.type.toLowerCase() === 'donate' ? 'donate' : 'sell'
  );

  const handleSelectOption = (option: 'sell' | 'donate') => {
    setSelectedOption(option);
    setDraftProduct({ type: option === 'sell' ? 'Sell' : 'Donate' });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F3F8F2] -m-8 p-8 flex flex-col">
      {/* Top Navbar specifically for this flow */}
      <header className="flex justify-between items-center mb-16 max-w-6xl mx-auto w-full">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2 text-[#1A5632]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="EcoEat" className="h-10 w-10 object-contain bg-white rounded-full p-1 shadow-sm" />
            <div>
              <h1 className="font-extrabold text-lg leading-tight tracking-tight uppercase">ECOEAT</h1>
              <p className="text-[8px] font-medium tracking-wider text-[#2A7A4A] uppercase">Delivery & Surplus</p>
            </div>
          </div>
          <nav className="hidden md:flex space-x-6 text-sm font-medium text-gray-500">
            <span className="hover:text-[#1A5632] cursor-pointer">Marketplace</span>
            <span className="hover:text-[#1A5632] cursor-pointer">Impact</span>
            <span className="hover:text-[#1A5632] cursor-pointer">History</span>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative bg-gray-200 text-gray-500 rounded-full px-4 py-1.5 flex items-center space-x-2 text-sm">
            <span className="w-3 h-3 border-2 border-gray-400 rounded-full"></span>
            <span>Search surplus...</span>
          </div>
          <Bell className="text-[#1A5632] h-5 w-5" />
          <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User" />
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto w-full flex-1 relative">
        {/* Back Button */}
        <div className="absolute -top-12 left-0">
          <button onClick={() => window.history.back()} className="flex items-center space-x-2 text-gray-500 hover:text-[#1A5632] transition-colors font-bold text-sm bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
        </div>

        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-[#E8F3EB] text-[#1A5632] px-4 py-1.5 rounded-full text-xs font-bold mb-6 border border-[#D1E8D7]">
            <Leaf size={14} />
            <span>YOUR SURPLUS HAS SAVED 42KG OF CO2 THIS WEEK</span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">What do you want to do with this food?</h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto font-medium">Select the path for your surplus produce. Every choice contributes to the EcoEat cycle of sustainability.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Sell Card */}
          <div 
            onClick={() => handleSelectOption('sell')}
            className={`relative bg-white rounded-3xl p-8 cursor-pointer transition-all ${
              selectedOption === 'sell' 
                ? 'border-2 border-[#1A5632] shadow-lg ring-4 ring-[#E8F3EB]' 
                : 'border border-gray-200 hover:border-[#1A5632]/50 hover:shadow-md'
            }`}
          >
            {selectedOption === 'sell' && (
              <div className="absolute top-6 right-6 text-[#1A5632]">
                <CheckCircle2 size={28} className="fill-[#1A5632] text-white" />
              </div>
            )}
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
              selectedOption === 'sell' ? 'bg-[#E8F3EB] text-[#1A5632]' : 'bg-gray-100 text-gray-500'
            }`}>
              <ShoppingCart size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Sell Food</h2>
            <p className="text-gray-500 font-medium mb-8 leading-relaxed">
              List this item for buyers to purchase at a competitive price on the local marketplace.
            </p>
            <div className={`font-bold flex items-center text-sm ${selectedOption === 'sell' ? 'text-[#1A5632]' : 'text-[#1A5632]'}`}>
              Configure Pricing &rarr;
            </div>
          </div>

          {/* Donate Card */}
          <div 
            onClick={() => handleSelectOption('donate')}
            className={`relative bg-white rounded-3xl p-8 cursor-pointer transition-all ${
              selectedOption === 'donate' 
                ? 'border-2 border-[#1A5632] shadow-lg ring-4 ring-[#E8F3EB]' 
                : 'border border-gray-200 hover:border-[#1A5632]/50 hover:shadow-md'
            }`}
          >
            {selectedOption === 'donate' && (
              <div className="absolute top-6 right-6 text-[#1A5632]">
                <CheckCircle2 size={28} className="fill-[#1A5632] text-white" />
              </div>
            )}
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
              selectedOption === 'donate' ? 'bg-[#E8F3EB] text-[#1A5632]' : 'bg-gray-100 text-gray-500'
            }`}>
              <HeartHandshake size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Donate Food</h2>
            <p className="text-gray-500 font-medium mb-8 leading-relaxed">
              Send this food to a verified organization to support families in need and claim tax relief.
            </p>
            <div className={`font-bold flex items-center text-sm ${selectedOption === 'donate' ? 'text-[#1A5632]' : 'text-[#1A5632]'}`}>
              Select Organization &rarr;
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <Link href={selectedOption === 'sell' ? '/seller/products/create/pricing' : '/seller/donations'}>
            <button className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white px-12 py-4 rounded-xl font-bold text-lg shadow-sm transition-colors">
              Continue
            </button>
          </Link>
          <p className="mt-6 text-xs font-bold text-gray-500 tracking-widest uppercase">Step 2 of 4: Distribution Intent</p>
        </div>
      </div>
    </div>
  );
}
