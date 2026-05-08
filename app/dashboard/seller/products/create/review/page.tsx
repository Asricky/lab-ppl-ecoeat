"use client";

import React, { useState } from 'react';
import { Rocket, ArrowLeft, CheckCircle2, ShieldCheck, Tag, ListChecks, Calendar as CalendarIcon, Package, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useProductStore } from '@/store/productStore';

function formatExpiryLabel(value: string) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ReviewPublishPage() {
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [publishedName, setPublishedName] = useState('');
  const { addProduct, draftProduct, clearDraft } = useProductStore();

  const handlePublish = async () => {
    setIsPublishing(true);
    const name = draftProduct.name || 'Untitled Product';

    const discountPercent = Math.max(20, Number(draftProduct.discountPercent) || 20);

    const payload = {
      type: 'sell',
      name,
      category: draftProduct.category || '',
      stock: draftProduct.stock || 0,
      originalPrice: draftProduct.originalPrice || '',
      discountPercent,
      salePriceIdr: draftProduct.price || '',
      expiry: draftProduct.expiry || '',
      description: draftProduct.description || '',
      image:
        draftProduct.image ||
        'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=100&h=100&q=80',
    };

    try {
      await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch {
      /* Stitch endpoint optional offline */
    }

    addProduct({
      id: `PRD-${Math.floor(Math.random() * 1000) + 100}`,
      name,
      image: payload.image,
      type: 'Sell',
      stock: draftProduct.stock || 1,
      price: draftProduct.price || 'Rp 0',
      expiry: draftProduct.expiry || '—',
      status: 'Active',
      description: draftProduct.description || 'No description provided.',
      category: draftProduct.category || '',
    });

    setPublishedName(name);
    clearDraft();
    setIsPublishing(false);
    setIsPublished(true);
  };

  if (isPublished) {
    return (
      <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 max-w-lg">
          <div className="w-24 h-24 bg-[#E8F3EB] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={50} className="text-[#1A5632]" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Published</h2>
          <p className="text-gray-500 font-medium mb-8">
            &quot;{publishedName}&quot; is now live. Currency: IDR (Rp).
          </p>
          <div className="flex flex-col space-y-3">
            <Link href="/dashboard/seller/products" className="w-full">
              <button
                type="button"
                className="w-full bg-[#1A5632] hover:bg-[#0F351F] text-white px-8 py-3.5 rounded-xl font-bold transition-colors shadow-sm"
              >
                View products
              </button>
            </Link>
            <Link href="/dashboard/seller" className="w-full">
              <button
                type="button"
                className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 px-8 py-3.5 rounded-xl font-bold transition-colors"
              >
                Dashboard
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex space-x-6 text-sm font-bold text-gray-500">
          <span className="text-[#1A5632] border-b-2 border-[#1A5632] pb-1">Products</span>
          <span className="hover:text-gray-800 cursor-pointer pb-1">Marketplace</span>
        </div>

        <div className="flex items-center space-x-4 max-w-lg w-full justify-center">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-[#E8F3EB] text-[#1A5632] flex items-center justify-center font-bold text-sm border border-[#D1E8D7]">
              ✓
            </div>
            <span className="text-xs font-bold text-[#1A5632] mt-2">Details</span>
          </div>
          <div className="flex-1 h-0.5 bg-[#1A5632] mb-6 max-w-[80px]" />
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-[#1A5632] text-white flex items-center justify-center font-bold text-sm">
              2
            </div>
            <span className="text-xs font-bold text-[#1A5632] mt-2">Review</span>
          </div>
        </div>

        <div className="w-24 hidden lg:block" />
      </div>

      <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
        <div className="p-8 border-b border-gray-100 flex items-center space-x-3 bg-gray-50/50">
          <div className="bg-[#E8F3EB] p-2 rounded-xl text-[#1A5632]">
            <ListChecks size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Review</h2>
            <p className="text-sm font-medium text-gray-500">
              Confirm IDR pricing and details before publishing.
            </p>
          </div>
        </div>

        <div className="p-8 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-8">
              <div>
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center border-b border-gray-100 pb-2">
                  <Package size={16} className="mr-2 text-gray-400" /> Product
                </h4>
                <div className="flex space-x-6">
                  <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        draftProduct.image ||
                        'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=500&h=500&q=80'
                      }
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-3 flex-1">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                        Name
                      </p>
                      <p className="font-bold text-gray-900">{draftProduct.name || '—'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                        Category
                      </p>
                      <p className="font-medium text-gray-700">{draftProduct.category || '—'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center border-b border-gray-100 pb-2">
                  <CalendarIcon size={16} className="mr-2 text-gray-400" /> Availability
                </h4>
                <div className="bg-[#F3F8F2] p-4 rounded-xl border border-[#D1E8D7]">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Stock
                  </p>
                  <p className="font-extrabold text-[#1A5632] text-xl">{draftProduct.stock || 0} units</p>
                </div>
                <div className="bg-[#F3F8F2] p-4 rounded-xl border border-[#D1E8D7] mt-4">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Expiry
                  </p>
                  <p className="font-extrabold text-[#1A5632] text-xl">
                    {formatExpiryLabel(draftProduct.expiry || '')}
                  </p>
                </div>
                {draftProduct.expiryDate && (
                  <div className="bg-[#F3F8F2] p-4 rounded-xl border border-[#D1E8D7] mt-4">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                      Expiry Date
                    </p>
                    <p className="font-extrabold text-[#1A5632] text-xl">
                      {draftProduct.expiryDate}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center border-b border-gray-100 pb-2">
                  <Tag size={16} className="mr-2 text-gray-400" /> Pricing (IDR)
                </h4>
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-500">Original price</span>
                    <span className="text-sm font-bold text-gray-400 line-through">
                      {draftProduct.originalPrice || '—'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-500">Discount</span>
                    <span className="text-sm font-bold text-[#1A5632]">
                      {Math.max(20, Number(draftProduct.discountPercent) || 20)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <span className="text-sm font-bold text-gray-900 uppercase">Sale price</span>
                    <span className="text-2xl font-extrabold text-[#1A5632]">
                      {draftProduct.price || '—'}
                    </span>
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
                    <h4 className="font-bold text-blue-900 text-sm">EcoPay Escrow</h4>
                    <p className="text-xs text-blue-800 font-medium mt-1 leading-relaxed">
                      Funds are held until the buyer confirms receipt.
                    </p>
                  </div>
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start space-x-3">
                  <AlertCircle className="text-amber-600 mt-0.5 shrink-0" size={20} />
                  <div>
                    <h4 className="font-bold text-amber-900 text-sm">Quality commitment</h4>
                    <p className="text-xs text-amber-800 font-medium mt-1 leading-relaxed">
                      By publishing, you confirm the food is safe to consume under local rules.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50/50">
          <Link href="/dashboard/seller/products/create">
            <button
              type="button"
              className="flex items-center space-x-2 text-gray-600 font-bold hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Edit details</span>
            </button>
          </Link>

          <button
            type="button"
            onClick={handlePublish}
            disabled={isPublishing}
            className="bg-[#1A5632] hover:bg-[#0F351F] text-white px-8 py-3.5 rounded-xl font-bold flex items-center space-x-2 transition-colors shadow-md disabled:opacity-70 min-w-[200px] justify-center"
          >
            {isPublishing ? (
              <span className="flex items-center space-x-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Publish…</span>
              </span>
            ) : (
              <>
                <span>Publish</span>
                <Rocket size={20} className="ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
