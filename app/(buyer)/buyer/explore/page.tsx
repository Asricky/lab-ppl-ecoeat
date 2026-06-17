"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Filter, X } from "lucide-react";
import FilterBar, { ExploreFilters } from "@/components/buyer/FilterBar";
import ProductCard from "@/components/buyer/ProductCard";

// getDynamicImage removed as we use image from store

import { useGlobalStore } from "@/store/globalStore";

function mapToProductTile(p: any) {
  const parseRp = (str: string) => {
    if (!str) return 0;
    const num = parseInt(str.replace(/[^0-9]/g, ''), 10);
    return isNaN(num) ? 0 : num / 1000;
  };

  let cat = "Meals";
  if (p.category?.includes("Bakery")) cat = "Bakery";
  else if (p.category?.includes("Snack")) cat = "Snacks";
  else if (p.category?.includes("Drink") || p.category?.includes("Produce")) cat = "Drinks";

  return {
    id: p.id,
    name: p.name,
    price: parseRp(p.originalPrice) || 15,
    discountPrice: parseRp(p.price) || 10,
    discountPercentage: p.discountPercent || 20,
    vendor: p.seller || "EcoEat Vendor",
    distance: 1.2,
    expiresIn: p.expiry || "1 HOUR",
    image: p.image,
    category: cat as any,
  };
}

const INITIAL_FILTERS: ExploreFilters = {
  category: "",
  minPriceIdr: 0,
  maxPriceIdr: 500_000,
  maxDistance: 10,
  condition: "Near expiry",
};

function productPriceIdr(p: any) {
  return Math.round(p.discountPrice * 10_000);
}

export default function ExplorePage() {
  const { products: globalProducts } = useGlobalStore();
  const allProducts = useMemo(() => globalProducts.filter(p => p.type === 'Sell' && p.stock > 0).map(mapToProductTile), [globalProducts]);

  const [draftFilters, setDraftFilters] = useState<ExploreFilters>(INITIAL_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<ExploreFilters>(INITIAL_FILTERS);
  const [filterOpen, setFilterOpen] = useState(false);

  const closeFilter = useCallback(() => setFilterOpen(false), []);

  useEffect(() => {
    if (!filterOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeFilter();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [filterOpen, closeFilter]);

  const commitFilters = useCallback(() => {
    const low = Math.min(draftFilters.minPriceIdr, draftFilters.maxPriceIdr);
    const high = Math.max(draftFilters.minPriceIdr, draftFilters.maxPriceIdr);
    const normalized = { ...draftFilters, minPriceIdr: low, maxPriceIdr: high };
    setDraftFilters(normalized);
    setAppliedFilters(normalized);
    setFilterOpen(false);
  }, [draftFilters]);

  const filteredProducts = useMemo(() => {
    const low = Math.min(appliedFilters.minPriceIdr, appliedFilters.maxPriceIdr);
    const high = Math.max(appliedFilters.minPriceIdr, appliedFilters.maxPriceIdr);

    return allProducts.filter((p) => {
      if (appliedFilters.category && p.category !== appliedFilters.category && appliedFilters.category !== "All Surplus" as any) return false;
      const pidr = productPriceIdr(p);
      if (pidr < low || pidr > high) return false;
      if (p.distance > appliedFilters.maxDistance) return false;
      return true;
    });
  }, [appliedFilters, allProducts]);

  return (
    <div className="max-w-[1400px] mx-auto pb-12 relative">
      {filterOpen && (
        <>
          <button
            type="button"
            aria-label="Tutup filter"
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300"
            onClick={closeFilter}
          />
          <aside
            className="fixed inset-y-0 left-0 z-50 w-full max-w-[min(100vw,22rem)] flex flex-col bg-[#f4f7ed] border-r border-[#d4dec4] shadow-2xl animate-in slide-in-from-left duration-300"
            role="dialog"
            aria-modal="true"
            aria-labelledby="explore-filter-title"
          >
            <div className="flex shrink-0 items-center justify-between gap-4 px-5 py-4 border-b border-[#d4dec4] bg-[#eef3e8]/80">
              <h2 id="explore-filter-title" className="text-lg font-extrabold text-gray-900">
                Filter
              </h2>
              <button
                type="button"
                onClick={closeFilter}
                className="p-2 rounded-xl text-gray-600 hover:bg-white hover:text-green-800 border border-transparent hover:border-[#d4dec4] transition-colors"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-6">
              <FilterBar
                draftFilters={draftFilters}
                setDraftFilters={setDraftFilters}
                onApply={commitFilters}
                className="pr-0"
              />
            </div>
          </aside>
        </>
      )}

      <div className="flex-1 flex flex-col gap-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center text-[10px] font-bold text-green-700 uppercase tracking-widest mb-1">
              <span className="w-8 h-[2px] bg-green-700 mr-2" /> LIVE FEED
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Explore Food</h1>
            <p className="text-gray-500 font-medium">
              Browse {filteredProducts.length} surplus items near you in <span className="text-gray-900 font-bold">Indonesia</span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            className="inline-flex items-center justify-center gap-2 self-start rounded-2xl border-2 border-[#388e3c] bg-white px-5 py-3 text-sm font-extrabold text-green-800 shadow-sm transition-all hover:bg-[#eef3e8]"
          >
            <Filter className="w-5 h-5" />
            Filter
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          <div className="sm:col-span-2 bg-[#1b5e20] rounded-3xl p-8 text-white flex flex-col justify-between shadow-lg relative overflow-hidden border border-[#144517]">
            <div className="relative z-10">
              <h2 className="text-3xl font-extrabold mb-4 leading-tight">
                Save food, save money,
                <br /> save the planet.
              </h2>
              <p className="text-green-50 mb-8 max-w-sm font-medium">
                Our community has saved over 1.2M meals this year alone. Join the movement and find delicious surplus nearby.
              </p>
              <button type="button" className="bg-white text-green-900 font-bold px-6 py-3 rounded-xl hover:bg-green-50 transition-colors shadow-md">
                Learn Your Impact
              </button>
            </div>
            <div className="absolute right-0 bottom-0 w-64 h-64 bg-green-600 rounded-full translate-x-1/3 translate-y-1/3 opacity-40 blur-3xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
