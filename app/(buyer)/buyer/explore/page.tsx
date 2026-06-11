"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Filter, X } from "lucide-react";
import FilterBar, { ExploreFilters } from "@/components/buyer/FilterBar";
import ProductCard from "@/components/buyer/ProductCard";

const allProducts = [
  { id: "2", name: "Artisan Sourdough Bundle", price: 9.0, discountPrice: 4.5, discountPercentage: 50, vendor: "Hearth & Grain", distance: 1.2, expiresIn: "3 HOURS", image: "https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", category: "Bakery" },
  { id: "5", name: "Roasted Veggie Bowl", price: 12.0, discountPrice: 7.2, discountPercentage: 40, vendor: "Green Garden Deli", distance: 0.8, expiresIn: "4 HOURS", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", category: "Meals" },
  { id: "3", name: "Evening Pastry Box", price: 12.5, discountPrice: 5.0, discountPercentage: 60, vendor: "Sweet Haven", distance: 2.1, expiresIn: "1 HOUR", image: "https://images.unsplash.com/photo-1495147466023-ff5a443385f5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", category: "Bakery" },
  { id: "6", name: "Salmon Poke Salad", price: 17.0, discountPrice: 8.5, discountPercentage: 50, vendor: "Ocean Fresh", distance: 1.5, expiresIn: "2 HOURS", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", category: "Meals" },
  { id: "4", name: "Cold-Pressed Detox Duo", price: 13.0, discountPrice: 9.0, discountPercentage: 30, vendor: "Pure Press", distance: 2.5, expiresIn: "5 HOURS", image: "https://images.unsplash.com/photo-1622597467836-f38240662c8c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", category: "Drinks" },
  { id: "7", name: "Dark Cocoa Brownie Box", price: 12.0, discountPrice: 6.0, discountPercentage: 50, vendor: "Sweet Haven", distance: 0.8, expiresIn: "2 HOURS", image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", category: "Bakery" },
];

const INITIAL_FILTERS: ExploreFilters = {
  category: "Bakery",
  minPriceIdr: 0,
  maxPriceIdr: 500_000,
  maxDistance: 10,
  condition: "Near expiry",
};

function productPriceIdr(p: (typeof allProducts)[0]) {
  return Math.round(p.discountPrice * 10_000);
}

export default function ExplorePage() {
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
      if (appliedFilters.category && p.category !== appliedFilters.category) return false;
      const pidr = productPriceIdr(p);
      if (pidr < low || pidr > high) return false;
      if (p.distance > appliedFilters.maxDistance) return false;
      return true;
    });
  }, [appliedFilters]);

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
