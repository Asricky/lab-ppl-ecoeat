"use client";

import React from "react";
import { Leaf } from "lucide-react";

const PARTNERS = [
  { name: "Telkom University", desc: "Educational Partner" },
  { name: "Dinas Lingkungan Hidup", desc: "Government Sponsor" },
  { name: "Surplus Rescue ID", desc: "NGO Alliance" },
  { name: "Bappenas RI", desc: "Policy Advisor" },
  { name: "Dompet Dhuafa", desc: "Distribution Partner" },
  { name: "FAO Indonesia", desc: "Global Advisor" },
  { name: "Food Bank Indonesia", desc: "Logistics Partner" },
  { name: "Yayasan Kehati", desc: "Conservation Support" },
];

export default function PartnerMarquee() {
  // Duplicate list to make infinite looping scroll smooth
  const doublePartners = [...PARTNERS, ...PARTNERS, ...PARTNERS, ...PARTNERS];

  return (
    <section id="pendukung" className="py-12 bg-[#EEF8E7] overflow-hidden select-none">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 35s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      ` }} />

      <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
        <p className="text-xs uppercase tracking-[0.15em] text-[#6B7D4F] font-bold">Instansi & Lembaga Pendukung</p>
      </div>

      <div className="relative w-full flex items-center">
        {/* Soft shadow gradients on edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#EEF8E7] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#EEF8E7] to-transparent z-10 pointer-events-none"></div>

        <div className="animate-marquee gap-6 py-2">
          {doublePartners.map((partner, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-card transition-all duration-300 transform hover:scale-105 shrink-0"
              style={{ boxShadow: "0 10px 30px rgba(20, 32, 23, 0.04)" }}
            >
              <div className="w-8 h-8 rounded-full bg-[#0F5A2A]/10 flex items-center justify-center text-[#0F5A2A] shrink-0 font-black">
                <Leaf size={16} fill="currentColor" className="opacity-80" />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-sm text-[#142017] tracking-tight">{partner.name}</h4>
                <p className="text-[10px] font-semibold text-[#66735F] uppercase tracking-wider">{partner.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
