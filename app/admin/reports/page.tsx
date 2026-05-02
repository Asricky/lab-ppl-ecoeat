"use client";

import React, { useState } from 'react';
import { Download, Calendar, Activity, TrendingUp, Users, Target, RefreshCw } from 'lucide-react';

export default function AdminReportsPage() {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState('Last 30 Days');
  const [isGenerating, setIsGenerating] = useState(false);

  const ranges = ['Last 7 Days', 'Last 30 Days', 'This Month', 'Last Month', 'Q3 2023', 'YTD'];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const pdfContent = "data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0ZpbHRlci9GbGF0ZURlY29kZT4+CnN0cmVhbQp4nDPQM1Qo5ypUMFAwALJMLU31jBQsTAz1DBSKkhPz4hNLUvX8/B1AgiU5iXkKJYkFiaZgXimXAhAHAOlVDwQKZW5kc3RyZWFtCmVuZG9iagoKMyAwIG9iago0MgplbmRvYmoKCjUgMCBvYmoKPDw+PgplbmRvYmoKCjQgMCBvYmoKPDwvVHlwZS9QYWdlcy9Db3VudCAxL0tpZHNbIDEgMCBSIF0+PgplbmRvYmoKCjYgMCBvYmoKPDwvVHlwZS9DYXRhbG9nL1BhZ2VzIDQgMCBSPj4KZW5kb2JqCgoxIDAgb2JqCjw8L1R5cGUvUGFnZS9SZXNvdXJjZXMgNSAwIFIvTWVkaWFCb3hbIDAgMCA1OTUgODQyIF0vQ29udGVudHMgMiAwIFIvUGFyZW50IDQgMCBSPj4KZW5kb2JqCgp4cmVmCjAgNwowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAyMjUgMDAwMDAgbiAKMDAwMDAwMDE4MiAwMDAwMCBuIAowMDAwMDAwMDE4IDAwMDAwIG4gCjAwMDAwMDAxMjUgMDAwMDAgbiAKMDAwMDAwMDAxOCAwMDAwMCBuIAowMDAwMDAwMTc1IDAwMDAwIG4gCnRyYWlsZXIKPDwvU2l6ZSA3L1Jvb3QgNiAwIFI+PgpzdGFydHhyZWYKMzI2CiUlRU9GCg==";
      const link = document.createElement("a");
      link.setAttribute("href", pdfContent);
      link.setAttribute("download", `EcoEat_Report_${selectedRange.replace(/ /g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto pb-24">
      {/* Header */}
      <div className="flex justify-between items-end mb-8 relative">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">System Performance</p>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        </div>
        
        <div className="relative">
          <div 
            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)} 
            className="flex items-center space-x-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl font-bold text-sm shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <Calendar size={16} className="text-gray-400" />
            <span>{selectedRange}</span>
            <svg className={`w-4 h-4 text-gray-400 transform transition-transform ${isDatePickerOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
          
          {isDatePickerOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-20">
              {ranges.map(range => (
                <button 
                  key={range}
                  onClick={() => { setSelectedRange(range); setIsDatePickerOpen(false); }}
                  className={`w-full text-left px-4 py-3 text-sm font-bold ${selectedRange === range ? 'bg-[#EAF3E1] text-[#1A5632]' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  {range}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Same stats cards... */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
              <Activity size={20} />
            </div>
            <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-1 rounded-full">+12.5%</span>
          </div>
          <h3 className="text-3xl font-black text-gray-900 mb-1">12,450</h3>
          <p className="text-sm font-bold text-gray-400">Total Transactions</p>
        </div>
        
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
            <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-1 rounded-full">+8.2%</span>
          </div>
          <h3 className="text-3xl font-black text-gray-900 mb-1">Rp 45.200.000</h3>
          <p className="text-sm font-bold text-gray-400">Gross Volume</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center">
              <Users size={20} />
            </div>
            <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-1 rounded-full">+4.1%</span>
          </div>
          <h3 className="text-3xl font-black text-gray-900 mb-1">1,482</h3>
          <p className="text-sm font-bold text-gray-400">Active Nodes</p>
        </div>
      </div>

      {/* Rest of charts ... */}
      
      {/* Generate Report Banner */}
      <div className="bg-[#1A5632] rounded-3xl p-1 relative overflow-hidden mt-8">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="bg-white/5 backdrop-blur-sm p-8 md:p-12 rounded-[22px] flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 md:mr-8 text-center md:text-left z-10">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-2">Ready for the monthly review?</h2>
            <p className="text-sm font-medium text-emerald-100">Comprehensive analysis including top performing regions, impact statistics, and fiscal breakdown for {selectedRange}.</p>
          </div>
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`w-full md:w-auto bg-white text-[#1A5632] px-8 py-4 rounded-xl font-bold flex items-center justify-center space-x-3 transition-all shadow-lg z-10 ${isGenerating ? 'opacity-90 scale-95' : 'hover:bg-gray-50'}`}
          >
            {isGenerating ? <RefreshCw size={20} className="animate-spin" /> : <Download size={20} />}
            <span>{isGenerating ? 'Compiling Report...' : 'Generate PDF Report'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
