"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Leaf, Truck, AlertCircle } from 'lucide-react';

export default function OrderHistoryPage() {
  const [activeTab, setActiveTab] = useState('Refunded'); // Default to Refunded to show the specific state easily
  const tabs = ['Active Orders', 'Completed', 'Cancelled', 'Refunded'];

  const formatRp = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount * 10000);
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-2">ACCOUNT ACTIVITY</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">Order History</h1>
        </div>
        
        <div className="bg-[#eef3e8] rounded-2xl p-4 flex items-center space-x-4 border border-[#d4dec4]">
          <div className="bg-green-700 p-2.5 rounded-xl text-white shadow-sm">
            <Leaf className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">IMPACT SCORE</p>
            <p className="font-extrabold text-gray-900 text-sm mt-0.5">12.4kg of food waste saved</p>
          </div>
        </div>
      </div>

      <div className="flex space-x-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-full font-bold text-sm transition-colors whitespace-nowrap ${activeTab === tab ? 'bg-[#388e3c] text-white shadow-md' : 'bg-[#eef3e8] text-gray-600 hover:bg-[#d4dec4]'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          
          {activeTab === 'Active Orders' && (
            <div className="bg-white rounded-3xl p-6 border border-[#eef3e8] shadow-sm flex flex-col sm:flex-row gap-6 items-center sm:items-start relative">
              <div className="w-full sm:w-36 h-36 rounded-2xl overflow-hidden bg-[#f4f7ed] flex-shrink-0 border border-[#e1e8d5]">
                <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 w-full">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="bg-[#eef3e8] text-green-800 text-[10px] font-bold px-3 py-1.5 rounded-full border border-[#d4dec4] flex items-center">
                    <Truck className="w-3 h-3 mr-1" /> Out for Delivery
                  </span>
                  <span className="text-[10px] text-gray-500 font-extrabold uppercase">Today</span>
                </div>
                <h3 className="font-extrabold text-gray-900 text-2xl mb-1">Local Organic Veggie Box</h3>
                <p className="text-xs text-gray-500 font-medium mb-6">Order #OP-7729</p>
                <div className="flex items-center justify-between w-full">
                  <span className="font-extrabold text-gray-900 text-xl">{formatRp(24.00)}</span>
                  <div className="flex space-x-3">
                    <Link href="/buyer/tracking" className="bg-[#eef3e8] text-green-800 font-bold px-5 py-2.5 rounded-xl transition-colors text-sm border border-[#d4dec4] hover:bg-[#e1e8d5]">
                      View Detail
                    </Link>
                    <Link href="/buyer/tracking" className="bg-[#388e3c] hover:bg-[#2e7d32] text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm shadow-md">
                      Track Order
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Refunded' && (
            <>
              <div className="bg-[#eef3e8] border border-[#d4dec4] rounded-2xl p-4 flex items-start space-x-3 mb-4 shadow-sm">
                <div className="w-5 h-5 rounded-full border-2 border-green-700 flex items-center justify-center text-green-700 text-[10px] font-bold mt-0.5 flex-shrink-0">i</div>
                <p className="text-sm text-gray-700 font-medium leading-relaxed">Refund will be processed automatically if delivery fails.</p>
              </div>

              {/* Failed Delivery waiting for refund */}
              <div className="bg-white rounded-3xl p-6 border border-[#eef3e8] shadow-sm flex flex-col sm:flex-row gap-6 items-center sm:items-start relative mb-6">
                <div className="w-full sm:w-40 h-40 rounded-2xl overflow-hidden bg-[#f4f7ed] flex-shrink-0 border border-[#e1e8d5]">
                  <img src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 w-full flex flex-col h-full">
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-red-50 text-red-700 text-[10px] font-bold px-3 py-1.5 rounded-full border border-red-200 flex items-center shadow-sm">
                      <AlertCircle className="w-3 h-3 mr-1" /> ITEM NOT DELIVERED
                    </span>
                    <span className="font-extrabold text-gray-900 text-xl">{formatRp(45.00)}</span>
                  </div>
                  <h3 className="font-extrabold text-gray-900 text-2xl mb-1 leading-tight">Heirloom Harvest Box</h3>
                  <p className="text-xs text-gray-500 font-medium mb-6">Order #OP-9921 • Oct 14, 2023</p>
                  <div className="flex space-x-3 mt-auto">
                    <Link href="/buyer/orders/OP-9921" className="bg-[#388e3c] hover:bg-[#2e7d32] text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm shadow-md">
                      Request Refund
                    </Link>
                    <Link href="/buyer/orders/OP-9921" className="bg-[#eef3e8] text-green-800 font-bold px-6 py-3 rounded-xl transition-colors text-sm border border-[#d4dec4] hover:bg-[#e1e8d5]">
                      Order Details
                    </Link>
                  </div>
                </div>
              </div>

              {/* Refunded Item */}
              <div className="bg-[#f4f7ed] rounded-3xl p-6 border border-[#d4dec4] shadow-sm flex flex-col sm:flex-row gap-6 items-center sm:items-start relative">
                <div className="flex-1 w-full">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-[#e1e8d5] text-green-800 text-[10px] font-bold px-3 py-1.5 rounded-full border border-[#c3d1b0] flex items-center shadow-sm">
                      <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg> REFUND COMPLETED
                    </span>
                    <span className="text-green-700 font-extrabold text-lg">+{formatRp(32.50)}</span>
                  </div>
                  <div className="w-full h-40 rounded-2xl overflow-hidden bg-gray-100 mb-4 border border-[#e1e8d5]">
                    <img src="https://images.unsplash.com/photo-1596199050105-6d5d32222916?w=500" className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-extrabold text-gray-900 text-xl mb-1">Organic Berry Medley</h3>
                  <p className="text-xs text-gray-500 font-medium mb-6">Order #OP-8834 • Oct 10, 2023</p>
                  <p className="text-xs text-gray-500 italic font-medium pt-4 border-t border-[#d4dec4]">Credit returned to Organic Wallet</p>
                </div>
              </div>
            </>
          )}

          {activeTab === 'Completed' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 border border-[#eef3e8] shadow-sm flex items-center space-x-4">
                <img src="https://images.unsplash.com/photo-1561136594-7f68413baa99?w=200" className="w-24 h-24 rounded-2xl object-cover border border-[#e1e8d5]" />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-extrabold text-gray-900 text-sm leading-tight">Vine-Ripened Tomato Crate</h4>
                    <span className="bg-[#e1e8d5] text-gray-600 text-[8px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ml-2">Processed</span>
                  </div>
                  <p className="text-[10px] text-gray-500 mb-3 font-medium">Quantity: 2 units</p>
                  <p className="text-green-700 font-extrabold text-base">{formatRp(18.90)}</p>
                </div>
              </div>
              <div className="bg-white rounded-3xl p-6 border border-[#eef3e8] shadow-sm flex items-center space-x-4">
                <img src="https://images.unsplash.com/photo-1582284540020-8acbe03f4924?w=200" className="w-24 h-24 rounded-2xl object-cover border border-[#e1e8d5]" />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-extrabold text-gray-900 text-sm leading-tight">Leafy Green Bundle</h4>
                    <span className="bg-[#e1e8d5] text-gray-600 text-[8px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ml-2">Processed</span>
                  </div>
                  <p className="text-[10px] text-gray-500 mb-3 font-medium">Quantity: 1 unit</p>
                  <p className="text-green-700 font-extrabold text-base">{formatRp(12.00)}</p>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'Cancelled' && (
            <div className="bg-[#f4f7ed] rounded-3xl p-6 border border-[#d4dec4] shadow-sm flex flex-col sm:flex-row gap-6 items-center sm:items-start relative opacity-80">
              <div className="w-full sm:w-32 h-32 rounded-2xl overflow-hidden bg-gray-200 flex-shrink-0 grayscale">
                <img src="https://images.unsplash.com/photo-1622597467836-f38240662c8c?w=500" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 w-full">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="bg-[#e1e8d5] text-gray-600 text-[10px] font-bold px-3 py-1.5 rounded-full border border-[#c3d1b0] shadow-sm">
                    CANCELLED
                  </span>
                  <span className="text-[10px] text-gray-500 font-extrabold uppercase">Oct 20, 2024</span>
                </div>
                <h3 className="font-extrabold text-gray-900 text-xl mb-1">Community Kitchen Meal Kit</h3>
                <p className="font-extrabold text-gray-500 mb-4">{formatRp(18.00)}</p>
                <button className="text-sm font-bold text-gray-600 hover:text-gray-900">View Detail</button>
              </div>
            </div>
          )}

        </div>

        {/* Right side static impact block */}
        <div className="w-full">
          <div className="bg-gradient-to-br from-[#eef3e8] to-[#e1e8d5] rounded-3xl p-10 border border-[#d4dec4] flex flex-col items-center text-center shadow-sm">
            <Leaf className="w-14 h-14 text-green-800 mb-5 drop-shadow-sm" />
            <h3 className="font-extrabold text-gray-900 text-2xl mb-3">Impact Summary</h3>
            <p className="text-sm text-gray-600 font-medium leading-relaxed mb-8">
              By choosing surplus boxes, you've diverted <span className="font-extrabold text-green-800">12kg</span> of food from waste this month.
            </p>
            <div className="w-full bg-[#d4dec4] rounded-full h-2.5 mb-3 shadow-inner overflow-hidden">
              <div className="bg-green-700 h-2.5 rounded-full" style={{ width: '75%' }}></div>
            </div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">75% OF MONTHLY GOAL</p>
          </div>
        </div>
      </div>
    </div>
  );
}
