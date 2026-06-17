"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, HeartHandshake, Leaf, Sparkles } from "lucide-react";

export default function HeroSection() {
  const handleLearnMore = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById("fitur");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative pt-32 pb-24 bg-[#F5FCED] overflow-hidden flex items-center min-h-[90vh]">
      {/* Decorative background gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#EEF8E7] rounded-full blur-3xl -translate-y-1/4 translate-x-1/4 opacity-75 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#E5F2DC] rounded-full blur-3xl translate-y-1/4 -translate-x-1/4 opacity-50 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-12 items-center relative z-10 w-full">
        {/* Left Copy Column */}
        <div className="md:col-span-7 text-left space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#EEF8E7] px-4 py-2 rounded-full text-xs font-bold text-[#0F5A2A] tracking-wide uppercase">
            <Sparkles size={14} className="animate-pulse" />
            <span>Penyelamat Makanan Surplus No. 1</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#142017] leading-[1.1] tracking-tight">
            Penyelamatan Makanan Surplus <br />
            <span className="text-[#0F5A2A]">Cegah Sampah Organik!</span>
          </h1>

          <p className="text-base sm:text-lg text-[#66735F] leading-relaxed max-w-xl font-medium">
            EcoEat menghubungkan Anda dengan bisnis kuliner lokal untuk menyelamatkan makanan berlebih berkualitas tinggi yang belum terjual dengan harga jauh lebih hemat. Mari bersama kurangi sampah makanan untuk bumi yang lebih hijau.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              href="/register"
              className="group flex items-center gap-2 bg-[#0F5A2A] hover:bg-[#2F8A49] text-white px-8 py-4 rounded-full font-bold transition-all duration-200 shadow-ambient text-base hover:scale-105 active:scale-95"
            >
              <span>Daftar Sekarang</span>
            </Link>

            <a
              href="#fitur"
              onClick={handleLearnMore}
              className="flex items-center justify-center bg-white hover:bg-[#EEF8E7] text-[#0F5A2A] px-8 py-4 rounded-full font-bold transition-all duration-200 text-base shadow-card hover:scale-105 active:scale-95"
              style={{ boxShadow: "0 10px 30px rgba(20, 32, 23, 0.04)" }}
            >
              Pelajari Fitur
            </a>
          </div>

          {/* Quick trust metrics */}
          <div className="grid grid-cols-3 gap-6 pt-10 border-t border-[#E5F2DC]/60">
            <div>
              <p className="text-3xl font-extrabold text-[#0F5A2A] tracking-tight">50k+</p>
              <p className="text-xs font-bold text-[#66735F] mt-1">Porsi Diselamatkan</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-[#0F5A2A] tracking-tight">120 Ton</p>
              <p className="text-xs font-bold text-[#66735F] mt-1">Emisi CO₂ Dicegah</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-[#0F5A2A] tracking-tight">200+</p>
              <p className="text-xs font-bold text-[#66735F] mt-1">Mitra Toko & Resto</p>
            </div>
          </div>
        </div>

        {/* Right Graphic Column */}
        <div className="md:col-span-5 relative flex items-center justify-center">
          <div className="relative w-full max-w-[400px] h-[450px]">
            {/* Main Interactive Card */}
            <div
              className="absolute inset-0 bg-white rounded-3xl p-6 shadow-ambient flex flex-col justify-between border-t-4 border-[#0F5A2A]"
              style={{ boxShadow: "0 18px 50px rgba(15, 90, 42, 0.08)" }}
            >
              {/* Card Header */}
              <div className="flex justify-between items-center">
                <span className="bg-[#EEF8E7] text-[#0F5A2A] text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider">
                  Tersedia Sekarang
                </span>
                <div className="w-8 h-8 rounded-full bg-[#EEF8E7] flex items-center justify-center text-[#0F5A2A]">
                  <Leaf size={16} fill="currentColor" />
                </div>
              </div>

              {/* Product Picture Mock */}
              <div className="my-6 bg-[#EEF8E7] w-full h-[180px] rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group">
                {/* Floating Discount Tag */}
                <div className="absolute top-3 right-3 bg-[#F4B942] text-[#142017] font-black text-xs px-3 py-1.5 rounded-full shadow-sm z-10">
                  Diskon 60%
                </div>
                
                <Image 
                  src="/images/nasi_goreng_hijau.png" 
                  alt="Nasi Goreng Spesial Hijau" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500" 
                  priority
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none"></div>
                <div className="absolute bottom-3 left-3 text-left w-full pr-4 pointer-events-none">
                  <h4 className="font-extrabold text-lg text-white drop-shadow-md leading-tight">Nasi Goreng Spesial Hijau</h4>
                  <p className="text-xs font-medium text-white/90 mt-0.5 drop-shadow-md">Sisa 3 porsi dari Dapur Ibu</p>
                </div>
              </div>

              {/* Pricing & CTA */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-bold text-[#66735F] uppercase tracking-wider">Harga Penyelamatan</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-xl font-extrabold text-[#0F5A2A]">Rp18.000</span>
                      <span className="text-xs font-bold text-[#66735F]/60 line-through">Rp45.000</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-[#66735F] uppercase tracking-wider">Rating Toko</p>
                    <p className="font-bold text-sm text-[#142017]">⭐ 4.9 (120 ulasan)</p>
                  </div>
                </div>

                <Link
                  href="/login"
                  className="w-full bg-[#0F5A2A] hover:bg-[#2F8A49] text-white py-3.5 rounded-2xl font-bold transition-all text-center text-sm block shadow-sm hover:scale-[1.02] active:scale-98"
                >
                  Selamatkan Makanan Ini
                </Link>
              </div>
            </div>

            {/* Tiny Floating Overlays */}
            <div
              className="absolute -top-6 -left-6 bg-white rounded-2xl p-4 shadow-card flex items-center gap-3 animate-bounce"
              style={{ animationDuration: "3s" }}
            >
              <div className="w-10 h-10 rounded-full bg-[#1F8A4C]/10 text-[#1F8A4C] flex items-center justify-center shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div className="text-left">
                <p className="text-xs font-extrabold text-[#142017]">100% Layak & Aman</p>
                <p className="text-[9px] font-bold text-[#66735F] uppercase">Standar Mutu Terjamin</p>
              </div>
            </div>

            <div
              className="absolute -bottom-4 -right-6 bg-white rounded-2xl p-4 shadow-card flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-[#0F5A2A]/10 text-[#0F5A2A] flex items-center justify-center shrink-0">
                <HeartHandshake size={20} />
              </div>
              <div className="text-left">
                <p className="text-xs font-extrabold text-[#142017]">Donasi Surplus</p>
                <p className="text-[9px] font-bold text-[#66735F] uppercase">Dukung Ketahanan Pangan</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
