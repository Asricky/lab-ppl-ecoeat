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
} from 'lucide-react';

import { CourierLiveMap } from '@/components/donations/CourierLiveMap';
import { DonationLocationExplorer } from '@/components/donations/DonationLocationExplorer';
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
  weight: string;
  recipient: string;
  recipientImage: string;
  date: string;
  status: string;
  image: string;
};

type DonationTab = 'add-donation' | 'lokasi-donasi' | 'transaction-summary' | 'donate';

type DonateStep = 'pick-lks' | 'confirm';

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
  type: string;
  stock: number;
  status: string;
  expiry: string;
  price?: string;
};

function DonationsPageInner() {
  const searchParams = useSearchParams();
  const { donations, addDonation, products, updateProduct } = useProductStore();
  const addDonationAlert = useLksInboxStore((s) => s.addDonationAlert);

  const [activeTab, setActiveTab] = useState<DonationTab>('add-donation');

  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  /** Produk katalog Donate yang dipilih dari daftar (untuk gambar + kurangi stok) */
  const [donationCatalogProductId, setDonationCatalogProductId] = useState<string | null>(null);
  const [selected, setSelected] = useState<LksPartner | null>(null);
  const [donateStep, setDonateStep] = useState<DonateStep>('pick-lks');
  const [submitting, setSubmitting] = useState(false);
  const [donateDone, setDonateDone] = useState(false);

  const [donateRefPresetId, setDonateRefPresetId] = useState('jakarta');
  const [donateGpsCoords, setDonateGpsCoords] = useState<[number, number] | null>(null);
  const [donateUseGps, setDonateUseGps] = useState(false);
  const [donateGpsError, setDonateGpsError] = useState<string | null>(null);

  const qtyNum = parseFloat(quantity.replace(',', '.')) || 0;
  const weightLabel = `${qtyNum} porsi`;
  const unit = 'portion' as const;
  const mealsCount = mealsSavedPorsi(donations);
  const catalogPicked = donationCatalogProductId
    ? (products as CatalogProduct[]).find((x) => x.id === donationCatalogProductId)
    : null;
  const overStock =
    catalogPicked != null && productName.trim() === catalogPicked.name.trim() && qtyNum > catalogPicked.stock;
  const productReady = Boolean(productName.trim() && qtyNum > 0 && !overStock);

  const availableDonationProducts = useMemo(() => {
    return (products as CatalogProduct[]).filter(
      (p) => p.type === 'Donate' && p.stock > 0 && p.status !== 'Sold Out'
    );
  }, [products]);

  const pickDonationCatalogProduct = useCallback((p: CatalogProduct) => {
    setDonationCatalogProductId(p.id);
    setProductName(p.name);
    setQuantity(String(p.stock));
  }, []);

  const handleDonationNameInput = useCallback((value: string) => {
    setProductName(value);
    setDonationCatalogProductId(null);
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
    setDonateStep('pick-lks');
    setSelected(null);
    setProductName('');
    setQuantity('');
    setDonationCatalogProductId(null);
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
      products.find((x) => x.id === donationCatalogProductId && x.name.trim() === productName.trim());
    const donationProductImage =
      catalogP?.image ??
      'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80';

    addDonation({
      id,
      productName: productName.trim(),
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
      setDonateStep('pick-lks');
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
                        <article className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden hover:border-[#1A5632]/25 transition-colors">
                          <div className="grid md:grid-cols-5 md:divide-x divide-gray-100">
                            <div className="md:col-span-2 p-5 flex gap-4 items-start">
                              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-gray-100 shrink-0 ring-1 ring-gray-100/80 shadow-sm">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={donation.image}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="min-w-0 pt-0.5">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                  Produk
                                </p>
                                <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug mt-1">
                                  {donation.productName}
                                </h3>
                                <p className="text-sm font-semibold text-[#1A5632] mt-2">
                                  {displayDonationQty(donation.weight)}
                                </p>
                              </div>
                            </div>

                            <div className="md:col-span-3 p-5 flex flex-col sm:flex-row gap-5 bg-gradient-to-br from-[#FAFAFA] to-[#F3F8F2]/50">
                              <div className="relative w-full sm:w-40 aspect-[4/3] sm:aspect-square sm:h-40 rounded-2xl overflow-hidden shrink-0 ring-2 ring-white shadow-md bg-gray-200">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={lks.image}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
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
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </section>
        )}

        {activeTab === 'donate' && (
          <section
            id="panel-donate"
            role="tabpanel"
            aria-labelledby="tab-donate"
            className="animate-in fade-in duration-200"
          >
            {donateDone && selected && productReady ? (
              <div className="max-w-lg mx-auto">
                <div className="w-16 h-16 bg-[#E8F3EB] rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={36} className="text-[#1A5632]" />
                </div>
                <p className="text-center font-bold text-gray-900 mb-1">Donasi terkonfirmasi</p>
                <p className="text-center text-sm text-gray-600 mb-6">
                  {productName.trim()} · {weightLabel} → {selected.name}
                </p>
                <CourierLiveMap dest={selected.coords} label="Kurir" />
                <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      resetDonateFlow();
                      setActiveTab('transaction-summary');
                    }}
                    className="bg-[#1A5632] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#0F351F]"
                  >
                    Lihat ringkasan transaksi
                  </button>
                  <button
                    type="button"
                    onClick={resetDonateFlow}
                    className="border-2 border-gray-200 text-gray-800 px-6 py-3 rounded-xl font-bold hover:bg-gray-50"
                  >
                    Donasi baru
                  </button>
                </div>
              </div>
            ) : donateStep === 'pick-lks' ? (
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-gray-500 mb-6">
                  <span className={productReady ? 'text-[#1A5632]' : ''}>① Produk & porsi</span>
                  <span>→</span>
                  <span className="text-[#1A5632]">② Pilih LKS</span>
                  <span>→</span>
                  <span className="text-gray-400">③ Konfirmasi</span>
                </div>

<<<<<<< HEAD:app/seller/donations/page.tsx
      {/* CTA */}
      <div className="flex justify-center mt-8">
        <Link href="/seller/donations/select">
          <button className="bg-[#1A5632] hover:bg-[#0F351F] text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors shadow-md flex items-center space-x-3">
            <HeartHandshake size={24} />
            <span>New Donation</span>
          </button>
        </Link>
=======
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8 max-w-2xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Produk donasi</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5">Nama produk</label>
                      <input
                        type="text"
                        value={productName}
                        onChange={(e) => handleDonationNameInput(e.target.value)}
                        placeholder="Contoh: Nasi kotak sisa catering"
                        className="w-full bg-[#F3F8F2] rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-[#1A5632]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5">Porsi</label>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="0"
                        className="w-full bg-[#F3F8F2] rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-[#1A5632]"
                      />
                    </div>
                  </div>
                  {overStock && (
                    <p className="text-xs text-red-600 font-medium mt-3">
                      Porsi melebihi stok katalog ({catalogPicked?.stock}).
                    </p>
                  )}
                </div>

                <div className="rounded-2xl border border-gray-100 bg-[#FAFAFA] p-4 mb-6 max-w-3xl">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Titik acuan jarak</p>
                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:items-end">
                    <div className="flex-1 min-w-[180px]">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Kota acuan</label>
                      <select
                        value={donateRefPresetId}
                        onChange={(e) => {
                          setDonateRefPresetId(e.target.value);
                          setDonateUseGps(false);
                        }}
                        disabled={donateUseGps && !!donateGpsCoords}
                        className="w-full py-2 px-3 rounded-xl border border-gray-200 text-sm font-medium bg-white outline-none focus:ring-2 focus:ring-[#1A5632] disabled:opacity-50"
                      >
                        {REFERENCE_LOCATION_PRESETS.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={requestDonateGps}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border-2 border-[#1A5632] text-[#1A5632] text-sm font-bold hover:bg-[#E8F3EB]"
                    >
                      <Crosshair size={16} />
                      Lokasi saya (GPS)
                    </button>
                    {donateUseGps && donateGpsCoords && (
                      <button
                        type="button"
                        onClick={() => setDonateUseGps(false)}
                        className="text-sm font-bold text-gray-500 hover:text-gray-800"
                      >
                        Pakai kota
                      </button>
                    )}
                  </div>
                  {donateGpsError && <p className="text-xs text-red-600 mt-2">{donateGpsError}</p>}
                </div>

                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 ${!productReady ? 'opacity-50 pointer-events-none' : ''}`}>
                  {donateLocationsWithDistance.map(({ loc: org, distKm }) => (
                    <button
                      key={org.id}
                      type="button"
                      onClick={() => setSelected(org)}
                      className={`text-left rounded-3xl border overflow-hidden bg-white shadow-sm transition-all hover:shadow-md ${
                        selected?.id === org.id
                          ? 'ring-2 ring-[#1A5632] border-[#1A5632]'
                          : 'border-gray-100'
                      }`}
                    >
                      <div className="h-36 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={org.image} alt="" className="w-full h-full object-cover" />
                        <div className="absolute top-3 right-3 bg-white/95 text-gray-900 px-2 py-1 rounded-lg text-[10px] font-bold shadow border border-gray-100">
                          {formatDistanceKm(distKm)}
                        </div>
                        {org.forWizard && (
                          <div className="absolute top-3 left-3 bg-[#1A5632] text-white px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                            <Verified size={12} />
                            Mitra utama
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <p className="text-[10px] font-bold text-[#1A5632] uppercase tracking-wide mb-1">{org.category}</p>
                        <h3 className="font-bold text-gray-900 mb-1">{org.name}</h3>
                        <p className="text-xs text-gray-600 font-semibold mb-2">Jarak: {formatDistanceKm(distKm)}</p>
                        <p className="text-xs text-gray-500 flex items-start gap-1">
                          <MapPin size={14} className="shrink-0 mt-0.5" />
                          {org.address}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex justify-end mt-10">
                  <button
                    type="button"
                    disabled={!selected || !productReady}
                    onClick={goConfirm}
                    className="bg-[#1A5632] disabled:opacity-40 text-white px-8 py-3 rounded-xl font-bold"
                  >
                    Lanjut konfirmasi
                  </button>
                </div>
              </div>
            ) : donateStep === 'confirm' && selected && productReady ? (
              <div className="max-w-lg mx-auto">
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-gray-500 mb-6">
                  <span className="text-[#1A5632]">① Produk & porsi</span>
                  <span>→</span>
                  <span className="text-[#1A5632]">② Pilih LKS</span>
                  <span>→</span>
                  <span className="text-[#1A5632]">③ Konfirmasi</span>
                </div>
                <button
                  type="button"
                  onClick={() => setDonateStep('pick-lks')}
                  className="flex items-center gap-2 text-gray-600 font-bold text-sm mb-6 hover:text-[#1A5632]"
                >
                  <ArrowLeft size={18} />
                  Ganti LKS
                </button>

                <CourierLiveMap dest={selected.coords} label="Kurir" />

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 mt-6">
                  <div className="flex items-center gap-2 text-[#1A5632] mb-6">
                    <HeartHandshake size={22} />
                    <span className="font-extrabold text-lg">Konfirmasi donasi</span>
                  </div>

                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Penerima</p>
                  <div className="flex gap-3 mb-8 pb-8 border-b border-gray-100">
                    <div className="w-14 h-14 rounded-xl overflow-hidden border border-gray-100 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={selected.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{selected.name}</p>
                      <p className="text-xs text-[#1A5632] font-semibold mt-0.5">{selected.category}</p>
                      {selectedDistanceKm != null && (
                        <p className="text-xs text-gray-700 font-bold mt-1">
                          Jarak dari acuan: {formatDistanceKm(selectedDistanceKm)}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <Phone size={12} />
                        {selected.phone}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{selected.address}</p>
                    </div>
                  </div>

                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Produk</p>
                  <div className="flex gap-3 mb-8">
                    <div className="w-14 h-14 rounded-xl bg-[#F3F8F2] flex items-center justify-center text-[#1A5632] shrink-0">
                      <Package size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{productName.trim()}</p>
                      <p className="text-sm text-gray-600 mt-1">{weightLabel}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleConfirmDonation}
                    className="w-full bg-[#1A5632] hover:bg-[#0F351F] text-white py-4 rounded-xl font-bold text-lg transition-colors disabled:opacity-60"
                  >
                    {submitting ? 'Mengirim…' : 'Konfirmasi donasi'}
                  </button>
                </div>
              </div>
            ) : null}
          </section>
        )}
>>>>>>> repo-sridamai/Sridamai:app/dashboard/seller/donations/page.tsx
      </div>
    </div>
  );
}

export default function DonationsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Memuat donasi…</div>}>
      <DonationsPageInner />
    </Suspense>
  );
}
