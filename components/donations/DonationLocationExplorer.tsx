'use client';

import React, { useMemo, useState } from 'react';
import { Crosshair, MapPinned, Search } from 'lucide-react';
import {
  DONATION_LOCATIONS,
  DONATION_CATEGORY_OPTIONS,
  RADIUS_OPTIONS,
  REFERENCE_LOCATION_PRESETS,
  type DonationCategoryKey,
} from '@/lib/donationLocations';
import { distanceKm, formatDistanceKm } from '@/lib/geo';
import { IndonesiaLksMap } from '@/components/donations/IndonesiaLksMap';

export function DonationLocationExplorer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<DonationCategoryKey | 'all'>('all');
  const [radiusKm, setRadiusKm] = useState(100);
  const [refPresetId, setRefPresetId] = useState('jakarta');
  const [gpsCoords, setGpsCoords] = useState<[number, number] | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [useGps, setUseGps] = useState(false);

  const refCoords = useMemo((): [number, number] => {
    if (useGps && gpsCoords) return gpsCoords;
    const p = REFERENCE_LOCATION_PRESETS.find((x) => x.id === refPresetId);
    return p?.coords ?? [-6.1944, 106.8229];
  }, [useGps, gpsCoords, refPresetId]);

  const requestGps = () => {
    setGpsError(null);
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setGpsError('Perangkat tidak mendukung lokasi.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsCoords([pos.coords.latitude, pos.coords.longitude]);
        setUseGps(true);
      },
      () => {
        setGpsError('Izin lokasi ditolak atau tidak tersedia.');
        setUseGps(false);
      },
      { enableHighAccuracy: true, timeout: 12_000 }
    );
  };

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return DONATION_LOCATIONS.map((loc) => ({
      loc,
      dist: distanceKm(refCoords, loc.coords),
    }))
      .filter(({ loc, dist }) => {
        if (categoryFilter !== 'all' && loc.categoryKey !== categoryFilter) return false;
        if (radiusKm > 0 && dist > radiusKm) return false;
        if (q) {
          const hay = `${loc.name} ${loc.address} ${loc.category} ${loc.description}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => a.dist - b.dist);
  }, [refCoords, categoryFilter, radiusKm, searchQuery]);

  const distancesById = useMemo(() => {
    const m: Record<string | number, number> = {};
    for (const { loc, dist } of DONATION_LOCATIONS.map((loc) => ({
      loc,
      dist: distanceKm(refCoords, loc.coords),
    }))) {
      m[loc.id] = dist;
    }
    return m;
  }, [refCoords]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <p className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
          <MapPinned size={18} className="text-[#1A5632]" />
          Cari lokasi donasi
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
          <div className="md:col-span-2">
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Cari teks</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nama, alamat, atau kata kunci…"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#1A5632] outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Kategori</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as DonationCategoryKey | 'all')}
              className="w-full py-2.5 px-3 rounded-xl border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-[#1A5632] outline-none bg-white"
            >
              {DONATION_CATEGORY_OPTIONS.map((o) => (
                <option key={o.key} value={o.key}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Radius</label>
            <select
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="w-full py-2.5 px-3 rounded-xl border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-[#1A5632] outline-none bg-white"
            >
              {RADIUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-end gap-3">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Titik acuan jarak</label>
            <select
              value={refPresetId}
              onChange={(e) => {
                setRefPresetId(e.target.value);
                setUseGps(false);
              }}
              disabled={useGps && !!gpsCoords}
              className="w-full py-2.5 px-3 rounded-xl border border-gray-200 text-sm font-medium focus:ring-2 focus:ring-[#1A5632] outline-none bg-white disabled:opacity-50"
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
            onClick={requestGps}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-[#1A5632] text-[#1A5632] font-bold text-sm hover:bg-[#E8F3EB] transition-colors"
          >
            <Crosshair size={18} />
            Lokasi saya (GPS)
          </button>
          {useGps && gpsCoords && (
            <button
              type="button"
              onClick={() => {
                setUseGps(false);
              }}
              className="text-sm font-bold text-gray-500 hover:text-gray-800"
            >
              Pakai kota pilihan
            </button>
          )}
        </div>
        {gpsError && <p className="text-xs text-red-600 mt-2">{gpsError}</p>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] gap-4 items-start">
        <IndonesiaLksMap
          locations={filtered.map((x) => x.loc)}
          referencePoint={refCoords}
          radiusKm={radiusKm}
          distancesById={distancesById}
        />

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden max-h-[min(520px,70vh)] flex flex-col">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 font-bold text-sm text-gray-900">
            Daftar lokasi ({filtered.length})
          </div>
          <ul className="overflow-y-auto flex-1 divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <li className="p-6 text-sm text-gray-500 text-center">Tidak ada lokasi pada filter ini.</li>
            ) : (
              filtered.map(({ loc, dist }) => (
                <li key={loc.id} className="p-4 hover:bg-[#F9FAFB] transition-colors">
                  <p className="font-bold text-gray-900 text-sm">{loc.name}</p>
                  <p className="text-xs text-[#1A5632] font-semibold mt-0.5">{loc.category}</p>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">{loc.address}</p>
                  <p className="text-xs font-bold text-gray-800 mt-2">
                    Jarak: {formatDistanceKm(dist)}
                  </p>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
