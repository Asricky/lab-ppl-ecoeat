"use client";

import React from 'react';
import { ChevronLeft, CheckCircle2, ShieldCheck, Leaf, Ban, MoreHorizontal, Download, Filter, Truck, ShoppingBag, Shield } from 'lucide-react';
import Link from 'next/link';

const usersDatabase = [
  { 
    id: '1', 
    name: 'Julian Casablancas', 
    email: 'julian.c@eco-net.org', 
    role: 'PRODUCER', 
    date: 'October 14, 2022', 
    status: 'ACTIVE', 
    impact: '2,450 kg saved',
    avatar: 'https://ui-avatars.com/api/?name=Julian+Casablancas&background=random'
  },
  { 
    id: '2', 
    name: 'Elena Rodriguez', 
    email: 'e.rodriguez@greenway.com', 
    role: 'COURIER', 
    date: 'November 04, 2023', 
    status: 'SUSPENDED', 
    impact: '120 deliveries',
    avatar: 'https://ui-avatars.com/api/?name=Elena+Rodriguez&background=random'
  },
  { 
    id: '3', 
    name: 'Thomas Haze', 
    email: 't.haze@harvest.market', 
    role: 'BUYER', 
    date: 'January 15, 2024', 
    status: 'ACTIVE', 
    impact: '850 kg purchased',
    avatar: 'https://ui-avatars.com/api/?name=Thomas+Haze&background=random'
  },
  { 
    id: '4', 
    name: 'Sarah Jenkins', 
    email: 'sarah.j@freshly.com', 
    role: 'PRODUCER', 
    date: 'February 02, 2024', 
    status: 'ACTIVE', 
    impact: '1,200 kg saved',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Jenkins&background=random'
  },
  { 
    id: '5', 
    name: 'Michael Chang', 
    email: 'm.chang@logistics.com', 
    role: 'COURIER', 
    date: 'February 10, 2024', 
    status: 'ACTIVE', 
    impact: '45 deliveries',
    avatar: 'https://ui-avatars.com/api/?name=Michael+Chang&background=random'
  },
];

export default function UserProfileDetail({ params }: { params: { id: string } }) {
  const user = usersDatabase.find(u => u.id === params.id) || usersDatabase[0];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Top Section */}
      <div className="mb-6">
        <Link href="/admin/users" className="inline-flex items-center space-x-2 text-gray-500 hover:text-[#1A5632] font-bold text-sm transition-colors">
          <ChevronLeft size={16} />
          <span>Back to Directory</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Profile Header Card */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
          <div className="w-32 h-32 rounded-3xl overflow-hidden bg-gray-100 shrink-0 border-4 border-[#F4F8EC]">
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 w-full">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-black text-gray-900">{user.name}</h1>
              <span className="bg-[#EAF3E1] text-[#1A5632] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">{user.role}</span>
            </div>
            <p className="text-gray-500 font-medium flex items-center mb-8">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              {user.email}
            </p>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Member Since</p>
                <p className="font-bold text-gray-900">{user.date}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Verification</p>
                <p className="font-bold text-emerald-600 flex items-center">
                  <ShieldCheck size={16} className="mr-1.5" />
                  Verified ID
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Impact Score</p>
                <p className="font-bold text-gray-900 flex items-center">
                  <Leaf size={16} className="mr-1.5 text-[#1A5632]" />
                  {user.impact}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Action Card */}
        <div className="bg-[#F4F8EC] rounded-3xl p-8 border border-[#E2EAD8] shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <h3 className="font-bold text-gray-900">Account Status</h3>
            <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${user.status === 'ACTIVE' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-gray-400'}`}></div>
          </div>
          
          <div className="bg-white py-4 rounded-2xl text-center mb-6 shadow-sm border border-gray-100">
            <span className={`text-xl font-black tracking-wider ${user.status === 'ACTIVE' ? 'text-emerald-600' : 'text-gray-500'}`}>{user.status}</span>
          </div>

          <div className="space-y-3">
            <button onClick={() => alert(`[ACTION: ACTIVATE]\n\nTarget User: ${user.name}\nSending activation command to database...`)} className="w-full bg-[#34A853] hover:bg-[#2c8f46] text-white py-3.5 rounded-xl font-bold flex items-center justify-center space-x-2 transition-colors shadow-sm">
              <CheckCircle2 size={18} />
              <span>Activate Account</span>
            </button>
            <button onClick={() => alert(`[ACTION: SUSPEND]\n\nSuspending user: ${user.name}\nReason: Admin manual override.\n\nAll current privileges will be revoked.`)} className="w-full bg-red-50 hover:bg-red-100 border border-red-100 text-red-600 py-3.5 rounded-xl font-bold flex items-center justify-center space-x-2 transition-colors">
              <Ban size={18} />
              <span>Suspend User</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
            <button className="text-xs font-bold text-[#1A5632] hover:underline">View All</button>
          </div>

          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
            
            <div className="relative flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 z-10 border-4 border-white">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Logged in</h4>
                <p className="text-xs font-medium text-gray-500">2 hours ago • Safari / macOS</p>
              </div>
            </div>

            <div className="relative flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-[#EAF3E1] text-[#1A5632] flex items-center justify-center shrink-0 z-10 border-4 border-white">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"></path></svg>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Performed Action</h4>
                <p className="text-xs font-medium text-gray-500">Yesterday, 4:12 PM</p>
              </div>
            </div>

            <div className="relative flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center shrink-0 z-10 border-4 border-white">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Updated profile</h4>
                <p className="text-xs font-medium text-gray-500">Mar 12, 2024</p>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-lg font-bold text-gray-900">Transaction History</h2>
            <div className="flex space-x-2">
              <button className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-lg transition-colors border border-gray-200">
                <Filter size={16} />
              </button>
              <button className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-lg transition-colors border border-gray-200">
                <Download size={16} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="pb-4 pr-6">Order ID</th>
                  <th className="pb-4 px-6">Date</th>
                  <th className="pb-4 px-6">Amount</th>
                  <th className="pb-4 px-6">Status</th>
                  <th className="pb-4 pl-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="bg-[#FAFCF8] rounded-xl border-b-[8px] border-white">
                  <td className="py-4 pl-4 pr-6 font-bold text-gray-900 rounded-l-xl">#TXN-94021</td>
                  <td className="py-4 px-6 font-medium text-gray-500">Mar 15, 2024</td>
                  <td className="py-4 px-6 font-black text-[#1A5632]">Rp 420.000</td>
                  <td className="py-4 px-6">
                    <span className="bg-[#D1E8D7] text-[#1A5632] text-[9px] font-bold px-2 py-1 rounded uppercase tracking-wider">Paid</span>
                  </td>
                  <td className="py-4 pl-6 pr-4 text-right rounded-r-xl">
                    <button className="text-gray-400 hover:text-gray-900"><MoreHorizontal size={18}/></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <p className="text-[10px] font-medium text-gray-400 mt-6 pb-20 md:pb-0">Last audited by System Automator on Mar 20, 2024</p>

      {/* Live Offset Widget */}
      <div className="fixed bottom-8 right-8 bg-[#FAFCF8] rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 p-2 pr-6 flex items-center space-x-4 z-50">
        <div className="bg-[#1A5632] text-white p-3 rounded-full shadow-inner">
          <svg className="w-5 h-5 text-yellow-400 fill-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Live Offset</p>
          <p className="text-sm font-black text-gray-900">24.5kg meals saved today</p>
        </div>
      </div>
    </div>
  );
}
