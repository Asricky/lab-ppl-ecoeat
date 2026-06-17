"use client";

import React from "react";
import { Leaf, Flame, ShieldAlert, Award, Globe, Heart } from "lucide-react";

export default function ImpactSection() {
  return (
    <section id="dampak" className="py-24 bg-[#EEF8E7] scroll-mt-20 relative overflow-hidden">
      {/* Background shape */}
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-white/30 rounded-full blur-3xl -translate-y-1/2 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#0F5A2A]">
            Dampak Keberlanjutan & Ekologis
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#142017] tracking-tight">
            Laporan Dampak Nyata Lingkungan Kami
          </h2>
          <p className="text-sm sm:text-base text-[#66735F] leading-relaxed font-medium">
            Setiap porsi makanan yang Anda selamatkan memberikan kontribusi besar dalam menekan pemanasan global dan mendukung kesejahteraan sosial.
          </p>
        </div>

        {/* Impact Statistics Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Stat Card 1 */}
          <div
            className="bg-white rounded-3xl p-8 text-center transition-all duration-300 transform hover:-translate-y-1"
            style={{ boxShadow: "0 10px 30px rgba(20, 32, 23, 0.04)" }}
          >
            <div className="w-12 h-12 rounded-full bg-[#1F8A4C]/10 text-[#1F8A4C] flex items-center justify-center mx-auto mb-6 shrink-0">
              <Leaf size={24} fill="currentColor" className="opacity-80" />
            </div>
            <p className="text-4xl sm:text-5xl font-black text-[#142017] tracking-tight">
              52.418+
            </p>
            <h4 className="text-base font-extrabold text-[#0F5A2A] mt-2 mb-3">Porsi Makanan Diselamatkan</h4>
            <p className="text-xs sm:text-sm text-[#66735F] leading-relaxed font-medium">
              Makanan surplus berkualitas tinggi berhasil diselamatkan dari pembuangan sia-sia dan tersalurkan ke meja makan keluarga Indonesia.
            </p>
          </div>

          {/* Stat Card 2 */}
          <div
            className="bg-white rounded-3xl p-8 text-center transition-all duration-300 transform hover:-translate-y-1"
            style={{ boxShadow: "0 10px 30px rgba(20, 32, 23, 0.04)" }}
          >
            <div className="w-12 h-12 rounded-full bg-[#B3261E]/10 text-[#B3261E] flex items-center justify-center mx-auto mb-6 shrink-0">
              <Flame size={24} fill="currentColor" className="opacity-80" />
            </div>
            <p className="text-4xl sm:text-5xl font-black text-[#142017] tracking-tight">
              125,8 T
            </p>
            <h4 className="text-base font-extrabold text-[#0F5A2A] mt-2 mb-3">Emisi Gas CO₂ Dicegah</h4>
            <p className="text-xs sm:text-sm text-[#66735F] leading-relaxed font-medium">
              Mencegah produksi gas metana berbahaya dari pembusukan sisa zat organik di TPA yang memperparah efek rumah kaca global.
            </p>
          </div>

          {/* Stat Card 3 */}
          <div
            className="bg-white rounded-3xl p-8 text-center transition-all duration-300 transform hover:-translate-y-1"
            style={{ boxShadow: "0 10px 30px rgba(20, 32, 23, 0.04)" }}
          >
            <div className="w-12 h-12 rounded-full bg-[#F4B942]/10 text-[#F4B942] flex items-center justify-center mx-auto mb-6 shrink-0">
              <Globe size={24} />
            </div>
            <p className="text-4xl sm:text-5xl font-black text-[#142017] tracking-tight">
              1,4 M+
            </p>
            <h4 className="text-base font-extrabold text-[#0F5A2A] mt-2 mb-3">Rupiah Anggaran Dihemat</h4>
            <p className="text-xs sm:text-sm text-[#66735F] leading-relaxed font-medium">
              Membantu meringankan beban finansial pengeluaran konsumsi bulanan rumah tangga pembeli lewat penjualan harga ekonomis.
            </p>
          </div>
        </div>

        {/* SDG Support Showcase Section */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-card" style={{ boxShadow: "0 10px 30px rgba(20, 32, 23, 0.04)" }}>
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <h3 className="text-2xl font-extrabold text-[#142017] tracking-tight">
              Komitmen Terhadap UN SDG 2 & 12
            </h3>
            <p className="text-xs sm:text-sm text-[#66735F] font-semibold uppercase tracking-wider">
              United Nations Sustainable Development Goals
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* SDG 2 Card */}
            <div className="flex gap-4 items-start bg-[#F5FCED] p-6 rounded-2xl">
              <div className="w-12 h-12 rounded-2xl bg-[#0F5A2A] text-white flex items-center justify-center shrink-0 shadow-md">
                <Heart size={24} fill="currentColor" />
              </div>
              <div className="text-left space-y-2">
                <span className="text-[10px] font-black text-[#0F5A2A] uppercase tracking-widest bg-[#EEF8E7] px-2.5 py-1 rounded-lg border border-[#0F5A2A]/10">
                  SDG 2 — Zero Hunger
                </span>
                <h4 className="text-lg font-extrabold text-[#142017] tracking-tight">Cegah Kelaparan Melalui Kolaborasi LKS</h4>
                <p className="text-xs sm:text-sm text-[#66735F] leading-relaxed font-medium">
                  EcoEat menjamin surplus makanan layak konsumsi yang disumbangkan oleh mitra toko disalurkan dengan aman ke Lembaga Kesejahteraan Sosial (LKS), panti asuhan, dan keluarga membutuhkan secara tepat sasaran.
                </p>
              </div>
            </div>

            {/* SDG 12 Card */}
            <div className="flex gap-4 items-start bg-[#F5FCED] p-6 rounded-2xl">
              <div className="w-12 h-12 rounded-2xl bg-[#0F5A2A] text-white flex items-center justify-center shrink-0 shadow-md">
                <Award size={24} />
              </div>
              <div className="text-left space-y-2">
                <span className="text-[10px] font-black text-[#0F5A2A] uppercase tracking-widest bg-[#EEF8E7] px-2.5 py-1 rounded-lg border border-[#0F5A2A]/10">
                  SDG 12 — Responsible Consumption
                </span>
                <h4 className="text-lg font-extrabold text-[#142017] tracking-tight">Produksi & Konsumsi Berkelanjutan</h4>
                <p className="text-xs sm:text-sm text-[#66735F] leading-relaxed font-medium">
                  Mengembangkan ekonomi sirkular dengan meredistribusi makanan berlebih sebelum basi. Sistem manajemen stok digital kami menekan pemborosan sumber daya dan mendidik masyarakat untuk mengonsumsi secara bertanggung jawab.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
