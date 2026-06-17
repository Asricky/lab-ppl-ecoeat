"use client";

import React, { useState } from 'react';
import { Users, AlertCircle, FileText, ArrowUpRight, Check, X, File, TrendingUp, Receipt, Link as LinkIcon, Download, ZoomIn, CheckCircle2 } from 'lucide-react';
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

  const handleDownloadPdf = async (fileName: string) => {
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();

      if (fileName === 'EcoEat_Revenue_Report.pdf') {
        // --- REVENUE REPORT GENERATION ---
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
        doc.text('PLATFORM REVENUE REPORT', 120, 24);
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(`Period: Year-to-Date (YTD)`, 120, 30);
        doc.text(`Generated: ${new Date().toLocaleDateString('id-ID')}`, 120, 36);

        // Metadata
        doc.setTextColor(80, 80, 80);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('Financial Metadata', 20, 52);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(`Reporting Entity: EcoEat Finance Dept`, 20, 60);
        doc.text(`Currency: Indonesian Rupiah (IDR)`, 20, 66);
        doc.text(`Audit Status: Internal Reconciliation`, 20, 72);

        // Separator
        doc.setDrawColor(220, 220, 220);
        doc.line(20, 78, 190, 78);

        // Financial summary cards
        doc.setFillColor(248, 250, 246);
        doc.setDrawColor(220, 235, 210);
        doc.rect(20, 85, 170, 30, 'FD');
        
        doc.setTextColor(100, 100, 100);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.text('TOTAL PLATFORM REVENUE YTD', 25, 93);
        
        doc.setTextColor(26, 86, 50);
        doc.setFontSize(20);
        doc.text('Rp 45.200.000', 25, 106);

        // Revenue Streams Table
        doc.setTextColor(26, 86, 50);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('1. Revenue Streams Breakdown', 20, 130);

        doc.setFillColor(234, 243, 225);
        doc.rect(20, 137, 170, 7, 'F');
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(26, 86, 50);
        doc.text('Revenue Stream', 25, 142);
        doc.text('Model / Rate', 90, 142);
        doc.text('Contribution (IDR)', 150, 142);

        doc.setDrawColor(220, 220, 220);
        doc.line(20, 144, 190, 144);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(60, 60, 60);
        doc.text('Seller Admin Fee', 25, 150);
        doc.text('5% of seller profit per product', 90, 150);
        doc.setFont('helvetica', 'bold');
        doc.text('Rp 32.100.000', 150, 150);

        doc.line(20, 153, 190, 153);

        doc.setFont('helvetica', 'normal');
        doc.text('Buyer Transaction Fee', 25, 159);
        doc.text('Rp 10.000 flat per buyer checkout', 90, 159);
        doc.setFont('helvetica', 'bold');
        doc.text('Rp 13.100.000', 150, 159);

        doc.line(20, 162, 190, 162);

        // Total
        doc.setFillColor(245, 245, 245);
        doc.rect(20, 164, 170, 8, 'F');
        doc.setFont('helvetica', 'bold');
        doc.text('Total Consolidated Revenue', 25, 170);
        doc.text('-', 90, 170);
        doc.setTextColor(26, 86, 50);
        doc.text('Rp 45.200.000', 150, 170);

        // Analysis text
        doc.setTextColor(26, 86, 50);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('2. Financial Narrative', 20, 190);

        doc.setTextColor(60, 60, 60);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        const text = "EcoEat's primary monetization channels continue to perform robustly. The Seller Admin Fee remains the dominant contributor, accounting for approximately 71% of total revenue. This is driven by high-volume food surplus sales from our cooperative partners. Meanwhile, the Buyer Transaction Fee contributes 29%, showing steady growth in consumer checkouts.";
        const splitText = doc.splitTextToSize(text, 170);
        doc.text(splitText, 20, 197);

        // Footer
        doc.setDrawColor(220, 220, 220);
        doc.line(20, 268, 190, 268);
        doc.setFontSize(7.5);
        doc.setTextColor(140, 140, 140);
        doc.text('EcoEat Finance Console - Confidential Performance Document.', 20, 274);
        doc.text('Page 1 of 1', 175, 274);
      } else {
        // --- MERCHANT/LKS DOCUMENT CERTIFICATE GENERATION ---
        // Find document info in state to make it look real
        const allItems = [...sellerItems, ...lksItems];
        const matchedItem = allItems.find(i => i.doc === fileName);
        const partnerName = matchedItem ? matchedItem.name : 'Ecosystem Partner';
        const partnerStatus = matchedItem ? matchedItem.status : 'PENDING';
        
        doc.setFillColor(34, 49, 63);
        doc.rect(0, 0, 210, 45, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        doc.text('EcoEat Document System', 20, 24);
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text('PARTNER VERIFICATION REPOSITORY', 20, 31);
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'italic');
        doc.text('Verified Archive & Audit Log', 20, 38);

        // Title Box
        doc.setTextColor(40, 40, 40);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text('SUBMITTED CREDENTIAL DETAILS', 20, 65);

        // Draw info card
        doc.setFillColor(248, 249, 250);
        doc.setDrawColor(220, 224, 230);
        doc.rect(20, 72, 170, 75, 'FD');

        doc.setFontSize(9.5);
        doc.setTextColor(100, 100, 100);
        
        doc.text('Partner / Organization:', 25, 82);
        doc.setTextColor(26, 86, 50);
        doc.setFont('helvetica', 'bold');
        doc.text(partnerName, 80, 82);

        doc.setTextColor(100, 100, 100);
        doc.setFont('helvetica', 'normal');
        doc.text('Document Filename:', 25, 92);
        doc.setTextColor(40, 40, 40);
        doc.setFont('helvetica', 'bold');
        doc.text(fileName, 80, 92);

        doc.setTextColor(100, 100, 100);
        doc.setFont('helvetica', 'normal');
        doc.text('Verification Status:', 25, 102);
        
        if (partnerStatus === 'APPROVED') {
          doc.setTextColor(40, 167, 69);
        } else if (partnerStatus === 'REJECTED') {
          doc.setTextColor(220, 53, 69);
        } else {
          doc.setTextColor(108, 117, 125);
        }
        doc.setFont('helvetica', 'bold');
        doc.text(partnerStatus, 80, 102);

        doc.setTextColor(100, 100, 100);
        doc.setFont('helvetica', 'normal');
        doc.text('Timestamp:', 25, 112);
        doc.setTextColor(40, 40, 40);
        doc.text(new Date().toLocaleString('id-ID'), 80, 112);

        doc.setTextColor(100, 100, 100);
        doc.text('Security Hash Checksum:', 25, 122);
        doc.setFont('courier', 'normal');
        doc.setFontSize(8.5);
        doc.text('SHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 80, 122);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(100, 100, 100);
        doc.text('System Integrity:', 25, 132);
        doc.setTextColor(40, 167, 69);
        doc.setFont('helvetica', 'bold');
        doc.text('SIGNED & SECURED BY ECOEAT CLOUD VAULT', 80, 132);

        // Details Section
        doc.setTextColor(40, 40, 40);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('Audit & Compliance Statement', 20, 165);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(80, 80, 80);
        const auditText = `This document confirms that the partner, ${partnerName}, has uploaded credentials to support their registration. Our compliance department has logged this submission. In accordance with Indonesian digital trade regulations, this record represents a formal verification archive.`;
        const splitAudit = doc.splitTextToSize(auditText, 170);
        doc.text(splitAudit, 20, 172);

        // Decorative seal
        doc.setDrawColor(200, 200, 200);
        doc.setFillColor(250, 250, 250);
        doc.rect(130, 200, 45, 45, 'F');
        doc.setTextColor(150, 150, 150);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.text('ECOEAT SECURITY SEAL', 133, 208);
        doc.setLineWidth(0.5);
        doc.line(133, 211, 172, 211);
        doc.setFont('courier', 'normal');
        doc.setFontSize(6.5);
        doc.text('status: ' + partnerStatus, 133, 218);
        doc.text('user: Marcus Chen', 133, 224);
        doc.text('date: ' + new Date().toLocaleDateString('id-ID'), 133, 230);
        
        // Footer
        doc.setDrawColor(220, 220, 220);
        doc.line(20, 268, 190, 268);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(140, 140, 140);
        doc.text('EcoEat Identity Console - Secure Document Vault.', 20, 274);
        doc.text('Page 1 of 1', 175, 274);
      }

      doc.save(fileName);
    } catch (err) {
      console.error('Error generating PDF:', err);
    }
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
          <p className="text-[10px] font-medium text-gray-400 mt-2 leading-relaxed">
            5% admin fee from seller profit + Rp 10.000 per buyer transaction
          </p>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded mt-2 inline-block">+Rp 4.2M this week</span>
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
          <Link href="/admin/transactions">
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
          <Link href="/admin/users">
            <button className="w-full mt-6 text-sm font-bold text-[#1A5632] hover:text-[#0F351F] transition-colors">Manage Users</button>
          </Link>
        </div>

        {/* Revenue Breakdown */}
        <div className="bg-[#1A5632] rounded-3xl p-6 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-white"><TrendingUp size={100} /></div>
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-emerald-100 uppercase tracking-wider">Revenue Breakdown</h3>
              <Receipt size={18} className="text-emerald-400" />
            </div>
            <h2 className="text-4xl font-black text-white mb-4">Rp 45.2M</h2>
            <div className="space-y-3">
              <div className="bg-white/10 rounded-xl p-3">
                <p className="text-xs font-bold text-emerald-200 uppercase tracking-wider mb-1">Seller Admin Fee</p>
                <p className="text-lg font-black text-white">Rp 32.1M</p>
                <p className="text-[10px] text-emerald-300 mt-0.5">5% dari keuntungan seller per produk</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <p className="text-xs font-bold text-emerald-200 uppercase tracking-wider mb-1">Buyer Transaction Fee</p>
                <p className="text-lg font-black text-white">Rp 13.1M</p>
                <p className="text-[10px] text-emerald-300 mt-0.5">Rp 10.000 per transaksi buyer</p>
              </div>
            </div>
          </div>
          <button onClick={() => handleDownloadPdf('EcoEat_Revenue_Report.pdf')} className="w-full mt-4 bg-emerald-500 hover:bg-emerald-400 text-white py-3 rounded-xl font-bold transition-colors shadow-sm">
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
}
