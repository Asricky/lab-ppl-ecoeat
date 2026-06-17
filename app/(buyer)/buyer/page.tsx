"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import ProductCard from "@/components/buyer/ProductCard";
import { useGlobalStore } from "@/store/globalStore";
import { useEcoPayStore } from "@/store/ecoPayStore";
import { useBuyerOrdersStore } from "@/store/buyerOrdersStore";
import Link from "next/link";
import { Clock, MapPin, Wallet, Leaf, ArrowRight, Truck, Package } from "lucide-react";

// getDynamicImage removed as we use image from store

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
  
  const balance = useEcoPayStore((s) => s.balance);
  const orders = useBuyerOrdersStore((s) => s.orders);
  const activeOrders = useMemo(() => orders.filter(o => o.tab === 'Active Orders'), [orders]);
  const latestOrder = activeOrders[0];
  
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Active Order Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#e1e8d5] flex flex-col relative overflow-hidden group hover:border-[#388e3c]/30 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-[#eef3e8] p-3 rounded-2xl text-green-700">
              {latestOrder?.deliveryMethod === 'pickup' ? <Package className="w-6 h-6" /> : <Truck className="w-6 h-6" />}
            </div>
            {latestOrder && (
              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                {latestOrder.statusLabel}
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">Pesanan Aktif</h3>
          {latestOrder ? (
            <>
              <p className="text-gray-500 font-medium text-sm mb-4 line-clamp-1">{latestOrder.vendorName} • {latestOrder.lines.length} items</p>
              <div className="mt-auto bg-[#f4f7ed] rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Estimasi Tiba</p>
                  <p className="font-bold text-gray-900 text-sm flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1.5 text-green-700" />
                    {latestOrder.estimatedArrivalLabel || "Menunggu konfirmasi"}
                  </p>
                </div>
                <Link href={`/buyer/tracking/${latestOrder.id}`} className="w-8 h-8 rounded-full bg-green-700 text-white flex items-center justify-center hover:bg-green-800 transition-colors shadow-sm">
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-500 font-medium text-sm mb-4">Belum ada pesanan aktif saat ini.</p>
              <div className="mt-auto pt-4 border-t border-gray-100">
                <Link href="/buyer/orders" className="text-sm font-bold text-green-700 hover:text-green-800 flex items-center">
                  Lihat Riwayat Pesanan <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </>
          )}
        </div>

        {/* EcoPay Balance Card */}
        <div className="bg-[#388e3c] rounded-3xl p-6 text-white relative overflow-hidden shadow-sm border border-[#2e7d32] flex flex-col">
          <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-green-500 rounded-full opacity-40 blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-white/20 p-3 rounded-2xl text-white backdrop-blur-sm">
                <Wallet className="w-6 h-6" />
              </div>
              <span className="bg-white/20 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-sm">
                ECOPAY
              </span>
            </div>
            <h3 className="text-xl font-medium text-green-50 mb-1">Saldo Tersedia</h3>
            <p className="text-3xl font-extrabold mb-4" suppressHydrationWarning>
              Rp{balance.toLocaleString('id-ID')}
            </p>
            <div className="mt-auto flex gap-2">
              <Link href="/buyer/profile?tab=topup" className="flex-1 bg-white text-green-800 text-center font-bold py-3 rounded-xl hover:bg-green-50 transition-colors shadow-sm text-sm">
                Top Up
              </Link>
              <Link href="/buyer/profile?tab=ecopay" className="w-12 bg-green-800/50 text-white flex items-center justify-center rounded-xl hover:bg-green-800 transition-colors shadow-sm backdrop-blur-sm border border-white/10">
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Eco Impact Card */}
        <div className="bg-[#eef3e8] rounded-3xl p-6 relative overflow-hidden shadow-sm border border-[#d4dec4] flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-white p-3 rounded-2xl text-green-700 shadow-sm">
              <Leaf className="w-6 h-6" />
            </div>
            <span className="bg-green-100 text-green-800 border border-green-200 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
              IMPACT
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">Pahlawan Makanan!</h3>
          <p className="text-gray-600 font-medium text-sm leading-relaxed mb-4">
            Pilihan Anda mencegah <span className="font-bold text-green-800">3.2kg CO2</span> minggu ini.
          </p>
          <div className="mt-auto flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm border border-[#e1e8d5]">
            <div className="flex items-center">
              <span className="text-2xl mr-2 font-extrabold text-green-700">5</span>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-tight">Makanan<br/>Diselamatkan</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
              <span className="text-sm">🌱</span>
            </div>
          </div>
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
