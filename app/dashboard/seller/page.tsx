"use client";

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Package, 
  ListChecks, 
  ShoppingCart, 
  Leaf, 
  PlusCircle, 
  AlertTriangle,
  TrendingUp,
  MapPin
} from 'lucide-react';

import { useProductStore } from '@/store/productStore';

function DashboardContent() {
  const searchParams = useSearchParams();
  const flow = searchParams.get('flow') || 'sell';
  const isDonate = flow === 'donate';
  const { products } = useProductStore();
  const [timeRange, setTimeRange] = useState('This Week');

  const salesDataByTime: any = {
    'Today': [
      { day: '6am', revenue: 12000 }, { day: '9am', revenue: 45000 }, { day: '12pm', revenue: 38000 },
      { day: '3pm', revenue: 65000 }, { day: '6pm', revenue: 20000 }, { day: '9pm', revenue: 15000 },
    ],
    'This Week': [
      { day: 'Mon', revenue: 45000 }, { day: 'Tue', revenue: 52000 }, { day: 'Wed', revenue: 38000 },
      { day: 'Thu', revenue: 65000 }, { day: 'Fri', revenue: 85000 }, { day: 'Sat', revenue: 120000 }, { day: 'Sun', revenue: 90000 },
    ],
    'This Month': [
      { day: 'W1', revenue: 245000 }, { day: 'W2', revenue: 352000 }, { day: 'W3', revenue: 438000 }, { day: 'W4', revenue: 565000 },
    ],
    'This Year': [
      { day: 'Q1', revenue: 1245000 }, { day: 'Q2', revenue: 2352000 }, { day: 'Q3', revenue: 3438000 }, { day: 'Q4', revenue: 4565000 },
    ],
    'All Time': [
      { day: '2021', revenue: 4245000 }, { day: '2022', revenue: 8352000 }, { day: '2023', revenue: 12438000 },
    ]
  };

  const currentData = salesDataByTime[timeRange];
  const maxRevenue = Math.max(...currentData.map((d: any) => d.revenue)) * 1.2 || 120000;
  const yAxisSteps = [maxRevenue, maxRevenue * 0.75, maxRevenue * 0.5, maxRevenue * 0.25, 0];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <p className="text-xs font-bold tracking-wider text-gray-500 uppercase mb-1">Overview</p>
          <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Today is Wednesday, October 25th, 2023</p>
        </div>
        
        {/* Time Range Filter */}
        <div className="relative z-20">
          <div className="flex items-center space-x-2 bg-white border border-gray-200 shadow-sm px-3 py-2 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors focus-within:ring-2 focus-within:ring-[#1A5632]">
            <select 
              className="bg-transparent outline-none appearance-none pr-4 cursor-pointer focus:outline-none"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
              <option value="This Year">This Year</option>
              <option value="All Time">All Time</option>
            </select>
            <span className="text-xs absolute right-3 pointer-events-none">▼</span>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link href="/dashboard/seller/wallet" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-[#1A5632] hover:shadow-md transition-all group block">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-[#E8F3EB] p-2.5 rounded-lg text-[#1A5632]">
              <Package size={20} />
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
              <TrendingUp size={12} className="mr-1" /> +12%
            </span>
          </div>
          <p className="text-sm text-gray-500 font-medium mb-1">{isDonate ? 'Meals Saved (kg)' : 'Total Revenue'}</p>
          <h3 className="text-2xl font-bold text-gray-900 group-hover:text-[#1A5632] transition-colors">{isDonate ? '428 kg' : 'Rp 2.4M'}</h3>
        </Link>

        <Link href="/dashboard/seller/products" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-[#1A5632] hover:shadow-md transition-all group block">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-blue-50 p-2.5 rounded-lg text-blue-600">
              <ListChecks size={20} />
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
              <TrendingUp size={12} className="mr-1" /> +4%
            </span>
          </div>
          <p className="text-sm text-gray-500 font-medium mb-1">{isDonate ? 'Donation Milestone' : 'Active Listings'}</p>
          <h3 className="text-2xl font-bold text-gray-900 group-hover:text-[#1A5632] transition-colors">{isDonate ? 'Silver Partner' : '86'}</h3>
        </Link>

        <Link href="/dashboard/seller/orders" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-[#1A5632] hover:shadow-md transition-all group block">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-amber-50 p-2.5 rounded-lg text-amber-600">
              <ShoppingCart size={20} />
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
              <TrendingUp size={12} className="mr-1" /> +22%
            </span>
          </div>
          <p className="text-sm text-gray-500 font-medium mb-1">Orders</p>
          <h3 className="text-2xl font-bold text-gray-900 group-hover:text-[#1A5632] transition-colors">42</h3>
        </Link>

        <Link href="/dashboard/seller/analytics" className="bg-[#1A5632] rounded-2xl p-6 shadow-sm border border-[#144226] text-white relative overflow-hidden hover:shadow-md hover:scale-[1.02] transition-all group block">
          <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
            <Leaf size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-[#2A7A4A] p-2.5 rounded-lg text-white">
                <Leaf size={20} />
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#2A7A4A] text-white border border-[#3A8A5A]">
                Impact Leader
              </span>
            </div>
            <p className="text-sm text-[#A3D9B5] font-medium mb-1">Donations</p>
            <h3 className="text-2xl font-bold text-white">58</h3>
          </div>
        </Link>
      </div>

      {/* Sales Analysis Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900">Sales Analysis</h2>
          <Link href="/dashboard/seller/analytics" className="text-sm font-bold text-[#1A5632] hover:bg-green-50 px-3 py-1.5 rounded-lg transition-colors">Detailed Report</Link>
        </div>
        <div className="relative h-[250px] w-full flex items-end pt-8 mb-4 ml-6 lg:ml-8">
          <div className="absolute inset-0 flex flex-col justify-between pb-8 pointer-events-none">
            {yAxisSteps.map((val, i) => (
              <div key={i} className="flex items-center w-full border-b border-gray-100 h-0 relative">
                <span className="absolute -left-2 -translate-x-full text-[10px] text-gray-400 font-medium whitespace-nowrap">
                  {val === 0 ? '0' : (val >= 1000000 ? (val/1000000).toFixed(1) + 'M' : Math.round(val/1000) + 'k')}
                </span>
              </div>
            ))}
          </div>
          <div className="flex-1 flex justify-between items-end h-full relative z-10 px-4 md:px-12">
            {currentData.map((data: any, index: number) => (
              <div key={index} className="flex flex-col items-center group relative pointer-events-auto h-full justify-end">
                <div className="absolute -top-4 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap z-20 shadow-lg pointer-events-none transform -translate-x-1/2 left-1/2">
                  Rp {data.revenue.toLocaleString('id-ID')}
                </div>
                <div className="w-8 md:w-12 bg-gradient-to-t from-[#1A5632] to-[#4ade80] rounded-t-lg transition-all duration-300 group-hover:opacity-80" style={{ height: `${(data.revenue / maxRevenue) * 100}%` }}></div>
                <span className="text-xs font-bold text-gray-500 mt-3 absolute -bottom-8">{data.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Section (Left) */}
        <div className="lg:w-2/3 flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Product Overview</h2>
              <Link href="/dashboard/seller/products" className="text-sm font-bold text-[#1A5632] hover:text-[#0F351F] px-3 py-1 rounded-lg hover:bg-green-50 transition-colors">View All</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 text-xs font-bold tracking-wider text-gray-500 uppercase border-b border-gray-100">
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4">Expiry</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {products.slice(0, 3).map((p) => (
                    <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                          <span className="font-bold text-gray-900">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold uppercase ${
                          p.type === 'Donate' ? 'bg-[#F2E8DF] text-[#7A5B42]' : 'bg-[#E8F3EB] text-[#1A5632]'
                        }`}>
                          {p.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900">{p.stock}</td>
                      <td className="px-6 py-4 text-gray-600">{p.expiry}</td>
                      <td className="px-6 py-4">
                         <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold uppercase ${
                          p.status === 'Expiring Soon' ? 'bg-red-100 text-red-700' : 
                          p.status === 'Sold Out' ? 'bg-gray-100 text-gray-600' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {p.status === 'Expiring Soon' && <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5"></span>}
                          {p.status === 'Sold Out' && <span className="w-1.5 h-1.5 rounded-full bg-gray-500 mr-1.5"></span>}
                          {p.status === 'Active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>}
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Side Panel (Right) */}
        <div className="lg:w-1/3 flex flex-col gap-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link href="/dashboard/seller/products/create" className="block">
                <button className="w-full flex items-center justify-center space-x-2 bg-[#1A5632] hover:bg-[#0F351F] text-white px-4 py-3 rounded-xl font-bold transition-colors shadow-sm">
                  <PlusCircle size={20} />
                  <span>Add Product</span>
                </button>
              </Link>
              <Link href="/dashboard/seller/products" className="block w-full">
                <button className="w-full flex items-center justify-center space-x-2 bg-[#E8F3EB] hover:bg-[#D1E8D7] text-[#1A5632] px-4 py-3 rounded-xl font-bold transition-colors">
                  <span>Manage Products</span>
                </button>
              </Link>
              <Link href="/dashboard/seller/orders" className="block w-full">
                <button className="w-full flex items-center justify-center space-x-2 bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-3 rounded-xl font-bold transition-colors border border-gray-100">
                  <ShoppingCart size={20} />
                  <span>Manage Orders</span>
                </button>
              </Link>
            </div>
          </div>

          {/* Urgent Alerts */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center text-red-600">
              <AlertTriangle size={20} className="mr-2" />
              Urgent Alerts
            </h3>
            <div className="space-y-4">
              <Link href="/dashboard/seller/products" className="block relative pl-4 border-l-2 border-red-500 hover:bg-gray-50 transition-colors p-2 rounded-r-xl cursor-pointer group">
                <p className="text-xs font-bold text-gray-500 uppercase mb-0.5">Expiring Soon</p>
                <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#1A5632] transition-colors">8kg Heirloom Tomatoes</h4>
                <p className="text-xs font-medium text-red-600 mt-0.5">Expiring in 6 hours</p>
              </Link>
              <Link href="/dashboard/seller/products" className="block relative pl-4 border-l-2 border-amber-400 hover:bg-gray-50 transition-colors p-2 rounded-r-xl cursor-pointer group">
                <p className="text-xs font-bold text-gray-500 uppercase mb-0.5">Low Stock</p>
                <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#1A5632] transition-colors">Honeycrisp Apples</h4>
                <p className="text-xs font-medium text-amber-600 mt-0.5">Only 2kg remaining</p>
              </Link>
              <Link href="/dashboard/seller/orders" className="block relative pl-4 border-l-2 border-red-500 hover:bg-gray-50 transition-colors p-2 rounded-r-xl cursor-pointer group">
                <p className="text-xs font-bold text-gray-500 uppercase mb-0.5">Order Overdue</p>
                <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#1A5632] transition-colors">Order #VH-4921</h4>
                <p className="text-xs font-medium text-red-600 mt-0.5">Pickup missed by 1 hour</p>
              </Link>
            </div>
            <button className="w-full mt-6 text-sm font-bold text-[#1A5632] hover:text-[#0F351F] text-center">
              View All Alerts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardOverview() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
