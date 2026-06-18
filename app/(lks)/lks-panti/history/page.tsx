"use client";

import { useState } from 'react';
import { useGlobalStore } from '@/store/globalStore';
import { CheckCircle2, Inbox, Search } from 'lucide-react';

interface DonationRow {
  id: string;
  product?: string;
  productName?: string;
  donor?: string;
  amountKg?: number;
  status: string;
  dateReceived?: string;
  courierName?: string;
  date?: string;
}

export default function LksHistoryPage() {
  const donations = useGlobalStore((s) => s.donations);
  const [searchQuery, setSearchQuery] = useState('');

  // ── Hanya donasi yang statusnya sudah 'Completed' ─────────────────────
  // Single source of truth: globalStore — sama dengan yang dipakai dashboard.
  // Ketika dashboard mengubah status → 'Completed', baris langsung muncul di sini.
  const completedDonations = donations.filter(
    (d: DonationRow) => d.status === 'Completed'
  );

  // ── Filter pencarian ───────────────────────────────────────────────────
  const historyDonations = completedDonations.filter((row: DonationRow) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (row.product     ?? '').toLowerCase().includes(q) ||
      (row.productName ?? '').toLowerCase().includes(q) ||
      (row.donor       ?? '').toLowerCase().includes(q) ||
      (row.id          ?? '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-emerald-700 font-bold">LKS Panel</p>
          <h1 className="text-3xl font-extrabold text-emerald-950">Riwayat Donasi</h1>
        </div>
        <span className="text-sm font-bold text-slate-500">
          {historyDonations.length} donasi selesai
        </span>
      </div>

      {/* ── Summary chip ── */}
      <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bold px-4 py-2 rounded-full">
        <CheckCircle2 size={15} />
        {completedDonations.length} donasi telah dikonfirmasi diterima
      </div>

      {/* ── Search Bar ── */}
      <div className="relative max-w-md">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari nama produk, donor, atau ID donasi..."
          className="w-full pl-10 pr-4 py-3 text-sm font-medium rounded-2xl border border-slate-200 bg-white shadow-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-400"
        />
      </div>

      {/* ── Tabel Riwayat ── */}
      {historyDonations.length > 0 ? (
        <div className="bg-white rounded-3xl border border-emerald-100 overflow-hidden shadow-sm">
          {/* Tabel scroll horizontal di layar kecil */}
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[640px]">
              <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-extrabold">ID Donasi</th>
                  <th className="px-5 py-4 font-extrabold">Nama Donor</th>
                  <th className="px-5 py-4 font-extrabold">Nama Produk</th>
                  <th className="px-5 py-4 font-extrabold">Jumlah (kg)</th>
                  <th className="px-5 py-4 font-extrabold">Tanggal Diterima</th>
                  <th className="px-5 py-4 font-extrabold">Kurir</th>
                  <th className="px-5 py-4 font-extrabold">Status</th>
                </tr>
              </thead>
              <tbody>
                {historyDonations.map((row: DonationRow) => {
                  const productLabel = row.product ?? row.productName ?? '–';
                  const initials = (row.courierName ?? '??').substring(0, 2).toUpperCase();
                  const dateLabel = row.dateReceived ?? row.date ?? '–';

                  return (
                    <tr
                      key={row.id}
                      className="border-b last:border-none border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-5 py-4 text-xs font-bold text-slate-400 whitespace-nowrap">
                        #{row.id}
                      </td>
                      <td className="px-5 py-4 font-bold text-emerald-950">
                        {row.donor ?? '–'}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-700 max-w-[200px]">
                        <span className="line-clamp-2">{productLabel}</span>
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-emerald-700 whitespace-nowrap">
                        {row.amountKg ?? '–'} kg
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600 whitespace-nowrap">
                        {dateLabel}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                          <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-700 shrink-0">
                            {initials}
                          </div>
                          {row.courierName ?? '–'}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100/60 px-2.5 py-1 rounded-full">
                          <CheckCircle2 size={12} />
                          Completed
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ── Empty State ── */
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-4">
            <Inbox size={32} />
          </div>
          <p className="font-extrabold text-slate-700 text-lg mb-1">
            {searchQuery ? 'Donasi tidak ditemukan' : 'Belum ada riwayat donasi'}
          </p>
          <p className="text-sm text-slate-500 font-medium max-w-xs">
            {searchQuery
              ? `Tidak ada hasil untuk "${searchQuery}".`
              : 'Donasi yang sudah dikonfirmasi selesai akan muncul di sini.'}
          </p>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="mt-4 text-sm font-bold text-emerald-700 underline underline-offset-2 hover:text-emerald-900"
            >
              Hapus filter
            </button>
          )}
        </div>
      )}
    </div>
  );
}
