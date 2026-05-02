"use client";

import React, { useState } from 'react';
import CourierLayout from '@/app/components/CourierLayout';
import { Download, Package, TrendingUp, Map, Leaf, Search, MoreVertical, Inbox } from 'lucide-react';
import { dummyOrders } from '@/lib/data';

export default function HistoryView() {
  const [filter, setFilter] = useState('this_week'); // 'today', 'this_week', 'all_time'
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Unified Data Source: Get only COMPLETED or CANCELLED tasks
  let historyOrders = dummyOrders.filter(order => 
    order.status === 'completed' || order.status === 'cancelled'
  ).reverse(); // latest()

  // Apply time filter
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start of this week (Sunday)

  historyOrders = historyOrders.filter(order => {
    if (!order.date) return true; // fallback if no date
    const orderDate = new Date(order.date);
    
    if (filter === 'today') {
      return orderDate >= todayStart;
    } else if (filter === 'this_week') {
      return orderDate >= weekStart;
    }
    return true; // all_time
  });

  // 2. Client-side filtering by search
  const filteredOrders = historyOrders.filter(order => {
    return order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
           order.productName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // 3. Dynamic Statistics Calculation
  const totalDeliveries = historyOrders.filter(o => o.status === 'completed').length;
  
  const distanceCovered = historyOrders
    .filter(o => o.status === 'completed')
    .reduce((total, order) => {
      // Parse float from string like "2.4 km"
      const dist = parseFloat(order.distance) || 0;
      return total + dist;
    }, 0);

  const totalCompleted = historyOrders.filter(o => o.status === 'completed').length;
  const totalOrders = historyOrders.length;
  const successRate = totalOrders > 0 ? Math.round((totalCompleted / totalOrders) * 100) : 0;

  return (
    <CourierLayout>
      <div className="h-full flex flex-col bg-ecoeat-bg overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto w-full">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <span className="text-[10px] font-bold text-ecoeat-accent uppercase tracking-widest mb-1">FLEET MANAGEMENT</span>
              <h1 className="text-3xl font-extrabold text-ecoeat-text leading-tight">Delivery History</h1>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Deliveries */}
            <div className="bg-ecoeat-primary rounded-3xl p-6 text-white shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Package size={20} className="text-white" />
                </div>
              </div>
              <div>
                <p className="text-white/70 text-sm font-medium mb-1">Total Deliveries</p>
                <p className="text-4xl font-extrabold">{totalDeliveries}</p>
              </div>
            </div>

            {/* Distance Covered */}
            <div className="bg-white rounded-3xl p-6 text-ecoeat-text shadow-sm border border-black/5 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-ecoeat-pill rounded-full flex items-center justify-center">
                  <Map size={20} className="text-ecoeat-primary" />
                </div>
              </div>
              <div>
                <p className="text-ecoeat-muted text-sm font-medium mb-1">Distance Covered</p>
                <div className="flex items-end gap-2 mb-2">
                  <p className="text-4xl font-extrabold">{distanceCovered.toFixed(1)} <span className="text-lg text-gray-400 font-bold">km</span></p>
                </div>
              </div>
            </div>

            {/* Success Rate */}
            <div className="bg-ecoeat-pill rounded-3xl p-6 text-ecoeat-text shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <TrendingUp size={20} className="text-ecoeat-accent" />
                </div>
              </div>
              <div>
                <p className="text-ecoeat-primary text-sm font-medium mb-1">Success Rate</p>
                <p className="text-4xl font-extrabold text-ecoeat-primary">{successRate}<span className="text-lg opacity-70 font-bold">%</span></p>
              </div>
            </div>
          </div>

          {/* Table Controls (Tabs & Search) */}
          <div className="bg-white p-4 rounded-t-[32px] border-b border-black/5 flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 shadow-sm">
            <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl w-full sm:w-auto">
              <button 
                 onClick={() => setFilter('today')}
                 className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${filter === 'today' ? 'bg-white text-ecoeat-text shadow-sm' : 'text-ecoeat-muted hover:text-ecoeat-text'}`}>
                 Today
              </button>
              <button 
                 onClick={() => setFilter('this_week')}
                 className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${filter === 'this_week' ? 'bg-white text-ecoeat-text shadow-sm' : 'text-ecoeat-muted hover:text-ecoeat-text'}`}>
                 This Week
              </button>
              <button 
                 onClick={() => setFilter('all_time')}
                 className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${filter === 'all_time' ? 'bg-white text-ecoeat-text shadow-sm' : 'text-ecoeat-muted hover:text-ecoeat-text'}`}>
                 All Time
              </button>
            </div>

            <div className="w-full sm:w-72 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                 type="text" 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 placeholder="Search ID or Product..." 
                 className="w-full bg-gray-50 border-none rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-ecoeat-accent outline-none text-ecoeat-text"
              />
            </div>
          </div>

          {/* Delivery Table */}
          <div className="bg-white rounded-b-[32px] shadow-sm overflow-hidden border border-black/5 border-t-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-gray-100 text-[10px] uppercase tracking-wider text-gray-400 font-bold">
                    <th className="px-6 py-4 rounded-tl-[32px]">Order Info</th>
                    <th className="px-6 py-4">Route</th>
                    <th className="px-6 py-4">Date & Time</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right rounded-tr-[32px]">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                            {/* Fallback image */}
                            <img src={order.pickupAvatar} alt="Product" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="text-sm font-extrabold text-ecoeat-text">{order.productName}</p>
                            <p className="text-xs text-ecoeat-muted font-medium">#{order.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-ecoeat-primary"></div>
                            <span className="text-xs text-ecoeat-text font-semibold truncate max-w-[180px]">{order.pickupName}</span>
                          </div>
                          <div className="border-l border-dashed border-gray-300 ml-1 h-3 my-0.5"></div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                            <span className="text-xs text-ecoeat-muted font-medium truncate max-w-[180px]">{order.destinationName}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-ecoeat-text">
                          {order.date ? new Date(order.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Today'}
                        </p>
                        <p className="text-xs text-ecoeat-muted font-medium">
                           {order.date ? new Date(order.date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        {order.status === 'completed' ? (
                          <span className="bg-ecoeat-pill text-ecoeat-accent px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 w-max">
                            <div className="w-1.5 h-1.5 bg-ecoeat-accent rounded-full"></div> Completed
                          </span>
                        ) : (
                          <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 w-max">
                            <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div> Cancelled
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-gray-400 hover:text-ecoeat-text p-2 rounded-lg hover:bg-gray-100 transition-colors">
                          <MoreVertical size={20} />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-ecoeat-muted">
                        <Inbox size={48} className="mx-auto text-gray-300 mb-3" />
                        <p className="font-bold">No delivery history found.</p>
                        <p className="text-sm">Try completing a task in the dashboard.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="p-6 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm text-ecoeat-muted font-medium">Showing 1 to {filteredOrders.length} of {filteredOrders.length} entries</span>
              <div className="flex gap-1">
                <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm font-medium text-gray-400 cursor-not-allowed">Prev</button>
                <button className="px-3 py-1 bg-ecoeat-primary text-white rounded-lg text-sm font-bold shadow-sm">1</button>
                <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm font-medium text-ecoeat-text hover:bg-gray-50">Next</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </CourierLayout>
  );
}
