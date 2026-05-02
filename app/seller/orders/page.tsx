"use client";

import React, { useState } from 'react';
import { 
  ShoppingBag, 
  ListChecks, 
  ShoppingCart, 
  Gift, 
  PlusCircle, 
  Settings, 
  AlertTriangle, 
  Leaf,
  ArrowRight,
  ArrowLeft,
  MapPin
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Dummy Data
const ORDERS = [
  { id: 'ORD-001', productName: 'Nasi Goreng Spesial', quantity: 2, price: 'Rp 30.000', status: 'Completed', refundStatus: '-' },
  { id: 'ORD-002', productName: 'Ayam Bakar Madu', quantity: 1, price: 'Rp 25.000', status: 'Refunded', refundStatus: 'Processed' },
  { id: 'ORD-003', productName: 'Sayur Asem', quantity: 3, price: 'Rp 15.000', status: 'Active', refundStatus: '-' },
  { id: 'ORD-004', productName: 'Sate Ayam', quantity: 1, price: 'Rp 20.000', status: 'Cancelled', refundStatus: 'Pending' }
];

const DONATIONS = [
  { id: 'DON-001', productName: 'Roti Gandum (Hampir Expired)', quantity: 5, price: 'Donate', status: 'Completed', refundStatus: '-' },
  { id: 'DON-002', productName: 'Nasi Kotak Sisa Event', quantity: 10, price: 'Donate', status: 'Active', refundStatus: '-' }
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState('Orders');
  const router = useRouter();

  const displayedData = activeTab === 'Orders' ? ORDERS : DONATIONS;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
      case 'Active':
        return 'bg-[#E8F3EB] text-[#1A5632]'; // Light green bg, dark green text
      case 'Refunded':
        return 'bg-gray-100 text-gray-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <div className="mb-4">
        <button onClick={() => window.history.back()} className="flex items-center space-x-2 text-gray-500 hover:text-[#1A5632] transition-colors font-bold text-sm bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 w-fit">
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
      </div>

      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Orders & Donations</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center">
          <div className="bg-blue-50 p-3.5 rounded-xl text-blue-600 mr-4">
            <ShoppingBag size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-0.5">Total Products</p>
            <h3 className="text-xl font-bold text-gray-900">42</h3>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center">
          <div className="bg-indigo-50 p-3.5 rounded-xl text-indigo-600 mr-4">
            <ListChecks size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-0.5">Active Listings</p>
            <h3 className="text-xl font-bold text-gray-900">18</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center">
          <div className="bg-[#E8F3EB] p-3.5 rounded-xl text-[#1A5632] mr-4">
            <ShoppingCart size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-0.5">Orders (30D)</p>
            <h3 className="text-xl font-bold text-gray-900">156</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center">
          <div className="bg-amber-50 p-3.5 rounded-xl text-amber-600 mr-4">
            <Gift size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-0.5">Donations</p>
            <h3 className="text-xl font-bold text-gray-900">24</h3>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Tabel Orders (2/3 width) */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Tabs */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center space-x-6">
              <button 
                onClick={() => setActiveTab('Orders')}
                className={`pb-4 -mb-4 font-medium text-sm transition-colors border-b-2 ${
                  activeTab === 'Orders' 
                    ? 'border-[#1A5632] text-[#1A5632]' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Orders
              </button>
              <button 
                onClick={() => setActiveTab('Donations')}
                className={`pb-4 -mb-4 font-medium text-sm transition-colors border-b-2 ${
                  activeTab === 'Donations' 
                    ? 'border-[#1A5632] text-[#1A5632]' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Donations
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/80 text-gray-500 text-sm border-b border-gray-100">
                    <th className="px-6 py-4 font-medium">Order ID</th>
                    <th className="px-6 py-4 font-medium">Product Name</th>
                    <th className="px-6 py-4 font-medium">Quantity</th>
                    <th className="px-6 py-4 font-medium">Price</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {displayedData.map((item) => (
                    <tr 
                      key={item.id} 
                      onClick={() => router.push(`/seller/orders/${item.id}`)}
                      className="border-b border-gray-50 hover:bg-[#F3F8F2] transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4 font-bold text-[#1A5632] group-hover:underline">{item.id}</td>
                      <td className="px-6 py-4 text-gray-700">{item.productName}</td>
                      <td className="px-6 py-4 text-gray-700 font-medium">{item.quantity}</td>
                      <td className="px-6 py-4 text-gray-700">{item.price}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusBadge(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/seller/orders/${item.id}`);
                          }}
                          className="inline-flex items-center space-x-1.5 bg-white border border-gray-200 hover:border-[#1A5632] hover:bg-green-50 text-[#1A5632] px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm"
                        >
                          <MapPin size={14} />
                          <span>Track Map</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {displayedData.length === 0 && (
                <div className="px-6 py-12 text-center text-gray-500">
                  No {activeTab.toLowerCase()} found.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Panel Aksi & Notifikasi (1/3 width) */}
        <div className="lg:w-1/3 flex flex-col gap-6">
          
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="flex flex-col space-y-3">
              <Link href="/seller/products/create" className="block w-full">
                <button className="flex items-center justify-between w-full bg-[#1A5632] hover:bg-[#0F351F] text-white px-4 py-3 rounded-xl transition-colors font-bold shadow-sm">
                  <div className="flex items-center space-x-3">
                    <PlusCircle size={20} />
                    <span>Add Product</span>
                  </div>
                  <ArrowRight size={16} />
                </button>
              </Link>
              <button className="flex items-center justify-between w-full bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-3 rounded-xl transition-colors font-medium border border-gray-100">
                <div className="flex items-center space-x-3">
                  <Settings size={20} />
                  <span>Manage Products</span>
                </div>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Urgent Alerts */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Urgent Alerts</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-xl border border-red-100 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
                <AlertTriangle size={20} className="text-red-500 flex-shrink-0 mt-0.5 ml-2" />
                <div>
                  <h4 className="text-sm font-bold text-red-700">Expiring Soon</h4>
                  <p className="text-xs text-red-600 mt-1">3 items are expiring within 24 hours. Consider lowering price or donating.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-amber-50 rounded-xl border border-amber-100 relative overflow-hidden">
                 <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>
                <AlertTriangle size={20} className="text-amber-500 flex-shrink-0 mt-0.5 ml-2" />
                <div>
                  <h4 className="text-sm font-bold text-amber-700">Low Stock Alert</h4>
                  <p className="text-xs text-amber-600 mt-1">"Ayam Bakar Madu" has only 2 units left in inventory.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sustainability Impact */}
          <div className="bg-[#1A5632] rounded-2xl p-6 shadow-sm border border-[#144226] text-white relative overflow-hidden">
            {/* Background design element */}
            <div className="absolute -right-4 -top-4 opacity-10">
              <Leaf size={100} />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center space-x-2 mb-2">
                <Leaf size={18} className="text-[#A3D9B5]" />
                <h3 className="text-sm font-medium text-gray-200">Sustainability Impact</h3>
              </div>
              <h2 className="text-3xl font-bold text-white mb-1">128 kg</h2>
              <p className="text-sm text-[#A3D9B5]">CO₂ emissions saved this month</p>
              <div className="mt-4 pt-4 border-t border-[#236A3F] text-xs text-gray-300">
                Your efforts are equivalent to planting 6 trees!
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
