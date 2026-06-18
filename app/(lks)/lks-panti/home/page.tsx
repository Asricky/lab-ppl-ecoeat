"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PackageCheck, Route, HeartPulse, Store, Clock, CheckCircle2, Search, Inbox } from 'lucide-react';
import { useGlobalStore } from '@/store/globalStore';

// ---------------------------------------------------------------------------
// Tipe minimal untuk item donasi di tampilan dashboard
// ---------------------------------------------------------------------------
interface DonationRow {
  id: string;
  product?: string;
  productName?: string;
  donor?: string;
  amountKg?: number;
  status: string;
  eta?: string;
  image?: string;
}

// ---------------------------------------------------------------------------
// Helper: warna badge sesuai status donasi
// ---------------------------------------------------------------------------
function statusBadge(status: string): { label: string; className: string } {
  const s = (status ?? '').toLowerCase();
  if (s === 'completed') {
    return { label: 'Completed',   className: 'text-emerald-700 bg-emerald-100/60' };
  }
  if (s === 'accepted') {
    return { label: 'Diterima',    className: 'text-emerald-700 bg-emerald-100/60' };
  }
  if (s === 'in progress' || s === 'in_progress') {
    return { label: 'On Delivery', className: 'text-amber-700 bg-amber-100/60' };
  }
  if (s === 'assigned') {
    return { label: 'Assigned',    className: 'text-blue-700 bg-blue-100/60' };
  }
  return { label: status, className: 'text-slate-600 bg-slate-100' };
}

// ---------------------------------------------------------------------------
// Helper: pilih gambar terbaik dari baris donasi
// Fallback bertingkat: field `image` → fallback berdasarkan nama produk → default
// ---------------------------------------------------------------------------
const FOOD_IMAGE_FALLBACKS: Record<string, string> = {
  roti:   'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
  nasi:   'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=80',
  buah:   'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=600&auto=format&fit=crop&q=80',
  sayur:  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80',
  ayam:   'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&auto=format&fit=crop&q=80',
  kue:    'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&auto=format&fit=crop&q=80',
};
const DEFAULT_FOOD_IMAGE =
  'https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=600&auto=format&fit=crop&q=80';

function getCardImage(row: DonationRow): string {
  if (row.image && row.image.trim() !== '') return row.image;
  const name = ((row.product ?? row.productName) ?? '').toLowerCase();
  for (const [key, url] of Object.entries(FOOD_IMAGE_FALLBACKS)) {
    if (name.includes(key)) return url;
  }
  return DEFAULT_FOOD_IMAGE;
}

// ---------------------------------------------------------------------------
// Komponen utama
// ---------------------------------------------------------------------------
export default function LksHomePage() {
  const router = useRouter();
  const { donations, updateDonationStatus } = useGlobalStore();
  const [searchQuery, setSearchQuery] = useState('');

  // ── Filter: hanya donasi yang BELUM Completed (tampil di dashboard) ────
  const activeDonations = donations.filter(
    (d: DonationRow) => d.status !== 'Completed'
  );

  // ── Filter pencarian di atas active donations ────────────────────────────
  const filteredDonations = activeDonations.filter((row: DonationRow) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (row.product     ?? '').toLowerCase().includes(q) ||
      (row.productName ?? '').toLowerCase().includes(q) ||
      (row.donor       ?? '').toLowerCase().includes(q) ||
      (row.id          ?? '').toLowerCase().includes(q)
    );
  });

  // ── Statistik ringkasan ──────────────────────────────────────────────────
  const totalReceivedKg = donations
    .filter((d: DonationRow) => d.status === 'Completed' || d.status === 'Accepted')
    .reduce((sum: number, d: DonationRow) => sum + (d.amountKg ?? 0), 0);

  const inTransitCount = donations
    .filter((d: DonationRow) => d.status === 'Assigned' || d.status === 'In Progress' || d.status === 'in_progress')
    .length;

  const mealsSaved = totalReceivedKg * 4;

  // ── Handler: Terima Donasi → langsung set Completed agar card hilang & masuk history
  const handleTerimaDonasi = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Set langsung ke 'Completed' — card otomatis hilang dari dashboard
    // dan langsung muncul di halaman Riwayat Donasi
    updateDonationStatus(id, 'Completed');
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        'https://csuogqxfwhlliuzsoqbv.supabase.co',
        'sb_publishable_iQH-QnTWU_zseHnHDk3ukQ_CU6f0i5h'
      );
      await supabase
        .from('donations')
        .update({ status: 'completed' })
        .eq('id', id);
    } catch (err) {
      console.warn('[LKS] Supabase sync failed:', err);
    }
  };

  const handleCardClick = (id: string) => {
    router.push(`/lks-panti/tracking/${id}`);
  };

  const isDonationDone = (status: string) =>
    status === 'Completed' || status === 'Accepted';

  // ────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-emerald-700 font-bold">LKS Panel</p>
          <h1 className="text-3xl font-extrabold text-emerald-950">Incoming Donations</h1>
        </div>
        {/* Counter total donasi */}
        <span className="text-sm font-bold text-slate-500">
          {filteredDonations.length} donasi
          {searchQuery && ` · hasil "${searchQuery}"`}
        </span>
      </div>

      {/* ── Statistik Ringkasan ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-[24px] border border-black/5 shadow-sm p-6 flex items-start gap-4 h-full">
          <div className="w-12 h-12 bg-[#F2F6F0] rounded-xl flex items-center justify-center shrink-0 border border-[#D4ECD7] text-emerald-700">
            <PackageCheck size={24} />
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1">
              TOTAL DONASI DITERIMA
            </p>
            <p className="text-3xl font-extrabold text-emerald-950">
              {totalReceivedKg} <span className="text-sm text-slate-500">kg</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[24px] border border-black/5 shadow-sm p-6 flex items-start gap-4 h-full">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 border border-blue-100 text-blue-600">
            <Route size={24} />
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1">
              DALAM PERJALANAN
            </p>
            <p className="text-3xl font-extrabold text-emerald-950">
              {inTransitCount} <span className="text-sm text-slate-500">donasi</span>
            </p>
          </div>
        </div>

        <div className="bg-[#1A5632] rounded-[24px] border border-emerald-900 shadow-sm p-6 flex items-start gap-4 text-white h-full">
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0 border border-white/20">
            <HeartPulse size={24} />
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-emerald-200 uppercase tracking-widest mb-1">
              DAMPAK SOSIAL (PBI#19)
            </p>
            <p className="text-3xl font-extrabold">
              {mealsSaved} <span className="text-sm text-emerald-200">porsi diselamatkan</span>
            </p>
          </div>
        </div>
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

      {/* ── Grid Kartu Donasi ────────────────────────────────────────────────
          Responsif:
          - Mobile (< sm):  1 kolom
          - Tablet (sm–lg): 2 kolom
          - Desktop (≥ lg): 3 kolom
          Kartu tingginya seragam karena `flex flex-col` + `flex-1`.
      ─────────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDonations.map((row: DonationRow) => {
          const badge = statusBadge(row.status);
          const imgSrc = getCardImage(row);
          const productLabel = row.product ?? row.productName ?? 'Produk Donasi';

          return (
            <div
              key={row.id}
              onClick={() => handleCardClick(row.id)}
              className="bg-white rounded-[24px] overflow-hidden border border-emerald-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col group"
            >
              {/* ── Foto Header ── */}
              <div className="h-44 bg-slate-200 relative overflow-hidden shrink-0">
                <img
                  src={imgSrc}
                  alt={productLabel}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.currentTarget.src = DEFAULT_FOOD_IMAGE; }}
                />
                {/* Gradient overlay bawah */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                {/* Badge berat */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-extrabold text-emerald-950 shadow-sm border border-white/20">
                  {row.amountKg ?? '–'} kg
                </div>
                {/* Badge ID donasi */}
                <div className="absolute bottom-3 left-4 text-[10px] font-bold text-white/80 uppercase tracking-wider">
                  #{row.id}
                </div>
              </div>

              {/* ── Konten Card ── */}
              <div className="p-5 flex-1 flex flex-col relative">
                {/* Icon toko */}
                <div className="absolute -top-6 left-5 w-12 h-12 bg-white rounded-2xl shadow-md border border-emerald-50 flex items-center justify-center text-emerald-600">
                  <Store size={24} />
                </div>

                {/* Nama produk & donor */}
                <div className="mt-5 mb-4">
                  <h3 className="font-extrabold text-emerald-950 text-lg mb-1 leading-tight line-clamp-2">
                    {productLabel}
                  </h3>
                  <p className="text-sm font-semibold text-slate-500 line-clamp-1">
                    {row.donor ?? 'Donor tidak diketahui'}
                  </p>
                </div>

                {/* Status & ETA */}
                <div className="flex items-center gap-3 mb-5 mt-auto bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                      STATUS
                    </p>
                    <p className={`text-xs font-bold inline-block px-2 py-0.5 rounded-md ${badge.className}`}>
                      {badge.label}
                    </p>
                  </div>
                  <div className="w-px h-8 bg-slate-200 shrink-0" />
                  <div className="flex-1 text-right min-w-0">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">
                      ETA
                    </p>
                    <p className="text-xs font-bold text-emerald-950 flex items-center justify-end gap-1.5 truncate">
                      <Clock size={13} className="text-emerald-600 shrink-0" />
                      {row.eta ?? '–'}
                    </p>
                  </div>
                </div>

                {/* ── Tombol Aksi ──
                    Belum diterima → "Terima Donasi" (hijau, klikable)
                    Sudah diterima/selesai → "Selesai" (muted, non-interaktif)
                ── */}
                {!isDonationDone(row.status) ? (
                  <button
                    type="button"
                    onClick={(e) => handleTerimaDonasi(row.id, e)}
                    className="w-full py-3.5 bg-emerald-600 text-white font-extrabold rounded-xl hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <PackageCheck size={18} /> Terima Donasi
                  </button>
                ) : (
                  <div className="w-full py-3.5 bg-[#eaf4eb] text-emerald-800 font-extrabold rounded-xl border border-[#d4ecd7] flex items-center justify-center gap-2">
                    <CheckCircle2 size={18} /> Selesai
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Empty State: muncul jika tidak ada donasi (atau filter kosong) ── */}
      {filteredDonations.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-4">
            <Inbox size={32} />
          </div>
          <p className="font-extrabold text-slate-700 text-lg mb-1">
            {searchQuery ? 'Donasi tidak ditemukan' : 'Belum ada donasi masuk'}
          </p>
          <p className="text-sm text-slate-500 font-medium max-w-xs">
            {searchQuery
              ? `Tidak ada hasil untuk "${searchQuery}". Coba kata kunci lain.`
              : 'Donasi dari para seller akan muncul di sini ketika ada yang masuk.'}
          </p>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="mt-4 text-sm font-bold text-emerald-700 underline underline-offset-2 hover:text-emerald-900"
            >
              Hapus filter pencarian
            </button>
          )}
        </div>
      )}
    </div>
  );
}
