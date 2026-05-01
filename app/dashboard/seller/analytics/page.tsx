"use client";

import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Leaf, 
  Wallet, 
  ArrowUpRight,
  Download,
  Calendar,
  ChevronDown,
  FileText,
  X,
  Printer,
  ArrowLeft
} from 'lucide-react';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('This Month');
  const [showReportModal, setShowReportModal] = useState(false);

  // Dummy Chart Data
  const weeklyData = [
    { day: 'Mon', revenue: 40, donations: 20 },
    { day: 'Tue', revenue: 60, donations: 30 },
    { day: 'Wed', revenue: 45000, donations: 50 },
    { day: 'Thu', revenue: 80000, donations: 40 },
    { day: 'Fri', revenue: 100000, donations: 60 },
    { day: 'Sat', revenue: 120000, donations: 80 },
    { day: 'Sun', revenue: 90000, donations: 50 },
  ];

  const handleExportCSV = () => {
    const headers = ['Day,Revenue(Rp),Donations(kg)'];
    const csvData = weeklyData.map(row => `${row.day},${row.revenue},${row.donations}`);
    const csvString = [headers, ...csvData].join('\n');
    
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ecoeat-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <div className="mb-4">
        <button onClick={() => window.history.back()} className="flex items-center space-x-2 text-gray-500 hover:text-[#1A5632] transition-colors font-bold text-sm bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 w-fit print:hidden">
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics & Impact</h1>
          <p className="text-sm font-medium text-gray-500">Track your financial performance and environmental contribution.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="flex items-center space-x-2 bg-white border border-gray-200 shadow-sm px-3 py-2 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors focus-within:ring-2 focus-within:ring-[#1A5632]">
              <Calendar size={16} className="text-gray-400" />
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-transparent outline-none appearance-none pr-4 cursor-pointer focus:outline-none"
              >
                <option value="Today">Today</option>
                <option value="This Week">This Week</option>
                <option value="This Month">This Month</option>
                <option value="This Year">This Year</option>
                <option value="All Time">All Time</option>
              </select>
              <ChevronDown size={14} className="text-gray-400 absolute right-3 pointer-events-none" />
            </div>
          </div>
          <button onClick={() => setShowReportModal(true)} className="bg-white border border-[#1A5632] text-[#1A5632] px-4 py-2 rounded-xl flex items-center space-x-2 text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm">
            <FileText size={16} />
            <span className="hidden sm:inline">Report</span>
          </button>
          <button onClick={handleExportCSV} className="bg-[#E8F3EB] text-[#1A5632] border border-[#D1E8D7] px-4 py-2 rounded-xl flex items-center space-x-2 text-sm font-bold hover:bg-[#D1E8D7] transition-colors shadow-sm">
            <Download size={16} />
            <span className="hidden sm:inline">CSV</span>
          </button>
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
              <BarChart3 size={20} />
            </div>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
              <TrendingUp size={12} className="mr-1" /> +15%
            </span>
          </div>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Total Revenue</p>
          <h3 className="text-2xl font-extrabold text-gray-900">Rp 4.250.000</h3>
        </div>

        <div className="bg-[#1A5632] rounded-2xl p-6 border border-[#144226] shadow-sm text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4">
            <Leaf size={100} />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-[#2A7A4A] p-3 rounded-xl text-white">
                <Leaf size={20} />
              </div>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-[#2A7A4A] text-white border border-[#3A8A5A]">
                <TrendingUp size={12} className="mr-1" /> +24%
              </span>
            </div>
            <p className="text-sm font-bold text-[#A3D9B5] uppercase tracking-wider mb-1">Meals Saved</p>
            <h3 className="text-2xl font-extrabold text-white">1,240 kg</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-amber-50 p-3 rounded-xl text-amber-600">
              <ArrowUpRight size={20} />
            </div>
          </div>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Conversion Rate</p>
          <h3 className="text-2xl font-extrabold text-gray-900">12.4%</h3>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-[#E8F3EB] p-3 rounded-xl text-[#1A5632]">
              <Wallet size={20} />
            </div>
          </div>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Escrow Balance</p>
          <h3 className="text-2xl font-extrabold text-gray-900">Rp 850.000</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Revenue vs Impact Overview</h3>
          
          <div className="flex-1 relative min-h-[250px] w-full flex items-end pt-8">
            {/* Y Axis Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pb-8 pointer-events-none">
              {[120000, 90000, 60000, 30000, 0].map((val, i) => (
                <div key={i} className="flex items-center w-full border-b border-gray-100 h-0 relative">
                  <span className="absolute -left-2 -translate-x-full text-[10px] text-gray-400 font-medium">
                    {val === 0 ? '0' : (val/1000) + 'k'}
                  </span>
                </div>
              ))}
            </div>

            {/* SVG Line Chart */}
            <svg className="absolute inset-0 h-full w-full overflow-visible pb-8" preserveAspectRatio="none">
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="donationGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1A5632" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#1A5632" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {/* Revenue Area & Line */}
              <path 
                d="M 5% 70% C 20% 55%, 35% 65%, 50% 40% C 65% 20%, 80% 5%, 95% 30% L 95% 100% L 5% 100% Z" 
                fill="url(#revenueGradient)" 
              />
              <path 
                d="M 5% 70% C 20% 55%, 35% 65%, 50% 40% C 65% 20%, 80% 5%, 95% 30%" 
                fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" 
              />
              
              {/* Donation Area & Line */}
              <path 
                d="M 5% 85% C 20% 75%, 35% 55%, 50% 65% C 65% 45%, 80% 25%, 95% 55% L 95% 100% L 5% 100% Z" 
                fill="url(#donationGradient)" 
              />
              <path 
                d="M 5% 85% C 20% 75%, 35% 55%, 50% 65% C 65% 45%, 80% 25%, 95% 55%" 
                fill="none" stroke="#1A5632" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="6 4"
              />
            </svg>

            {/* X Axis Labels & Tooltips */}
            <div className="absolute inset-0 flex justify-between items-end pb-2 px-[5%] pointer-events-none">
              {weeklyData.map((data, index) => (
                <div key={index} className="flex flex-col items-center group relative pointer-events-auto h-full justify-end">
                  {/* Tooltip */}
                  <div className="absolute -top-4 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap z-20 shadow-lg pointer-events-none transform -translate-x-1/2 left-1/2">
                    Rev: Rp {data.revenue.toLocaleString('id-ID')} | Don: {data.donations}kg
                  </div>
                  {/* Hover Line */}
                  <div className="w-px h-full bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-8 z-0"></div>
                  {/* Dot */}
                  <div className="w-2.5 h-2.5 bg-white border-2 border-blue-500 rounded-full mb-6 z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <span className="text-xs font-bold text-gray-500">{data.day}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center space-x-6 mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm font-bold text-gray-600">Revenue (Rp)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-1 border-b-2 border-dashed border-[#1A5632]"></div>
              <span className="text-sm font-bold text-gray-600">Donations (kg)</span>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Top Performing</h3>
            <button onClick={() => alert("Navigating to all products view...")} className="text-sm font-bold text-[#1A5632] hover:underline">View All</button>
          </div>

          <div className="space-y-5">
            {[
              { name: 'Nasi Goreng Spesial', sales: 42, rev: 'Rp 420.000', img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=100&h=100&q=80' },
              { name: 'Roti Gandum (Sisa)', sales: 38, rev: 'Rp 380.000', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=100&h=100&q=80' },
              { name: 'Sayur Sop Ayam', sales: 25, rev: 'Rp 125.000', img: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=100&h=100&q=80' },
              { name: 'Pisang Sunpride', sales: 18, rev: 'Rp 270.000', img: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=100&h=100&q=80' },
            ].map((product, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 line-clamp-1">{product.name}</p>
                    <p className="text-xs font-medium text-gray-500">{product.sales} sales</p>
                  </div>
                </div>
                <div className="text-right pl-2">
                  <p className="text-sm font-bold text-[#1A5632]">{product.rev}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* EcoPay Escrow Breakdown */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
          <Wallet size={20} className="mr-2 text-[#1A5632]" />
          EcoPay Escrow Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Available to Withdraw</p>
            <h4 className="text-xl font-bold text-gray-900">Rp 1.250.000</h4>
            <button onClick={() => alert("Withdrawal flow opened")} className="mt-3 text-sm font-bold text-[#1A5632] hover:underline">Withdraw Now</button>
          </div>
          <div className="p-4 bg-[#E8F3EB] rounded-xl border border-[#D1E8D7]">
            <p className="text-xs font-bold text-[#1A5632] uppercase tracking-wider mb-1">Held in Escrow (Pending Delivery)</p>
            <h4 className="text-xl font-bold text-[#1A5632]">Rp 850.000</h4>
            <p className="mt-3 text-xs font-medium text-[#1A5632]/80">Funds release automatically upon buyer confirmation.</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Refunded (30D)</p>
            <h4 className="text-xl font-bold text-gray-900">Rp 120.000</h4>
            <p className="mt-3 text-xs font-medium text-gray-500">2 orders refunded.</p>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setShowReportModal(false)}></div>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col relative z-10 animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="bg-[#E8F3EB] p-2 rounded-xl text-[#1A5632]">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Sustainability Report</h3>
                  <p className="text-sm font-medium text-gray-500">Preview generated report for {timeRange}</p>
                </div>
              </div>
              <button onClick={() => setShowReportModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-200">
                <X size={24} />
              </button>
            </div>

            {/* Modal Body / Report Preview */}
            <div className="flex-1 overflow-y-auto p-8 bg-gray-200/50">
              {/* This is the "A4" paper preview */}
              <div id="pdf-report-content" className="bg-white mx-auto shadow-sm border border-gray-200 p-10 max-w-2xl min-h-[800px] relative">
                
                {/* PDF Header */}
                <div className="flex justify-between items-start border-b-2 border-[#1A5632] pb-6 mb-8">
                  <div>
                    <h1 className="text-3xl font-black text-[#1A5632] mb-1">IMPACT REPORT</h1>
                    <p className="text-sm font-bold text-gray-500 tracking-widest uppercase">EcoEat Monthly Summary</p>
                  </div>
                  <div className="text-right">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/logo.jpg" alt="EcoEat" className="h-10 w-auto mb-2 inline-block opacity-80" />
                    <p className="text-xs font-medium text-gray-400">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>

                {/* PDF Seller Info */}
                <div className="bg-gray-50 rounded-xl p-5 mb-8 border border-gray-100 flex items-center space-x-4">
                   <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm">
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                     <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Alex Rivera" className="w-full h-full object-cover" />
                   </div>
                   <div>
                     <h3 className="text-lg font-bold text-gray-900">Alex Rivera</h3>
                     <p className="text-sm font-medium text-gray-500">Premium Seller • Joined Jan 2026</p>
                   </div>
                </div>

                {/* PDF Key Metrics */}
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Key Achievements</h3>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="border border-[#D1E8D7] rounded-xl p-5 bg-[#F9FCFA]">
                    <div className="flex items-center space-x-2 text-[#1A5632] mb-2">
                      <Leaf size={20} />
                      <span className="font-bold text-sm">Food Saved</span>
                    </div>
                    <p className="text-3xl font-black text-gray-900">1,240 kg</p>
                    <p className="text-xs font-medium text-[#1A5632] mt-1">+24% from last month</p>
                  </div>
                  <div className="border border-gray-200 rounded-xl p-5">
                    <div className="flex items-center space-x-2 text-blue-600 mb-2">
                      <BarChart3 size={20} />
                      <span className="font-bold text-sm">Revenue Generated</span>
                    </div>
                    <p className="text-3xl font-black text-gray-900">Rp 4.25M</p>
                    <p className="text-xs font-medium text-gray-500 mt-1">+15% from last month</p>
                  </div>
                </div>

                {/* PDF Environmental Impact */}
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Environmental Impact</h3>
                <div className="bg-[#1A5632] text-white rounded-xl p-6 mb-8 relative overflow-hidden">
                   <Leaf size={120} className="absolute -right-4 -bottom-4 text-white opacity-10" />
                   <div className="relative z-10 grid grid-cols-2 gap-6">
                     <div>
                       <p className="text-xs font-bold text-[#A3D9B5] uppercase tracking-wider mb-1">CO2 Emissions Prevented</p>
                       <p className="text-2xl font-bold">3.1 Tonnes</p>
                     </div>
                     <div>
                       <p className="text-xs font-bold text-[#A3D9B5] uppercase tracking-wider mb-1">Equivalent To</p>
                       <p className="text-xl font-bold">780 Trees Planted</p>
                     </div>
                   </div>
                </div>

                {/* PDF Footer Note */}
                <div className="mt-auto pt-8 border-t border-gray-100 text-center">
                  <p className="text-xs font-medium text-gray-400">This document is auto-generated by EcoEat Seller Portal.</p>
                  <p className="text-xs font-medium text-gray-400">Share this report to showcase your sustainability commitment!</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 bg-white flex justify-between items-center">
              <p className="text-sm font-medium text-gray-500">Format: A4 PDF Document</p>
              <div className="flex space-x-3">
                <button onClick={() => setShowReportModal(false)} className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors">
                  Cancel
                </button>
                <button onClick={() => window.print()} className="bg-[#1A5632] hover:bg-[#0F351F] text-white px-6 py-2.5 rounded-xl font-bold flex items-center space-x-2 transition-colors shadow-sm">
                  <Printer size={18} />
                  <span>Save as PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
