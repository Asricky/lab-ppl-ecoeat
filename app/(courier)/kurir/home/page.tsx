"use client";

import { useMemo, useState } from 'react';
import TaskCard from '@/components/TaskCard';
import { useTaskStore } from '@/store/taskStore';
import { useEcoPayStore } from '@/store/ecoPayStore';
import { SlidersHorizontal, ChevronDown, Maximize2, Wallet } from 'lucide-react';

export default function KurirHomePage() {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'nearest' | 'furthest'>('nearest');
  const [isSortOpen, setIsSortOpen] = useState(false);

  const { tasks, searchQuery } = useTaskStore();
  const { balance } = useEcoPayStore();
  const ecopayBalance = balance;

  // Calculate Today's Goal
  const completedCount = tasks.filter((t) => t.status === 'completed' && t.proofUploaded).length;
  const goalTotal = 15;
  const goalPercentage = Math.round((completedCount / goalTotal) * 100);

  const filteredTasks = useMemo(() => {
    let list = [...tasks];

    if (filter === 'active') list = list.filter((t) => t.status !== 'completed');
    if (filter === 'completed') list = list.filter((t) => t.status === 'completed');

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((t) => 
        t.id.toLowerCase().includes(q) || 
        t.pickup.toLowerCase().includes(q) || 
        t.destination.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'nearest') {
      list.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    } else if (sortBy === 'furthest') {
      list.sort((a, b) => parseFloat(b.distance) - parseFloat(a.distance));
    }
    return list;
  }, [filter, sortBy]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500 font-extrabold">COURIER DASHBOARD</p>
          <h1 className="text-3xl font-extrabold text-emerald-950">Delivery Tasks</h1>
        </div>

        {/* Top Summary Bar */}
        <div className="flex items-center gap-4">
          <div className="bg-white rounded-[16px] shadow-sm border border-black/5 p-4 flex gap-4 min-w-[200px]">
            <div className="w-10 h-10 bg-[#eaf4eb] text-[#1e8932] rounded-xl flex items-center justify-center shrink-0">
              <Maximize2 size={20} />
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1">TODAY'S GOAL</p>
              <div className="flex items-end gap-2">
                <span className="text-xl font-extrabold text-emerald-950 leading-none">{completedCount}/{goalTotal}</span>
                <span className="text-xs font-bold text-emerald-700">{goalPercentage}%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[16px] shadow-sm border border-black/5 p-4 flex gap-4 min-w-[220px]">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center shrink-0">
              <Wallet size={20} />
            </div>
            <div>
              <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1">ECOPAY BALANCE</p>
              <p className="text-xl font-extrabold text-emerald-950 leading-none">Rp {ecopayBalance.toLocaleString('id-ID')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter + Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div className="bg-white rounded-xl border border-black/5 shadow-sm p-1 flex items-center gap-1 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-5 py-2 rounded-lg text-sm font-extrabold transition-colors ${filter === 'all' ? 'bg-[#F2F6F0] text-emerald-950' : 'text-slate-500 hover:text-emerald-950'}`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilter('active')}
            className={`px-5 py-2 rounded-lg text-sm font-extrabold transition-colors ${filter === 'active' ? 'bg-[#F2F6F0] text-emerald-950' : 'text-slate-500 hover:text-emerald-950'}`}
          >
            Active
          </button>
          <button
            type="button"
            onClick={() => setFilter('completed')}
            className={`px-5 py-2 rounded-lg text-sm font-extrabold transition-colors ${filter === 'completed' ? 'bg-[#F2F6F0] text-emerald-950' : 'text-slate-500 hover:text-emerald-950'}`}
          >
            Completed
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end relative">
          <button
            type="button"
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="h-[42px] px-4 rounded-xl bg-white border border-black/5 shadow-sm text-slate-700 font-extrabold text-sm inline-flex items-center gap-2"
          >
            <SlidersHorizontal size={16} className="text-slate-500" />
            Sort: <span className="text-emerald-950 capitalize">{sortBy}</span>
            <ChevronDown size={16} className="text-slate-500" />
          </button>
          
          {isSortOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-black/5 shadow-lg rounded-xl overflow-hidden z-20">
              <button 
                onClick={() => { setSortBy('nearest'); setIsSortOpen(false); }}
                className={`w-full text-left px-4 py-3 text-sm font-bold hover:bg-gray-50 transition-colors ${sortBy === 'nearest' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600'}`}
              >
                Nearest
              </button>
              <button 
                onClick={() => { setSortBy('furthest'); setIsSortOpen(false); }}
                className={`w-full text-left px-4 py-3 text-sm font-bold hover:bg-gray-50 transition-colors ${sortBy === 'furthest' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600'}`}
              >
                Furthest
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
          />
        ))}

      </div>
    </div>
  );
}
