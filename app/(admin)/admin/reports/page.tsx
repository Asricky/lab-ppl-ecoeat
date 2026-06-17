"use client";

import React, { useState } from 'react';
import { Download, Calendar, Activity, TrendingUp, Users, Target, RefreshCw } from 'lucide-react';

export default function AdminReportsPage() {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState('Last 30 Days');
  const [isGenerating, setIsGenerating] = useState(false);

  const ranges = ['Last 7 Days', 'Last 30 Days', 'This Month', 'Last Month', 'Q3 2023', 'YTD'];

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      
      // Header Banner (Dark Green #1A5632)
      doc.setFillColor(26, 86, 50);
      doc.rect(0, 0, 210, 40, 'F');
      
      // Header Title & Logo Text
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.text('EcoEat', 20, 25);
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('DELIVERY & SURPLUS FOOD PLATFORM', 20, 32);
      
      // Header Right (Title)
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text('MONTHLY PERFORMANCE REVIEW', 120, 24);
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Period: ${selectedRange}`, 120, 30);
      doc.text(`Generated: ${new Date().toLocaleDateString('id-ID')}`, 120, 36);

      // Metadata Block
      doc.setTextColor(80, 80, 80);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('Document Metadata', 20, 52);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`Author: Marcus Chen (System Manager)`, 20, 60);
      doc.text(`System Status: Active / Operational`, 20, 66);
      doc.text(`Database Sync: Real-time Live`, 20, 72);

      // Separator Line
      doc.setDrawColor(220, 220, 220);
      doc.line(20, 78, 190, 78);

      // Card-like stats boxes
      // Card 1: Total Transactions
      doc.setFillColor(248, 250, 246);
      doc.setDrawColor(220, 235, 210);
      doc.rect(20, 85, 52, 35, 'FD');
      doc.setTextColor(100, 100, 100);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('TOTAL TRANSACTIONS', 25, 93);
      doc.setTextColor(26, 86, 50);
      doc.setFontSize(16);
      doc.text('12,450', 25, 104);
      doc.setTextColor(46, 117, 89);
      doc.setFontSize(8);
      doc.text('+12.5% vs Last 30d', 25, 113);

      // Card 2: Gross Volume
      doc.setFillColor(248, 250, 246);
      doc.setDrawColor(220, 235, 210);
      doc.rect(79, 85, 52, 35, 'FD');
      doc.setTextColor(100, 100, 100);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('GROSS VOLUME', 84, 93);
      doc.setTextColor(26, 86, 50);
      doc.setFontSize(14);
      doc.text('Rp 45.200.000', 84, 104);
      doc.setTextColor(46, 117, 89);
      doc.setFontSize(8);
      doc.text('+8.2% vs Last 30d', 84, 113);

      // Card 3: Active Nodes
      doc.setFillColor(248, 250, 246);
      doc.setDrawColor(220, 235, 210);
      doc.rect(138, 85, 52, 35, 'FD');
      doc.setTextColor(100, 100, 100);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('ACTIVE NODES', 143, 93);
      doc.setTextColor(26, 86, 50);
      doc.setFontSize(16);
      doc.text('1,482', 143, 104);
      doc.setTextColor(46, 117, 89);
      doc.setFontSize(8);
      doc.text('+4.1% vs Last 30d', 143, 113);

      // Analysis Section
      doc.setTextColor(26, 86, 50);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('1. Platform Activity Analysis', 20, 136);

      doc.setTextColor(60, 60, 60);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      const text1 = `EcoEat has registered strong growth across all metrics in this period (${selectedRange}). Total transactions completed stood at 12,450, representing a substantial +12.5% increase. The expansion of our merchant network has led to more frequent surplus listings, creating an active environment for buyers seeking affordable high-quality options.`;
      const splitText1 = doc.splitTextToSize(text1, 170);
      doc.text(splitText1, 20, 143);

      // Impact Section
      doc.setTextColor(26, 86, 50);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('2. Environmental & Social Impact', 20, 168);

      doc.setTextColor(60, 60, 60);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      const text2 = `Our sustainable routing algorithms and courier initiatives saved 4,200 kg of edible food items from disposal. This has resulted in a carbon offset of approximately 8,400 kg of CO2 equivalent emissions. Social outreach has also been strengthened, with 45 active LKS partners participating, feeding roughly 3,200 local beneficiaries.`;
      const splitText2 = doc.splitTextToSize(text2, 170);
      doc.text(splitText2, 20, 175);

      // Fiscal Section
      doc.setTextColor(26, 86, 50);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('3. Fiscal Breakdown & Revenue Sharing', 20, 202);

      // Draw table background headers
      doc.setFillColor(234, 243, 225);
      doc.rect(20, 209, 170, 7, 'F');
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(26, 86, 50);
      doc.text('Revenue Category', 25, 214);
      doc.text('Allocation Model', 95, 214);
      doc.text('Total Contribution', 150, 214);

      // Draw lines and content
      doc.setDrawColor(220, 220, 220);
      doc.line(20, 216, 190, 216);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      doc.text('Seller Admin Fee', 25, 222);
      doc.text('5% from seller profit', 95, 222);
      doc.setFont('helvetica', 'bold');
      doc.text('Rp 32.100.000', 150, 222);

      doc.line(20, 225, 190, 225);

      doc.setFont('helvetica', 'normal');
      doc.text('Buyer Transaction Fee', 25, 231);
      doc.text('Rp 10.000 per checkout', 95, 231);
      doc.setFont('helvetica', 'bold');
      doc.text('Rp 13.100.000', 150, 231);

      doc.line(20, 234, 190, 234);

      // Total row
      doc.setFillColor(245, 245, 245);
      doc.rect(20, 236, 170, 8, 'F');
      doc.setFont('helvetica', 'bold');
      doc.text('Total Revenue', 25, 242);
      doc.text('-', 95, 242);
      doc.setTextColor(26, 86, 50);
      doc.text('Rp 45.200.000', 150, 242);

      // Document Sign-off / Signature Area
      doc.setTextColor(100, 100, 100);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('Approved by:', 20, 258);
      doc.setFont('helvetica', 'italic');
      doc.text('Marcus Chen (System Manager)', 45, 258);

      // Footer
      doc.setDrawColor(220, 220, 220);
      doc.line(20, 268, 190, 268);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(140, 140, 140);
      doc.text('EcoEat Admin Console - Confidential Performance Document. All metrics audited.', 20, 274);
      doc.text('Page 1 of 1', 175, 274);

      doc.save(`EcoEat_Report_${selectedRange.replace(/ /g, '_')}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setIsGenerating(false);
    }
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
