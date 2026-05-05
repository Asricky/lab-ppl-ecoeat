"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Clock3, Heart, Navigation, Package, Route, MapPin, Receipt, X, FileImage, User } from 'lucide-react';
import { useCourier } from '@/components/kurir/CourierLayout';
import type { CourierTask } from '@/lib/dashboardData';

export interface TaskCardProps {
  task: CourierTask;
}

const statusBadge: Record<CourierTask['status'], { label: string; className: string; dotClass: string }> = {
  assigned: { label: 'ASSIGNED', className: 'bg-slate-100 text-slate-600 border border-slate-200', dotClass: 'bg-slate-400' },
  in_progress: { label: 'IN PROGRESS', className: 'bg-emerald-100 text-emerald-800 border border-emerald-200', dotClass: 'bg-emerald-700' },
  completed: { label: 'COMPLETED', className: 'bg-white text-emerald-800 border border-emerald-200', dotClass: 'bg-emerald-700' },
  failed: { label: 'FAILED', className: 'bg-red-50 text-red-700 border border-red-200', dotClass: 'bg-red-600' },
};

export default function TaskCard({ task }: TaskCardProps) {
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const { isOnline } = useCourier();
  const badge = statusBadge[task.status];
  const taskType = task.type === 'donation' ? 'Donation Delivery' : 'Purchase Delivery';
  const TypeIcon = task.type === 'donation' ? Heart : Package;

  return (
    <article className="bg-white rounded-[22px] shadow-sm border border-black/5 overflow-hidden">
      <div className="p-6 pb-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-100">
              <TypeIcon size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-extrabold text-emerald-950">{taskType}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {task.isHighPriority && (
              <span className="px-2 py-1 rounded-full text-[10px] font-extrabold text-slate-500 bg-slate-100 border border-slate-200">
                High Priority
              </span>
            )}
            <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider inline-flex items-center gap-1.5 ${badge.className}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${badge.dotClass}`} />
              {badge.label}
            </span>
          </div>
        </div>

        {/* Locations */}
        <div className="mt-5 relative pl-7">
          <div className="absolute left-[13px] top-3 bottom-3 w-px bg-slate-200" />

          <div className="relative pb-4">
            <div className="absolute -left-7 top-1.5 w-4 h-4 rounded-full bg-white border border-emerald-200 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-emerald-700" />
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <MapPin size={14} className="text-emerald-700" />
              <p className="text-[10px] font-extrabold uppercase tracking-wider">PICKUP</p>
            </div>
            <p className="text-sm font-extrabold text-emerald-950 leading-snug mt-1">{task.pickup}</p>
          </div>

          <div className="relative">
            <div className="absolute -left-7 top-1.5 w-4 h-4 rounded-full bg-white border border-slate-200 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-slate-300" />
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <MapPin size={14} className="text-slate-400" />
              <p className="text-[10px] font-extrabold uppercase tracking-wider">DESTINATION</p>
            </div>
            <p className="text-sm font-extrabold text-emerald-950 leading-snug mt-1">{task.destination}</p>
          </div>
        </div>

        {/* Reward */}
        <div className="mt-5 bg-[#E8F3EB] border border-[#D4ECD7] rounded-xl px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider">TASK REWARD</p>
          </div>
          <p className="text-sm font-extrabold text-emerald-950">Rp {task.reward.toLocaleString('id-ID')}</p>
        </div>

        {/* Metrics */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-[#EFF6F0] border border-[#E3EFE5] p-3">
            <div className="flex items-center gap-2 text-slate-500">
              <Route size={16} />
              <p className="text-[10px] font-extrabold uppercase tracking-wider">DISTANCE</p>
            </div>
            <p className="mt-2 text-xs font-extrabold text-emerald-950">{task.distance}</p>
          </div>
          <div className="rounded-xl bg-[#EFF6F0] border border-[#E3EFE5] p-3">
            <div className="flex items-center gap-2 text-slate-500">
              <Clock3 size={16} />
              <p className="text-[10px] font-extrabold uppercase tracking-wider">EST. TIME</p>
            </div>
            <p className="mt-2 text-xs font-extrabold text-emerald-950">{task.eta}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5">
          {task.status === 'completed' || task.status === 'failed' ? (
            <button
              onClick={() => setIsReceiptOpen(true)}
              className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm rounded-xl border-2 font-extrabold transition-colors ${task.status === 'failed' ? 'border-red-800 bg-white text-red-900 hover:bg-red-50' : 'border-emerald-800 bg-white text-emerald-900 hover:bg-emerald-50'}`}
            >
              <Receipt size={16} /> Summary Receipt
            </button>
          ) : (
            <Link
              href={`/kurir/tracking/${task.id}`}
              onClick={(e) => {
                if (!isOnline) {
                  e.preventDefault();
                  alert('Harap "Go Online" terlebih dahulu di pojok kanan atas untuk memulai tugas.');
                }
              }}
              className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm rounded-xl font-extrabold transition-colors ${isOnline ? 'bg-emerald-900 text-white hover:bg-emerald-950' : 'bg-slate-200 text-slate-500 cursor-not-allowed'}`}
            >
              <Navigation size={16} /> Start Delivery
            </Link>
          )}
        </div>
      </div>

      {/* Summary Receipt Modal */}
      {isReceiptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsReceiptOpen(false)}></div>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className={`p-6 text-white flex justify-between items-center shrink-0 ${task.status === 'failed' ? 'bg-red-950' : 'bg-emerald-950'}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                  <Receipt size={20} />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg leading-tight">Summary Receipt</h3>
                  <p className={`text-[10px] uppercase tracking-widest font-bold ${task.status === 'failed' ? 'text-red-200/80' : 'text-emerald-200/80'}`}>{task.id}</p>
                </div>
              </div>
              <button onClick={() => setIsReceiptOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            {/* Modal Content Scrollable */}
            <div className="p-6 space-y-6 overflow-y-auto">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2">
                  <TypeIcon size={18} className={task.status === 'failed' ? 'text-red-700' : 'text-emerald-700'} />
                  <p className="font-extrabold text-emerald-950 text-sm">{taskType}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    {task.status === 'failed' ? 'FAILED AT' : 'COMPLETED AT'}
                  </p>
                  <p className="text-xs font-bold text-emerald-950">{task.completedAt || task.eta}</p>
                </div>
              </div>

              {/* Route Ledger */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200">
                    <User size={12} className="text-emerald-700" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">SENDER</p>
                    <p className="font-extrabold text-sm text-slate-800 leading-tight">{task.pickup}</p>
                  </div>
                </div>
                <div className="w-px h-6 bg-slate-200 ml-3"></div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center shrink-0 mt-0.5 border border-blue-200">
                    <MapPin size={12} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">RECEIVER</p>
                    <p className="font-extrabold text-sm text-slate-800 leading-tight">{task.destination}</p>
                  </div>
                </div>
              </div>

              {/* Handover Proof / Failure Reason */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                <p className={`text-xs font-extrabold mb-3 flex items-center gap-2 ${task.status === 'failed' ? 'text-red-950' : 'text-emerald-950'}`}>
                  <FileImage size={16} className={task.status === 'failed' ? 'text-red-700' : 'text-emerald-700'} /> 
                  {task.status === 'failed' ? 'Laporan Kendala (Gagal Antar)' : 'Photo Handover Validation'}
                </p>
                
                {task.status === 'failed' ? (
                  <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                    <p className="text-[10px] font-extrabold text-red-400 uppercase tracking-wider mb-1">ALASAN KEGAGALAN</p>
                    <p className="text-sm font-bold text-red-900">{task.handoverNote}</p>
                  </div>
                ) : task.photoProofUrl ? (
                  <div className="aspect-video w-full rounded-xl overflow-hidden border border-black/5 bg-gray-200">
                    <img src={task.photoProofUrl} alt="Delivery Proof" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="aspect-video w-full rounded-xl bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-bold border border-gray-300 border-dashed">
                    No Photo Provided
                  </div>
                )}
                
                {task.status !== 'failed' && task.handoverNote && (
                  <div className="mt-4 bg-white border border-slate-100 rounded-xl p-3">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">COURIER NOTE</p>
                    <p className="text-sm font-medium text-slate-700 italic">"{task.handoverNote}"</p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`p-6 border-t flex items-center justify-between shrink-0 ${task.status === 'failed' ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
              <p className={`text-xs font-bold uppercase tracking-widest ${task.status === 'failed' ? 'text-red-800' : 'text-emerald-800'}`}>
                {task.status === 'failed' ? 'REWARD CANCELLED' : 'TOTAL EARNING'}
              </p>
              <p className={`text-2xl font-extrabold ${task.status === 'failed' ? 'text-red-950 line-through opacity-50' : 'text-emerald-950'}`}>
                Rp {task.reward.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
