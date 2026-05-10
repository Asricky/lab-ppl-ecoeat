"use client";

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Leaf,
  Download,
  Calendar,
  ChevronDown,
  FileText,
  X,
  Printer,
  ArrowLeft,
  ShoppingCart,
  ListChecks,
} from 'lucide-react';
import Image from 'next/image';

import { useProductStore } from '@/store/productStore';
import {
  buildDonationChartSeries,
  getSellerMetrics,
  maxChartDonations,
  type SellerTimeRange,
} from '@/lib/sellerMetrics';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<SellerTimeRange>('This Month');
  const [showReportModal, setShowReportModal] = useState(false);
  const { products } = useProductStore();

  const metrics = useMemo(
    () => getSellerMetrics(products, timeRange),
    [products, timeRange]
  );

  const chartSeries = useMemo(
    () => buildDonationChartSeries(products, timeRange),
    [products, timeRange]
  );

  const maxDon = maxChartDonations(chartSeries);

  const handleExportCSV = () => {
    const headers = ['Time,Total donations (portions)'];
    const csvData = chartSeries.map((row) => `${row.label},${row.donations}`);
    const csvString = [headers.join(','), ...csvData].join('\n');

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ecoeat-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const topProducts = useMemo(() => {
    return [...products]
      .filter((p: { type?: string }) => p.type === 'Sell')
      .sort((a, b) => b.stock - a.stock)
      .slice(0, 4)
      .map((p) => ({
        ...p,
        salesEstimate: Math.max(1, p.stock + 12),
      }));
  }, [products]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="flex items-center space-x-2 text-gray-500 hover:text-[#1A5632] transition-colors font-bold text-sm bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 w-fit print:hidden"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics &amp; impact</h1>
          <p className="text-sm font-medium text-gray-500">
            Track orders, active products, and donation portions. Currency: IDR (Rp).
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="flex items-center space-x-2 bg-white border border-gray-200 shadow-sm px-3 py-2 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors focus-within:ring-2 focus-within:ring-[#1A5632]">
              <Calendar size={16} className="text-gray-400" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as SellerTimeRange)}
                className="bg-transparent outline-none appearance-none pr-4 cursor-pointer focus:outline-none"
              >
                <option value="This Week">This Week</option>
                <option value="This Month">This Month</option>
                <option value="This Year">This Year</option>
                <option value="All Time">All Time</option>
              </select>
              <ChevronDown size={14} className="text-gray-400 absolute right-3 pointer-events-none" />
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowReportModal(true)}
            className="bg-white border border-[#1A5632] text-[#1A5632] px-4 py-2 rounded-xl flex items-center space-x-2 text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm"
          >
            <FileText size={16} />
            <span className="hidden sm:inline">Report</span>
          </button>
          <button
            type="button"
            onClick={handleExportCSV}
            className="bg-[#E8F3EB] text-[#1A5632] border border-[#D1E8D7] px-4 py-2 rounded-xl flex items-center space-x-2 text-sm font-bold hover:bg-[#D1E8D7] transition-colors shadow-sm"
          >
            <Download size={16} />
            <span className="hidden sm:inline">CSV</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-amber-50 p-3 rounded-xl text-amber-600">
              <ShoppingCart size={20} />
            </div>
          </div>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Total orders</p>
          <h3 className="text-2xl font-extrabold text-gray-900">
            {metrics.totalOrders.toLocaleString('id-ID')}
          </h3>
        </div>

        <div className="bg-[#1A5632] rounded-2xl p-6 border border-[#144226] shadow-sm text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4">
            <Leaf size={100} />
          </div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-[#2A7A4A] p-3 rounded-xl text-white">
                <Leaf size={20} />
              </div>
            </div>
            <p className="text-sm font-bold text-[#A3D9B5] uppercase tracking-wider mb-1">
              Meals saved (portions)
            </p>
            <h3 className="text-2xl font-extrabold text-white">
              {metrics.totalDonationPortions.toLocaleString('id-ID')}
            </h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sm:col-span-2 lg:col-span-1">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
              <ListChecks size={20} />
            </div>
          </div>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">
            Active products
          </p>
          <h3 className="text-2xl font-extrabold text-gray-900">
            {metrics.activeProducts.toLocaleString('id-ID')}
          </h3>
          <p className="text-xs text-gray-400 mt-2">Commercial items with Active status</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Impact overview</h3>

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
                    <div
                      key={i}
                      className="flex items-center w-full border-b border-gray-100 h-0 relative"
                    >
                      <span className="absolute -left-2 -translate-x-full text-[10px] text-gray-400 font-medium whitespace-nowrap">
                        {frac === 0
                          ? '0'
                          : `${Math.round(maxDon * frac).toLocaleString('id-ID')}`}
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

          <div className="flex items-center justify-center mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-3 rounded bg-gradient-to-t from-[#1A5632] to-[#4ade80]" />
              <span className="text-sm font-bold text-gray-600">Donations (portions)</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Top performing</h3>
            <Link href="/dashboard/seller/products">
              <button
                type="button"
                className="text-sm font-bold text-[#1A5632] hover:underline"
              >
                View all
              </button>
            </Link>
          </div>

          <div className="space-y-5">
            {topProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between gap-2">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 line-clamp-1">{product.name}</p>
                    <p className="text-xs font-medium text-gray-500">
                      {product.salesEstimate} est. units · stock {product.stock}
                    </p>
                  </div>
                </div>
                <div className="text-right pl-2 shrink-0">
                  <p className="text-sm font-bold text-[#1A5632]">{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showReportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            onClick={() => setShowReportModal(false)}
          />
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col relative z-10 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="bg-[#E8F3EB] p-2 rounded-xl text-[#1A5632]">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Impact report</h3>
                  <p className="text-sm font-medium text-gray-500">Preview for {timeRange}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-200"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 bg-gray-200/50">
              <div
                id="pdf-report-content"
                className="bg-white mx-auto shadow-sm border border-gray-200 p-10 max-w-2xl min-h-[800px] relative"
              >
                <div className="flex justify-between items-start border-b-2 border-[#1A5632] pb-6 mb-8">
                  <div>
                    <h1 className="text-3xl font-black text-[#1A5632] mb-1">IMPACT REPORT</h1>
                    <p className="text-sm font-bold text-gray-500 tracking-widest uppercase">
                      EcoEat seller summary
                    </p>
                  </div>
                  <div className="text-right">
                    <Image
                      src="/Logo EcoEat.png"
                      alt="EcoEat — Delivery & Surplus Food"
                      width={150}
                      height={40}
                      priority
                      className="h-10 w-auto mb-2 inline-block"
                    />
                    <p className="text-xs font-medium text-gray-400">
                      {new Date().toLocaleDateString('en-GB', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-5 mb-8 border border-gray-100 flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                      alt="Seller"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Seller</h3>
                    <p className="text-sm font-medium text-gray-500">EcoEat partner</p>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                  Summary
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="border border-[#D1E8D7] rounded-xl p-5 bg-[#F9FCFA]">
                    <div className="flex items-center space-x-2 text-[#1A5632] mb-2">
                      <ShoppingCart size={20} />
                      <span className="font-bold text-sm">Total orders</span>
                    </div>
                    <p className="text-3xl font-black text-gray-900">
                      {metrics.totalOrders.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div className="border border-[#D1E8D7] rounded-xl p-5 bg-[#F9FCFA]">
                    <div className="flex items-center space-x-2 text-[#1A5632] mb-2">
                      <Leaf size={20} />
                      <span className="font-bold text-sm">Meals saved (portions)</span>
                    </div>
                    <p className="text-3xl font-black text-gray-900">
                      {metrics.totalDonationPortions.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div className="border border-gray-200 rounded-xl p-5 col-span-2">
                    <div className="flex items-center space-x-2 text-blue-600 mb-2">
                      <ListChecks size={20} />
                      <span className="font-bold text-sm">Active products</span>
                    </div>
                    <p className="text-3xl font-black text-gray-900">
                      {metrics.activeProducts.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>

                <div className="bg-[#1A5632] text-white rounded-xl p-6 mb-8 relative overflow-hidden">
                  <Leaf size={120} className="absolute -right-4 -bottom-4 text-white opacity-10" />
                  <div className="relative z-10">
                    <p className="text-xs font-bold text-[#A3D9B5] uppercase tracking-wider mb-2">
                      Report period
                    </p>
                    <p className="text-xl font-bold">{timeRange}</p>
                    <p className="text-sm text-[#A3D9B5] mt-2">
                      Matches the time filter on your seller dashboard.
                    </p>
                  </div>
                </div>

                <div className="mt-auto pt-8 border-t border-gray-100 text-center">
                  <p className="text-xs font-medium text-gray-400">
                    Generated by EcoEat Seller Portal. Amounts in IDR where applicable.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-white flex justify-between items-center">
              <p className="text-sm font-medium text-gray-500">Format: A4 PDF</p>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-[#1A5632] hover:bg-[#0F351F] text-white px-6 py-2.5 rounded-xl font-bold flex items-center space-x-2 transition-colors shadow-sm"
                >
                  <Printer size={18} />
                  <span>Save as PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
