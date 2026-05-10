"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import ProductCard from "@/components/buyer/ProductCard";

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

const products: ProductTile[] = [
  {
    id: "1",
    name: "Mediterranean Bowl",
    price: 14,
    discountPrice: 7,
    discountPercentage: 50,
    vendor: "Green Garden Deli",
    distance: 0.4,
    expiresIn: "3 HOURS",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Meals",
  },
  {
    id: "2",
    name: "Artisan Sourdough",
    price: 8.5,
    discountPrice: 2.55,
    discountPercentage: 70,
    vendor: "Hearth & Grain",
    distance: 1.2,
    expiresIn: "1 HOUR",
    image: "https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Bakery",
  },
  {
    id: "3",
    name: "Pastry Surprise Box",
    price: 12,
    discountPrice: 7.2,
    discountPercentage: 40,
    vendor: "Sweet Haven",
    distance: 0.8,
    expiresIn: "6 HOURS",
    image: "https://images.unsplash.com/photo-1495147466023-ff5a443385f5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Bakery",
  },
  {
    id: "4",
    name: "Green Vitality Juice",
    price: 9,
    discountPrice: 3.6,
    discountPercentage: 60,
    vendor: "Pure Press",
    distance: 2.5,
    expiresIn: "2 HOURS",
    image: "https://images.unsplash.com/photo-1622597467836-f38240662c8c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Drinks",
  },
  {
    id: "5",
    name: "Crunch Granola Cup",
    price: 6,
    discountPrice: 3,
    discountPercentage: 50,
    vendor: "Hearth & Grain",
    distance: 1,
    expiresIn: "4 HOURS",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&auto=format&fit=crop&q=60",
    category: "Snacks",
  },
  {
    id: "6",
    name: "Cold Brew Duo",
    price: 11,
    discountPrice: 5.5,
    discountPercentage: 50,
    vendor: "Ocean Fresh Café",
    distance: 2.1,
    expiresIn: "5 HOURS",
    image: "https://images.unsplash.com/photo-1541167760496-bcad86446031?w=500&auto=format&fit=crop&q=60",
    category: "Drinks",
  },
  {
    id: "7",
    name: "Savory Rice Bowl",
    price: 13,
    discountPrice: 6.5,
    discountPercentage: 50,
    vendor: "Community Kitchen",
    distance: 0.6,
    expiresIn: "2 HOURS",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&auto=format&fit=crop&q=60",
    category: "Meals",
  },
  {
    id: "8",
    name: "Mini Cookie Mix",
    price: 7,
    discountPrice: 2.8,
    discountPercentage: 60,
    vendor: "Sweet Haven",
    distance: 1.8,
    expiresIn: "7 HOURS",
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&auto=format&fit=crop&q=60",
    category: "Snacks",
  },
];

function DashboardFallback() {
  return (
    <div className="max-w-7xl mx-auto pb-12 animate-pulse space-y-8">
      <div className="h-28 bg-[#eef3e8] rounded-2xl" />
      <div className="h-44 bg-green-900/30 rounded-3xl" />
      <div className="h-14 bg-[#eef3e8] rounded-full max-w-xl" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-64 bg-[#eef3e8] rounded-3xl border border-[#d4dec4]" />
        ))}
      </div>
    </div>
  );
}

function BuyerDashboardContent() {
  const user = useAuthStore((s) => s.user);
  const [activeCategory, setActiveCategory] = useState<CategoryTab>("All Surplus");

  const searchParams = useSearchParams();
  const query = (searchParams.get("q") || "").trim().toLowerCase();

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = activeCategory === "All Surplus" || p.category === activeCategory;
      const matchesQuery = !query || p.name.toLowerCase().includes(query) || p.vendor.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

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
            <ProductCard key={product.id} product={product} />
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

export default function BuyerDashboardPage() {
  return (
    <Suspense fallback={<DashboardFallback />}>
      <BuyerDashboardContent />
    </Suspense>
  );
}
