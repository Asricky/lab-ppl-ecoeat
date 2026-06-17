"use client";

import React, { useState } from 'react';
import { Shield, FileText, ChevronLeft, ChevronRight, X, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useVerificationStore } from '@/store/verificationStore';

export default function AdminVerificationPage() {
  const [activeTab, setActiveTab] = useState<'seller' | 'lks' | 'buyer' | 'kurir'>('seller');
  const { applicants, updateStatus } = useVerificationStore();

  const applicantsList = applicants.filter(app => app.tab === activeTab);

  const getPendingCount = (tab: 'seller' | 'lks' | 'buyer' | 'kurir') => {
    return applicants.filter(app => app.tab === tab && app.status === 'PENDING').length;
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-4">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Administrative Dashboard</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Verification</h1>
          
          <div className="flex flex-wrap gap-x-6 gap-y-2 border-b border-gray-200">
            <button 
              onClick={() => setActiveTab('seller')}
              className={`pb-4 font-bold flex items-center space-x-2 transition-colors ${activeTab === 'seller' ? 'text-[#1A5632] border-b-2 border-[#1A5632]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <span>Seller Verification</span>
              <span className={`${activeTab === 'seller' ? 'bg-[#1A5632] text-white' : 'bg-gray-200 text-gray-500'} text-[10px] px-2 py-0.5 rounded-full transition-colors`}>
                {getPendingCount('seller')} pending
              </span>
            </button>
            <button 
              onClick={() => setActiveTab('lks')}
              className={`pb-4 font-bold flex items-center space-x-2 transition-colors ${activeTab === 'lks' ? 'text-[#1A5632] border-b-2 border-[#1A5632]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <span>LKS Verification</span>
              <span className={`${activeTab === 'lks' ? 'bg-[#1A5632] text-white' : 'bg-gray-200 text-gray-500'} text-[10px] px-2 py-0.5 rounded-full transition-colors`}>
                {getPendingCount('lks')} pending
              </span>
            </button>
            <button 
              onClick={() => setActiveTab('buyer')}
              className={`pb-4 font-bold flex items-center space-x-2 transition-colors ${activeTab === 'buyer' ? 'text-[#1A5632] border-b-2 border-[#1A5632]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <span>Buyer Verification</span>
              <span className={`${activeTab === 'buyer' ? 'bg-[#1A5632] text-white' : 'bg-gray-200 text-gray-500'} text-[10px] px-2 py-0.5 rounded-full transition-colors`}>
                {getPendingCount('buyer')} pending
              </span>
            </button>
            <button 
              onClick={() => setActiveTab('kurir')}
              className={`pb-4 font-bold flex items-center space-x-2 transition-colors ${activeTab === 'kurir' ? 'text-[#1A5632] border-b-2 border-[#1A5632]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <span>Kurir Verification</span>
              <span className={`${activeTab === 'kurir' ? 'bg-[#1A5632] text-white' : 'bg-gray-200 text-gray-500'} text-[10px] px-2 py-0.5 rounded-full transition-colors`}>
                {getPendingCount('kurir')} pending
              </span>
            </button>
          </div>
        </div>
        <div className="mb-6">
          <span className="bg-[#EAF3E1] text-[#1A5632] text-[11px] font-bold px-4 py-2 rounded-full flex items-center space-x-2">
            <span className="w-1.5 h-1.5 bg-[#1A5632] rounded-full animate-pulse"></span>
            <span>{getPendingCount(activeTab)} submissions awaiting urgent review</span>
          </span>
        </div>
      </div>

      {/* Verification Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                <th className="px-8 py-5">Name</th>
                <th className="px-6 py-5">Document</th>
                <th className="px-6 py-5">Submitted</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {applicantsList.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-200 shrink-0">
                        <img src={app.avatar} alt={app.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 leading-tight">{app.name}</p>
                        <p className="text-[11px] font-medium text-gray-500 mt-1">{app.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-[#EAF3E1] text-[#1A5632] flex items-center justify-center shrink-0">
                        <FileText size={18} />
                      </div>
                      <span className={`font-semibold ${app.isErrorFile ? 'text-red-500 line-through' : 'text-gray-600'}`}>{app.file}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <p className="font-bold text-gray-900">{app.date}</p>
                    <p className="text-[11px] font-medium text-gray-500 mt-1">{app.time}</p>
                  </td>
                  <td className="px-6 py-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider ${
                      app.status === 'PENDING' ? 'bg-amber-50 text-amber-600' :
                      app.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        app.status === 'PENDING' ? 'bg-amber-500' :
                        app.status === 'APPROVED' ? 'bg-emerald-500' : 'bg-red-500'
                      }`}></span>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    {app.status === 'PENDING' ? (
                      <div className="flex items-center justify-end space-x-4">
                        <Link href={`/admin/verification/${app.id}`}>
                          <span className="text-xs font-bold text-gray-500 hover:text-[#1A5632] transition-colors cursor-pointer">Details</span>
                        </Link>
                        <button onClick={() => updateStatus(app.id, 'APPROVED')} className="bg-[#1A5632] hover:bg-[#0F351F] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm">Approve</button>
                        <button onClick={() => updateStatus(app.id, 'REJECTED')} className="text-red-400 hover:text-red-600 transition-colors p-1"><X size={18} /></button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end space-x-4">
                        <Link href={`/admin/verification/${app.id}`}>
                          <span className="text-xs font-bold text-gray-500 hover:text-[#1A5632] transition-colors cursor-pointer mr-2">Details</span>
                        </Link>
                        <button onClick={() => updateStatus(app.id, 'PENDING')} className="text-xs font-bold text-gray-400 hover:text-[#1A5632] transition-colors">
                          Undo Action
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-8 py-5 border-t border-gray-100 flex items-center justify-between text-sm bg-[#FAFCF8]">
          <p className="text-gray-500 font-medium">Showing <span className="font-bold text-gray-900">{applicantsList.length}</span> of {applicants.filter(a => a.tab === activeTab).length} applicants</p>
          <div className="flex space-x-4 text-gray-400">
            <button className="hover:text-gray-900 transition-colors"><ChevronLeft size={20} /></button>
            <button className="text-gray-900"><ChevronRight size={20} /></button>
          </div>
        </div>
      </div>

      {/* Bottom Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2 bg-[#EAF3E1] rounded-3xl p-8 border border-[#D1E8D7] shadow-sm flex flex-col justify-between">
          <h3 className="text-xl font-bold text-[#1A5632] mb-8">Compliance Overview</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <h2 className="text-5xl font-black text-[#1A5632] mb-2">94%</h2>
              <p className="text-[10px] font-bold text-[#409B5C] uppercase tracking-widest">Approval Rate</p>
            </div>
            <div>
              <h2 className="text-5xl font-black text-[#1A5632] mb-2">1.2d</h2>
              <p className="text-[10px] font-bold text-[#409B5C] uppercase tracking-widest">Avg. Processing Time</p>
            </div>
            <div>
              <h2 className="text-5xl font-black text-[#1A5632] mb-2">{applicants.filter(a => a.tab === activeTab).length}</h2>
              <p className="text-[10px] font-bold text-[#409B5C] uppercase tracking-widest">Total Registered</p>
            </div>
          </div>
        </div>

        <div className="bg-[#EAF3E1] rounded-3xl p-8 border border-[#D1E8D7] shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-4 right-4 bg-[#D1E8D7] text-[#1A5632] text-[10px] font-bold px-2 py-1 rounded">V.2.4</div>
          <div className="w-12 h-12 bg-[#1A5632] rounded-xl text-white flex items-center justify-center mb-6 shadow-sm">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-2">Policy Update</h4>
            <p className="text-sm font-medium text-gray-600 leading-relaxed">
              New registration verification protocols are active. Ensure all identity and license files match system criteria.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
