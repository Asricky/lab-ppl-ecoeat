"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter, notFound } from "next/navigation";
import {
  Leaf,
  Clock,
  MapPin,
  Box,
  Utensils,
  ShieldCheck,
  ShoppingCart,
  Star,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useReviewStore } from "@/store/reviewStore";
import { useGlobalStore } from "@/store/globalStore";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Parse "Rp 25.000" atau "Rp25000" → angka integer Rupiah penuh */
function parseRpString(str: string | undefined | null): number {
  if (!str || str === "Free") return 0;
  const digits = str.replace(/[^0-9]/g, "");
  return parseInt(digits, 10) || 0;
}

/** Format angka Rupiah penuh → "Rp25.000" */
function formatRp(amount: number): string {
  return "Rp" + amount.toLocaleString("id-ID");
}

/**
 * Pilih gambar terbaik dari data produk globalStore.
 * Gambar di globalStore berukuran 100×100 — ganti dengan versi resolusi tinggi.
 */
function getHighResImage(rawUrl: string, productName: string): string {
  if (rawUrl && rawUrl.trim() !== "") {
    // Unsplash: ganti parameter w/h ke resolusi besar
    return rawUrl
      .replace(/w=\d+/, "w=800")
      .replace(/h=\d+/, "h=800")
      .replace(/q=\d+/, "q=80");
  }
  // Fallback berdasarkan nama produk
  const name = productName.toLowerCase();
  if (name.includes("roti") || name.includes("croissant") || name.includes("bakery"))
    return "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80";
  if (name.includes("nasi") || name.includes("ayam") || name.includes("rice"))
    return "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&auto=format&fit=crop&q=80";
  if (name.includes("keripik") || name.includes("snack") || name.includes("pisang"))
    return "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&auto=format&fit=crop&q=80";
  if (name.includes("kopi") || name.includes("drink") || name.includes("es"))
    return "https://images.unsplash.com/photo-1495147466023-ff5a443385f5?w=800&auto=format&fit=crop&q=80";
  return "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80";
}

// ---------------------------------------------------------------------------
// Komponen utama
// ---------------------------------------------------------------------------

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = typeof params.id === "string" ? params.id : (params.id?.[0] ?? "");

  // Ambil data produk dari globalStore berdasarkan ID dari URL
  const allProducts = useGlobalStore((s) => s.products);
  const rawProduct = useMemo(
    () => allProducts.find((p) => p.id === productId) ?? null,
    [allProducts, productId]
  );

  const addItem = useCartStore((s) => s.addItem);
  const allReviews = useReviewStore((s) => s.reviews);

  // ---------------------------------------------------------------------------
  // Normalisasi data — dihitung sebelum hook state agar tidak ada hook kondisional
  // ---------------------------------------------------------------------------
  const hargaAsli = parseRpString(rawProduct?.originalPrice ?? rawProduct?.price);
  const hargaJual = parseRpString(rawProduct?.price);
  const discountPercentage =
    rawProduct?.discountPercent ??
    (hargaAsli > hargaJual && hargaAsli > 0
      ? Math.round(((hargaAsli - hargaJual) / hargaAsli) * 100)
      : 0);

  const mainImageUrl = getHighResImage(rawProduct?.image ?? "", rawProduct?.name ?? "");

  // Galeri: gambar utama + fallback berbasis nama produk (dedup)
  const galleryImages: string[] = useMemo(() => {
    const imgs = [
      mainImageUrl,
      getHighResImage("", rawProduct?.name ?? ""),
    ];
    return imgs.filter((v, i, arr) => arr.indexOf(v) === i);
  }, [mainImageUrl, rawProduct?.name]);

  // Semua useState WAJIB di atas early return — Rules of Hooks
  const [mainImg, setMainImg] = useState<string>(() => galleryImages[0] ?? "");
  const [qty, setQty] = useState(1);
  const [showToast, setShowToast] = useState(false);

  const reviews = useMemo(
    () => allReviews.filter((r: any) => r.productId === productId),
    [allReviews, productId]
  );
  const avgRating =
    reviews.length
      ? (reviews.reduce((acc: any, r: any) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

  // Jika ID tidak ditemukan di store → tampilkan 404 (setelah semua hooks)
  if (!rawProduct) {
    return (
      <div className="max-w-6xl mx-auto pb-12 pt-16 text-center">
        <p className="text-2xl font-bold text-gray-500">Produk tidak ditemukan.</p>
        <button
          onClick={() => router.push("/buyer")}
          className="mt-6 px-6 py-3 bg-green-700 text-white rounded-xl font-bold hover:bg-green-800 transition-colors"
        >
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  const vendorName: string = rawProduct.seller ?? rawProduct.vendor ?? "EcoEat Vendor";
  const expiresIn: string = rawProduct.expiry ?? rawProduct.expiresIn ?? "–";
  const distance: number = rawProduct.distance ?? 1.2;

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------
  const productForCart = {
    id: rawProduct.id,
    name: rawProduct.name,
    price: hargaAsli,
    discountPrice: hargaJual,
    discountPercentage,
    vendor: vendorName,
    distance,
    expiresIn,
    image: mainImageUrl,
    category: rawProduct.category,
  };

  const handleAddToCart = () => {
    addItem({ ...productForCart, quantity: qty });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleBuyNow = () => {
    addItem({ ...productForCart, quantity: qty });
    router.push("/buyer/checkout");
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex flex-col lg:flex-row gap-12 mb-16">

        {/* ── Gallery ── */}
        <div className="w-full lg:w-1/2">
          <div className="bg-white rounded-3xl overflow-hidden aspect-square mb-4 shadow-sm border border-[#eef3e8]">
            <img
              src={mainImg}
              alt={rawProduct.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.src = "/images/garden-bg.png"; }}
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {galleryImages.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setMainImg(img)}
                className={`aspect-square rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${
                  mainImg === img
                    ? "border-green-600 shadow-md"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={img}
                  alt={`Thumb ${idx + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = "/images/garden-bg.png"; }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Info ── */}
        <div className="w-full lg:w-1/2 flex flex-col">
          {/* Badges */}
          <div className="flex items-center space-x-3 mb-4">
            {discountPercentage > 0 && (
              <span className="bg-[#fde8e8] text-red-700 text-xs font-bold px-2 py-1 rounded-md">
                -{discountPercentage}%
              </span>
            )}
            <span className="text-gray-500 text-xs font-bold tracking-widest uppercase bg-[#e1e8d5] px-3 py-1 rounded-full">
              Surplus Rescue
            </span>
            <span className="bg-[#eef3e8] text-green-800 text-xs font-bold px-3 py-1 rounded-full flex items-center shadow-sm">
              <Leaf className="w-3 h-3 mr-1 text-green-600" /> Saves 1.2kg CO2e
            </span>
          </div>

          {/* Judul — dinamis dari data produk */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            {rawProduct.name}
          </h1>

          {/* Harga — dinamis, tanpa teks "per kg" statis */}
          <div className="flex items-baseline space-x-3 mb-8">
            <span className="text-4xl font-extrabold text-green-700">
              {formatRp(hargaJual)}
            </span>
            {hargaAsli > hargaJual && (
              <span className="text-xl text-gray-400 line-through font-medium">
                {formatRp(hargaAsli)}
              </span>
            )}
          </div>

          {/* Expires widget */}
          <div className="bg-red-50 border border-red-100 rounded-2xl p-5 mb-8 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-600" />
            <div className="flex justify-between items-center mb-3 ml-2">
              <div className="flex items-center text-red-700 font-bold">
                <Clock className="w-5 h-5 mr-2" /> Expires: {expiresIn}
              </div>
              <div className="flex space-x-2">
                <span className="bg-white text-gray-600 text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider">
                  Near Expiry
                </span>
                <span className="bg-white text-gray-600 text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider">
                  Surplus
                </span>
              </div>
            </div>
            <div className="w-full bg-red-200 rounded-full h-1.5 mb-2 ml-2 pr-4">
              <div className="bg-red-600 h-1.5 rounded-full" style={{ width: "15%" }} />
            </div>
            <p className="text-right text-[10px] font-bold text-red-700 uppercase tracking-wider pr-2">
              Only {rawProduct.stock ?? 4} left - Selling Fast!
            </p>
          </div>

          {/* Vendor — dinamis dari data produk */}
          <div className="bg-[#eef3e8] rounded-2xl p-5 mb-6 flex items-center justify-between border border-[#d4dec4] shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="bg-white p-3 rounded-xl text-green-700 shadow-sm border border-[#e1e8d5]">
                <Leaf className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{vendorName}</h3>
                <p className="text-xs text-gray-500 flex items-center mt-1 font-medium">
                  <MapPin className="w-3 h-3 mr-1" /> Local Vendor · EcoEat Partner
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-green-800 font-extrabold text-sm">{distance} miles away</div>
              <div className="text-[10px] text-green-700 font-bold uppercase tracking-wider mt-1">
                Local Vendor
              </div>
            </div>
          </div>

          {/* Deskripsi produk */}
          {rawProduct.description && (
            <div className="bg-white rounded-2xl p-6 mb-8 border border-[#eef3e8] shadow-sm">
              <h4 className="flex items-center font-bold text-gray-900 mb-3 text-sm">
                <Box className="w-4 h-4 mr-2 text-gray-500" /> Deskripsi Produk
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                {rawProduct.description}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-auto">
            <div className="flex items-center bg-[#eef3e8] rounded-full border border-[#d4dec4] w-full sm:w-auto p-1">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-5 py-2 text-gray-600 hover:text-green-800 transition-colors font-bold text-lg"
              >
                −
              </button>
              <span className="w-8 text-center font-bold text-gray-900">{qty}</span>
              <button
                onClick={() => setQty(Math.min(rawProduct.stock ?? 99, qty + 1))}
                className="px-5 py-2 text-gray-600 hover:text-green-800 transition-colors font-bold text-lg"
              >
                +
              </button>
            </div>

            <div className="flex w-full flex-col sm:flex-row gap-3 ml-auto sm:justify-end mt-4 sm:mt-0">
              <button
                onClick={handleAddToCart}
                className="w-full sm:w-auto sm:min-w-[160px] flex-1 max-w-full sm:max-w-[200px] bg-[#388e3c] hover:bg-[#2e7d32] text-white font-bold py-4 rounded-xl transition-colors shadow-md flex justify-center items-center"
              >
                <ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="w-full sm:w-auto sm:min-w-[160px] flex-1 max-w-full sm:max-w-[200px] bg-white hover:bg-green-50 text-green-800 border-2 border-[#388e3c] font-bold py-4 rounded-xl transition-colors shadow-sm flex justify-center items-center"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Customer Reviews ── */}
      <div className="mb-16">
        <div className="flex items-center space-x-4 mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Customer Reviews</h2>
          <div className="bg-[#eef3e8] border border-[#d4dec4] px-4 py-2 rounded-xl flex items-center space-x-2 shadow-sm">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <span className="font-extrabold text-gray-900 text-lg">
              {avgRating}
              <span className="text-sm text-gray-500 font-medium">/5</span>
            </span>
            <span className="text-sm text-gray-500 font-medium ml-2">
              ({reviews.length} reviews)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev: any) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl p-6 border border-[#eef3e8] shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-extrabold text-gray-900 text-base">{rev.userName}</h4>
                  <p
                    className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5"
                    suppressHydrationWarning
                  >
                    {new Date(rev.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex space-x-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < rev.rating
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                &ldquo;{rev.comment}&rdquo;
              </p>
            </div>
          ))}
          {reviews.length === 0 && (
            <div className="col-span-full bg-[#f4f7ed] rounded-3xl p-8 border border-[#d4dec4] text-center shadow-sm">
              <p className="text-gray-500 font-medium text-sm">
                Belum ada ulasan untuk produk ini.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Why Rescue ── */}
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8">
        Why rescue this produce?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#eef3e8] rounded-3xl p-8 border border-[#d4dec4] shadow-sm">
          <Leaf className="w-8 h-8 text-green-800 mb-5" />
          <h3 className="font-extrabold text-green-900 text-lg mb-3">Environmental Impact</h3>
          <p className="text-sm text-green-800/80 leading-relaxed font-medium">
            Every rescue prevents methane emissions from landfill waste and honors the water and
            soil used in growth.
          </p>
        </div>
        <div className="bg-[#eef3e8] rounded-3xl p-8 border border-[#d4dec4] shadow-sm">
          <Utensils className="w-8 h-8 text-gray-700 mb-5" />
          <h3 className="font-extrabold text-gray-900 text-lg mb-3">Perfect for Cooking</h3>
          <p className="text-sm text-gray-600 leading-relaxed font-medium">
            Surplus food near expiry is often at peak flavor — ideal for home cooking, meal prep,
            or artisanal recipes.
          </p>
        </div>
        <div className="bg-[#eef3e8] rounded-3xl p-8 border border-[#d4dec4] shadow-sm">
          <ShieldCheck className="w-8 h-8 text-green-800 mb-5" />
          <h3 className="font-extrabold text-gray-900 text-lg mb-3">Quality Guarantee</h3>
          <p className="text-sm text-gray-600 leading-relaxed font-medium">
            Inspected daily by our regional advocates to ensure that &apos;near expiry&apos; never
            means &apos;low quality&apos;.
          </p>
        </div>
      </div>

      {/* ── Toast Notifikasi ── */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-green-800 text-white px-6 py-3 rounded-full shadow-xl font-bold flex items-center z-50 animate-bounce">
          <ShoppingCart className="w-5 h-5 mr-2" />
          Produk berhasil ditambahkan ke keranjang!
        </div>
      )}
    </div>
  );
}
