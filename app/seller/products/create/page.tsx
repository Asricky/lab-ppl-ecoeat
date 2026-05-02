"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { Upload, Clock, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useProductStore } from '@/store/productStore';

function formatPriceInput(value: string) {
  const num = parseInt(value.replace(/\D/g, ''), 10);
  if (Number.isNaN(num)) return '';
  return num.toLocaleString('id-ID');
}

function clampDiscount(n: number) {
  return Math.min(90, Math.max(20, Math.round(n)));
}

export default function CreateCommercialProductPage() {
  const { draftProduct, setDraftProduct, products } = useProductStore();
  const [imagePreview, setImagePreview] = useState<string | null>(draftProduct.image || null);

  const discountPct = clampDiscount(
    typeof draftProduct.discountPercent === 'number' ? draftProduct.discountPercent : 20
  );

  useEffect(() => {
    setDraftProduct({ type: 'Sell' });
  }, [setDraftProduct]);

  useEffect(() => {
    const o = parseInt(draftProduct.originalPrice?.replace(/\D/g, '') || '0', 10);
    const pct = clampDiscount(
      typeof draftProduct.discountPercent === 'number' ? draftProduct.discountPercent : 20
    );
    if (o <= 0) return;
    const sale = Math.round(o * (1 - pct / 100));
    const formatted = `Rp ${sale.toLocaleString('id-ID')}`;
    const current = useProductStore.getState().draftProduct.price;
    if (current !== formatted) {
      setDraftProduct({ price: formatted });
    }
  }, [draftProduct.originalPrice, draftProduct.discountPercent, setDraftProduct]);

  const activeCount = useMemo(() => {
    return products.filter(
      (p: { type?: string; status?: string }) => p.type === 'Sell' && p.status === 'Active'
    ).length;
  }, [products]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setDraftProduct({ image: url });
    }
  };

  return (
    <div className="max-w-6xl mx-auto min-h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex space-x-6 text-sm font-bold text-gray-500">
          <span className="text-[#1A5632] border-b-2 border-[#1A5632] pb-1">Products</span>
          <span className="hover:text-gray-800 cursor-pointer pb-1">Marketplace</span>
        </div>

        <div className="flex items-center space-x-4 max-w-lg w-full justify-center">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-[#1A5632] text-white flex items-center justify-center font-bold text-sm shadow-sm">
              1
            </div>
            <span className="text-xs font-bold text-[#1A5632] mt-2">Details</span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-200 mb-6 max-w-[80px]" />
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <span className="text-xs font-bold text-gray-500 mt-2">Review</span>
          </div>
        </div>

        <div className="w-24 hidden lg:block" />
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-12 overflow-hidden">
        <div className="flex-1 bg-white rounded-3xl p-8 shadow-sm border border-gray-100 overflow-y-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Add product</h2>
          <p className="text-sm text-gray-500 mb-8">
            Commercial items only. Currency: Indonesian Rupiah (IDR). Sale price is calculated from
            original price and discount (minimum 20%).
          </p>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Product name
              </label>
              <input
                type="text"
                placeholder="e.g. Special fried rice"
                value={draftProduct.name}
                onChange={(e) => setDraftProduct({ name: e.target.value })}
                className="w-full bg-[#F3F8F2] border border-transparent rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1A5632] outline-none text-gray-900 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Category
              </label>
              <select
                value={draftProduct.category}
                onChange={(e) => setDraftProduct({ category: e.target.value })}
                className="w-full bg-[#F3F8F2] border border-transparent rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1A5632] outline-none text-gray-900 font-medium appearance-none"
              >
                <option value="">Select category</option>
                <option value="Fresh Produce">Fresh Produce</option>
                <option value="Bakery & Pastry">Bakery & Pastry</option>
                <option value="Prepared Meals">Prepared Meals</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Stock
              </label>
              <input
                type="number"
                min={0}
                placeholder="0"
                value={draftProduct.stock || ''}
                onChange={(e) =>
                  setDraftProduct({ stock: parseInt(e.target.value, 10) || 0 })
                }
                className="w-full bg-[#F3F8F2] border border-transparent rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1A5632] outline-none text-gray-900 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Original price (IDR)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
                    Rp
                  </span>
                  <input
                    type="text"
                    value={draftProduct.originalPrice?.replace(/^Rp\s?/i, '') || ''}
                    onChange={(e) =>
                      setDraftProduct({
                        originalPrice: `Rp ${formatPriceInput(e.target.value)}`,
                      })
                    }
                    className="w-full bg-[#F3F8F2] border border-transparent rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-[#1A5632] outline-none text-gray-900 font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Discount (min 20%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={20}
                    max={90}
                    value={discountPct}
                    onChange={(e) =>
                      setDraftProduct({
                        discountPercent: clampDiscount(parseInt(e.target.value, 10) || 20),
                      })
                    }
                    onBlur={() =>
                      setDraftProduct({
                        discountPercent: clampDiscount(
                          typeof draftProduct.discountPercent === 'number'
                            ? draftProduct.discountPercent
                            : 20
                        ),
                      })
                    }
                    className="w-full bg-[#F3F8F2] border border-transparent rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1A5632] outline-none text-gray-900 font-bold text-center"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
                    %
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 mt-2 font-medium">
                  Sale price updates automatically (IDR).
                </p>
              </div>
            </div>

            <div className="bg-[#F3F8F2] rounded-xl px-4 py-3 border border-[#E2EFE5]">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                Sale price (IDR)
              </p>
              <p className="text-xl font-extrabold text-[#1A5632]">
                {draftProduct.price || '—'}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Short description (optional)
              </label>
              <textarea
                rows={3}
                value={draftProduct.description}
                onChange={(e) => setDraftProduct({ description: e.target.value })}
                placeholder="Storage, allergens, etc."
                className="w-full bg-[#F3F8F2] border border-transparent rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1A5632] outline-none text-gray-900 font-medium resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Photo (optional)
              </label>
              <label className="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer relative overflow-hidden min-h-[140px]">
                <input
                  type="file"
                  className="hidden"
                  accept="image/png, image/jpeg"
                  onChange={handleImageChange}
                />
                {imagePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                  />
                ) : null}
                <div className="relative z-10 text-center">
                  <div className="bg-[#E8F3EB] p-3 rounded-full text-[#1A5632] inline-flex mb-2">
                    <Upload size={22} />
                  </div>
                  <p className="font-bold text-gray-900 text-sm">Upload image</p>
                  <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[400px] flex flex-col gap-6">
          <div className="text-xs font-bold text-[#1A5632] flex items-center tracking-wider uppercase mb-2">
            <span className="w-2 h-2 rounded-full bg-[#1A5632] mr-2" />
            Preview
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-44 bg-gray-200 relative">
              {imagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-tr from-gray-700/30 to-transparent" />
              )}
              <div className="absolute top-4 left-4 bg-[#1A5632] text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                −{discountPct}%
              </div>
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
                <Clock size={14} className="text-[#1A5632]" />
                <span>Surplus</span>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {draftProduct.name || 'Product name'}
              </h3>
              <p className="text-xs text-gray-500 mb-4">{draftProduct.category || 'Category'}</p>
              <div className="flex items-end gap-3 mb-4">
                <span className="text-sm text-gray-400 line-through">
                  {draftProduct.originalPrice || 'Rp —'}
                </span>
                <span className="text-2xl font-extrabold text-[#1A5632]">
                  {draftProduct.price || 'Rp —'}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Stock: <span className="font-bold">{draftProduct.stock || 0}</span> units
              </p>
            </div>
          </div>

          <div className="rounded-2xl p-5 bg-[#E8F3EB] border border-[#D1E8D7]">
            <p className="text-xs font-bold text-[#1A5632] uppercase tracking-wider mb-1">
              Active products
            </p>
            <p className="text-3xl font-black text-gray-900">{activeCount}</p>
            <p className="text-xs text-gray-600 mt-2 font-medium">
              Active commercial items today. After you publish, this count increases.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
<<<<<<< HEAD:app/seller/products/create/page.tsx
        <Link href="/seller">
          <button className="flex items-center space-x-2 text-gray-600 font-bold hover:text-gray-900 transition-colors">
=======
        <Link href="/dashboard/seller/products">
          <button
            type="button"
            className="flex items-center space-x-2 text-gray-600 font-bold hover:text-gray-900 transition-colors"
          >
>>>>>>> repo-sridamai/Sridamai:app/dashboard/seller/products/create/page.tsx
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
        </Link>
<<<<<<< HEAD:app/seller/products/create/page.tsx
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
=======
        <Link href="/dashboard/seller/products/create/review">
          <button
            type="button"
            className="bg-[#1A5632] hover:bg-[#0F351F] text-white px-6 py-3 rounded-xl font-bold flex items-center space-x-2 transition-colors shadow-sm"
          >
            <span>Continue to review</span>
            <ArrowRight size={20} />
          </button>
>>>>>>> repo-sridamai/Sridamai:app/dashboard/seller/products/create/page.tsx
        </Link>
      </div>
    </div>
  );
}
