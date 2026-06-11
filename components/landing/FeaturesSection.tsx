"use client";

import React from "react";
import { Search, Truck, ShieldCheck, MapPin, Gift, HeartHandshake } from "lucide-react";

const STEPS = [
  {
    title: "1. Eksplor & Pilih",
    desc: "Buka peta interaktif EcoEat untuk memantau makanan surplus berkualitas di sekitar lokasi Anda yang siap diselamatkan dengan diskon hingga 70%.",
    icon: Search,
  },
  {
    title: "2. Pengantaran atau Ambil",
    desc: "Pilih opsi praktis untuk mengambil sendiri makanan langsung ke merchant (Self-pickup) atau menggunakan layanan kurir handal EcoEat.",
    icon: Truck,
  },
  {
    title: "3. Transaksi Aman (EcoPay)",
    desc: "Bayar secara digital dengan saldo EcoPay yang dilindungi escrow. Dana baru akan diteruskan ke penjual setelah makanan berada di tangan Anda.",
    icon: ShieldCheck,
  },
];

export default function FeaturesSection() {
  return (
    <section id="fitur" className="py-24 bg-[#F5FCED] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#6B7D4F]">
            Alur Penyelamatan Makanan
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#142017] tracking-tight">
            Sistem Cerdas Penyelamat Makanan
          </h2>
          <p className="text-sm sm:text-base text-[#66735F] leading-relaxed font-medium">
            EcoEat dirancang dengan alur transaksi yang aman, instan, dan mudah untuk semua kalangan pengguna.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-8 transition-all duration-300 transform hover:-translate-y-1"
                style={{ boxShadow: "0 10px 30px rgba(20, 32, 23, 0.04)" }}
              >
                <div className="w-12 h-12 rounded-2xl bg-[#EEF8E7] text-[#0F5A2A] flex items-center justify-center mb-6 shrink-0 shadow-sm">
                  <Icon size={24} />
                </div>
                <h3 className="text-lg font-extrabold text-[#142017] mb-3">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#66735F] leading-relaxed font-medium">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Roles Highlight */}
        <div className="mt-20 grid md:grid-cols-2 gap-8 items-stretch">
          {/* Buyer/Seller highlight */}
          <div className="bg-white rounded-3xl p-8 flex flex-col justify-between" style={{ boxShadow: "0 10px 30px rgba(20, 32, 23, 0.04)" }}>
            <div className="space-y-4 text-left">
              <div className="w-10 h-10 rounded-2xl bg-[#0F5A2A]/10 text-[#0F5A2A] flex items-center justify-center">
                <MapPin size={20} />
              </div>
              <h3 className="text-xl font-extrabold text-[#142017] tracking-tight">Untuk Pembeli & Pecinta Lingkungan</h3>
              <p className="text-xs sm:text-sm text-[#66735F] leading-relaxed font-medium">
                Nikmati hidangan lezat dan berkualitas tinggi dari merchant kesayangan Anda dengan harga jauh lebih hemat. Selamatkan porsi makanan Anda hari ini dan jadilah pahlawan pelestari bumi dari timbunan sampah gas metana berbahaya!
              </p>
            </div>
          </div>

          {/* Donor/LKS highlight */}
          <div className="bg-white rounded-3xl p-8 flex flex-col justify-between" style={{ boxShadow: "0 10px 30px rgba(20, 32, 23, 0.04)" }}>
            <div className="space-y-4 text-left">
              <div className="w-10 h-10 rounded-2xl bg-[#0F5A2A]/10 text-[#0F5A2A] flex items-center justify-center">
                <HeartHandshake size={20} />
              </div>
              <h3 className="text-xl font-extrabold text-[#142017] tracking-tight">Untuk Merchant & Donatur Sosial</h3>
              <p className="text-xs sm:text-sm text-[#66735F] leading-relaxed font-medium">
                Kurangi kerugian inventori yang tersisa dan jangkau basis konsumen baru. Anda juga dapat dengan mudah menyumbangkan kelebihan makanan berkualitas secara terjadwal langsung ke Lembaga Kesejahteraan Sosial (LKS) terpercaya.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
