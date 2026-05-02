"use client";

import React from 'react';
import { Rocket, MapPin, Heart, Clock, Leaf, Info, ShieldCheck, ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useProductStore } from '@/store/productStore';

export default function ConfigurePricingPage() {
  const { draftProduct, setDraftProduct } = useProductStore();
  
  const origVal = parseInt(draftProduct.originalPrice?.replace(/\D/g, '') || '50000');
  const discVal = parseInt(draftProduct.price?.replace(/\D/g, '') || '30000');
  const currentPercent = origVal && discVal ? Math.round(((origVal - discVal) / origVal) * 100) : 40;

  const handlePercentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let percent = parseInt(e.target.value);
    if (isNaN(percent)) percent = 0;
    if (percent > 100) percent = 100;
    if (percent < 0) percent = 0;
    
    const orig = parseInt(draftProduct.originalPrice?.replace(/\D/g, '') || '50000');
    const newPrice = Math.round(orig * (1 - percent / 100));
    setDraftProduct({ price: `Rp ${newPrice.toLocaleString('id-ID')}` });
  };

  const formatPriceInput = (value: string) => {
    const num = parseInt(value.replace(/\D/g, ''));
    if (isNaN(num)) return '';
    return num.toLocaleString('id-ID');
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
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
            <div className="w-8 h-8 rounded-full bg-[#1A5632] text-white flex items-center justify-center font-bold text-sm shadow-sm">2</div>
            <span className="text-xs font-bold text-[#1A5632] mt-2">Price & Inventory</span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-200 mb-6"></div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-sm">3</div>
            <span className="text-xs font-bold text-gray-500 mt-2">Review</span>
          </div>
        </div>
        
        <div className="w-24"></div> {/* Spacer for balance */}
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-8 overflow-hidden">
        {/* Left Panel */}
        <div className="flex-1 bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col overflow-y-auto">
          <div className="flex items-center space-x-3 mb-8">
            <div className="bg-[#E8F3EB] p-2 rounded-xl text-[#1A5632]">
              <div className="w-5 h-5 border-2 border-current rounded bg-transparent relative">
                <div className="absolute inset-x-1 top-1/2 -translate-y-1/2 h-0.5 bg-current"></div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Pricing Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">ORIGINAL PRICE</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">Rp</span>
                <input 
                  type="text" 
                  value={draftProduct.originalPrice?.replace('Rp ', '') || '50.000'} 
                  onChange={(e) => setDraftProduct({ originalPrice: `Rp ${formatPriceInput(e.target.value)}` })}
                  className="w-full bg-[#F3F8F2] border border-transparent rounded-xl pl-10 pr-4 py-4 text-xl focus:ring-2 focus:ring-[#1A5632] outline-none transition-colors text-gray-900 font-bold" 
                />
              </div>
              <p className="text-[10px] text-gray-500 mt-2 font-medium">Standard market price.</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">DISCOUNT %</label>
              <div className="relative">
                <input 
                  type="number" 
                  value={currentPercent} 
                  onChange={handlePercentChange}
                  className="w-full bg-[#F3F8F2] border border-transparent rounded-xl px-4 py-4 text-xl focus:ring-2 focus:ring-[#1A5632] outline-none transition-colors text-gray-900 font-bold text-center" 
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">%</span>
              </div>
              <p className="text-[10px] text-gray-500 mt-2 font-medium">Recommended: 30% - 60%.</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">DISCOUNT PRICE</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">Rp</span>
                <input 
                  type="text" 
                  value={draftProduct.price?.replace('Rp ', '') || '30.000'} 
                  onChange={(e) => setDraftProduct({ price: `Rp ${formatPriceInput(e.target.value)}` })}
                  className="w-full bg-[#F3F8F2] border border-transparent rounded-xl pl-10 pr-4 py-4 text-xl focus:ring-2 focus:ring-[#1A5632] outline-none transition-colors text-gray-900 font-bold" 
                />
              </div>
              <p className="text-[10px] text-gray-500 mt-2 font-medium">Final selling price.</p>
            </div>
          </div>

          {/* EcoPay Escrow Integration */}
          <div className="bg-[#F0F7FF] border border-[#D1E5FE] rounded-2xl p-5 mb-6 flex items-start space-x-3">
             <ShieldCheck className="text-blue-600 mt-0.5 shrink-0" size={24} />
             <div>
               <h4 className="font-bold text-blue-900 text-sm">EcoPay Escrow Protected</h4>
               <p className="text-xs text-blue-800 font-medium mt-1 leading-relaxed">Funds are held securely and released to your wallet only after the buyer confirms receipt of the food.</p>
             </div>
          </div>

          <div className="bg-[#F3F8F2] rounded-2xl p-6 flex items-center justify-between mb-6 border border-[#E2EFE5]">
            <div>
              <p className="text-xs font-bold text-[#1A5632] uppercase tracking-wider mb-1">IMPACT PREDICTION</p>
              <h3 className="text-4xl font-extrabold text-gray-900 mb-2">Save {
                (() => {
                  const orig = parseInt(draftProduct.originalPrice?.replace(/\D/g, '') || '50000');
                  const disc = parseInt(draftProduct.price?.replace(/\D/g, '') || '30000');
                  if (!orig || !disc) return '40%';
                  return `${Math.round(((orig - disc) / orig) * 100)}%`;
                })()
              }</h3>
              <p className="text-sm text-gray-600 font-medium max-w-xs">This price point is 15% more likely to sell within the first 4 hours.</p>
            </div>
            <div className="w-24 h-24 rounded-full border-4 border-[#A3D9B5] flex items-center justify-center bg-white shadow-sm shrink-0">
              <div className="text-center">
                <span className="block text-2xl font-bold text-[#1A5632] leading-none">{
                  (() => {
                    const orig = parseInt(draftProduct.originalPrice?.replace(/\D/g, '') || '50000');
                    const disc = parseInt(draftProduct.price?.replace(/\D/g, '') || '30000');
                    if (!orig || !disc) return '40%';
                    return `${Math.round(((orig - disc) / orig) * 100)}%`;
                  })()
                }</span>
                <span className="block text-[10px] font-bold text-gray-500 uppercase mt-1">OFF</span>
              </div>
            </div>
          </div>

          <div className="border-l-4 border-[#1A5632] pl-4 py-2 mb-8">
            <p className="text-sm text-[#1A5632] font-medium leading-relaxed flex items-start">
              <Leaf size={16} className="mr-2 shrink-0 mt-0.5" />
              Discounting surplus helps reduce food waste faster and helps you sell quickly. Your contribution supports a circular food economy in your neighborhood.
            </p>
          </div>
        </div>

        {/* Right Panel (Preview) */}
        <div className="w-full lg:w-[350px] flex flex-col gap-6">
          <div className="text-xs font-bold text-gray-500 flex justify-between items-center tracking-wider uppercase mb-2">
            <span>BUYER PREVIEW</span>
            <div className="flex items-center text-[#1A5632]">
              <span className="w-2 h-2 rounded-full bg-[#1A5632] mr-2"></span> LIVE PREVIEW
            </div>
          </div>
          
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="relative h-48 bg-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={draftProduct.image || "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=500&h=500&q=80"} alt="Product Preview" className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 bg-white text-[#1A5632] text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                SAVE {
                  (() => {
                    const orig = parseInt(draftProduct.originalPrice?.replace(/\D/g, '') || '50000');
                    const disc = parseInt(draftProduct.price?.replace(/\D/g, '') || '30000');
                    if (!orig || !disc) return '40%';
                    return `${Math.round(((orig - disc) / orig) * 100)}%`;
                  })()
                }
              </div>
              <div className="absolute bottom-4 right-4 bg-gray-900/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center space-x-1.5">
                <Clock size={12} />
                <span>2h left</span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">PREPARED MEALS</p>
                  <h3 className="text-2xl font-bold text-gray-900 leading-tight">{draftProduct.name || 'Nasi Goreng Spesial'}</h3>
                </div>
                <button onClick={() => alert("Added to favorites")} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-500 transition-colors shrink-0">
                  <Heart size={16} />
                </button>
              </div>
              
              <div className="flex items-end mb-6">
                <div>
                  <span className="text-sm text-gray-400 line-through font-medium mr-2">{draftProduct.originalPrice || 'Rp 50.000'}</span>
                  <span className="text-3xl font-extrabold text-[#1A5632]">{draftProduct.price || 'Rp 30.000'}</span>
                </div>
                <div className="ml-6 bg-[#E8F3EB] text-[#1A5632] text-xs font-bold px-2 py-1 rounded-md flex items-center">
                  <Leaf size={12} className="mr-1" />
                  {draftProduct.stock || 1} Porsi
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-start space-x-2">
                  <MapPin size={16} className="text-gray-400 mt-0.5" />
                  <p className="text-xs text-gray-500 font-medium">Green Valley Farm (0.8 mi)</p>
                </div>
                <button onClick={() => alert("Added to box")} className="bg-[#1A5632] text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-[#0F351F] transition-colors">Add to Box</button>
              </div>
            </div>
          </div>

          <div className="bg-[#F9FAFB] border border-gray-200 border-dashed rounded-2xl p-5">
            <div className="flex items-center space-x-2 text-gray-900 font-bold text-sm mb-2">
              <Info size={16} />
              <span>Smart Pricing Tip</span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed font-medium">
              Buyers respond best to psychological price points. Setting your price to <span className="font-bold text-gray-900">Rp 29.900</span> instead of Rp 30.000 could increase clicks by up to 22%.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Nav */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
        <Link href="/seller/products/create">
          <button className="flex items-center space-x-2 text-gray-600 font-bold hover:text-gray-900 transition-colors">
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
        </Link>
        <Link href="/seller/products/create/review">
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">NEXT STEP</p>
              <p className="text-sm font-bold text-gray-900">Review & Publish</p>
            </div>
            <button className="bg-[#1A5632] hover:bg-[#0F351F] text-white px-6 py-3 rounded-xl font-bold flex items-center space-x-2 transition-colors shadow-sm">
              <span>Review & Publish</span>
              <ArrowRight size={20} className="ml-2" />
            </button>
          </div>
        </Link>
      </div>
    </div>
  );
}
