"use client";

import React, { useState } from "react";
import { MapPin, Users, Award } from "lucide-react";

interface RegionData {
  id: string;
  name: string;
  partners: number;
  mealsSaved: number;
  co2Prevented: string;
  description: string;
  topPartners: string[];
}

const regionDataList: RegionData[] = [
  {
    id: "sumatra",
    name: "Sumatra",
    partners: 35,
    mealsSaved: 8500,
    co2Prevented: "20.4 Ton",
    description:
      "Hub penyelamatan surplus makanan di Medan, Padang, dan Palembang. Bekerja sama erat dengan jaringan hotel lokal dan produsen roti terkemuka untuk menekan sampah organik.",
    topPartners: [
      "Bumi Lestari Bakery",
      "Medan Green Hotel",
      "Sumatra Food Rescue",
    ],
  },
  {
    id: "jawa",
    name: "Jawa",
    partners: 120,
    mealsSaved: 32000,
    co2Prevented: "76.8 Ton",
    description:
      "Pusat aktivitas EcoEat terbesar. Didukung oleh kolaborasi strategis bersama Telkom University, aliansi komunitas mahasiswa, dan ratusan merchant kuliner aktif di Jabodetabek & Bandung.",
    topPartners: [
      "Telkom University Eco Hub",
      "Dapur Ibu Group",
      "Kantin Sehat Harmoni",
    ],
  },
  {
    id: "kalimantan",
    name: "Kalimantan",
    partners: 15,
    mealsSaved: 3100,
    co2Prevented: "7.4 Ton",
    description:
      "Fokus pada penyelamatan surplus pangan siap saji dari katering korporasi industri energi dan kafe-kafe keluarga di Balikpapan dan Pontianak.",
    topPartners: ["Borneo Catering", "Warung Selera Khatulistiwa"],
  },
  {
    id: "sulawesi",
    name: "Sulawesi",
    partners: 22,
    mealsSaved: 5400,
    co2Prevented: "12.9 Ton",
    description:
      "Gerakan penyelamatan pangan di Makassar dan Manado. Menjangkau kedai kopi modern lokal dan industri kuliner maritim untuk mengurangi sampah makanan.",
    topPartners: [
      "Makassar Coffee Shop Association",
      "Karya Mandiri Fish House",
    ],
  },
  {
    id: "bali_nusatenggara",
    name: "Bali & Nusa Tenggara",
    partners: 40,
    mealsSaved: 10000,
    co2Prevented: "23.9 Ton",
    description:
      "Didorong oleh tingginya kesadaran ekologis industri pariwisata ramah lingkungan. EcoEat bermitra dengan resor berkelanjutan, kafe vegan, dan toko kue legendaris di Seminyak & Ubud.",
    topPartners: [
      "Ubud Organic Cafe",
      "Seminyak Beach Resort",
      "Dewata Surplus Hub",
    ],
  },
  {
    id: "maluku",
    name: "Maluku",
    partners: 12,
    mealsSaved: 2200,
    co2Prevented: "5.2 Ton",
    description:
      "Inisiatif distribusi surplus makanan dari sektor perikanan dan restoran lokal di Ambon dan Ternate kepada komunitas terpencil.",
    topPartners: ["Ambon Care Initiative", "Maluku Food Rescue"],
  },
  {
    id: "papua",
    name: "Papua",
    partners: 8,
    mealsSaved: 1000,
    co2Prevented: "2.4 Ton",
    description:
      "Pelopor penyelamatan makanan surplus mandiri di Jayapura. Menghubungkan pemasok buah-buahan lokal dan bahan makanan pokok terverifikasi dengan panti asuhan terpencil.",
    topPartners: [
      "Jayapura Peduli Kasih",
      "Papua Sejahtera Foundation",
    ],
  },
];

// Accurate SVG path data from SVGRepo (CC0 License)
// Original viewBox: 0 0 260 82, scaled 3.8x for display in 0 0 1000 320
const ISLAND_PATHS: Record<string, { paths: string[]; labelPos: { x: number; y: number } }> = {
  sumatra: {
    paths: [
      "M63.888,47.288l-2.69-4.46l-4.034-0.377l-3.115-6.607l-5.19-1.25l1.462-5.427l-7.196-2.524l-2.053-3.233l-3.846-1.557l-2.099-2.69l-4.224-1.652l-3.232-3.303l-8.14-4.624L14.859,3.26L7.238,3.285L2,1.939l1.392,3.988l5.757,5.403l2.572,0.708l5.073,7.573l2.005,0.425l3.775,3.445l2.525,6.913l3.374,1.392l7.786,12.953l14.888,12.293l3.964,3.681l8.069,0.472l-0.306-8.99L63.888,47.288z",
    ],
    labelPos: { x: 35, y: 28 },
  },
  jawa: {
    paths: [
      "M101.002,68.098l-1.014-3.303l-5.026-0.661l-5.403-0.944l-0.92,2.431l-8.471-0.213l-3.893-2.902l-6.535-0.401l-1.392-0.024l-3.705-0.707l-1.227,3.468l3.516,2.359l0.778,2.195l10.429,1.533l1.793-0.943l6.701,0.802l4.365,1.415l0.543,0.118l11.986-0.377l4.247,1.628l2.383-4.341l-6.229,0.094L101.002,68.098z",
    ],
    labelPos: { x: 86, y: 66 },
  },
  kalimantan: {
    paths: [
      "M124.786,30.3l1.038-8.14l5.332-0.26l-0.519-2.383l-4.861-3.138l1.133-2.076l-5.12-6.914l-0.236-4.011l-8.376,1.463l-0.637,6.135l-4.695,8.801l-4.53,1.321L99.87,19.66l-4.507,0.707L93.57,22.82l-8.352,0.496l-5.215-4.766l-2.312,6.04l1.321,5.686l5.592,5.285l1.746,9.084l3.681-0.826l9.06,2.407l2.926-2.006l6.134,1.581l1.888,3.846l7.055-3.35l2.925-6.819l-1.51-3.445L124.786,30.3z",
    ],
    labelPos: { x: 110, y: 28 },
  },
  sulawesi: {
    paths: [
      "M164.306,19.163l-2.052-2.005l-3.776,3.114l-8.966-0.566l-7.101-1.369l-1.676,3.162l-2.737,0.377l-2.241,8.612l-0.944,6.159l-2.926,4.483l1.109,4.199l3.044-0.566l0.92,4.412l-1.25,5.663l2.524,1.722l2.761-1.109l0.448-4.766l-0.637-7.597l3.728-1.817l-0.897,3.445l3.634,3.586l5.804,0.661l-1.651-6.229l-4.672-6.158l4.389-3.28l2.265-3.209h-7.15l-2.17,3.162l-5.545-3.846l1.227-6.205l5.214-0.189l8.943-0.59l2.666,0.779l4.719-0.732L164.306,19.163z",
    ],
    labelPos: { x: 152, y: 35 },
  },
  bali_nusatenggara: {
    paths: [
      // Bali/Lombok area
      "M122.945,72.298l1.038,3.161l9.249-1.981l1.133-2.69l-6.205,0.472L122.945,72.298z",
      // Small island
      "M114.49,74.372l-4.333-2.917l6.083-0.667l1.417,2.167L114.49,74.372z",
      // Flores/Sumbawa
      "M140.924,70.458l-1.463,3.186l10.051-0.236l5.427-1.628l0.873-2.548l-3.657,2.76L140.924,70.458z",
      // Timor
      "M160.177,79.494l3.634,0.566l3.421-3.751l-0.802-2.855L160.177,79.494z",
    ],
    labelPos: { x: 140, y: 78 },
  },
  maluku: {
    paths: [
      // Halmahera
      "M185.282,14.658l-7.22,2.312l4.152,10.547l0.795-0.636l-1.62-5.947l3.94-3.492L185.282,14.658z",
      // Small island
      "M175.679,45.188l1.817-3.705l-6.088,0.496l-0.896,2.581L175.679,45.188z",
      // Seram area
      "M184.463,40.77l-0.283,2.761l7.205-0.526l7.204,1.475l-1.628-4.129l-5.577-0.813L184.463,40.77z",
    ],
    labelPos: { x: 185, y: 34 },
  },
  papua: {
    paths: [
      "M257.74,35.421l-6.771-1.18l-12.6-4.837l-8.069,4.625l-5.238,6.818l-2.831-0.118l-1.911-2.784l-2.855-2.524l0.283-5.946l-1.935-3.516l-3.374,0.165l-4.011-1.887l-8.235,3.02l-1.439,3.586l5.356,0.661l5.073,6.654l0.118,4.978l3.138,2.029l1.746-2.831l7.527,3.775l6.417,1.392l10.264,3.988l6.63,9.367l1.557,4.506l-1.242,2.728l-0.457-3.86l-4.601,1.368l-2.359,4.554l4.742,0.023l2.582-1.879l-0.222,0.487l6.512-0.047l6.111,6.182L258,58.118L257.74,35.421z",
    ],
    labelPos: { x: 240, y: 42 },
  },
};

// Pin dot positions (in the original 260x82 coordinate space)
const PIN_POSITIONS: Record<string, { x: number; y: number }> = {
  sumatra: { x: 38, y: 32 },
  jawa: { x: 90, y: 67 },
  kalimantan: { x: 112, y: 26 },
  sulawesi: { x: 155, y: 30 },
  bali_nusatenggara: { x: 128, y: 74 },
  maluku: { x: 184, y: 36 },
  papua: { x: 238, y: 46 },
};

export default function MitraMapSection() {
  const [selectedRegion, setSelectedRegion] = useState<RegionData>(
    regionDataList[1]
  );

  const getFill = (regionId: string) =>
    selectedRegion.id === regionId ? "#7BC462" : "#A8D5A0";

  const getStroke = (regionId: string) =>
    selectedRegion.id === regionId ? "#2E7D32" : "#4A7A3F";

  const getStrokeWidth = (regionId: string) =>
    selectedRegion.id === regionId ? "0.8" : "0.5";

  // Scale factor: original viewBox is 260x82
  // We display in a viewBox of ~280x90 with padding
  const svgViewBox = "-5 -5 270 95";

  return (
    <section
      id="mitra-peta"
      className="py-24 bg-[#F5FCED] relative z-10 w-full overflow-hidden scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 bg-[#EEF8E7] px-4 py-1.5 rounded-full text-xs font-extrabold text-[#0F5A2A] tracking-wider uppercase">
            <Users size={12} />
            <span>Jangkauan Nasional EcoEat</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#142017] tracking-tight">
            Peta Distribusi{" "}
            <span className="text-[#0F5A2A]">Mitra EcoEat</span>
          </h2>
          <p className="text-[#66735F] font-semibold text-sm max-w-xl mx-auto leading-relaxed">
            Menyelamatkan makanan surplus lezat dan layak konsumsi di seluruh
            wilayah Indonesia. Temukan titik aktif mitra kami yang terus
            bertambah!
          </p>
        </div>

        {/* Interactive Dashboard Layout */}
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Map Container */}
          <div
            className="lg:col-span-8 bg-white rounded-3xl p-6 flex flex-col justify-between relative min-h-[350px] md:min-h-[480px] overflow-hidden"
            style={{ boxShadow: "0 18px 50px rgba(15, 90, 42, 0.05)" }}
          >
            {/* Map Header */}
            <div className="flex items-center justify-between mb-4 z-10">
              <span className="text-xs font-extrabold text-[#66735F] uppercase tracking-wider">
                Peta Kepulauan Indonesia
              </span>
              <span className="text-[10px] font-bold text-[#0F5A2A] bg-[#EEF8E7] px-2.5 py-1 rounded-full animate-pulse">
                Klik Wilayah untuk Detail Statistik
              </span>
            </div>

            {/* Indonesia Map SVG */}
            <div className="relative w-full flex-1 flex items-center justify-center my-2">
              <svg
                viewBox={svgViewBox}
                className="w-full h-auto max-h-[400px]"
                xmlns="http://www.w3.org/2000/svg"
                style={{ maxWidth: "100%" }}
              >
                <defs>
                  {/* Dot grid background */}
                  <pattern
                    id="dot-grid"
                    width="8"
                    height="8"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle cx="1" cy="1" r="0.3" fill="#0F5A2A" opacity="0.07" />
                  </pattern>
                  {/* Drop shadow for selected island */}
                  <filter id="selected-glow" x="-15%" y="-15%" width="130%" height="130%">
                    <feDropShadow
                      dx="0"
                      dy="0.5"
                      stdDeviation="1.5"
                      floodColor="#2E7D32"
                      floodOpacity="0.3"
                    />
                  </filter>
                  <filter id="default-shadow" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow
                      dx="0"
                      dy="0.3"
                      stdDeviation="0.5"
                      floodColor="#2E7D32"
                      floodOpacity="0.1"
                    />
                  </filter>
                </defs>

                {/* Ocean background */}
                <rect x="-5" y="-5" width="270" height="95" fill="#FAFFF5" rx="4" />
                <rect x="-5" y="-5" width="270" height="95" fill="url(#dot-grid)" />

                {/* Equator line */}
                <line
                  x1="0" y1="45" x2="260" y2="45"
                  stroke="#0F5A2A" strokeWidth="0.15"
                  strokeDasharray="3 2" opacity="0.2"
                />
                <text x="3" y="43.5" fontSize="2.5" fill="#0F5A2A" opacity="0.2" fontStyle="italic">
                  Khatulistiwa
                </text>

                {/* Distribution lanes */}
                <g opacity="0.15" stroke="#2E7D32" strokeWidth="0.3" fill="none">
                  <path d="M 50,38 Q 70,55 82,66" strokeDasharray="1.5 1.5" />
                  <path d="M 100,66 Q 105,50 110,30" strokeDasharray="1.5 1.5" />
                  <path d="M 130,30 Q 145,25 152,22" strokeDasharray="1.5 1.5" />
                  <path d="M 165,35 Q 178,35 183,30" strokeDasharray="1.5 1.5" />
                  <path d="M 195,38 Q 218,38 230,40" strokeDasharray="1.5 1.5" />
                  <path d="M 108,68 Q 118,72 125,73" strokeDasharray="1 1" />
                </g>

                {/* Render each island region */}
                {regionDataList.map((region) => {
                  const islandData = ISLAND_PATHS[region.id];
                  if (!islandData) return null;
                  const isSelected = selectedRegion.id === region.id;

                  return (
                    <g
                      key={region.id}
                      className="cursor-pointer transition-all duration-300"
                      onClick={() => setSelectedRegion(region)}
                      filter={isSelected ? "url(#selected-glow)" : "url(#default-shadow)"}
                      style={{ transition: "filter 0.3s ease" }}
                    >
                      {islandData.paths.map((d, idx) => (
                        <path
                          key={idx}
                          d={d}
                          fill={getFill(region.id)}
                          stroke={getStroke(region.id)}
                          strokeWidth={getStrokeWidth(region.id)}
                          strokeLinejoin="round"
                          strokeLinecap="round"
                          className="transition-colors duration-300 hover:brightness-110"
                        />
                      ))}
                    </g>
                  );
                })}

                {/* Region labels */}
                {regionDataList.map((region) => {
                  const islandData = ISLAND_PATHS[region.id];
                  if (!islandData) return null;
                  const isSelected = selectedRegion.id === region.id;

                  return (
                    <text
                      key={`label-${region.id}`}
                      x={islandData.labelPos.x}
                      y={islandData.labelPos.y}
                      fontSize={region.id === "bali_nusatenggara" ? "2.2" : "2.8"}
                      fontWeight={isSelected ? "700" : "600"}
                      fill={isSelected ? "#0F5A2A" : "#4A7A3F"}
                      textAnchor="middle"
                      opacity={isSelected ? 0.9 : 0.5}
                      className="pointer-events-none select-none transition-all duration-300"
                      style={{ textTransform: "uppercase", letterSpacing: "0.5px" }}
                    >
                      {region.name === "Bali & Nusa Tenggara" ? "Nusa Tenggara" : region.name}
                    </text>
                  );
                })}

                {/* Animated ping dots for each region */}
                {regionDataList.map((region) => {
                  const pin = PIN_POSITIONS[region.id];
                  if (!pin) return null;
                  const isSelected = selectedRegion.id === region.id;

                  return (
                    <g
                      key={`pin-${region.id}`}
                      className="cursor-pointer"
                      onClick={() => setSelectedRegion(region)}
                    >
                      {/* Ping animation */}
                      <circle
                        cx={pin.x}
                        cy={pin.y}
                        r="2.5"
                        fill="#0F5A2A"
                        opacity="0.15"
                      >
                        <animate
                          attributeName="r"
                          values="2;5;2"
                          dur="2.5s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values="0.2;0;0.2"
                          dur="2.5s"
                          repeatCount="indefinite"
                        />
                      </circle>
                      {/* Pin dot */}
                      <circle
                        cx={pin.x}
                        cy={pin.y}
                        r={isSelected ? "2" : "1.5"}
                        fill={isSelected ? "#0F5A2A" : "#2F8A49"}
                        stroke="white"
                        strokeWidth="0.5"
                        className="transition-all duration-300"
                      />
                      {/* Tooltip on hover */}
                      <title>
                        {region.name} ({region.partners} Mitra)
                      </title>
                    </g>
                  );
                })}

                {/* Compass rose */}
                <g transform="translate(252, 8)" opacity="0.2">
                  <circle cx="0" cy="0" r="4" stroke="#2E7D32" strokeWidth="0.3" fill="none" />
                  <line x1="0" y1="-5.5" x2="0" y2="5.5" stroke="#2E7D32" strokeWidth="0.2" />
                  <line x1="-5.5" y1="0" x2="5.5" y2="0" stroke="#2E7D32" strokeWidth="0.2" />
                  <polygon points="0,-6 0.8,-2 0,-1 -0.8,-2" fill="#2E7D32" />
                  <text x="0" y="-7.5" textAnchor="middle" fontSize="2.5" fontWeight="bold" fill="#2E7D32">
                    N
                  </text>
                </g>
              </svg>
            </div>

            {/* Map Footer */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#EEF8E7] z-10 bg-white">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#0F5A2A] block animate-pulse" />
                <span className="text-xs font-semibold text-[#66735F]">
                  Jaringan Pengantaran & Distribusi Mandiri
                </span>
              </div>
              <p className="text-[11px] font-bold text-[#6B7D4F]">
                EcoEat Nasional © 2026. Menyelamatkan Pangan Nusantara.
              </p>
            </div>
          </div>

          {/* Right: Info Panel */}
          <div
            className="lg:col-span-4 bg-white rounded-3xl p-8 flex flex-col justify-between border-t-4 border-[#0F5A2A]"
            style={{ boxShadow: "0 18px 50px rgba(15, 90, 42, 0.05)" }}
          >
            <div className="space-y-6">
              <div>
                <span className="bg-[#EEF8E7] text-[#0F5A2A] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  Detail Wilayah
                </span>
                <h3 className="text-2xl font-black text-[#142017] mt-2 flex items-center gap-2">
                  <MapPin size={20} className="text-[#0F5A2A]" />
                  {selectedRegion.name}
                </h3>
              </div>

              <p className="text-sm text-[#66735F] leading-relaxed font-medium">
                {selectedRegion.description}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#F5FCED] rounded-2xl p-4">
                  <span className="text-[10px] font-bold text-[#6B7D4F] uppercase block">
                    Mitra Aktif
                  </span>
                  <span className="text-2xl font-black text-[#0F5A2A] mt-1 block">
                    {selectedRegion.partners} Toko
                  </span>
                </div>
                <div className="bg-[#F5FCED] rounded-2xl p-4">
                  <span className="text-[10px] font-bold text-[#6B7D4F] uppercase block">
                    Makanan Selamat
                  </span>
                  <span className="text-2xl font-black text-[#0F5A2A] mt-1 block">
                    {selectedRegion.mealsSaved.toLocaleString()} Porsi
                  </span>
                </div>
              </div>

              <div className="bg-[#EEF8E7]/50 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0F5A2A]/10 text-[#0F5A2A] flex items-center justify-center shrink-0">
                  <Award size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#6B7D4F] uppercase block">
                    Emisi Karbon Dicegah
                  </span>
                  <span className="text-sm font-extrabold text-[#142017] mt-0.5 block">
                    {selectedRegion.co2Prevented} CO₂ Eq
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-extrabold text-[#6B7D4F] uppercase tracking-wider block">
                  Top Partner & Dukungan
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedRegion.topPartners.map((partner, index) => (
                    <span
                      key={index}
                      className="bg-[#F5FCED] text-[#0F5A2A] text-xs font-bold px-3 py-1.5 rounded-full"
                    >
                      {partner}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#EEF8E7]">
              <p className="text-[11px] text-[#6B7D4F] text-center font-bold mb-3">
                Kota Anda belum terdaftar? Jadilah pelopor gerakan kami!
              </p>
              <a
                href="/register"
                className="w-full bg-[#0F5A2A] hover:bg-[#2F8A49] text-white py-3.5 rounded-full font-bold transition-all text-center text-sm block shadow-sm hover:scale-[1.02] active:scale-95"
              >
                Gabung Kemitraan Sekarang
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}