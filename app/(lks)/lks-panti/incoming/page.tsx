"use client";

import { useRouter } from 'next/navigation';
import { useGlobalStore } from '@/store/globalStore';

export default function LksIncomingPage() {
  const router = useRouter();
  const incomingDonations = useGlobalStore(s => s.donations);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-emerald-700 font-bold">LKS Panel</p>
        <h1 className="text-3xl font-extrabold text-emerald-950">Incoming Donasi</h1>
      </div>

      <div className="bg-white rounded-3xl border border-emerald-100 p-6">
        <p className="text-sm font-semibold text-slate-600 mb-4">Track incoming donations and open live delivery detail.</p>
        <div className="space-y-3">
          {incomingDonations.map((row) => (
            <button
              key={row.id}
              onClick={() => router.push(`/lks-panti/tracking/${row.id}`)}
              className="w-full text-left rounded-2xl border border-slate-100 bg-slate-50 p-4 hover:bg-emerald-50"
            >
              <p className="font-bold text-emerald-950">{row.product}</p>
              <p className="text-sm text-slate-600 mt-1">{row.donor} • {row.amountKg} kg • {row.status}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
