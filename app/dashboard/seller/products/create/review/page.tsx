"use client";

import React, { useState } from 'react';
import { Rocket, ArrowLeft, CheckCircle2, ShieldCheck, Tag, Info, ListChecks, Calendar as CalendarIcon, Package, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useProductStore } from '@/store/productStore';

export default function ReviewPublishPage() {
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const { addProduct, draftProduct, clearDraft } = useProductStore();

  const handlePublish = () => {
    setIsPublishing(true);
    
    // Add the new product to the store using the draft data
    addProduct({
      id: `PRD-${Math.floor(Math.random() * 1000) + 100}`, 
      name: draftProduct.name || 'Untitled Product', 
      image: draftProduct.image || 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=100&h=100&q=80',
      type: draftProduct.type || 'Sell',
      stock: draftProduct.stock || 1,
      price: draftProduct.price || 'Rp 0',
      expiry: draftProduct.expiry || 'N/A',
      status: 'Active',
      description: draftProduct.description || 'No description provided.'
    });

    setTimeout(() => {
      setIsPublishing(false);
      setIsPublished(true);
      clearDraft();
    }, 1500);
  };

  if (isPublished) {
    return (
      <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 max-w-lg">
          <div className="w-24 h-24 bg-[#E8F3EB] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={50} className="text-[#1A5632]" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Listing Published!</h2>
          <p className="text-gray-500 font-medium mb-8">
            Your "{draftProduct.name || 'Product'}" is now live on the marketplace. Buyers in your area will receive a notification.
          </p>
          <div className="flex flex-col space-y-3">
            <Link href="/dashboard/seller/products" className="w-full">
              <button className="w-full bg-[#1A5632] hover:bg-[#0F351F] text-white px-8 py-3.5 rounded-xl font-bold transition-colors shadow-sm">
                View My Products
              </button>
            </Link>
            <Link href="/dashboard/seller" className="w-full">
              <button className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 px-8 py-3.5 rounded-xl font-bold transition-colors">
                Back to Dashboard
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      {/* Header with nav logic */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex space-x-6 text-sm font-bold text-gray-500">
          <span className="text-[#1A5632] border-b-2 border-[#1A5632] pb-1">Listings</span>
          <span className="hover:text-gray-800 cursor-pointer pb-1">Marketplace</span>
        </div>
        
        {/* Stepper */}
        <div className="flex items-center space-x-4 max-w-lg w-full justify-center">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-[#E8F3EB] text-[#1A5632] flex items-center justify-center font-bold text-sm shadow-sm border border-[#D1E8D7]">✓</div>
            <span className="text-xs font-bold text-[#1A5632] mt-2">Product Info</span>
          </div>
          <div className="flex-1 h-0.5 bg-[#1A5632] mb-6"></div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-[#E8F3EB] text-[#1A5632] flex items-center justify-center font-bold text-sm shadow-sm border border-[#D1E8D7]">✓</div>
            <span className="text-xs font-bold text-[#1A5632] mt-2">Price & Inventory</span>
          </div>
          <div className="flex-1 h-0.5 bg-[#1A5632] mb-6"></div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-[#1A5632] text-white flex items-center justify-center font-bold text-sm shadow-sm">3</div>
            <span className="text-xs font-bold text-[#1A5632] mt-2">Review</span>
          </div>
        </div>
        
        <div className="w-24"></div> {/* Spacer for balance */}
      </div>

      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <div className="p-8 border-b border-gray-100 flex items-center space-x-3 bg-gray-50/50">
          <div className="bg-[#E8F3EB] p-2 rounded-xl text-[#1A5632]">
            <ListChecks size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Review Listing</h2>
            <p className="text-sm font-medium text-gray-500">Please verify the details below before publishing.</p>
          </div>
        </div>

        <div className="p-8 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Left Column: Basic Info */}
            <div className="space-y-8">
              <div>
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center border-b border-gray-100 pb-2">
                  <Package size={16} className="mr-2 text-gray-400" /> Basic Details
                </h4>
                <div className="flex space-x-6">
                  <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={draftProduct.image || "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=500&h=500&q=80"} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-3 flex-1">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Product Name</p>
                      <p className="font-bold text-gray-900">{draftProduct.name || 'Untitled'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Category</p>
                      <p className="font-medium text-gray-700">{draftProduct.category || 'Uncategorized'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Listing Type</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase mt-1 ${
                        draftProduct.type === 'Donate' ? 'bg-[#F2E8DF] text-[#7A5B42]' : 'bg-[#E8F3EB] text-[#1A5632]'
                      }`}>
                        {draftProduct.type || 'Sell'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center border-b border-gray-100 pb-2">
                  <CalendarIcon size={16} className="mr-2 text-gray-400" /> Availability
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#F3F8F2] p-4 rounded-xl border border-[#D1E8D7]">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Quantity</p>
                    <p className="font-extrabold text-[#1A5632] text-xl">{draftProduct.stock || 0} Porsi</p>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                    <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-1">Expires In</p>
                    <p className="font-extrabold text-amber-800 text-xl">{draftProduct.expiry || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Pricing & Escrow */}
            <div className="space-y-8">
              <div>
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center border-b border-gray-100 pb-2">
                  <Tag size={16} className="mr-2 text-gray-400" /> Pricing
                </h4>
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-500">Original Price</span>
                    <span className="text-sm font-bold text-gray-400 line-through">{draftProduct.originalPrice || 'Rp 50.000'}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium text-gray-500">Discount Percentage</span>
                    <span className="text-xs font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Save {
                      (() => {
                        const orig = parseInt(draftProduct.originalPrice?.replace(/\D/g, '') || '50000');
                        const disc = parseInt(draftProduct.price?.replace(/\D/g, '') || '30000');
                        if (!orig || !disc) return '40%';
                        return `${Math.round(((orig - disc) / orig) * 100)}%`;
                      })()
                    }</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <span className="text-sm font-bold text-gray-900 uppercase">Listing Price</span>
                    <span className="text-2xl font-extrabold text-[#1A5632]">{draftProduct.price || 'Rp 0'}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center border-b border-gray-100 pb-2">
                  <ShieldCheck size={16} className="mr-2 text-gray-400" /> Terms
                </h4>
                
                <div className="bg-[#F0F7FF] border border-[#D1E5FE] rounded-2xl p-4 flex items-start space-x-3 mb-4">
                   <ShieldCheck className="text-blue-600 mt-0.5 shrink-0" size={20} />
                   <div>
                     <h4 className="font-bold text-blue-900 text-sm">EcoPay Escrow Protected</h4>
                     <p className="text-xs text-blue-800 font-medium mt-1 leading-relaxed">Funds are held securely and released to your wallet only after the buyer confirms receipt.</p>
                   </div>
                </div>

                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start space-x-3">
                   <AlertCircle className="text-amber-600 mt-0.5 shrink-0" size={20} />
                   <div>
                     <h4 className="font-bold text-amber-900 text-sm">Quality Commitment</h4>
                     <p className="text-xs text-amber-800 font-medium mt-1 leading-relaxed">By publishing, you confirm this food is safe for consumption and adheres to local health guidelines.</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Nav */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50/50">
          <Link href="/dashboard/seller/products/create/pricing">
            <button className="flex items-center space-x-2 text-gray-600 font-bold hover:text-gray-900 transition-colors">
              <ArrowLeft size={20} />
              <span>Back to Pricing</span>
            </button>
          </Link>
          
          <button 
            onClick={handlePublish}
            disabled={isPublishing}
            className="bg-[#1A5632] hover:bg-[#0F351F] text-white px-8 py-3.5 rounded-xl font-bold flex items-center space-x-2 transition-colors shadow-md disabled:opacity-70 min-w-[200px] justify-center"
          >
            {isPublishing ? (
              <span className="flex items-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Publishing...</span>
              </span>
            ) : (
              <>
                <span>Publish Listing</span>
                <Rocket size={20} className="ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
