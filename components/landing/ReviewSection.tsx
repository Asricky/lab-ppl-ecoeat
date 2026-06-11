"use client";

import React from "react";

export default function ReviewSection() {
  return (
    <section id="review" className="py-24 bg-[#F5FCED] relative z-10 w-full scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#6B7D4F]">
            Testimoni & Dampak Sosial
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#142017] tracking-tight">
            Apa Kata <span className="text-[#0F5A2A]">Mereka?</span>
          </h2>
          <p className="text-[#66735F] font-semibold text-sm max-w-lg mx-auto leading-relaxed">
            Dengar cerita inspiratif dari para pembeli, pelaku usaha kuliner, dan lembaga sosial yang telah berdampak nyata bersama EcoEat.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Buyer Testimonial */}
          <div
            className="bg-white rounded-3xl p-8 shadow-ambient flex flex-col justify-between hover:translate-y-[-6px] transition-all duration-300 border-t-4 border-[#0F5A2A]/40"
            style={{ boxShadow: "0 18px 50px rgba(15, 90, 42, 0.05)" }}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-1 text-[#F4B942] text-sm">
                ★ ★ ★ ★ ★
              </div>
              <p className="text-sm font-medium text-[#142017] leading-relaxed italic">
                "Saya bisa menghemat pengeluaran bulanan hingga 40% sekaligus berkontribusi mengurangi sampah makanan. Makanan dari EcoEat selalu enak, bersih, dan sangat layak makan!"
              </p>
            </div>
            <div className="flex items-center gap-4 mt-8 pt-6 border-t border-[#EEF8E7]">
              <div className="w-10 h-10 rounded-full bg-[#0F5A2A]/10 text-[#0F5A2A] font-extrabold flex items-center justify-center text-sm shrink-0">
                AD
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-[#142017]">Aditama</h4>
                <p className="text-[10px] font-extrabold text-[#66735F] uppercase tracking-wider">Buyer (Penyelamat Makanan)</p>
              </div>
            </div>
          </div>

          {/* Seller Testimonial */}
          <div
            className="bg-white rounded-3xl p-8 shadow-ambient flex flex-col justify-between hover:translate-y-[-6px] transition-all duration-300 border-t-4 border-[#1F8A4C]/40"
            style={{ boxShadow: "0 18px 50px rgba(15, 90, 42, 0.05)" }}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-1 text-[#F4B942] text-sm">
                ★ ★ ★ ★ ★
              </div>
              <p className="text-sm font-medium text-[#142017] leading-relaxed italic">
                "Dulu sisa roti hari ini terbuang percuma begitu saja. Sekarang kami bisa menjualnya kembali sebagai produk surplus di EcoEat. Sangat membantu menekan kerugian!"
              </p>
            </div>
            <div className="flex items-center gap-4 mt-8 pt-6 border-t border-[#EEF8E7]">
              <div className="w-10 h-10 rounded-full bg-[#1F8A4C]/10 text-[#1F8A4C] font-extrabold flex items-center justify-center text-sm shrink-0">
                TL
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-[#142017]">Toko Lestari</h4>
                <p className="text-[10px] font-extrabold text-[#66735F] uppercase tracking-wider">Seller (Mitra Kuliner)</p>
              </div>
            </div>
          </div>

          {/* LKS Testimonial */}
          <div
            className="bg-white rounded-3xl p-8 shadow-ambient flex flex-col justify-between hover:translate-y-[-6px] transition-all duration-300 border-t-4 border-[#F4B942]/40"
            style={{ boxShadow: "0 18px 50px rgba(15, 90, 42, 0.05)" }}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-1 text-[#F4B942] text-sm">
                ★ ★ ★ ★ ★
              </div>
              <p className="text-sm font-medium text-[#142017] leading-relaxed italic">
                "Donasi surplus makanan dari mitra EcoEat sangat membantu mencukupi kebutuhan gizi sehat adik-adik di panti asuhan kami secara teratur. Terima kasih banyak!"
              </p>
            </div>
            <div className="flex items-center gap-4 mt-8 pt-6 border-t border-[#EEF8E7]">
              <div className="w-10 h-10 rounded-full bg-[#F4B942]/20 text-[#0F5A2A] font-extrabold flex items-center justify-center text-sm shrink-0">
                PK
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-[#142017]">Panti Kasih</h4>
                <p className="text-[10px] font-extrabold text-[#66735F] uppercase tracking-wider">LKS (Lembaga Sosial)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
