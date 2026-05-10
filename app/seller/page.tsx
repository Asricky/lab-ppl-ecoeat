"use client";

import React, { Suspense, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Package,
  ListChecks,
  ShoppingCart,
  Leaf,
  PlusCircle,
  AlertTriangle,
} from 'lucide-react';

import { useProductStore } from '@/store/productStore';
import { useAuthStore } from '@/store/authStore';
import {
  buildDonationChartSeries,
  getSellerMetrics,
  maxChartDonations,
  type SellerTimeRange,
} from '@/lib/sellerMetrics';

function DashboardContent() {
  const { products } = useProductStore();
  const { user } = useAuthStore();
  const [timeRange, setTimeRange] = useState<SellerTimeRange>('This Week');

  const [weekRangeLabel] = useState(() => {
    const start = new Date();
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return `Current Week: ${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  });

  const metrics = useMemo(
    () => getSellerMetrics(products, timeRange),
    [products, timeRange]
  );

  const chartSeries = useMemo(
    () => buildDonationChartSeries(products, timeRange),
    [products, timeRange]
  );

  const maxDon = maxChartDonations(chartSeries);

  const sellProductsPreview = useMemo(
    () => products.filter((p: { type: string }) => p.type === 'Sell').slice(0, 3),
    [products]
  );

  const dateByTime: Record<SellerTimeRange, string> = useMemo(
    () => ({
      Today: `Today is ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}`,
      'This Week': weekRangeLabel,
      'This Month': `Current Month: ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`,
      'This Year': `Current Year: ${new Date().getFullYear()}`,
      'All Time': 'Since Store Opening',
    }),
    [weekRangeLabel]
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <p className="text-xs font-bold tracking-wider text-gray-500 uppercase mb-1">Overview</p>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {user?.name || 'Seller'}!
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            EcoPay Balance: Rp {(user?.ecoPayBalance ?? 0).toLocaleString('id-ID')}
          </p>
          <p className="text-sm text-gray-400 mt-0.5">{dateByTime[timeRange]}</p>
        </div>

        <div className="relative z-20">
          <div className="flex items-center space-x-2 bg-white border border-gray-200 shadow-sm px-3 py-2 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors focus-within:ring-2 focus-within:ring-[#1A5632]">
            <select
              className="bg-transparent outline-none appearance-none pr-4 cursor-pointer focus:outline-none"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as SellerTimeRange)}
            >
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
              <option value="This Year">This Year</option>
              <option value="All Time">All Time</option>
            </select>
            <span className="text-xs absolute right-3 pointer-events-none">▼</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link
          href="/seller/orders"
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-[#1A5632] hover:shadow-md transition-all group block"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="bg-amber-50 p-2.5 rounded-lg text-amber-600">
              <ShoppingCart size={20} />
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium mb-1">Total Orders</p>
          <h3 className="text-2xl font-bold text-gray-900 group-hover:text-[#1A5632] transition-colors">
            {metrics.totalOrders.toLocaleString('id-ID')}
          </h3>
        </Link>

        <Link
          href="/seller/donations"
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-[#1A5632] hover:shadow-md transition-all group block"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="bg-[#E8F3EB] p-2.5 rounded-lg text-[#1A5632]">
              <Leaf size={20} />
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium mb-1">Meals saved (portions)</p>
          <h3 className="text-2xl font-bold text-gray-900 group-hover:text-[#1A5632] transition-colors">
            {metrics.totalDonationPortions.toLocaleString('id-ID')}
          </h3>
        </Link>

        <Link
          href="/seller/products"
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-[#1A5632] hover:shadow-md transition-all group block"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="bg-blue-50 p-2.5 rounded-lg text-blue-600">
              <ListChecks size={20} />
            </div>
          </div>
          <p className="text-sm text-gray-500 font-medium mb-1">Active products</p>
          <h3 className="text-2xl font-bold text-gray-900 group-hover:text-[#1A5632] transition-colors">
            {metrics.activeProducts.toLocaleString('id-ID')}
          </h3>
          <p className="text-xs text-gray-400 mt-1">IDR catalogue · Active status</p>
        </Link>

        <Link
          href="/seller/analytics"
          className="bg-[#1A5632] rounded-2xl p-6 shadow-sm border border-[#144226] text-white relative overflow-hidden hover:shadow-md hover:scale-[1.02] transition-all group block"
        >
          <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
            <Leaf size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-[#2A7A4A] p-2.5 rounded-lg text-white">
                <Package size={20} />
              </div>
            </div>
            <p className="text-sm text-[#A3D9B5] font-medium mb-1">Analytics</p>
            <h3 className="text-2xl font-bold text-white">Impact trends</h3>
            <p className="text-xs text-[#A3D9B5] mt-2 opacity-90">
              Same period as Analytics for the selected range
            </p>
          </div>
        </Link>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900">Impact overview</h2>
          <Link
            href="/seller/analytics"
            className="text-sm font-bold text-[#1A5632] hover:bg-green-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            Detailed report
          </Link>
        </div>
        <div className="flex gap-0 min-h-[280px]">
          <div className="flex flex-col items-center justify-center w-11 shrink-0 pt-6 pb-10">
            <span className="text-[10px] font-bold text-gray-500 [writing-mode:vertical-rl] rotate-180 tracking-tight text-center">
              Total donations (portions)
            </span>
          </div>
          <div className="flex-1 min-w-0 flex flex-col">
            <div className="relative h-[250px] w-full flex items-end pt-8 ml-2 lg:ml-4 mb-1">
              <div className="absolute inset-0 flex flex-col justify-between pb-8 pointer-events-none">
                {[1, 0.75, 0.5, 0.25, 0].map((frac, i) => (
                  <div key={i} className="flex items-center w-full border-b border-gray-100 h-0 relative">
                    <span className="absolute -left-2 -translate-x-full text-[10px] text-gray-400 font-medium whitespace-nowrap">
                      {frac === 0
                        ? '0'
                        : Math.round(maxDon * frac).toLocaleString('id-ID')}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex-1 flex justify-between items-end h-full relative z-10 px-2 md:px-6 w-full gap-1">
                {chartSeries.map((point, index) => (
                  <div
                    key={`${point.label}-${index}`}
                    className="flex flex-col items-center group relative pointer-events-auto h-full justify-end flex-1 min-w-0"
                  >
                    <div className="absolute -top-4 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap z-20 shadow-lg pointer-events-none transform -translate-x-1/2 left-1/2">
                      {point.donations.toLocaleString('id-ID')} portions
                    </div>
                    <div
                      className="w-full max-w-[48px] mx-auto bg-gradient-to-t from-[#1A5632] to-[#4ade80] rounded-t-lg transition-all duration-300 group-hover:opacity-90 min-h-[4px]"
                      style={{
                        height: `${maxDon > 0 ? (point.donations / maxDon) * 100 : 0}%`,
                      }}
                    />
                    <span className="text-[10px] sm:text-xs font-bold text-gray-500 mt-3 text-center leading-tight px-0.5">
                      {point.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-center text-[10px] font-bold text-gray-500 uppercase tracking-wide mt-2">
              Time
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Product Overview</h2>
              <Link
                href="/seller/products"
                className="text-sm font-bold text-[#1A5632] hover:text-[#0F351F] px-3 py-1 rounded-lg hover:bg-green-50 transition-colors"
              >
                View All
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 text-xs font-bold tracking-wider text-gray-500 uppercase border-b border-gray-100">
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4">Expiry</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {sellProductsPreview.map((p: (typeof products)[number]) => (
                    <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                          />
                          <span className="font-bold text-gray-900">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900">{p.stock}</td>
                      <td className="px-6 py-4 text-gray-600">{p.expiry}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold uppercase ${
                            p.status === 'Expiring Soon'
                              ? 'bg-red-100 text-red-700'
                              : p.status === 'Sold Out'
                                ? 'bg-gray-100 text-gray-600'
                                : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {p.status === 'Expiring Soon' && (
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5" />
                          )}
                          {p.status === 'Sold Out' && (
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-500 mr-1.5" />
                          )}
                          {p.status === 'Active' && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
                          )}
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

        <div className="lg:w-1/3 flex flex-col gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link href="/seller/products/create" className="block">
                <button
                  type="button"
                  className="w-full flex items-center justify-center space-x-2 bg-[#1A5632] hover:bg-[#0F351F] text-white px-4 py-3 rounded-xl font-bold transition-colors shadow-sm"
                >
                  <PlusCircle size={20} />
                  <span>Add Product</span>
                </button>
              </Link>
              <Link href="/seller/products" className="block w-full">
                <button
                  type="button"
                  className="w-full flex items-center justify-center space-x-2 bg-[#E8F3EB] hover:bg-[#D1E8D7] text-[#1A5632] px-4 py-3 rounded-xl font-bold transition-colors"
                >
                  <span>Manage Products</span>
                </button>
              </Link>
              <Link href="/seller/orders" className="block w-full">
                <button
                  type="button"
                  className="w-full flex items-center justify-center space-x-2 bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-3 rounded-xl font-bold transition-colors border border-gray-100"
                >
                  <ShoppingCart size={20} />
                  <span>Manage Orders</span>
                </button>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center text-red-600">
              <AlertTriangle size={20} className="mr-2" />
              Urgent Alerts
            </h3>
            <div className="space-y-4">
              <Link
                href="/seller/products"
                className="block relative pl-4 border-l-2 border-red-500 hover:bg-gray-50 transition-colors p-2 rounded-r-xl cursor-pointer group"
              >
                <p className="text-xs font-bold text-gray-500 uppercase mb-0.5">Expiring Soon</p>
                <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#1A5632] transition-colors">
                  8kg Heirloom Tomatoes
                </h4>
                <p className="text-xs font-medium text-red-600 mt-0.5">Expiring in 6 hours</p>
              </Link>
              <Link
                href="/seller/products"
                className="block relative pl-4 border-l-2 border-amber-400 hover:bg-gray-50 transition-colors p-2 rounded-r-xl cursor-pointer group"
              >
                <p className="text-xs font-bold text-gray-500 uppercase mb-0.5">Low Stock</p>
                <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#1A5632] transition-colors">
                  Honeycrisp Apples
                </h4>
                <p className="text-xs font-medium text-amber-600 mt-0.5">Only 2kg remaining</p>
              </Link>
              <Link
                href="/seller/orders"
                className="block relative pl-4 border-l-2 border-red-500 hover:bg-gray-50 transition-colors p-2 rounded-r-xl cursor-pointer group"
              >
                <p className="text-xs font-bold text-gray-500 uppercase mb-0.5">Order Overdue</p>
                <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#1A5632] transition-colors">
                  Order #VH-4921
                </h4>
                <p className="text-xs font-medium text-red-600 mt-0.5">Pickup missed by 1 hour</p>
              </Link>
            </div>
            <button
              type="button"
              className="w-full mt-6 text-sm font-bold text-[#1A5632] hover:text-[#0F351F] text-center"
            >
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
