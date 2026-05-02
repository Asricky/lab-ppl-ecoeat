"use client";

import React, { useState } from 'react';
import { Upload, Leaf, Clock, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateProductStep1() {
  const [name, setName] = useState('');
  
  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      {/* Header with nav logic */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex space-x-6 text-sm font-bold text-gray-500">
          <span className="text-[#1A5632] border-b-2 border-[#1A5632] pb-1">Products</span>
          <span className="hover:text-gray-800 cursor-pointer pb-1">Marketplace</span>
        </div>
        
        {/* Stepper */}
        <div className="flex items-center space-x-4 max-w-lg w-full justify-center">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-[#1A5632] text-white flex items-center justify-center font-bold text-sm shadow-sm">1</div>
            <span className="text-xs font-bold text-[#1A5632] mt-2">Product Info</span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-200 mb-6"></div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-sm">2</div>
            <span className="text-xs font-bold text-gray-500 mt-2">Price & Inventory</span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-200 mb-6"></div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-sm">3</div>
            <span className="text-xs font-bold text-gray-500 mt-2">Review</span>
          </div>
        </div>
        
        <div className="w-24"></div> {/* Spacer for balance */}
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-12 overflow-hidden">
        {/* Form Section */}
        <div className="flex-1 bg-white rounded-3xl p-8 shadow-sm border border-gray-100 overflow-y-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Product Information</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Product Name</label>
              <input 
                type="text" 
                placeholder="e.g. Organic Heirloom Tomatoes" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#F3F8F2] border border-transparent rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1A5632] focus:border-[#1A5632] outline-none transition-colors text-gray-900 font-medium" 
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category</label>
              <select className="w-full bg-[#F3F8F2] border border-transparent rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1A5632] outline-none transition-colors text-gray-900 font-medium appearance-none">
                <option>Select Category</option>
                <option>Fresh Produce</option>
                <option>Bakery & Pastry</option>
                <option>Prepared Meals</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Quantity</label>
                <div className="relative">
                  <input type="number" placeholder="0" className="w-full bg-[#F3F8F2] border border-transparent rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1A5632] outline-none transition-colors text-gray-900 font-medium" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">portions</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Expiry Time</label>
                <input type="datetime-local" className="w-full bg-[#F3F8F2] border border-transparent rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1A5632] outline-none transition-colors text-gray-900 font-medium" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Product Image Upload</label>
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-10 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer group">
                <div className="bg-[#E8F3EB] p-4 rounded-full text-[#1A5632] mb-4 group-hover:scale-110 transition-transform">
                  <Upload size={24} />
                </div>
                <h4 className="font-bold text-gray-900 mb-1">Upload Image</h4>
                <p className="text-sm text-gray-500 mb-4">Drag and drop or click to browse</p>
                <div className="bg-gray-100 text-gray-500 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">PNG, JPG up to 10MB</div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview Section */}
        <div className="w-full lg:w-[400px] flex flex-col gap-6">
          <div className="text-xs font-bold text-[#1A5632] flex items-center tracking-wider uppercase mb-2">
            <span className="w-2 h-2 rounded-full bg-[#1A5632] mr-2"></span> LIVE PREVIEW
          </div>
          
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-48 bg-gray-400 relative">
              {/* Fake crumpled paper background like the image */}
              <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-gradient-to-tr from-gray-900 to-transparent"></div>
              
              <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                -0%
              </div>
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center space-x-1.5">
                <Clock size={14} className="text-[#1A5632]" />
                <span>Expires soon</span>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-900">{name || 'Product Name'}</h3>
                <span className="text-2xl font-extrabold text-[#1A5632]">Rp 0</span>
              </div>
              <p className="text-sm text-gray-500 font-medium flex items-center mb-6">
                <span className="mr-2">🍽</span> 0 portions available
              </p>
              
              <div className="bg-[#F9FAFB] rounded-xl p-4 flex items-start space-x-3 border border-gray-100">
                <div className="bg-[#E8F3EB] p-1.5 rounded-full text-[#1A5632] shrink-0 mt-0.5">
                  <Leaf size={14} />
                </div>
                <p className="text-xs font-medium text-gray-600 leading-relaxed">
                  Publishing this product helps save <span className="font-bold text-[#1A5632]">0</span> meal portions from going to waste.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#EAE5DF] rounded-2xl p-4 flex items-center justify-center space-x-2 text-[#4A3D35] font-bold text-xs tracking-wider uppercase border border-[#DCD5CD]">
            <span>🌲</span>
            <span>YOUR IMPACT: 240 PORTIONS SAVED THIS MONTH</span>
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
        <Link href="/seller/products/create/pricing">
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">NEXT STEP</p>
              <p className="text-sm font-bold text-gray-900">Price & Inventory</p>
            </div>
            <button className="bg-[#1A5632] hover:bg-[#0F351F] text-white px-6 py-3 rounded-xl font-bold flex items-center space-x-2 transition-colors shadow-sm">
              <span>Next Step</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </Link>
      </div>
    </div>
  );
}
