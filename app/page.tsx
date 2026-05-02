"use client";

import React, { useState } from 'react';
import CourierLayout from '../components/CourierLayout';
import OrderCard, { OrderProps, OrderStatus } from '../components/OrderCard';
import { Filter, Maximize2 } from 'lucide-react';

import { dummyOrders, OrderData } from '../lib/data';

export default function Home() {
  const [orders, setOrders] = useState<OrderData[]>(dummyOrders);
  const [activeTab, setActiveTab] = useState('All');

  const handleViewDetails = (id: string) => {
    alert(`Viewing details for ${id}`);
  };

  const handleAction = (id: string) => {
    setOrders(orders.map(order => {
      if (order.id === id) {
        let nextStatus: OrderStatus = 'completed';
        if (order.status === 'assigned') nextStatus = 'in_progress';
        return { ...order, status: nextStatus };
      }
      return order;
    }));
  };

  return (
    <CourierLayout>
      <div className="max-w-6xl mx-auto py-2">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-xs font-bold text-ecoeat-muted uppercase tracking-widest mb-1">COURIER DASHBOARD</p>
            <h1 className="text-3xl font-extrabold text-ecoeat-text">Delivery Tasks</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Tabs */}
            <div className="flex bg-white rounded-xl shadow-sm border border-black/5 p-1">
              {['All', 'Active', 'Completed'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-colors ${
                    activeTab === tab 
                      ? 'bg-ecoeat-bg text-ecoeat-text' 
                      : 'text-ecoeat-muted hover:text-ecoeat-text'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            
            {/* Sort */}
            <button className="flex items-center gap-2 bg-white rounded-xl shadow-sm border border-black/5 px-4 py-2 text-sm font-bold text-ecoeat-text hover:bg-gray-50">
              <Filter size={16} />
              Sort: <span className="text-ecoeat-primary">Nearest</span>
            </button>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map(order => (
            <OrderCard 
              key={order.id} 
              order={order} 
              onViewDetails={handleViewDetails}
              onAction={handleAction}
            />
          ))}

          {/* Live Network Status Widget Placeholder */}
          <div className="lg:col-span-2 bg-[#8c9790] rounded-[24px] p-6 text-white relative overflow-hidden flex flex-col justify-end min-h-[300px]">
            {/* Abstract map background pattern could go here */}
            <div className="absolute top-6 left-6 bg-white text-[#1e8932] text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-[#1e8932]"></div>
              Live Network Status
            </div>
            <button className="absolute top-6 right-6 bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors">
              <Maximize2 size={18} />
            </button>

            <div className="flex flex-col sm:flex-row gap-4 mt-auto relative z-10">
              <div className="bg-ecoeat-primary/90 backdrop-blur-sm rounded-xl p-4 flex-1 border border-white/10">
                <p className="text-xs font-bold text-white/80 uppercase mb-2">Today's Goal</p>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-3xl font-extrabold leading-none">12/15</span>
                  <span className="text-sm font-semibold text-white/80">80% Done</span>
                </div>
                <div className="h-1.5 w-full bg-white/30 rounded-full overflow-hidden">
                  <div className="h-full bg-white w-4/5 rounded-full"></div>
                </div>
              </div>
              
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 flex-1 text-ecoeat-text flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-ecoeat-muted uppercase mb-1">Active Couriers</p>
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"></div>
                    <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-white"></div>
                    <div className="w-8 h-8 rounded-full bg-gray-500 border-2 border-white"></div>
                    <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-ecoeat-muted">
                      +24
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CourierLayout>
  );
}
