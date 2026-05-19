"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Leaf, Heart } from "lucide-react";

export default function FooterLanding() {
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-white py-16 scroll-mt-20 relative">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-12 gap-12 items-start">
        {/* Brand Column */}
        <div className="md:col-span-5 space-y-4 text-left">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-ecoeat.png"
              alt="EcoEat — Delivery & Surplus Food"
              width={140}
              height={36}
              priority
              className="h-9 w-auto object-contain"
            />
          </Link>
          <p className="text-sm text-[#66735F] leading-relaxed max-w-sm font-medium">
            Platform pelopor penyelamatan makanan surplus terpercaya di Indonesia. Bersama menyelamatkan kelezatan makanan, mengurangi limbah pangan, dan memelihara kelestarian bumi.
          </p>
          <div className="flex gap-4 pt-2">
            <a href="#" className="w-10 h-10 rounded-full bg-[#F5FCED] text-[#0F5A2A] flex items-center justify-center hover:bg-[#0F5A2A] hover:text-white transition-all duration-200 shadow-sm" aria-label="Instagram">
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-[#F5FCED] text-[#0F5A2A] flex items-center justify-center hover:bg-[#0F5A2A] hover:text-white transition-all duration-200 shadow-sm" aria-label="Twitter">
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
              </svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-[#F5FCED] text-[#0F5A2A] flex items-center justify-center hover:bg-[#0F5A2A] hover:text-white transition-all duration-200 shadow-sm" aria-label="Youtube">
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/>
                <polygon points="10 15 15 12 10 9"/>
              </svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-[#F5FCED] text-[#0F5A2A] flex items-center justify-center hover:bg-[#0F5A2A] hover:text-white transition-all duration-200 shadow-sm" aria-label="LinkedIn">
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect width="4" height="12" x="2" y="9"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="md:col-span-3 space-y-4 text-left">
          <h4 className="font-extrabold text-sm text-[#142017] uppercase tracking-wider">Navigasi Utama</h4>
          <ul className="space-y-3 font-semibold text-sm">
            <li>
              <a href="#fitur" onClick={(e) => scrollToSection(e, "fitur")} className="text-[#66735F] hover:text-[#0F5A2A] transition-colors">
                Fitur Utama
              </a>
            </li>
            <li>
              <a href="#kategori" onClick={(e) => scrollToSection(e, "kategori")} className="text-[#66735F] hover:text-[#0F5A2A] transition-colors">
                Kategori Makanan
              </a>
            </li>
            <li>
              <a href="#dampak" onClick={(e) => scrollToSection(e, "dampak")} className="text-[#66735F] hover:text-[#0F5A2A] transition-colors">
                Dampak Lingkungan
              </a>
            </li>
          </ul>
        </div>

        {/* Legal Column */}
        <div className="md:col-span-4 space-y-4 text-left">
          <h4 className="font-extrabold text-sm text-[#142017] uppercase tracking-wider">Hubungi Kami</h4>
          <p className="text-sm text-[#66735F] leading-relaxed font-medium">
            Pertanyaan, kerja sama merchant, atau koordinasi penyaluran donasi LKS? Hubungi pusat layanan pelanggan kami.
          </p>
          <p className="text-sm text-[#0F5A2A] font-bold">
            support@ecoeat.id
          </p>
        </div>
      </div>

      {/* Footer Bottom area */}
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 bg-[#F5FCED] rounded-2xl py-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-center">
        <p className="text-xs font-bold text-[#66735F] flex items-center justify-center gap-1.5">
          <span>EcoEat &copy; 2026. Made with</span>
          <Heart size={12} fill="currentColor" className="text-red-500 animate-pulse" />
          <span>for a greener Planet.</span>
        </p>
        <div className="flex gap-6 text-[10px] font-bold text-[#66735F] uppercase tracking-wider">
          <a href="#" className="hover:text-[#0F5A2A] transition-colors">Kebijakan Privasi</a>
          <a href="#" className="hover:text-[#0F5A2A] transition-colors">Syarat & Ketentuan</a>
        </div>
      </div>
    </footer>
  );
}
