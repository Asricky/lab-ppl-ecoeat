"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowRight } from "lucide-react";

export default function NavbarLanding() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      setIsMobileMenuOpen(false);
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? "bg-white/95 backdrop-blur-md py-4"
        : "bg-white/80 backdrop-blur-md py-5"
        }`}
      style={{
        boxShadow: isScrolled
          ? "0 18px 50px rgba(15, 90, 42, 0.08)"
          : "0 10px 30px rgba(20, 32, 23, 0.03)"
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo-ecoeat.png"
            alt="EcoEat — Delivery & Surplus Food"
            width={130}
            height={32}
            priority
            className="h-8 w-auto object-contain"
          />
        </Link>        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6">
          <a
            href="#fitur"
            onClick={(e) => scrollToSection(e, "fitur")}
            className="text-xs xl:text-sm font-bold text-[#6B7D4F] hover:text-[#0F5A2A] transition-colors whitespace-nowrap"
          >
            Fitur utama
          </a>
          <a
            href="#kategori"
            onClick={(e) => scrollToSection(e, "kategori")}
            className="text-xs xl:text-sm font-bold text-[#6B7D4F] hover:text-[#0F5A2A] transition-colors whitespace-nowrap"
          >
            Kategori Makanan
          </a>
          <a
            href="#mitra-peta"
            onClick={(e) => scrollToSection(e, "mitra-peta")}
            className="text-xs xl:text-sm font-bold text-[#6B7D4F] hover:text-[#0F5A2A] transition-colors whitespace-nowrap"
          >
            Mitra EcoEat
          </a>
          <a
            href="#dampak"
            onClick={(e) => scrollToSection(e, "dampak")}
            className="text-xs xl:text-sm font-bold text-[#6B7D4F] hover:text-[#0F5A2A] transition-colors whitespace-nowrap"
          >
            Dampak
          </a>
          <a
            href="#review"
            onClick={(e) => scrollToSection(e, "review")}
            className="text-xs xl:text-sm font-bold text-[#6B7D4F] hover:text-[#0F5A2A] transition-colors whitespace-nowrap"
          >
            Review
          </a>
          <a
            href="#pendukung"
            onClick={(e) => scrollToSection(e, "pendukung")}
            className="text-xs xl:text-sm font-bold text-[#6B7D4F] hover:text-[#0F5A2A] transition-colors whitespace-nowrap"
          >
            Pendukung
          </a>
        </nav>

        {/* Action Buttons (Double Capsule) */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/login"
            className="px-5 py-2.5 rounded-full font-bold text-[#0F5A2A] hover:bg-[#EEF8E7] transition-all duration-200 text-sm hover:scale-105 active:scale-95 whitespace-nowrap"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="group flex items-center gap-1.5 bg-[#0F5A2A] hover:bg-[#2F8A49] text-white px-5 py-2.5 rounded-full font-bold transition-all duration-200 text-sm shadow-ambient hover:scale-105 active:scale-95 whitespace-nowrap"
          >
            <span>Daftar Sekarang</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden text-[#142017] p-1.5 rounded-xl hover:bg-[#EEF8E7] transition-colors"
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white p-6 space-y-4 shadow-ambient animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-4">
            <a
              href="#fitur"
              onClick={(e) => scrollToSection(e, "fitur")}
              className="text-base font-bold text-[#6B7D4F] hover:text-[#0F5A2A] transition-colors py-1.5"
            >
              Fitur utama
            </a>
            <a
              href="#kategori"
              onClick={(e) => scrollToSection(e, "kategori")}
              className="text-base font-bold text-[#6B7D4F] hover:text-[#0F5A2A] transition-colors py-1.5"
            >
              Kategori Makanan
            </a>
            <a
              href="#mitra-peta"
              onClick={(e) => scrollToSection(e, "mitra-peta")}
              className="text-base font-bold text-[#6B7D4F] hover:text-[#0F5A2A] transition-colors py-1.5"
            >
              Mitra EcoEat
            </a>
            <a
              href="#dampak"
              onClick={(e) => scrollToSection(e, "dampak")}
              className="text-base font-bold text-[#6B7D4F] hover:text-[#0F5A2A] transition-colors py-1.5"
            >
              Dampak
            </a>
            <a
              href="#review"
              onClick={(e) => scrollToSection(e, "review")}
              className="text-base font-bold text-[#6B7D4F] hover:text-[#0F5A2A] transition-colors py-1.5"
            >
              Review
            </a>
            <a
              href="#pendukung"
              onClick={(e) => scrollToSection(e, "pendukung")}
              className="text-base font-bold text-[#6B7D4F] hover:text-[#0F5A2A] transition-colors py-1.5"
            >
              Pendukung
            </a>

            <div className="flex flex-col gap-2 pt-2">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center bg-transparent hover:bg-[#EEF8E7] text-[#0F5A2A] px-6 py-3 rounded-full font-bold transition-all text-sm w-full"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 bg-[#0F5A2A] hover:bg-[#2F8A49] text-white px-6 py-3 rounded-full font-bold transition-all text-sm w-full shadow-ambient"
              >
                <span>Daftar Sekarang</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
