"use client";

import React, { useState } from 'react';
import { Shield, FileText, ChevronLeft, ChevronRight, X, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

type Applicant = {
  id: number;
  name: string;
  type: string;
  file: string;
  date: string;
  time: string;
  status: string;
  avatar: string;
  isErrorFile?: boolean;
};

export default function AdminVerificationPage() {
  const [activeTab, setActiveTab] = useState<'seller' | 'lks'>('seller');

  const sellerApplicants: Applicant[] = [
    { id: 1, name: 'Green Valley Cooperatives', type: 'Organic Produce Supplier', file: 'NIB_2023_GV.pdf', date: 'Oct 24, 2023', time: '14:32 PM', status: 'PENDING', avatar: 'https://ui-avatars.com/api/?name=Green+Valley&background=1A5632&color=fff' },
    { id: 2, name: 'EcoHarvest Logistics', type: 'Fresh Food Distributor', file: 'Business_License.jpg', date: 'Oct 23, 2023', time: '09:15 AM', status: 'PENDING', avatar: 'https://ui-avatars.com/api/?name=EcoHarvest&background=409B5C&color=fff' },
    { id: 3, name: 'Bumi Lestari Foundation', type: 'Community Kitchen Network', file: 'Tax_ID_2023.pdf', date: 'Oct 21, 2023', time: '11:00 AM', status: 'APPROVED', avatar: 'https://ui-avatars.com/api/?name=Bumi+Lestari&background=B0D5B5&color=1A5632' },
    { id: 4, name: 'Urban Oasis Mart', type: 'Retail Store', file: 'Incomplete_File.zip', date: 'Oct 20, 2023', time: '16:45 PM', status: 'REJECTED', isErrorFile: true, avatar: 'https://ui-avatars.com/api/?name=Urban+Oasis&background=E2EAD8&color=1A5632' },
  ];

  const lksApplicants: Applicant[] = [
    { id: 5, name: 'Yayasan Peduli Pangan', type: 'Registered Food Bank', file: 'SK_Kemenkumham.pdf', date: 'Oct 25, 2023', time: '10:00 AM', status: 'PENDING', avatar: 'https://ui-avatars.com/api/?name=Yayasan+Peduli&background=2563EB&color=fff' },
    { id: 6, name: 'Dompet Dhuafa', type: 'National Charity', file: 'Akta_Yayasan_2023.pdf', date: 'Oct 24, 2023', time: '15:20 PM', status: 'PENDING', avatar: 'https://ui-avatars.com/api/?name=Dompet+Dhuafa&background=3B82F6&color=fff' },
  ];

  const applicants = activeTab === 'seller' ? sellerApplicants : lksApplicants;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Administrative Dashboard</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Verification</h1>
          
          <div className="flex space-x-6 border-b border-gray-200">
            <button 
              onClick={() => setActiveTab('seller')}
              className={`pb-4 font-bold flex items-center space-x-2 transition-colors ${activeTab === 'seller' ? 'text-[#1A5632] border-b-2 border-[#1A5632]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <span>Seller Verification</span>
              <span className={`${activeTab === 'seller' ? 'bg-[#1A5632] text-white' : 'bg-gray-200 text-gray-500'} text-[10px] px-2 py-0.5 rounded-full transition-colors`}>5 pending</span>
            </button>
            <button 
              onClick={() => setActiveTab('lks')}
              className={`pb-4 font-bold flex items-center space-x-2 transition-colors ${activeTab === 'lks' ? 'text-[#1A5632] border-b-2 border-[#1A5632]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <span>LKS Verification</span>
              <span className={`${activeTab === 'lks' ? 'bg-[#1A5632] text-white' : 'bg-gray-200 text-gray-500'} text-[10px] px-2 py-0.5 rounded-full transition-colors`}>2 pending</span>
            </button>
          </div>
        </div>
        <div className="mb-6">
          <span className="bg-[#EAF3E1] text-[#1A5632] text-[11px] font-bold px-4 py-2 rounded-full flex items-center space-x-2">
            <span className="w-1.5 h-1.5 bg-[#1A5632] rounded-full animate-pulse"></span>
            <span>{activeTab === 'seller' ? '7' : '2'} submissions awaiting urgent review</span>
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
              {applicants.map((app) => (
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
                        <button onClick={() => alert(`[ACTION: APPROVE]\n\nApplicant: ${app.name}\nDocument: ${app.file}\n\nFast-track approval executed.`)} className="bg-[#1A5632] hover:bg-[#0F351F] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm">Approve</button>
                        <button onClick={() => alert(`[ACTION: REJECT]\n\nApplicant: ${app.name}\nDocument: ${app.file}\n\nFast-track rejection executed.`)} className="text-red-400 hover:text-red-600 transition-colors p-1"><X size={18} /></button>
                      </div>
                    ) : (
                      <button onClick={() => alert(`Loading history logs for ${app.name}...`)} className="text-xs font-bold text-gray-500 hover:text-[#1A5632] transition-colors">
                        {app.status === 'APPROVED' ? 'View Logs' : 'Review Denial'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-8 py-5 border-t border-gray-100 flex items-center justify-between text-sm bg-[#FAFCF8]">
          <p className="text-gray-500 font-medium">Showing <span className="font-bold text-gray-900">{applicants.length}</span> of {activeTab === 'seller' ? '127' : '15'} applicants</p>
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
              <h2 className="text-5xl font-black text-[#1A5632] mb-2">{activeTab === 'seller' ? '14' : '3'}</h2>
              <p className="text-[10px] font-bold text-[#409B5C] uppercase tracking-widest">New This Week</p>
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
              New NIB verification protocols are active as of Nov 1st. Ensure all legal documents are OCR-checked.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
