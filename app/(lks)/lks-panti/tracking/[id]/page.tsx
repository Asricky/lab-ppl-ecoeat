"use client";

import React, { useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Clock, Truck, Store, Map } from 'lucide-react';
import { useDonationStore } from '@/store/donationStore';
import { useTaskStore } from '@/store/taskStore';
import { useGlobalStore } from '@/store/globalStore';
import dynamic from 'next/dynamic';

const MapContainer = dynamic(() => import('@/components/MapContainer'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center text-gray-400 font-semibold rounded-xl">
      Loading Live Tracking...
    </div>
  )
});

// ---------------------------------------------------------------------------
// Helper: pemetaan status donasi ke label yang ditampilkan di UI
// Single source of truth — semua bagian halaman ini pakai fungsi ini
// ---------------------------------------------------------------------------
function resolveStatusLabel(donationStatus: string): {
  label: string;
  color: string;
  isCompleted: boolean;
  isOnDelivery: boolean;
} {
  const s = (donationStatus ?? '').toLowerCase();
  if (s === 'completed' || s === 'accepted') {
    return { label: 'Completed', color: 'text-emerald-700', isCompleted: true, isOnDelivery: false };
  }
  if (s === 'in progress' || s === 'in_progress' || s === 'assigned') {
    return { label: 'On Delivery', color: 'text-amber-600', isCompleted: false, isOnDelivery: true };
  }
  return { label: donationStatus, color: 'text-slate-600', isCompleted: false, isOnDelivery: false };
}

// ---------------------------------------------------------------------------
// Komponen utama
// ---------------------------------------------------------------------------
export default function LksTrackingDetail() {
  const params = useParams();
  const resolvedId = Array.isArray(params.id) ? params.id[0] : (params.id ?? '');

  // ── SINGLE SOURCE OF TRUTH ──────────────────────────────────────────────
  // Semua status dibaca LANGSUNG dari store (reaktif), BUKAN di-copy ke local state.
  // Dengan begitu setiap perubahan status dari halaman lain (home/dashboard)
  // langsung tercermin di halaman ini tanpa perlu refresh.
  // ────────────────────────────────────────────────────────────────────────

  // 1. globalStore — sumber utama (data DON-XXXX dari INITIAL_DONATIONS / home page)
  const globalDonations = useGlobalStore((s) => s.donations);

  // 2. donationStore — fallback (data ORD-2 dst dari dashboardData)
  const donationStoreDonations = useDonationStore((s) => s.donations);

  // 3. taskStore — status kurir (opsional, untuk overlay peta)
  const tasks = useTaskStore((s) => s.tasks);

  // Cari donasi: cek globalStore dulu, lalu donationStore sebagai fallback
  const rawDonation = useMemo(() => {
    const fromGlobal = globalDonations.find((d: any) => d.id === resolvedId);
    if (fromGlobal) return fromGlobal;
    return donationStoreDonations.find((d: any) => d.id === resolvedId) ?? null;
  }, [resolvedId, globalDonations, donationStoreDonations]);

  // Normalisasi field — semua key opsional di-default agar template tidak crash
  const donationData = useMemo(() => {
    if (!rawDonation) return null;
    return {
      id:          rawDonation.id,
      donor:       rawDonation.donor       ?? 'EcoEat Vendor',
      product:     rawDonation.product     ?? rawDonation.productName ?? 'Produk Donasi',
      amountKg:    rawDonation.amountKg    ?? 0,
      // ← Status selalu diambil segar dari store (bukan snapshot)
      status:      rawDonation.status      ?? 'Assigned',
      eta:         rawDonation.eta         ?? 'Segera',
      dateReceived:rawDonation.dateReceived?? '-',
      courierName: rawDonation.courierName ?? 'Alex Green',
    };
  }, [rawDonation]);

  // Status kurir (opsional — dari taskStore)
  const courierTask = useMemo(
    () => tasks.find((t: any) => t.id === resolvedId) ?? null,
    [tasks, resolvedId]
  );

  // ── Derived status — satu tempat, dipakai oleh seluruh UI ──────────────
  const statusInfo = useMemo(
    () => resolveStatusLabel(donationData?.status ?? ''),
    [donationData?.status]
  );

  // ── 404 ─────────────────────────────────────────────────────────────────
  if (!donationData) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <p className="text-emerald-950 font-bold text-xl">Donation Not Found</p>
        <Link href="/lks-panti/home" className="px-6 py-2 bg-emerald-900 text-white font-bold rounded-xl">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  // Simulated map points for the courier tracking
  const mapPoints = [
    { lat: -6.2,   lng: 106.816, type: 'seller',  name: donationData.donor },
    { lat: -6.206, lng: 106.822, type: 'courier', name: 'Courier' },
    { lat: -6.21,  lng: 106.826, type: 'lks',     name: 'Yayasan Berbagi' },
  ];

  // Status kurir ditentukan berdasarkan status donasi (single source of truth)
  // bukan lagi tergantung pada courierTask yang mungkin tidak ada
  const isDelivered = statusInfo.isCompleted;
  const courierStatusLabel = isDelivered
    ? 'Tiba di Lokasi'
    : statusInfo.isOnDelivery
    ? 'Sedang Dijemput'
    : 'Menunggu Konfirmasi';

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/lks-panti/home"
          className="p-2 bg-white rounded-full border border-black/5 hover:bg-emerald-50 text-emerald-950 transition-colors shadow-sm"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1">
            REAL-TIME COURIER TRACKING
          </p>
          <h1 className="text-3xl font-extrabold text-emerald-950">
            Donation #{donationData.id}
          </h1>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── Peta ── */}
        <div className="lg:col-span-2 bg-white rounded-[24px] border border-black/5 p-2 shadow-sm min-h-[500px] relative">
          {/* Overlay "Donasi Telah Tiba" — muncul jika status = Completed */}
          {isDelivered && (
            <div className="absolute inset-0 z-20 bg-white/70 backdrop-blur-md rounded-[24px] flex flex-col items-center justify-center animate-in fade-in">
              <div className="w-24 h-24 bg-[#eaf4eb] rounded-full flex items-center justify-center border-4 border-white shadow-xl mb-4">
                <CheckCircle2 size={48} className="text-[#388e3c]" />
              </div>
              <h2 className="text-3xl font-extrabold text-emerald-950">Donasi Telah Tiba!</h2>
              <p className="text-emerald-700 font-bold mt-2">
                Kurir telah berhasil menyelesaikan pengantaran.
              </p>
            </div>
          )}
          <div className="h-full rounded-2xl overflow-hidden relative">
            <MapContainer locations={mapPoints} showRoute={true} />
          </div>
        </div>

        {/* ── Panel Info ── */}
        <div className="bg-white rounded-[24px] shadow-sm border border-black/5 p-6 space-y-6">
          {/* Kurir */}
          <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl flex items-center gap-4">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
              alt="Driver"
              className="w-12 h-12 bg-white rounded-full shadow-sm border border-emerald-100"
            />
            <div>
              <p className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider mb-0.5">
                KURIR PENGANTAR
              </p>
              <p className="font-extrabold text-emerald-950 text-base leading-tight">
                {donationData.courierName}
              </p>
              <p className="text-xs font-medium text-slate-600 mt-1">
                Honda Beat •{' '}
                <span className="text-emerald-700 font-extrabold">B 1420 ECO</span>
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-extrabold text-emerald-950 flex items-center gap-2">
              <Map size={20} className="text-emerald-700" /> Detail Donasi
            </h2>
          </div>

          {/* Detail produk — STATUS dibaca dari donationData.status (single source) */}
          <div className="space-y-4 border-b border-gray-100 pb-6">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Produk Makanan</p>
              <p className="font-extrabold text-emerald-950 text-lg">{donationData.product}</p>
            </div>
            <div className="flex gap-4">
              <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Jumlah</p>
                <p className="font-bold text-emerald-950">{donationData.amountKg} kg</p>
              </div>
              <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Status</p>
                {/* ← Membaca statusInfo.label yang berasal dari donationData.status */}
                <p className={`font-bold ${statusInfo.color}`}>
                  {statusInfo.label}
                </p>
              </div>
            </div>
          </div>

          {/* Route */}
          <div className="relative pl-6 space-y-8 pb-4">
            <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gray-200" />
            <div className="relative">
              <div className="absolute -left-[27px] top-1 w-4 h-4 rounded-full bg-emerald-100 border border-emerald-500 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-emerald-700" />
              </div>
              <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                DARI (DONOR)
              </p>
              <p className="font-bold text-emerald-950 text-sm leading-tight flex items-center gap-2">
                <Store size={14} className="text-emerald-600" /> {donationData.donor}
              </p>
            </div>
            <div className="relative">
              <div className="absolute -left-[27px] top-1 w-4 h-4 rounded-full bg-gray-100 border border-gray-400 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-gray-600" />
              </div>
              <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">
                TUJUAN
              </p>
              <p className="font-bold text-emerald-950 text-sm leading-tight">
                Yayasan Berbagi (LKS)
              </p>
            </div>
          </div>

          {/* Status Kurir — juga konsisten dengan donationData.status */}
          <div className="pt-6 border-t border-gray-100">
            <div className="bg-[#F2F6F0] p-4 rounded-xl border border-emerald-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-emerald-600 shadow-sm">
                  <Truck size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider mb-0.5">
                    STATUS KURIR
                  </p>
                  {/* ← courierStatusLabel juga derivasi dari donationData.status */}
                  <p className="font-extrabold text-emerald-950">{courierStatusLabel}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider mb-0.5">
                  ETA
                </p>
                <p className="font-extrabold text-emerald-950 text-lg flex items-center gap-1">
                  <Clock size={16} className="text-emerald-600" /> {donationData.eta}
                </p>
              </div>
            </div>

            {/* ── Tombol Konfirmasi Terima Donasi ────────────────────────────
                Muncul HANYA ketika status masih On Delivery / belum Completed.
                Ketika ditekan → update globalStore → status berubah "Completed"
                → UI ini langsung reaktif karena baca dari store, bukan local state.
            ─────────────────────────────────────────────────────────────── */}
            {!isDelivered && (
              <ConfirmReceivedButton donationId={donationData.id} />
            )}

            {/* Badge konfirmasi setelah Completed */}
            {isDelivered && (
              <div className="mt-4 flex items-center justify-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl py-3 px-4">
                <CheckCircle2 size={18} className="text-emerald-700 shrink-0" />
                <p className="text-sm font-extrabold text-emerald-800">
                  Donasi telah dikonfirmasi diterima
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-komponen: Tombol Konfirmasi Penerimaan
// Dipisah agar logika Supabase tidak mencemari komponen utama.
// ---------------------------------------------------------------------------
function ConfirmReceivedButton({ donationId }: { donationId: string }) {
  const updateDonationStatus = useGlobalStore((s) => s.updateDonationStatus);
  const [loading, setLoading] = React.useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    // 1. Update store lokal segera (optimistic — UI langsung reaktif)
    updateDonationStatus(donationId, 'Completed');

    // 2. Sinkronisasi ke Supabase — kolom `status` di tabel `donations`
    //    sesuai DATABASE STRUCTURE FINAL.xlsx
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        'https://csuogqxfwhlliuzsoqbv.supabase.co',
        'sb_publishable_iQH-QnTWU_zseHnHDk3ukQ_CU6f0i5h'
      );
      const { error } = await supabase
        .from('donations')
        .update({ status: 'completed' })
        .eq('id', donationId);
      if (error) console.warn('[LKS] Supabase sync error:', error.message);
    } catch (err) {
      console.warn('[LKS] Supabase unavailable, state updated locally:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleConfirm}
      disabled={loading}
      className="mt-4 w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-extrabold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
    >
      <CheckCircle2 size={18} />
      {loading ? 'Menyimpan...' : 'Konfirmasi Donasi Diterima'}
    </button>
  );
}
