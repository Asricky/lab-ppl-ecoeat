"use client";

import React, { useState } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { Route, PackageCheck, Target, ArrowUpDown } from 'lucide-react';

export default function KurirHistoryPage() {
  const [filter, setFilter] = useState<'today' | 'week' | 'all'>('all');
  
  const { tasks, searchQuery } = useTaskStore();
  
  // Real calculation from completed tasks
  const doneTasks = tasks.filter((task) => task.status === 'completed');
  const historyTasks = tasks.filter((task) => task.status === 'completed' || task.status === 'failed');
  
  const totalDeliveries = doneTasks.length;
  
  const totalDistanceNum = doneTasks.reduce((acc, task) => {
    const distStr = task.distance.replace(/[^0-9.]/g, '');
    const dist = parseFloat(distStr);
    return acc + (isNaN(dist) ? 0 : dist);
  }, 0);
  
  const totalDistance = totalDistanceNum.toFixed(1);
  const successRate = historyTasks.length > 0 ? Math.round((doneTasks.length / historyTasks.length) * 100) : 0;

  // Filter tasks for table
  const displayTasks = historyTasks.filter((t) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return t.id.toLowerCase().includes(q) || 
           t.pickup.toLowerCase().includes(q) || 
           t.destination.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-emerald-700 font-extrabold mb-1">COURIER HUB</p>
        <h1 className="text-3xl font-extrabold text-emerald-950">Delivery History</h1>
      </div>

      {/* Sustainability Stats (PBI#19) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-[24px] border border-black/5 shadow-sm p-6 flex items-start gap-4 h-full">
          <div className="w-12 h-12 bg-[#F2F6F0] rounded-xl flex items-center justify-center shrink-0 border border-[#D4ECD7] text-emerald-700">
             <PackageCheck size={24} />
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1">TOTAL DELIVERIES</p>
            <p className="text-3xl font-extrabold text-emerald-950">{totalDeliveries}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-[24px] border border-black/5 shadow-sm p-6 flex items-start gap-4 h-full">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 border border-blue-100 text-blue-600">
             <Route size={24} />
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1">DISTANCE COVERED</p>
            <p className="text-3xl font-extrabold text-emerald-950">{totalDistance} <span className="text-sm text-slate-500">km</span></p>
          </div>
        </div>
        
        <div className="bg-[#1A5632] rounded-[24px] border border-emerald-900 shadow-sm p-6 flex items-start gap-4 text-white h-full">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0 border border-white/20">
             <Target size={24} />
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-emerald-200 uppercase tracking-widest mb-1">SUCCESS RATE</p>
            <p className="text-3xl font-extrabold">{successRate} <span className="text-sm text-emerald-200">%</span></p>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[24px] border border-black/5 shadow-sm overflow-hidden flex flex-col">
        {/* Table Header & Filters */}
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-extrabold text-emerald-950">Transaction Ledger</h2>
          <div className="bg-slate-50 rounded-xl p-1 inline-flex border border-slate-100">
            <button 
              onClick={() => setFilter('today')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${filter === 'today' ? 'bg-white text-emerald-900 shadow-sm' : 'text-slate-500 hover:text-emerald-700'}`}
            >
              Today
            </button>
            <button 
              onClick={() => setFilter('week')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${filter === 'week' ? 'bg-white text-emerald-900 shadow-sm' : 'text-slate-500 hover:text-emerald-700'}`}
            >
              This Week
            </button>
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${filter === 'all' ? 'bg-white text-emerald-900 shadow-sm' : 'text-slate-500 hover:text-emerald-700'}`}
            >
              All Time
            </button>
          </div>
        </div>

        {/* Ledger Table (PBI#12) */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-6 py-4 text-[10px] uppercase tracking-wider font-extrabold text-slate-500 border-b border-gray-100">Order Info</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-wider font-extrabold text-slate-500 border-b border-gray-100">Route</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-wider font-extrabold text-slate-500 border-b border-gray-100">
                  <div className="flex items-center gap-1">Date & Time <ArrowUpDown size={12} /></div>
                </th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-wider font-extrabold text-slate-500 border-b border-gray-100">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {displayTasks.map((task) => (
                <tr key={task.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-extrabold text-emerald-950">ID: {task.id}</p>
                    <p className="text-xs font-medium text-slate-500 mt-1 capitalize">{task.type} Delivery</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></div>
                         <p className="text-xs font-bold text-slate-700 truncate max-w-[200px]">{task.pickup}</p>
                      </div>
                      <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-slate-300 shrink-0"></div>
                         <p className="text-xs font-bold text-slate-700 truncate max-w-[200px]">{task.destination}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-800">{task.completedAt ? task.completedAt.split(',')[0] : 'Today'}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{task.completedAt ? task.completedAt.split(',')[1] : task.eta}</p>
                  </td>
                  <td className="px-6 py-4">
                    {task.status === 'failed' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-50 border border-red-100 text-red-700 text-[10px] font-extrabold uppercase tracking-wider">
                         <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> Failed
                      </span>
                    ) : task.proofUploaded ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-extrabold uppercase tracking-wider">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Completed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-100 text-amber-700 text-[10px] font-extrabold uppercase tracking-wider">
                         <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div> Pending Proof
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              
              {displayTasks.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500 font-medium">
                    No completed deliveries found for this period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
