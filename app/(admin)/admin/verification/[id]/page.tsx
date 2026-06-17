"use client";

import React, { useState } from 'react';
import { FileText, ZoomIn, Download, Printer, CheckCircle2, XCircle, Flag, ChevronLeft, Search } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useVerificationStore } from '@/store/verificationStore';

export default function VerificationDetailPage() {
  const [isZoomed, setIsZoomed] = useState(false);
  const params = useParams();
  const idStr = params.id;
  const id = idStr ? parseInt(idStr as string, 10) : null;

  const { applicants, updateStatus, updateNotes } = useVerificationStore();

  const applicant = applicants.find(app => app.id === id);

  const handleDownload = () => {
    const pdfContent = "data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0ZpbHRlci9GbGF0ZURlY29kZT4+CnN0cmVhbQp4nDPQM1Qo5ypUMFAwALJMLU31jBQsTAz1DBSKkhPz4hNLUvX8/B1AgiU5iXkKJYkFiaZgXimXAhAHAOlVDwQKZW5kc3RyZWFtCmVuZG9iagoKMyAwIG9iago0MgplbmRvYmoKCjUgMCBvYmoKPDw+PgplbmRvYmoKCjQgMCBvYmoKPDwvVHlwZS9QYWdlcy9Db3VudCAxL0tpZHNbIDEgMCBSIF0+PgplbmRvYmoKCjYgMCBvYmoKPDwvVHlwZS9DYXRhbG9nL1BhZ2VzIDQgMCBSPj4KZW5kb2JqCgoxIDAgb2JqCjw8L1R5cGUvUGFnZS9SZXNvdXJjZXMgNSAwIFIvTWVkaWFCb3hbIDAgMCA1OTUgODQyIF0vQ29udGVudHMgMiAwIFIvUGFyZW50IDQgMCBSPj4KZW5kb2JqCgp4cmVmCjAgNwowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAyMjUgMDAwMDAgbiAKMDAwMDAwMDE4MiAwMDAwMCBuIAowMDAwMDAwMDE4IDAwMDAwIG4gCjAwMDAwMDAxMjUgMDAwMDAgbiAKMDAwMDAwMDAxOCAwMDAwMCBuIAowMDAwMDAwMTc1IDAwMDAwIG4gCnRyYWlsZXIKPDwvU2l6ZSA3L1Jvb3QgNiAwIFI+PgpzdGFydHhyZWYKMzI2CiUlRU9GCg==";
    const link = document.createElement("a");
    link.setAttribute("href", pdfContent);
    link.setAttribute("download", applicant ? `${applicant.file}` : `Verification_Document.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!applicant) {
    return (
      <div className="max-w-7xl mx-auto pb-16 text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Applicant Not Found</h2>
        <p className="text-gray-500 mb-8">The verification request with ID "{idStr}" does not exist.</p>
        <Link href="/admin/verification">
          <span className="bg-[#1A5632] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#0F351F] transition-colors cursor-pointer inline-block">
            Back to Dashboard
          </span>
        </Link>
      </div>
    );
  }

  const status = applicant.status.toLowerCase() as 'pending' | 'approved' | 'rejected';
  
  // Document Label & Text details based on type
  const docTypeLabel = 
    applicant.tab === 'seller' ? 'Business License Document' : 
    applicant.tab === 'lks' ? 'LKS Verification Document' : 
    applicant.tab === 'buyer' ? 'Identity Card (KTP)' : 'Driver License (SIM)';
  
  const docMainTitle = 
    applicant.tab === 'seller' ? 'CERTIFICATE OF\nAGRICULTURAL\nCOMPLIANCE' : 
    applicant.tab === 'lks' ? 'MINISTRY OF SOCIAL AFFAIRS\nYAYASAN REGISTRATION' : 
    applicant.tab === 'buyer' ? 'INDONESIAN NATIONAL\nIDENTITY CARD (KTP)' : 'NATIONAL DRIVING\nLICENSE (SIM)';

  const docSubtitle = 
    applicant.tab === 'seller' ? 'State Department of Sustainable Farming' : 
    applicant.tab === 'lks' ? 'Ministry of Social Affairs / Kemenkumham' : 
    applicant.tab === 'buyer' ? 'Republik Indonesia KTP Archive' : 'Kepolisian Negara Republik Indonesia';

  const docDescText = 
    applicant.tab === 'seller' ? `This is to certify that the aforementioned entity, ${applicant.name}, has met all the rigorous standards set forth for sustainable food surplus management and biological organic handling within the Verdant Harvest ecosystem.` : 
    applicant.tab === 'lks' ? `This document confirms that ${applicant.name} is a legally registered Social Institution (LKS) authorized to receive, store, and distribute food donations to registered beneficiaries under local jurisdiction.` : 
    applicant.tab === 'buyer' ? `This represents the verified identity file of buyer partner ${applicant.name}. Account is designated as verified individual consumer eligible for purchasing surplus listings.` : 
    `This represents the verified driving license of delivery courier partner ${applicant.name}, permitting vehicle operation for transporting orders and surplus packages.`;

  const docLicenseNumber = `VH - 0${applicant.id}08 - ${applicant.tab.toUpperCase().substring(0, 3)} - ${applicant.id}`;

  return (
    <div className="max-w-7xl mx-auto pb-16 relative">
      {/* Zoom Modal Overlay */}
      {isZoomed && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-8 backdrop-blur-sm" onClick={() => setIsZoomed(false)}>
          <div className="bg-white w-full max-w-4xl aspect-[8.5/11] shadow-2xl p-16 relative scale-100 transition-transform cursor-zoom-out" onClick={(e) => e.stopPropagation()}>
             <button onClick={() => setIsZoomed(false)} className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-full p-2"><XCircle size={24} /></button>
             <h1 className="text-4xl font-black text-gray-900 tracking-wider mb-4 whitespace-pre-line">{docMainTitle}</h1>
             <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-16">{docSubtitle}</p>
             <div className="w-full h-1 bg-gray-900 mb-12"></div>
             <div className="grid grid-cols-2 gap-8 mb-16">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Registered Entity</p>
                  <p className="text-2xl font-bold text-gray-900 leading-tight">{applicant.name}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">License / ID Number</p>
                  <p className="text-xl font-bold text-gray-900">{docLicenseNumber}</p>
                </div>
             </div>
             <p className="text-lg font-medium text-gray-700 leading-relaxed mb-16">
                {docDescText}
             </p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/admin/verification" className="text-gray-400 hover:text-gray-900 transition-colors">
            <ChevronLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold text-[#1A5632]">Verification Management</h1>
        </div>
        <div className="relative hidden md:block">
          <Search size={16} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search entries..." 
            className="bg-[#FAFCF8] border border-[#E2EAD8] rounded-full pl-10 pr-4 py-2.5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1A5632] w-72" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Document Viewer (Left) */}
        <div className="lg:col-span-3 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col overflow-hidden relative">
          
          {/* Status Overlay if not pending */}
          {status !== 'pending' && (
            <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-md flex items-center justify-center flex-col">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-2xl ${status === 'approved' ? 'bg-[#1A5632] text-white' : 'bg-red-500 text-white'}`}>
                {status === 'approved' ? <CheckCircle2 size={48} /> : <XCircle size={48} />}
              </div>
              <h2 className={`text-3xl font-black mb-2 ${status === 'approved' ? 'text-[#1A5632]' : 'text-red-600'}`}>
                {status === 'approved' ? 'Application Approved' : 'Application Rejected'}
              </h2>
              <p className="text-gray-600 font-medium">The decision has been logged and the applicant notified.</p>
            </div>
          )}

          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-[#FAFCF8]">
            <div className="flex items-center space-x-2 text-gray-900 font-bold">
              <FileText size={20} className="text-[#1A5632]" />
              <span>{docTypeLabel}</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-500">
              <button onClick={() => setIsZoomed(true)} className="p-2 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"><ZoomIn size={18} /></button>
              <button onClick={handleDownload} className="p-2 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"><Download size={18} /></button>
              <button onClick={() => alert('Connecting to printer...')} className="p-2 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"><Printer size={18} /></button>
            </div>
          </div>
          
          <div className="flex-1 bg-gray-50 p-8 flex items-center justify-center min-h-[600px]">
            {/* Mock Document */}
            <div 
              onClick={() => setIsZoomed(true)} 
              className="bg-white w-full max-w-lg aspect-[8.5/11] shadow-lg border border-gray-200 relative p-12 cursor-zoom-in transition-transform hover:scale-[1.02]"
            >
              <div className="absolute top-12 right-12 w-24 h-24 border-4 border-emerald-100 rounded-full flex items-center justify-center rotate-12 opacity-50">
                <span className="text-emerald-500 font-black text-[10px] uppercase text-center leading-tight">Certified<br/>EcoEat</span>
              </div>
              <h1 className="text-2xl font-black text-gray-900 tracking-wider mb-2 whitespace-pre-line">{docMainTitle}</h1>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-12">{docSubtitle}</p>
              
              <div className="w-full h-0.5 bg-gray-900 mb-8"></div>
              
              <div className="grid grid-cols-2 gap-8 mb-12">
                <div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Registered Entity</p>
                  <p className="text-lg font-bold text-gray-900 leading-tight">{applicant.name}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">License / ID Number</p>
                  <p className="font-bold text-gray-900">{docLicenseNumber}</p>
                </div>
              </div>

              <p className="text-sm font-medium text-gray-700 leading-relaxed mb-12">
                {docDescText}
              </p>

              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs text-gray-600 mb-4 border-b border-gray-900 inline-block pb-1">Inspected on {applicant.date}. Valid indefinitely.</p>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Platform Integrity Officer</p>
                </div>
                <div className="w-16 h-16 bg-[#F4F8EC] rounded-full flex items-center justify-center">
                  <CheckCircle2 size={32} className="text-[#1A5632]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Panel (Right) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Verification Request Details */}
          <div className="bg-[#F4F8EC] rounded-3xl p-8 border border-[#E2EAD8] shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Verification Request Details</h2>
            
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Applicant Name</p>
                <p className="text-xl font-bold text-gray-900">{applicant.name}</p>
              </div>
              
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Type</p>
                <p className="font-bold text-gray-900 flex items-center capitalize">
                  <span className="w-2 h-2 rounded-full bg-[#1A5632] mr-2"></span>
                  {applicant.tab === 'kurir' ? 'Courier' : applicant.tab}
                </p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Submission Date</p>
                <p className="font-bold text-gray-900 flex items-center">
                  <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  {applicant.date}
                </p>
              </div>
            </div>
          </div>

          {/* Internal Notes */}
          <div className="bg-[#FAFCF8] rounded-3xl p-8 border border-gray-100 shadow-sm">
            <h2 className="text-sm font-bold text-gray-900 mb-4">Internal Notes</h2>
            <textarea 
              value={applicant.notes || ''}
              onChange={(e) => updateNotes(applicant.id, e.target.value)}
              disabled={status !== 'pending'}
              className="w-full h-32 bg-[#E2EAD8]/30 border border-transparent rounded-2xl p-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1A5632] resize-none placeholder-gray-400 font-medium disabled:opacity-50"
              placeholder="Type observations about this applicant..."
            ></textarea>
            <p className="text-[9px] font-bold text-gray-400 italic mt-2">* Notes are only visible to internal staff members.</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 relative">
            
            {status !== 'pending' && (
               <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                 <button onClick={() => updateStatus(applicant.id, 'PENDING')} className="bg-white border border-gray-200 shadow-sm px-4 py-2 rounded-lg font-bold text-sm text-gray-600 hover:text-gray-900">Undo Action</button>
               </div>
            )}

            <button onClick={() => updateStatus(applicant.id, 'APPROVED')} className="w-full bg-[#34A853] hover:bg-[#2c8f46] text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 transition-colors shadow-sm">
              <CheckCircle2 size={20} />
              <span>Approve Application</span>
            </button>
            <button onClick={() => updateStatus(applicant.id, 'REJECTED')} className="w-full bg-[#FDF9F9] border border-red-100 hover:bg-red-50 text-red-600 py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 transition-colors">
              <XCircle size={20} />
              <span>Reject Application</span>
            </button>
            <div className="text-center mt-6 pt-4">
              <button onClick={() => alert('Opening email template...')} className="text-sm font-bold text-gray-500 hover:text-gray-900 flex items-center justify-center space-x-2 mx-auto transition-colors">
                <Flag size={16} />
                <span>Request Further Documentation</span>
              </button>
            </div>
          </div>
        </div>
      </div>

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
