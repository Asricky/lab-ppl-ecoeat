"use client";

import React, { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  HeartHandshake,
  Leaf,
  MapPin,
  CheckCircle2,
  ArrowLeft,
  Package,
  Phone,
  Verified,
  Crosshair,
  X,
} from 'lucide-react';

import { CourierLiveMap } from '@/components/donations/CourierLiveMap';
import { DonationLocationExplorer } from '@/components/donations/DonationLocationExplorer';
import { DonationTrackingModal } from '@/components/donations/DonationTrackingModal';
import {
  DONATION_LOCATIONS,
  REFERENCE_LOCATION_PRESETS,
  resolveLksMetaForRecipient,
} from '@/lib/donationLocations';
import { distanceKm, formatDistanceKm } from '@/lib/geo';
import { type LksPartner } from '@/lib/lksPartners';
import { useProductStore } from '@/store/productStore';
import { useLksInboxStore } from '@/store/lksInboxStore';

type DonationRow = {
  id: string;
  productName: string;
  category?: string;
  expiry?: string;
  weight: string;
  recipient: string;
  recipientImage: string;
  date: string;
  status: string;
  image: string;
};

type DonationTab = 'add-donation' | 'lokasi-donasi' | 'transaction-summary' | 'donate';

type DonateStep = 'select-product' | 'select-location' | 'confirm';

function mealsSavedPorsi(donations: { weight: string }[]) {
  return donations.reduce((sum, d) => {
    const low = String(d.weight).toLowerCase();
    if (low.includes('kg')) return sum;
    const n = parseFloat(low.replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
    return sum + n;
  }, 0);
}

function displayDonationQty(weight: string) {
  return String(weight)
    .replace(/\bportions\b/gi, 'porsi')
    .replace(/\bportion\b/gi, 'porsi');
}

function donationStatusClass(status: string) {
  const s = status.toLowerCase();
  if (s === 'delivered' || s === 'completed') return 'bg-emerald-100 text-emerald-800';
  if (s === 'scheduled' || s === 'active') return 'bg-amber-100 text-amber-800';
  if (s === 'cancelled') return 'bg-red-100 text-red-800';
  return 'bg-gray-100 text-gray-700';
}

const subNav: { id: DonationTab; label: string }[] = [
  { id: 'add-donation', label: 'Add donation product' },
  { id: 'lokasi-donasi', label: 'Lokasi donasi' },
  { id: 'transaction-summary', label: 'Transaction summary' },
  { id: 'donate', label: 'Donate' },
];

type CatalogProduct = {
  id: string;
  name: string;
  image: string;
  category?: string;
  type: string;
  stock: number;
  status: string;
  expiry: string;
  expiryDatetime?: string;
  price?: string;
};

function DonationsPageInner() {
  const searchParams = useSearchParams();
  const { donations, addDonation, products, updateProduct } = useProductStore();
  const addDonationAlert = useLksInboxStore((s) => s.addDonationAlert);

  const [activeTab, setActiveTab] = useState<DonationTab>('add-donation');

  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [donationCategory, setDonationCategory] = useState('');
  const [donationExpiry, setDonationExpiry] = useState('');
  const [donationExpiryDatetime, setDonationExpiryDatetime] = useState('');
  /** Produk katalog Donate yang dipilih dari daftar (untuk gambar + kurangi stok) */
  const [donationCatalogProductId, setDonationCatalogProductId] = useState<string | null>(null);
  const [selected, setSelected] = useState<LksPartner | null>(null);
  const [donateStep, setDonateStep] = useState<DonateStep>('select-product');
  const [submitting, setSubmitting] = useState(false);
  const [donateDone, setDonateDone] = useState(false);

  const [donateRefPresetId, setDonateRefPresetId] = useState('jakarta');
  const [donateGpsCoords, setDonateGpsCoords] = useState<[number, number] | null>(null);
  const [donateUseGps, setDonateUseGps] = useState(false);
  const [donateGpsError, setDonateGpsError] = useState<string | null>(null);
  const [txDetail, setTxDetail] = useState<DonationRow | null>(null);

  const qtyNum = parseFloat(quantity.replace(',', '.')) || 0;
  const weightLabel = `${qtyNum} porsi`;
  const unit = 'portion' as const;
  const mealsCount = mealsSavedPorsi(donations);
  const catalogPicked = donationCatalogProductId
    ? (products as CatalogProduct[]).find((x) => x.id === donationCatalogProductId)
    : null;
  const overStock =
    catalogPicked != null && productName.trim() === catalogPicked.name.trim() && qtyNum > catalogPicked.stock;
  const productReady = Boolean(
    productName.trim() &&
      qtyNum > 0 &&
      !overStock &&
      donationCategory.trim() &&
      donationExpiry.trim()
  );

  const availableDonationProducts = useMemo(() => {
    return (products as CatalogProduct[]).filter(
      (p) => p.type === 'Donate' && p.stock > 0 && p.status !== 'Sold Out'
    );
  }, [products]);

  const pickDonationCatalogProduct = useCallback((p: CatalogProduct) => {
    setDonationCatalogProductId(p.id);
    setProductName(p.name);
    setQuantity('1');
    setDonationCategory(p.category ?? '');
    setDonationExpiry(p.expiry ?? '');
    setDonationExpiryDatetime(p.expiryDatetime ?? '');
  }, []);

  const handleDonationNameInput = useCallback((value: string) => {
    setProductName(value);
    setDonationCatalogProductId(null);
    setDonationCategory('');
    setDonationExpiry('');
    setDonationExpiryDatetime('');
  }, []);

  const donateRefCoords = useMemo((): [number, number] => {
    if (donateUseGps && donateGpsCoords) return donateGpsCoords;
    const p = REFERENCE_LOCATION_PRESETS.find((x) => x.id === donateRefPresetId);
    return p?.coords ?? [-6.1944, 106.8229];
  }, [donateUseGps, donateGpsCoords, donateRefPresetId]);

  const donateLocationsWithDistance = useMemo(() => {
    return DONATION_LOCATIONS.map((loc) => ({
      loc,
      distKm: distanceKm(donateRefCoords, loc.coords),
    })).sort((a, b) => a.distKm - b.distKm);
  }, [donateRefCoords]);

  const selectedDistanceKm = useMemo(() => {
    if (!selected) return null;
    return distanceKm(donateRefCoords, selected.coords);
  }, [selected, donateRefCoords]);

  const requestDonateGps = () => {
    setDonateGpsError(null);
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setDonateGpsError('Perangkat tidak mendukung lokasi.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setDonateGpsCoords([pos.coords.latitude, pos.coords.longitude]);
        setDonateUseGps(true);
      },
      () => {
        setDonateGpsError('Izin lokasi ditolak atau tidak tersedia.');
        setDonateUseGps(false);
      },
      { enableHighAccuracy: true, timeout: 12_000 }
    );
  };

  useEffect(() => {
    const t = searchParams.get('tab');
    const map: Record<string, DonationTab> = {
      donate: 'donate',
      lokasi: 'lokasi-donasi',
      'lokasi-donasi': 'lokasi-donasi',
      add: 'add-donation',
      transaction: 'transaction-summary',
    };
    if (t && map[t]) setActiveTab(map[t]);
  }, [searchParams]);

  const resetDonateFlow = useCallback(() => {
    setDonateDone(false);
    setDonateStep('select-product');
    setSelected(null);
    setProductName('');
    setQuantity('');
    setDonationCatalogProductId(null);
    setDonationCategory('');
    setDonationExpiry('');
    setDonationExpiryDatetime('');
    setSubmitting(false);
  }, []);

  const goConfirm = () => {
    if (!selected || !productReady) return;
    setDonateStep('confirm');
  };

  const handleConfirmDonation = async () => {
    if (!selected || !productReady) return;
    setSubmitting(true);
    const id = `DON-${Math.floor(Math.random() * 90000) + 10000}`;
    const body = {
      table: 'donations',
      id,
      lksId: selected.id,
      lksName: selected.name,
      productName: productName.trim(),
      category: donationCategory.trim(),
      expiry: donationExpiry.trim(),
      quantity: qtyNum,
      unit,
      weightLabel,
      status: 'Scheduled',
      createdAt: new Date().toISOString(),
    };

    try {
      await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch {
      /* offline */
    }

    const catalogP =
      donationCatalogProductId &&
      products.find(
        (x: { id: string; name: string; image?: string; type?: string; stock?: number; status?: string }) =>
          x.id === donationCatalogProductId && x.name.trim() === productName.trim()
      );
    const donationProductImage =
      catalogP?.image ??
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80';

    addDonation({
      id,
      productName: productName.trim(),
      category: donationCategory.trim(),
      expiry: donationExpiry.trim(),
      weight: weightLabel,
      recipient: selected.name,
      recipientImage: selected.image,
      date: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      status: 'Scheduled',
      image: donationProductImage,
    });

    if (catalogP && catalogP.type === 'Donate') {
      const nextStock = Math.max(0, catalogP.stock - qtyNum);
      updateProduct(catalogP.id, {
        stock: nextStock,
        status: nextStock === 0 ? 'Sold Out' : catalogP.status,
      });
    }

    addDonationAlert({
      lksId: selected.id,
      lksName: selected.name,
      productName: productName.trim(),
      quantity: qtyNum,
      unit: 'portion',
      weightLabel,
      donationId: id,
    });

    setSubmitting(false);
    setDonateDone(true);
  };

  useEffect(() => {
    if (activeTab === 'donate' && !productReady) {
      setDonateStep('select-product');
      setSelected(null);
      setDonateDone(false);
    }
  }, [activeTab, productReady]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Donations</h1>
        </div>
        <div className="bg-[#E8F3EB] text-[#1A5632] px-4 py-2 rounded-full font-bold flex items-center space-x-2 self-start md:self-auto shadow-sm border border-[#D1E8D7]">
          <Leaf size={18} />
          <span>Meals saved (porsi): {mealsCount.toLocaleString('id-ID')}</span>
        </div>
      </div>

      <nav
        aria-label="Donation sections"
        className="flex flex-wrap gap-2 mb-8 pb-4 border-b border-gray-200"
        role="tablist"
      >
        {subNav.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              id={`tab-${item.id}`}
              aria-controls={`panel-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-colors border ${
                isActive
                  ? 'bg-[#1A5632] text-white border-[#1A5632] shadow-md'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-[#1A5632] hover:text-[#1A5632]'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="min-h-[320px]">
        {activeTab === 'add-donation' && (
          <section
            id="panel-add-donation"
            role="tabpanel"
            aria-labelledby="tab-add-donation"
            className="animate-in fade-in duration-200 max-w-5xl"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add donation product</h2>

            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
              Produk tersedia untuk donasi
            </p>
            {availableDonationProducts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/80 py-12 text-center text-sm text-gray-500 mb-8">
                Tidak ada produk bertipe Donate dengan stok. Tambahkan dari katalog produk (tipe Donate).
              </div>
            ) : (
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10 list-none p-0 m-0">
                {availableDonationProducts.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => pickDonationCatalogProduct(p)}
                      className={`w-full text-left rounded-2xl border p-4 flex gap-3 transition-all ${
                        donationCatalogProductId === p.id
                          ? 'ring-2 ring-[#1A5632] border-[#1A5632] bg-[#F3F8F2] shadow-sm'
                          : 'border-gray-200 bg-white hover:border-[#1A5632]/35 shadow-sm'
                      }`}
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-100 ring-1 ring-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">{p.name}</p>
                        <p className="text-xs font-semibold text-[#1A5632] mt-1">{p.stock} porsi</p>
                        {p.category ? (
                          <p className="text-[10px] text-gray-500 mt-1">Category: {p.category}</p>
                        ) : null}
                        <p className="text-[10px] text-gray-500 mt-1">{p.expiry}</p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Manual</p>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5 max-w-xl">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Nama produk</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => handleDonationNameInput(e.target.value)}
                  placeholder="Contoh: Nasi kotak sisa catering"
                  className="w-full bg-[#F3F8F2] rounded-xl px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-[#1A5632]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Porsi</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="0"
                  className="w-full bg-[#F3F8F2] rounded-xl px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-[#1A5632]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Category</label>
                <select
                  value={donationCategory}
                  onChange={(e) => setDonationCategory(e.target.value)}
                  className="w-full bg-[#F3F8F2] rounded-xl px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-[#1A5632] appearance-none"
                >
                  <option value="">Select category</option>
                  <option value="Fresh Produce">Fresh Produce</option>
                  <option value="Bakery & Pastry">Bakery & Pastry</option>
                  <option value="Prepared Meals">Prepared Meals</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Expired/Expiry</label>
                <input
                  type="text"
                  value={donationExpiry}
                  onChange={(e) => setDonationExpiry(e.target.value)}
                  placeholder="Contoh: 45 mins / 2 days / 4 hours"
                  className="w-full bg-[#F3F8F2] rounded-xl px-4 py-3 font-medium outline-none focus:ring-2 focus:ring-[#1A5632]"
                />
              </div>
              {overStock && (
                <p className="text-xs text-red-600 font-medium">Porsi melebihi stok katalog ({catalogPicked?.stock}).</p>
              )}
            </div>
            <button
              type="button"
              disabled={!productReady}
              onClick={() => setActiveTab('donate')}
              className="mt-4 text-sm font-bold text-[#1A5632] hover:underline disabled:opacity-40 disabled:no-underline"
            >
              Lanjut ke Donate →
            </button>
          </section>
        )}

        {activeTab === 'lokasi-donasi' && (
          <section
            id="panel-lokasi-donasi"
            role="tabpanel"
            aria-labelledby="tab-lokasi-donasi"
            className="animate-in fade-in duration-200"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Lokasi donasi</h2>
            <DonationLocationExplorer />
          </section>
        )}

        {activeTab === 'transaction-summary' && (
          <section
            id="panel-transaction-summary"
            role="tabpanel"
            aria-labelledby="tab-transaction-summary"
            className="animate-in fade-in duration-200"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Transaction summary</h2>
            <div className="rounded-2xl border border-gray-200 bg-gray-50/80 p-4 sm:p-5">
              {donations.length === 0 ? (
                <p className="text-gray-500 text-sm font-medium py-12 text-center bg-white rounded-xl border border-gray-100">
                  Belum ada transaksi.
                </p>
              ) : (
                <ul className="space-y-4 list-none p-0 m-0">
                  {donations.map((donation: DonationRow) => {
                    const lks = resolveLksMetaForRecipient(
                      donation.recipient,
                      donation.recipientImage
                    );
                    return (
                      <li key={donation.id}>
                        <button type="button" onClick={() => setTxDetail(donation)} className="w-full text-left">
                          <article className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden hover:border-[#1A5632]/25 transition-colors">
                            <div className="grid md:grid-cols-5 md:divide-x divide-gray-100">
                              <div className="md:col-span-2 p-5 flex gap-4 items-start">
                                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-gray-100 shrink-0 ring-1 ring-gray-100/80 shadow-sm">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={donation.image} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="min-w-0 pt-0.5">
                                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                    Produk
                                  </p>
                                  <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug mt-1">
                                    {donation.productName}
                                  </h3>
                                  {donation.category ? (
                                    <p className="text-xs text-gray-600 font-medium mt-1">
                                      Category: {donation.category}
                                    </p>
                                  ) : null}
                                  {donation.expiry ? (
                                    <p className="text-xs text-gray-600 font-medium mt-1">
                                      Expired: {donation.expiry}
                                    </p>
                                  ) : null}
                                  <p className="text-sm font-semibold text-[#1A5632] mt-2">
                                    {displayDonationQty(donation.weight)}
                                  </p>
                                </div>
                              </div>

                              <div className="md:col-span-3 p-5 flex flex-col sm:flex-row gap-5 bg-gradient-to-br from-[#FAFAFA] to-[#F3F8F2]/50">
                                <div className="relative w-full sm:w-40 aspect-[4/3] sm:aspect-square sm:h-40 rounded-2xl overflow-hidden shrink-0 ring-2 ring-white shadow-md bg-gray-200">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img src={lks.image} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                    LKS penerima
                                  </p>
                                  <h4 className="text-base font-bold text-gray-900 mt-1 leading-snug">
                                    {donation.recipient}
                                  </h4>
                                  {lks.category && (
                                    <p className="text-xs font-semibold text-[#1A5632] mt-1">{lks.category}</p>
                                  )}
                                  {lks.address && (
                                    <p className="text-xs text-gray-500 mt-2 leading-relaxed line-clamp-2">
                                      {lks.address}
                                    </p>
                                  )}
                                  <div className="flex flex-wrap items-center gap-2 mt-4">
                                    <span
                                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${donationStatusClass(donation.status)}`}
                                    >
                                      {donation.status}
                                    </span>
                                    <span className="text-xs text-gray-400 hidden sm:inline">·</span>
                                    <span className="text-xs font-medium text-gray-600 flex items-center gap-1">
                                      <MapPin size={13} className="text-gray-400 shrink-0" />
                                      {donation.date}
                                    </span>
                                  </div>
                                  <p className="text-xs text-green-700 font-bold flex items-center gap-1 mt-3">
                                    <CheckCircle2 size={14} className="shrink-0" />
                                    Mitra terverifikasi
                                  </p>
                                </div>
                              </div>
                            </div>
                          </article>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            {txDetail && (
              <DonationTrackingModal
                donation={{
                  ...txDetail,
                  lksCoords: DONATION_LOCATIONS.find((l) => l.name === txDetail.recipient)?.coords,
                  lksAddress: DONATION_LOCATIONS.find((l) => l.name === txDetail.recipient)?.address,
                }}
                onClose={() => setTxDetail(null)}
              />
            )}
          </section>
        )}

        {activeTab === 'donate' && (
          <section
            id="panel-donate"
            role="tabpanel"
            aria-labelledby="tab-donate"
            className="animate-in fade-in duration-200"
          >
            {donateDone ? (
              /* ── SUCCESS SCREEN ── */
              <div className="max-w-2xl mx-auto text-center py-16">
                <div className="w-24 h-24 bg-[#E8F3EB] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <CheckCircle2 size={48} className="text-[#1A5632]" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Donasi Berhasil!</h2>
                <p className="text-gray-500 font-medium mb-2">
                  <span className="font-bold text-gray-800">{qtyNum} porsi {productName}</span>
                </p>
                <p className="text-gray-500 font-medium mb-8">
                  Sedang diproses untuk disalurkan ke{' '}
                  <span className="font-bold text-[#1A5632]">{selected?.name}</span>.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    type="button"
                    onClick={resetDonateFlow}
                    className="bg-[#1A5632] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#144226] transition-colors shadow-sm"
                  >
                    Donasi lagi
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('transaction-summary')}
                    className="bg-white border border-gray-200 text-gray-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                  >
                    Lihat riwayat
                  </button>
                </div>
              </div>
            ) : (
              <div className="max-w-4xl">
                {/* ── STEPPER ── */}
                <div className="flex items-center gap-0 mb-10">
                  {[
                    { step: 1, key: 'select-product', label: 'Pilih Produk' },
                    { step: 2, key: 'select-location', label: 'Pilih Lokasi' },
                    { step: 3, key: 'confirm', label: 'Konfirmasi' },
                  ].map(({ step, key, label }, idx) => {
                    const stepOrder = ['select-product', 'select-location', 'confirm'];
                    const currentIdx = stepOrder.indexOf(donateStep);
                    const isDone = idx < currentIdx;
                    const isActive = donateStep === key;
                    return (
                      <React.Fragment key={key}>
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                              isDone
                                ? 'bg-[#1A5632] text-white'
                                : isActive
                                ? 'bg-[#1A5632] text-white shadow-md ring-4 ring-[#E8F3EB]'
                                : 'bg-gray-100 text-gray-400'
                            }`}
                          >
                            {isDone ? <CheckCircle2 size={18} /> : step}
                          </div>
                          <span
                            className={`text-xs font-bold mt-2 whitespace-nowrap ${
                              isActive ? 'text-[#1A5632]' : isDone ? 'text-[#1A5632]' : 'text-gray-400'
                            }`}
                          >
                            {label}
                          </span>
                        </div>
                        {idx < 2 && (
                          <div
                            className={`flex-1 h-0.5 mx-2 mb-5 transition-all ${
                              idx < currentIdx ? 'bg-[#1A5632]' : 'bg-gray-200'
                            }`}
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* ── STEP 1: SELECT PRODUCT ── */}
                {donateStep === 'select-product' && (
                  <div className="animate-in fade-in duration-200">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Pilih produk untuk didonasikan</h2>
                    <p className="text-sm text-gray-500 mb-6">Pilih produk dari katalog donasi Anda, lalu atur jumlah porsi.</p>

                    {availableDonationProducts.length === 0 ? (
                      <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 py-16 text-center">
                        <Package size={40} className="mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500 font-medium text-sm">Tidak ada produk donasi tersedia.</p>
                        <p className="text-gray-400 text-xs mt-1">Tambahkan produk bertipe Donate dari menu Products.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {availableDonationProducts.map((p) => {
                          const isSelected = donationCatalogProductId === p.id;
                          const currentQty = isSelected ? qtyNum : 0;
                          return (
                            <div
                              key={p.id}
                              className={`rounded-2xl border-2 bg-white overflow-hidden transition-all shadow-sm ${
                                isSelected
                                  ? 'border-[#1A5632] shadow-md'
                                  : 'border-gray-100 hover:border-gray-200'
                              }`}
                            >
                              {/* Product image */}
                              <div className="relative h-40 bg-gray-100 overflow-hidden">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  className="w-full h-full object-cover"
                                />
                                {isSelected && (
                                  <div className="absolute top-3 right-3 bg-[#1A5632] text-white rounded-full p-1 shadow-md">
                                    <CheckCircle2 size={18} />
                                  </div>
                                )}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-4 py-3">
                                  <span className="text-white text-xs font-bold bg-[#1A5632]/80 px-2 py-0.5 rounded-full">
                                    {p.category}
                                  </span>
                                </div>
                              </div>

                              {/* Product info */}
                              <div className="p-4">
                                <h3 className="font-bold text-gray-900 text-sm leading-snug mb-1">{p.name}</h3>
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <Package size={12} />
                                    Stok: <span className="font-bold text-gray-700">{p.stock} porsi</span>
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    Exp: <span className="font-semibold text-amber-600">{p.expiry}</span>
                                  </span>
                                </div>

                                {/* Quantity control */}
                                {isSelected ? (
                                  <div className="space-y-3">
                                    <div className="flex items-center justify-between bg-[#F3F8F2] rounded-xl p-1">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const next = Math.max(1, qtyNum - 1);
                                          setQuantity(String(next));
                                        }}
                                        className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center text-[#1A5632] font-bold text-lg hover:bg-gray-50 transition-colors border border-gray-100"
                                      >
                                        −
                                      </button>
                                      <div className="text-center">
                                        <span className="text-xl font-extrabold text-[#1A5632]">{qtyNum}</span>
                                        <span className="text-xs text-gray-500 ml-1">porsi</span>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const next = Math.min(p.stock, qtyNum + 1);
                                          setQuantity(String(next));
                                        }}
                                        className="w-9 h-9 rounded-lg bg-[#1A5632] shadow-sm flex items-center justify-center text-white font-bold text-lg hover:bg-[#144226] transition-colors"
                                      >
                                        +
                                      </button>
                                    </div>
                                    {overStock && (
                                      <p className="text-xs text-red-600 font-medium text-center">
                                        Melebihi stok ({p.stock} porsi)
                                      </p>
                                    )}
                                    <button
                                      type="button"
                                      disabled={qtyNum < 1 || overStock}
                                      onClick={() => setDonateStep('select-location')}
                                      className="w-full bg-[#1A5632] hover:bg-[#144226] disabled:opacity-50 text-white py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
                                    >
                                      <HeartHandshake size={16} />
                                      Donate {qtyNum} porsi →
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => pickDonationCatalogProduct(p)}
                                    className="w-full border-2 border-[#1A5632] text-[#1A5632] py-2.5 rounded-xl font-bold text-sm hover:bg-[#F3F8F2] transition-colors"
                                  >
                                    Pilih produk ini
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* ── STEP 2: SELECT LOCATION ── */}
                {donateStep === 'select-location' && (
                  <div className="animate-in fade-in duration-200">
                    <div className="flex items-center gap-3 mb-6">
                      <button
                        type="button"
                        onClick={() => setDonateStep('select-product')}
                        className="flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-[#1A5632] transition-colors"
                      >
                        <ArrowLeft size={16} />
                        Kembali
                      </button>
                      <div className="h-4 w-px bg-gray-200" />
                      <div className="flex items-center gap-2 bg-[#F3F8F2] px-3 py-1.5 rounded-xl border border-[#D1E8D7]">
                        {catalogPicked && (
                          <div className="w-6 h-6 rounded-md overflow-hidden shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={catalogPicked.image} alt="" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <span className="text-xs font-bold text-[#1A5632]">{productName}</span>
                        <span className="text-xs text-gray-500">· {qtyNum} porsi</span>
                      </div>
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 mb-2">Pilih lokasi penerima</h2>
                    <p className="text-sm text-gray-500 mb-5">Pilih LKS terdekat berdasarkan lokasi referensi Anda.</p>

                    {/* Location filter */}
                    <div className="flex items-center gap-2 mb-5 flex-wrap">
                      <button
                        type="button"
                        onClick={requestDonateGps}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-bold transition-colors ${
                          donateUseGps
                            ? 'bg-[#1A5632] border-[#1A5632] text-white'
                            : 'bg-white border-gray-200 text-gray-600 hover:border-[#1A5632]'
                        }`}
                      >
                        <Crosshair size={15} />
                        Lokasi saya
                      </button>
                      <select
                        value={donateRefPresetId}
                        onChange={(e) => {
                          setDonateRefPresetId(e.target.value);
                          setDonateUseGps(false);
                        }}
                        className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-[#1A5632]"
                      >
                        {REFERENCE_LOCATION_PRESETS.map((p) => (
                          <option key={p.id} value={p.id}>{p.label}</option>
                        ))}
                      </select>
                    </div>

                    {donateGpsError && (
                      <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-medium mb-4">
                        {donateGpsError}
                      </div>
                    )}

                    <div className="grid gap-3 max-h-[520px] overflow-y-auto pr-1">
                      {donateLocationsWithDistance.map(({ loc, distKm: dist }) => {
                        const isChosen = selected?.id === loc.id;
                        return (
                          <button
                            key={loc.id}
                            type="button"
                            onClick={() => setSelected(loc)}
                            className={`w-full text-left rounded-2xl border-2 p-4 flex gap-4 transition-all ${
                              isChosen
                                ? 'border-[#1A5632] bg-[#F3F8F2] shadow-md'
                                : 'border-gray-100 bg-white hover:border-gray-200 shadow-sm'
                            }`}
                          >
                            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={loc.image} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p className="font-bold text-gray-900 text-sm leading-snug">{loc.name}</p>
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${
                                  dist < 10 ? 'bg-emerald-100 text-emerald-700' :
                                  dist < 50 ? 'bg-amber-100 text-amber-700' :
                                  'bg-gray-100 text-gray-600'
                                }`}>
                                  {dist.toFixed(1)} km
                                </span>
                              </div>
                              <p className="text-xs font-semibold text-[#1A5632] mt-0.5">{loc.category}</p>
                              <p className="text-xs text-gray-500 mt-1 line-clamp-1">{loc.address}</p>
                            </div>
                            {isChosen && (
                              <div className="shrink-0 self-center">
                                <CheckCircle2 size={20} className="text-[#1A5632]" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-6 flex justify-end">
                      <button
                        type="button"
                        disabled={!selected}
                        onClick={() => setDonateStep('confirm')}
                        className="bg-[#1A5632] hover:bg-[#144226] disabled:opacity-50 text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-sm flex items-center gap-2"
                      >
                        Lanjut ke Konfirmasi →
                      </button>
                    </div>
                  </div>
                )}

                {/* ── STEP 3: CONFIRM ── */}
                {donateStep === 'confirm' && (
                  <div className="animate-in fade-in duration-200 max-w-xl">
                    <div className="flex items-center gap-3 mb-6">
                      <button
                        type="button"
                        onClick={() => setDonateStep('select-location')}
                        className="flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-[#1A5632] transition-colors"
                      >
                        <ArrowLeft size={16} />
                        Kembali
                      </button>
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 mb-6">Konfirmasi donasi</h2>

                    {/* Product summary */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
                      <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Produk yang didonasikan</p>
                      </div>
                      <div className="p-5 flex gap-4 items-center">
                        {catalogPicked && (
                          <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={catalogPicked.image} alt="" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900">{productName}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{donationCategory}</p>
                          <p className="text-xs text-gray-500 mt-0.5">Exp: {donationExpiry}</p>
                          <div className="mt-2 inline-flex items-center gap-1.5 bg-[#E8F3EB] px-3 py-1 rounded-full">
                            <Leaf size={13} className="text-[#1A5632]" />
                            <span className="text-sm font-extrabold text-[#1A5632]">{qtyNum} porsi</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* LKS summary */}
                    {selected && (
                      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
                        <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Dikirim ke</p>
                        </div>
                        <div className="p-5 flex gap-4 items-center">
                          <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={selected.image} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-900">{selected.name}</p>
                            <p className="text-xs font-semibold text-[#1A5632] mt-0.5">{selected.category}</p>
                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                              <MapPin size={11} className="shrink-0" />
                              {selected.address}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {selectedDistanceKm !== null && `${selectedDistanceKm.toFixed(1)} km dari referensi`}
                            </p>
                          </div>
                          <CheckCircle2 size={20} className="text-[#1A5632] shrink-0" />
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleConfirmDonation}
                      disabled={submitting}
                      className="w-full bg-[#1A5632] hover:bg-[#144226] disabled:opacity-70 text-white py-4 rounded-xl font-bold text-base transition-colors shadow-md flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Memproses…
                        </>
                      ) : (
                        <>
                          <HeartHandshake size={20} />
                          Konfirmasi Donasi
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

export default function DonationsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-8 h-8 border-4 border-[#1A5632]/20 border-t-[#1A5632] rounded-full animate-spin" />
        </div>
      }
    >
      <DonationsPageInner />
    </Suspense>
  );
}
