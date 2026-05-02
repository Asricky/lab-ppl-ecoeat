"use client";

import type { Dispatch, SetStateAction } from "react";

export type ExploreFilters = {
  category: string;
  /** Bounds in integer Rupiah (sesuai harga efektif diskon × 10.000) */
  minPriceIdr: number;
  maxPriceIdr: number;
  maxDistance: number;
  condition: string;
};

const PRICE_PRESETS: { label: string; min: number; max: number }[] = [
  { label: "0 – 75RB", min: 0, max: 75_000 },
  { label: "75RB – 150RB", min: 75_000, max: 150_000 },
  { label: "150RB – 200RB", min: 150_000, max: 200_000 },
];

function parseIdrInput(raw: string): number | null {
  const digits = raw.replace(/\D/g, "");
  if (digits === "") return null;
  const n = parseInt(digits, 10);
  return Number.isNaN(n) ? null : Math.min(Math.max(n, 0), 999_999_999);
}

export default function FilterBar({
  draftFilters,
  setDraftFilters,
  onApply,
  className = "",
}: {
  draftFilters: ExploreFilters;
  setDraftFilters: Dispatch<SetStateAction<ExploreFilters>>;
  onApply: () => void;
  /** Extra classes for root wrapper (e.g. drawer padding) */
  className?: string;
}) {
  const setMinStr = (raw: string) => {
    const v = parseIdrInput(raw);
    setDraftFilters((prev) => ({
      ...prev,
      minPriceIdr: v ?? 0,
    }));
  };

  const setMaxStr = (raw: string) => {
    const v = parseIdrInput(raw);
    setDraftFilters((prev) => ({
      ...prev,
      maxPriceIdr: v ?? prev.maxPriceIdr,
    }));
  };

  const applyPreset = (min: number, max: number) => {
    setDraftFilters((prev) => ({ ...prev, minPriceIdr: min, maxPriceIdr: max }));
  };

  return (
    <div className={`w-full min-w-0 shrink-0 ${className}`}>
      <div className="mb-8">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Category</h3>
        <div className="space-y-3">
          {["Meals", "Snacks", "Bakery", "Drinks"].map((cat) => (
            <label key={cat} className="flex items-center space-x-3 cursor-pointer group">
              <div
                className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                  draftFilters.category === cat ? "bg-green-700 border-green-700" : "border-[#d4dec4] group-hover:border-green-500 bg-white"
                }`}
              >
                {draftFilters.category === cat && (
                  <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <span className={`text-sm font-semibold ${draftFilters.category === cat ? "text-gray-900" : "text-gray-600"}`}>{cat}</span>
              <input
                type="checkbox"
                className="hidden"
                checked={draftFilters.category === cat}
                onChange={() =>
                  setDraftFilters((prev) => ({
                    ...prev,
                    category: prev.category === cat ? "" : cat,
                  }))
                }
              />
            </label>
          ))}
        </div>
      </div>

      <div className="mb-8 rounded-2xl border border-[#d4dec4] bg-[#eef3e8]/80 p-4">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Batas Harga</h3>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">Min</label>
            <input
              type="text"
              inputMode="numeric"
              value={draftFilters.minPriceIdr === 0 ? "" : String(draftFilters.minPriceIdr)}
              placeholder="0"
              onChange={(e) => setMinStr(e.target.value)}
              className="w-full rounded-xl border border-[#d4dec4] bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 shadow-sm outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/20"
              aria-label="Harga minimum Rupiah"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">Max</label>
            <input
              type="text"
              inputMode="numeric"
              value={draftFilters.maxPriceIdr === 0 ? "" : String(draftFilters.maxPriceIdr)}
              placeholder="Mis. 200000"
              onChange={(e) => setMaxStr(e.target.value)}
              className="w-full rounded-xl border border-[#d4dec4] bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 shadow-sm outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/20"
              aria-label="Harga maksimum Rupiah"
            />
          </div>
        </div>
        <p className="text-[10px] text-gray-500 font-medium mb-3 leading-relaxed">
          Ketik nominal tanpa titik atau koma. Filter diterapkan setelah Anda menekan <span className="font-bold text-green-900">Apply Filter</span>.
        </p>
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-2">Pilih cepat</p>
        <div className="flex flex-col gap-2">
          {PRICE_PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => applyPreset(p.min, p.max)}
              className="w-full rounded-xl border border-[#d4dec4] bg-white py-2.5 text-xs font-bold text-green-900 shadow-sm transition-colors hover:bg-[#eef3e8] hover:border-green-700/40"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Distance</h3>
        <div className="flex space-x-2">
          {[5, 10, 25].map((dist) => (
            <button
              key={dist}
              type="button"
              onClick={() => setDraftFilters((prev) => ({ ...prev, maxDistance: dist }))}
              className={`flex-1 py-1.5 text-xs font-bold rounded-full transition-colors ${
                draftFilters.maxDistance === dist ? "bg-green-800 text-white shadow-md" : "bg-white border border-[#d4dec4] text-gray-600 hover:bg-green-50"
              }`}
            >
              {dist}km
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Condition</h3>
        <div className="space-y-3">
          {["Near expiry", "Surplus stock", "Imperfect food"].map((cond) => (
            <label key={cond} className="flex items-center space-x-3 cursor-pointer group">
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                  draftFilters.condition === cond ? "border-green-700" : "border-[#d4dec4] group-hover:border-green-500 bg-white"
                }`}
              >
                {draftFilters.condition === cond && <div className="w-2.5 h-2.5 bg-green-700 rounded-full" />}
              </div>
              <span className={`text-sm font-semibold ${draftFilters.condition === cond ? "text-gray-900" : "text-gray-600"}`}>{cond}</span>
              <input
                type="radio"
                className="hidden"
                checked={draftFilters.condition === cond}
                onChange={() => setDraftFilters((prev) => ({ ...prev, condition: cond }))}
              />
            </label>
          ))}
        </div>
      </div>

      <button type="button" onClick={onApply} className="w-full bg-green-800 hover:bg-green-900 text-white font-bold py-3.5 rounded-xl transition-colors shadow-md">
        Apply Filter
      </button>
    </div>
  );
}
