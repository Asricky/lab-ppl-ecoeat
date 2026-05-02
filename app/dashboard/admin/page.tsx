"use client";

import React, { useState } from 'react';
import { Users, AlertCircle, FileText, ArrowUpRight, Check, X, File, TrendingUp, Receipt, Leaf, Link as LinkIcon, Download, ZoomIn, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [pipelineTab, setPipelineTab] = useState<'seller' | 'lks'>('seller');
  
  const [sellerItems, setSellerItems] = useState([
    { id: 1, name: 'Green Valley Cooperatives', doc: 'NIB_2023_GV.pdf', icon: 'bg-green-100 text-green-700', status: 'PENDING' },
    { id: 2, name: 'EcoHarvest Logistics', doc: 'Business_License.jpg', icon: 'bg-green-100 text-green-700', status: 'PENDING' },
    { id: 3, name: 'Bumi Lestari Foundation', doc: 'Tax_ID_2023.pdf', icon: 'bg-green-100 text-green-700', status: 'APPROVED' },
    { id: 4, name: 'Urban Oasis Mart', doc: 'Incomplete_File.zip', icon: 'bg-gray-100 text-gray-600', status: 'REJECTED' }
  ]);

  const [lksItems, setLksItems] = useState([
    { id: 5, name: 'Yayasan Peduli Pangan', doc: 'SK_Kemenkumham.pdf', icon: 'bg-blue-100 text-blue-700', status: 'PENDING' },
    { id: 6, name: 'Dompet Dhuafa', doc: 'Akta_Yayasan_2023.pdf', icon: 'bg-blue-100 text-blue-700', status: 'PENDING' }
  ]);

  const [previewModal, setPreviewModal] = useState<{ id: number, name: string, doc: string, type: 'seller' | 'lks' } | null>(null);

  const activeItems = pipelineTab === 'seller' ? sellerItems : lksItems;

  const handleAction = (id: number, type: 'seller' | 'lks', newStatus: string) => {
    if (type === 'seller') {
      setSellerItems(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
    } else {
      setLksItems(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
    }
    setPreviewModal(null);
  };

  const handleDownloadPdf = (fileName: string) => {
    const pdfContent = "data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0ZpbHRlci9GbGF0ZURlY29kZT4+CnN0cmVhbQp4nDPQM1Qo5ypUMFAwALJMLU31jBQsTAz1DBSKkhPz4hNLUvX8/B1AgiU5iXkKJYkFiaZgXimXAhAHAOlVDwQKZW5kc3RyZWFtCmVuZG9iagoKMyAwIG9iago0MgplbmRvYmoKCjUgMCBvYmoKPDw+PgplbmRvYmoKCjQgMCBvYmoKPDwvVHlwZS9QYWdlcy9Db3VudCAxL0tpZHNbIDEgMCBSIF0+PgplbmRvYmoKCjYgMCBvYmoKPDwvVHlwZS9DYXRhbG9nL1BhZ2VzIDQgMCBSPj4KZW5kb2JqCgoxIDAgb2JqCjw8L1R5cGUvUGFnZS9SZXNvdXJjZXMgNSAwIFIvTWVkaWFCb3hbIDAgMCA1OTUgODQyIF0vQ29udGVudHMgMiAwIFIvUGFyZW50IDQgMCBSPj4KZW5kb2JqCgp4cmVmCjAgNwowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAyMjUgMDAwMDAgbiAKMDAwMDAwMDE4MiAwMDAwMCBuIAowMDAwMDAwMDE4IDAwMDAwIG4gCjAwMDAwMDAxMjUgMDAwMDAgbiAKMDAwMDAwMDAxOCAwMDAwMCBuIAowMDAwMDAwMTc1IDAwMDAwIG4gCnRyYWlsZXIKPDwvU2l6ZSA3L1Jvb3QgNiAwIFI+PgpzdGFydHhyZWYKMzI2CiUlRU9GCg==";
    const link = document.createElement("a");
    link.setAttribute("href", pdfContent);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto pb-16 relative">
      {/* Document Preview Modal */}
      {previewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setPreviewModal(null)}></div>
          <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden relative z-10 flex flex-col h-[80vh]">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Document Review: {previewModal.name}</h3>
                <p className="text-sm font-medium text-gray-500 mt-1">{previewModal.doc}</p>
              </div>
              <div className="flex items-center space-x-3">
                <button onClick={() => handleDownloadPdf(previewModal.doc)} className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                  <Download size={16} />
                  <span>Download File</span>
                </button>
                <button onClick={() => setPreviewModal(null)} className="p-2 text-gray-400 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="flex-1 bg-gray-100 p-8 flex items-center justify-center overflow-auto">
              <div className="bg-white w-full max-w-2xl h-[800px] shadow-sm rounded-xl border border-gray-200 flex flex-col items-center justify-center text-gray-400">
                <FileText size={64} className="mb-4 opacity-20" />
                <p className="font-medium">Secure Document Viewer</p>
                <p className="text-sm mt-2">{previewModal.doc}</p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
              <p className="text-sm font-medium text-gray-500">Please verify all information before approving.</p>
              <div className="flex space-x-3">
                <button onClick={() => handleAction(previewModal.id, previewModal.type, 'REJECTED')} className="bg-white border border-red-200 text-red-600 hover:bg-red-50 px-6 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm">
                  Reject Application
                </button>
                <button onClick={() => handleAction(previewModal.id, previewModal.type, 'APPROVED')} className="flex items-center space-x-2 bg-[#1A5632] hover:bg-[#0F351F] text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm">
                  <CheckCircle2 size={18} />
                  <span>Approve Application</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header section */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Overview</p>
          <h1 className="text-4xl font-bold text-gray-900">Admin Console</h1>
        </div>
        <div className="bg-[#EAF3E1] text-[#1A5632] px-4 py-2 rounded-full flex items-center space-x-2 border border-[#D1E8D7]">
          <span className="w-2 h-2 bg-[#1A5632] rounded-full animate-pulse"></span>
          <span className="text-xs font-bold tracking-wider">System Live</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Users size={48} /></div>
          <h3 className="text-sm font-bold text-gray-500 mb-2">Total Active Users</h3>
          <p className="text-3xl font-black text-gray-900">1,482</p>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded mt-3 inline-block">+12% this month</span>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><TrendingUp size={48} /></div>
          <h3 className="text-sm font-bold text-gray-500 mb-2">Platform Revenue</h3>
          <p className="text-3xl font-black text-[#1A5632]">Rp 45.2M</p>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded mt-3 inline-block">+Rp 4.2M this week</span>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Leaf size={48} /></div>
          <h3 className="text-sm font-bold text-gray-500 mb-2">Total Meals Saved</h3>
          <p className="text-3xl font-black text-gray-900">12.4k</p>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded mt-3 inline-block">Equivalent to 400 families</span>
        </div>
        <div className="bg-[#1A5632] p-6 rounded-3xl shadow-sm border border-[#0F351F] relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-white"><AlertCircle size={48} /></div>
          <h3 className="text-sm font-bold text-emerald-100 mb-2">Pending Actions</h3>
          <p className="text-3xl font-black text-white">{sellerItems.filter(i=>i.status==='PENDING').length + lksItems.filter(i=>i.status==='PENDING').length}</p>
          <span className="text-[10px] font-bold text-[#1A5632] bg-emerald-100 px-2 py-1 rounded mt-3 inline-block">Requires attention</span>
        </div>
      </div>

      {/* Verification Pipeline */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Verification Pipeline</h2>
            <p className="text-sm font-medium text-gray-500 mt-1">Approve new ecosystem partners to join the network.</p>
          </div>
          <div className="flex bg-[#F4F8EC] p-1.5 rounded-xl">
            <button onClick={() => setPipelineTab('seller')} className={`${pipelineTab === 'seller' ? 'bg-white text-[#1A5632] shadow-sm' : 'text-gray-500 hover:text-[#1A5632]'} px-6 py-2 rounded-lg text-sm font-bold transition-colors`}>Seller Verification</button>
            <button onClick={() => setPipelineTab('lks')} className={`${pipelineTab === 'lks' ? 'bg-white text-[#1A5632] shadow-sm' : 'text-gray-500 hover:text-[#1A5632]'} px-6 py-2 rounded-lg text-sm font-bold transition-colors`}>LKS Verification</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                <th className="pb-4 font-bold">Partner Name</th>
                <th className="pb-4 font-bold">Doc Preview</th>
                <th className="pb-4 font-bold">Status</th>
                <th className="pb-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {activeItems.map((item, idx) => (
                <tr key={idx} className="group hover:bg-gray-50/50 transition-colors">
                  <td className="py-5 flex items-center space-x-4 pl-2">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.icon}`}>
                      <FileText size={20} />
                    </div>
                    <span className="font-bold text-gray-900 group-hover:text-[#1A5632] transition-colors">{item.name}</span>
                  </td>
                  <td className="py-5">
                    <div onClick={() => setPreviewModal({ id: item.id, name: item.name, doc: item.doc, type: pipelineTab })} className="flex items-center space-x-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer">
                      <File size={16} />
                      <span>{item.doc}</span>
                    </div>
                  </td>
                  <td className="py-5">
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                      item.status === 'PENDING' ? 'bg-gray-100 text-gray-500' :
                      item.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-5 text-right pr-2">
                    <div className="flex justify-end space-x-3">
                      {item.status === 'PENDING' ? (
                        <>
                          <button onClick={() => handleAction(item.id, pipelineTab, 'APPROVED')} className="bg-[#1A5632] hover:bg-[#0F351F] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow-sm">Approve</button>
                          <button onClick={() => handleAction(item.id, pipelineTab, 'REJECTED')} className="border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg text-xs font-bold transition-colors">Reject</button>
                        </>
                      ) : (
                        <button onClick={() => handleAction(item.id, pipelineTab, 'PENDING')} className="text-gray-400 hover:text-gray-600 px-4 py-2 text-xs font-bold underline">Undo</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <div className="bg-[#FAFCF8] rounded-3xl p-6 border border-green-50 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Recent Transactions</h3>
            <Receipt size={18} className="text-green-600" />
          </div>
          <div className="space-y-4">
            {[
              { id: 'Order #8421', time: '2 mins ago', amount: 'Rp 42.000' },
              { id: 'Order #8420', time: '15 mins ago', amount: 'Rp 18.500' },
              { id: 'Order #8419', time: '1 hour ago', amount: 'Rp 124.000' },
            ].map((tx, i) => (
              <div key={i} className="bg-white p-4 rounded-2xl flex justify-between items-center shadow-sm border border-gray-50 cursor-pointer group hover:bg-gray-50">
                <div>
                  <p className="font-bold text-gray-900 text-sm">{tx.id}</p>
                  <p className="text-xs text-gray-400 font-medium">{tx.time}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-emerald-600">{tx.amount}</span>
                  <ArrowUpRight size={16} className="text-gray-400 group-hover:text-[#1A5632]" />
                </div>
              </div>
            ))}
          </div>
          <Link href="/dashboard/admin/transactions">
            <button className="w-full mt-6 text-sm font-bold text-[#1A5632] hover:text-[#0F351F] transition-colors">View Ledger</button>
          </Link>
        </div>

        {/* New Registrations */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">New Registrations</h3>
            <Users size={18} className="text-gray-400" />
          </div>
          <div className="space-y-4">
            {[
              { name: 'Fresh Farms Ltd.', time: '20 mins ago', avatar: 'FF' },
              { name: 'Sarah Jenkins', time: '1 hour ago', avatar: 'SJ' },
              { name: 'Eco Delivery Co.', time: '3 hours ago', avatar: 'ED' },
            ].map((user, i) => (
              <div key={i} className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center font-bold text-[#1A5632] text-xs">
                    {user.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{user.name}</p>
                    <p className="text-xs text-gray-400 font-medium">{user.time}</p>
                  </div>
                </div>
                <button className="text-xs font-bold text-[#1A5632] hover:underline">Review</button>
              </div>
            ))}
          </div>
          <Link href="/dashboard/admin/users">
            <button className="w-full mt-6 text-sm font-bold text-[#1A5632] hover:text-[#0F351F] transition-colors">Manage Users</button>
          </Link>
        </div>

        {/* Impact Summary */}
        <div className="bg-[#1A5632] rounded-3xl p-6 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-white"><Leaf size={100} /></div>
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-emerald-100 uppercase tracking-wider">Weekly Impact</h3>
              <Leaf size={18} className="text-emerald-400" />
            </div>
            
            <h2 className="text-5xl font-black text-white mb-2">840<span className="text-2xl text-emerald-300">kg</span></h2>
            <p className="text-sm font-medium text-emerald-100 mb-8">Surplus food redirected this week. This equates to 2,100 meals provided to communities.</p>
          </div>
          
          <button onClick={() => handleDownloadPdf('EcoEat_Impact_Report.pdf')} className="w-full bg-emerald-500 hover:bg-emerald-400 text-white py-3 rounded-xl font-bold transition-colors shadow-sm">
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
}
