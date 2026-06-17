"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import ProductCard from "@/components/buyer/ProductCard";

function getDynamicImage(name: string): string {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('nasi') || lowerName.includes('ayam')) {
    return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60';
  }
  if (lowerName.includes('roti') || lowerName.includes('kue')) {
    return 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=60';
  }
  if (lowerName.includes('martabak') || lowerName.includes('snack')) {
    return 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&auto=format&fit=crop&q=60';
  }
  return 'https://images.unsplash.com/photo-1495147466023-ff5a443385f5?w=500&auto=format&fit=crop&q=60';
}

const CATEGORY_TABS = ["All Surplus", "Meals", "Snacks", "Drinks", "Bakery"] as const;
type CategoryTab = (typeof CATEGORY_TABS)[number];

type ProductTile = {
  id: string;
  name: string;
  price: number;
  discountPrice: number;
  discountPercentage: number;
  vendor: string;
  distance: number;
  expiresIn: string;
  image: string;
  category: Exclude<CategoryTab, "All Surplus">;
};

import { useGlobalStore } from "@/store/globalStore";

function mapToProductTile(p: any): ProductTile {
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

function BuyerDashboardContent() {
  const user = useAuthStore((s) => s.user);
  const { products: globalProducts } = useGlobalStore();
  const products = useMemo(() => globalProducts.filter(p => p.type === 'Sell' && p.stock > 0).map(mapToProductTile), [globalProducts]);
  
  const [activeCategory, setActiveCategory] = useState<CategoryTab>("All Surplus");

  const searchParams = useSearchParams();
  const query = (searchParams.get("q") || "").trim().toLowerCase();

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = activeCategory === "All Surplus" || p.category === activeCategory;
      const matchesQuery = !query || p.name.toLowerCase().includes(query) || p.vendor.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query, products]);

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 flex items-center">
          Hi, {user?.name || "Julian Rivers"} <span className="ml-2">👋</span>
        </h1>
        <p className="text-gray-500 text-lg mt-1 font-medium">Find surplus food near you and reduce waste.</p>
      </div>

      <div className="bg-[#388e3c] rounded-3xl p-8 md:p-10 text-white mb-10 relative overflow-hidden shadow-lg border border-[#2e7d32]">
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-green-500 rounded-full opacity-40 blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <span className="bg-white/20 px-4 py-1.5 rounded-full text-sm font-bold tracking-wider mb-6 inline-block">ECO IMPACT</span>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">You saved 5 meals this week 🌱</h2>
          <p className="text-green-50 max-w-2xl text-lg font-medium leading-relaxed">
            Your choices prevented 3.2kg of CO2 emissions. You&apos;re a hero of the digital ecosystem!
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Browse by category</h2>
        {query && (
          <span className="text-xs font-semibold text-green-800 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">
            Search &quot;{query}&quot;
          </span>
        )}
      </div>
      <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
        {CATEGORY_TABS.map((cat) => {
          const active = cat === activeCategory;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={
                active
                  ? "px-6 py-2.5 rounded-full font-bold whitespace-nowrap bg-green-800 text-white shadow-md border border-green-900 transition-all duration-200 scale-[1.02]"
                  : "px-6 py-2.5 rounded-full font-bold whitespace-nowrap bg-white text-gray-600 hover:bg-[#eef3e8] border border-[#d4dec4] transition-colors duration-200"
              }
            >
              {cat}
            </button>
          );
        })}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="bg-[#eef3e8] border border-[#d4dec4] rounded-3xl p-12 text-center">
          <p className="text-gray-700 font-semibold mb-1">Tidak ada produk untuk filter ini.</p>
          <p className="text-sm text-gray-500 font-medium">Coba ubah kategori atau kosongkan pencarian di bilah atas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={{ ...product, image: getDynamicImage(product.name) }} />
          ))}
        </div>
      )}

      <div className="mt-10 flex justify-end">
        <div className="bg-[#ebd9d1]/80 px-6 py-4 rounded-full flex items-center gap-3 shadow-sm border border-[#e1cfc7]">
          <div className="bg-green-800 rounded-full p-2 text-white shrink-0">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#8e6856] uppercase tracking-wider">GLOBAL IMPACT</p>
            <p className="text-gray-900 font-extrabold text-sm">450kg waste saved today</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardFallback() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-800"></div>
    </div>
  );
}

export default function BuyerDashboardPage() {
  return (
    <Suspense fallback={<DashboardFallback />}>
      <BuyerDashboardContent />
    </Suspense>
  );
}
