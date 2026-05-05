"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Navigation } from 'lucide-react';
import { CourierTask } from '@/lib/dashboardData';
import { useTaskStore } from '@/store/taskStore';

export default function CourierTaskDetail() {
  const params = useParams();
  const [task, setTask] = useState<CourierTask | null>(null);
  const { tasks } = useTaskStore();
  
  useEffect(() => {
    const resolvedId = Array.isArray(params.id) ? params.id[0] : params.id;
    if (resolvedId) {
      const foundTask = tasks.find(t => t.id === resolvedId);
      if (foundTask) setTask(foundTask);
    }
  }, [params]);

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <p className="text-emerald-950 font-bold text-xl">Task Not Found</p>
        <Link href="/kurir/home" className="px-6 py-2 bg-emerald-900 text-white font-bold rounded-xl">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/kurir/home" className="p-2 bg-white rounded-full border border-black/5 hover:bg-emerald-50 text-emerald-950 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1">TASK DETAILS</p>
          <h1 className="text-3xl font-extrabold text-emerald-950">
            {task.id}
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-[24px] shadow-sm border border-black/5 p-8">
        <h2 className="text-xl font-bold text-emerald-950 mb-6">Delivery Information</h2>
        <div className="space-y-4">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Pickup Location</p>
            <p className="font-medium text-slate-800">{task.pickup}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase">Destination</p>
            <p className="font-medium text-slate-800">{task.destination}</p>
          </div>
          <div className="flex gap-6 pt-4 border-t border-gray-100">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Distance</p>
              <p className="font-bold text-emerald-950">{task.distance}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">ETA</p>
              <p className="font-bold text-emerald-950">{task.eta}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Reward</p>
              <p className="font-bold text-emerald-950">Rp {task.reward.toLocaleString('id-ID')}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex gap-4">
          <Link 
            href={`/kurir/tracking/${task.id}`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-900 text-white font-extrabold hover:bg-emerald-950 transition-colors"
          >
            <Navigation size={18} /> Start Delivery
          </Link>
        </div>
      </div>
    </div>
  );
}
