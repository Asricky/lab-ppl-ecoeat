"use client";

import React, { useState } from 'react';
import { ShoppingCart, HeartHandshake, CheckCircle2, Leaf, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SellOrDonateDecision() {
  const [choice, setChoice] = useState<'sell' | 'donate'>('sell');

  return (
    <div className="min-h-screen bg-[#F3F8F2] flex flex-col">
      {/* Header with Logo */}
      <header className="h-20 px-8 flex items-center justify-between bg-[#F3F8F2]">
        <div className="flex items-center space-x-8">
           <img src="/logo.jpg" alt="EcoEat Logo" className="h-12 w-auto object-contain" />
           <div className="hidden md:flex space-x-6 text-sm font-bold text-gray-500">
             <Link href="#" className="hover:text-[#1A5632] transition-colors">Marketplace</Link>
             <Link href="#" className="hover:text-[#1A5632] transition-colors">Impact</Link>
             <Link href="#" className="hover:text-[#1A5632] transition-colors">History</Link>
           </div>
        </div>
        <div className="flex items-center space-x-5">
          <div className="relative hidden md:block w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input
              type="text"
              placeholder="Search surplus..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full bg-[#E8EDE6] text-sm focus:outline-none focus:ring-2 focus:ring-[#1A5632] transition-colors"
            />
          </div>
          <button onClick={() => alert("Search functionality coming soon")} className="text-[#1A5632] hover:text-green-800 transition-colors">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
          </button>
          <button onClick={() => alert("Opening User Profile menu...")} className="w-8 h-8 rounded-full bg-blue-100 overflow-hidden flex-shrink-0 border-2 border-white shadow-sm hover:ring-2 hover:ring-[#1A5632] transition-all">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User" className="w-full h-full object-cover" />
          </button>
        </div>
      </header>

      {/* Decision Section */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 flex flex-col justify-center relative mt-16 pb-20">
        
        {/* Back Button */}
        <div className="absolute -top-12 left-4">
          <button onClick={() => window.history.back()} className="flex items-center space-x-2 text-gray-500 hover:text-[#1A5632] transition-colors font-bold text-sm bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
        </div>

        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-[#E8F3EB] text-[#1A5632] px-4 py-1.5 rounded-full text-xs font-bold mb-6 border border-[#D1E8D7] shadow-sm">
            <Leaf size={14} />
            <span>YOUR SURPLUS HAS SAVED 42KG OF CO2 THIS WEEK</span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">What do you want to do with this food?</h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto font-medium">Select the path for your surplus produce. Every choice contributes to the EcoEat cycle of sustainability.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 w-full">
          {/* Sell Card */}
          <div 
            onClick={() => setChoice('sell')}
            className={`relative bg-white rounded-3xl p-8 cursor-pointer transition-all ${
              choice === 'sell' 
                ? 'border-2 border-[#1A5632] shadow-lg ring-4 ring-[#E8F3EB]' 
                : 'border border-gray-200 hover:border-[#1A5632]/50 hover:shadow-md'
            }`}
          >
            {choice === 'sell' && (
              <div className="absolute top-6 right-6 text-[#1A5632]">
                <CheckCircle2 size={28} className="fill-[#1A5632] text-white" />
              </div>
            )}
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
              choice === 'sell' ? 'bg-[#E8F3EB] text-[#1A5632]' : 'bg-gray-100 text-gray-500'
            }`}>
              <ShoppingCart size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Sell Food</h2>
            <p className="text-sm text-gray-500 font-medium mb-8 leading-relaxed max-w-xs">
              List this item for buyers to purchase at a competitive price on the local marketplace.
            </p>
            <div className="mt-auto">
              <span className="text-[#1A5632] text-xs font-bold hover:underline cursor-pointer flex items-center">
                Configure Pricing <span className="ml-1">→</span>
              </span>
            </div>
          </div>

          {/* Donate Card */}
          <div 
            onClick={() => setChoice('donate')}
            className={`relative bg-white rounded-3xl p-8 cursor-pointer transition-all flex flex-col ${
              choice === 'donate' 
                ? 'border-2 border-[#1A5632] shadow-lg ring-4 ring-[#E8F3EB]' 
                : 'border border-gray-200 hover:border-[#1A5632]/50 hover:shadow-md'
            }`}
          >
            {choice === 'donate' && (
              <div className="absolute top-6 right-6 text-[#1A5632]">
                <CheckCircle2 size={28} className="fill-[#1A5632] text-white" />
              </div>
            )}
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
              choice === 'donate' ? 'bg-[#E8F3EB] text-[#1A5632]' : 'bg-gray-100 text-gray-500'
            }`}>
              <HeartHandshake size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Donate Food</h2>
            <p className="text-sm text-gray-500 font-medium mb-8 leading-relaxed max-w-xs">
              Send this food to a verified organization to support families in need and claim tax relief.
            </p>
            <div className="mt-auto">
              <span className="text-[#1A5632] text-xs font-bold hover:underline cursor-pointer flex items-center">
                Select Organization <span className="ml-1">→</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <Link href={`/seller?flow=${choice}`}>
            <button className="bg-[#2A824A] hover:bg-[#1A5632] text-white px-10 py-3 rounded-xl font-bold text-sm shadow-sm transition-colors">
              Continue
            </button>
          </Link>
          <p className="mt-4 text-[10px] font-bold text-gray-500 tracking-widest uppercase">Step 2 of 4: Distribution Intent</p>
        </div>
      </main>
    </div>
  );
}
