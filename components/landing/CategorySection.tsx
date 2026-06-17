"use client";

import React from "react";
import { Utensils, Cookie, ShoppingBag, GlassWater, ArrowRight } from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
  {
    id: "meals",
    title: "Meals",
    subtitle: "Makanan Siap Saji",
    desc: "Bento box, paket nasi goreng, masakan rumahan, dan porsi katering berlebih yang dijamin hangat serta higienis.",
    icon: Utensils,
    color: "bg-emerald-50 text-emerald-800",
    bgHover: "hover:bg-emerald-50/50",
  },
  {
    id: "bakery",
    title: "Bakery",
    subtitle: "Roti & Pastry",
    desc: "Croissant premium, donat, roti tawar gandum, dan kue artisan segar langsung dari outlet bakery menjelang jam tutup.",
    icon: Cookie,
    color: "bg-amber-50 text-amber-800",
    bgHover: "hover:bg-amber-50/50",
  },
  {
    id: "groceries",
    title: "Groceries",
    subtitle: "Bahan Pangan",
    desc: "Sayur organik, buah musiman segar, produk susu, serta bahan pokok yang melimpah namun aman dikonsumsi.",
    icon: ShoppingBag,
    color: "bg-green-50 text-green-800",
    bgHover: "hover:bg-green-50/50",
  },
  {
    id: "beverage",
    title: "Beverage",
    subtitle: "Minuman Segar",
    desc: "Cold-pressed juice, kopi botolan, teh herbal, dan yogurt dingin dengan masa simpan terbatas dengan diskon ekstra.",
    icon: GlassWater,
    color: "bg-sky-50 text-sky-800",
    bgHover: "hover:bg-sky-50/50",
  },
];

export default function CategorySection() {
  return (
    <section id="kategori" className="py-24 bg-[#F5FCED] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#6B7D4F]">
            Eksplorasi Surplus Makanan
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#142017] tracking-tight">
            Berbagai Pilihan Kategori Makanan
          </h2>
          <p className="text-sm sm:text-base text-[#66735F] leading-relaxed font-medium">
            Temukan makanan berkualitas tinggi dari mitra terbaik kami yang siap Anda selamatkan hari ini.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                className="bg-white rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-2 hover:shadow-ambient group border-t-4 border-transparent hover:border-[#0F5A2A]"
                style={{ boxShadow: "0 10px 30px rgba(20, 32, 23, 0.04)" }}
              >
                <div>
                  {/* Icon Block */}
                  <div className={`w-14 h-14 rounded-2xl ${cat.color} flex items-center justify-center mb-6 shrink-0 shadow-sm`}>
                    <Icon size={28} />
                  </div>

                  <span className="text-xs font-bold text-[#6B7D4F] uppercase tracking-wider">
                    {cat.title}
                  </span>
                  <h3 className="text-xl font-extrabold text-[#142017] mt-1 mb-3">
                    {cat.subtitle}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#66735F] leading-relaxed font-medium">
                    {cat.desc}
                  </p>
                </div>

                <div className="mt-8 pt-4">
                  <Link
                    href={`/login?category=${cat.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0F5A2A] hover:text-[#2F8A49] transition-colors"
                  >
                    <span>Mulai Cari</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Callout box inside Category */}
        <div className="mt-16 bg-[#EEF8E7] rounded-3xl p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 max-w-2xl">
            <h3 className="text-xl md:text-2xl font-extrabold text-[#142017] tracking-tight">
              Ingin menyelamatkan makanan berlebih dari toko favorit Anda?
            </h3>
            <p className="text-xs md:text-sm text-[#66735F] font-bold">
              Daftar sekarang untuk menerima notifikasi harian saat merchant terdekat memiliki surplus makanan.
            </p>
          </div>
          <Link
            href="/register"
            className="bg-[#0F5A2A] hover:bg-[#2F8A49] text-white px-8 py-4 rounded-full font-bold transition-all text-sm shadow-ambient shrink-0"
          >
            Mulai Sekarang
          </Link>
        </div>
      </div>
    </section>
  );
}
