"use client";

import Link from 'next/link';
import { courierTasks } from '@/lib/dashboardData';

const statusLabel = {
  assigned: 'Assigned',
  in_progress: 'In Progress',
  completed: 'Completed',
};

const statusClass = {
  assigned: 'bg-amber-100 text-amber-700',
  in_progress: 'bg-sky-100 text-sky-700',
  completed: 'bg-emerald-100 text-emerald-700',
};

export default function KurirTasksPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-emerald-700 font-bold">Courier Hub</p>
        <h1 className="text-3xl font-extrabold text-emerald-950">Delivery Tasks</h1>
      </div>

      <div className="grid gap-4">
        {courierTasks.map((task) => (
          <article key={task.id} className="bg-white rounded-3xl border border-emerald-100 p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <span className={`px-3 py-1 text-xs rounded-full font-bold ${statusClass[task.status]}`}>{statusLabel[task.status]}</span>
              <span className="text-sm font-semibold text-slate-500">{task.id}</span>
            </div>
            <h2 className="text-lg font-bold text-emerald-950">{task.pickup} {'->'} {task.destination}</h2>
            <p className="text-sm text-slate-600 mt-1">{task.distance} • ETA {task.eta}</p>
            <p className="text-sm font-bold text-emerald-800 mt-3">Task Reward: Rp {task.reward.toLocaleString('id-ID')}</p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              {task.status === 'completed' ? (
                <Link href={`/kurir/${task.id}/upload-proof`} className="px-5 py-2.5 rounded-xl bg-emerald-700 text-white font-bold hover:bg-emerald-800">
                  Summary Receipt
                </Link>
              ) : (
                <Link href={`/kurir/${task.id}`} className="px-5 py-2.5 rounded-xl bg-emerald-700 text-white font-bold hover:bg-emerald-800">
                  Start Delivery
                </Link>
              )}
              {!task.proofUploaded && (
                <span className="text-xs font-bold text-amber-700">Reward added only after photo proof upload.</span>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
