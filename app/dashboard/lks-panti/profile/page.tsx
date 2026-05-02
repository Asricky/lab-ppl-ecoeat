import React from 'react';
import { User, ShieldCheck, MapPin, Users, Thermometer, Edit3, Phone } from 'lucide-react';

export default function ProfilLks() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <p className="text-xs font-bold text-ecoeat-muted uppercase tracking-widest mb-1">Settings & Identity</p>
          <h1 className="text-3xl font-extrabold text-ecoeat-text">Profil Institusi</h1>
        </div>
        <button className="flex items-center gap-2 bg-[#eaf4eb] text-[#388e3c] px-4 py-2 rounded-xl font-bold hover:bg-[#d4ecd7] transition-colors">
          <Edit3 size={16} /> Edit Profil
        </button>
      </div>
      
      {/* Cover and Header */}
      <div className="bg-white rounded-[24px] shadow-sm border border-black/5 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-[#1e8932] to-[#388e3c] relative">
          <div className="absolute -bottom-10 left-8 flex items-end">
            <div className="w-24 h-24 bg-white rounded-2xl p-2 shadow-lg flex items-center justify-center">
              <div className="w-full h-full bg-[#f8fbf8] rounded-xl flex items-center justify-center text-[#1e8932]">
                <User size={40} />
              </div>
            </div>
          </div>
        </div>
        <div className="pt-14 pb-8 px-8">
          <h2 className="text-2xl font-extrabold text-ecoeat-text mb-1">Yayasan Berbagi</h2>
          <p className="text-sm font-bold text-ecoeat-muted flex items-center gap-1.5">
            <ShieldCheck size={16} className="text-[#388e3c]" /> Terverifikasi - LKS / Panti Asuhan
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="bg-white rounded-[24px] shadow-sm border border-black/5 p-8">
          <h3 className="text-lg font-bold text-ecoeat-text mb-6 pb-4 border-b border-gray-100">Informasi Umum</h3>
          
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-bold text-ecoeat-muted uppercase tracking-wider mb-1">NOMOR IZIN OPERASIONAL</p>
              <p className="font-bold text-ecoeat-text bg-gray-50 p-3 rounded-xl border border-gray-100 font-mono text-sm">
                LKS-JB/12948.33.2023
              </p>
            </div>

            <div>
              <p className="text-[10px] font-bold text-ecoeat-muted uppercase tracking-wider mb-1">KAPASITAS PENERIMA MANFAAT</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Users size={20} />
                </div>
                <p className="font-bold text-ecoeat-text text-lg">120 <span className="text-sm font-medium text-ecoeat-muted">Anak Asuh</span></p>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-ecoeat-muted uppercase tracking-wider mb-1">KONTAK UTAMA</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="font-bold text-ecoeat-text">Bapak Hasanudin</p>
                  <p className="text-sm text-ecoeat-muted">+62 812-3456-7890</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Facilities Information */}
        <div className="space-y-6">
          <div className="bg-white rounded-[24px] shadow-sm border border-black/5 p-8">
            <h3 className="text-lg font-bold text-ecoeat-text mb-6 pb-4 border-b border-gray-100">Alamat Lengkap</h3>
            <div className="flex gap-4">
              <div className="w-10 h-10 shrink-0 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <MapPin size={20} />
              </div>
              <div>
                <p className="font-bold text-ecoeat-text leading-tight mb-2">
                  Jl. Cempaka Putih Raya No. 45
                </p>
                <p className="text-sm text-ecoeat-muted mb-4">
                  RT.04/RW.02, Cemp. Putih Tim., Kec. Cemp. Putih, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta 10510
                </p>
                <div className="h-32 bg-gray-100 rounded-xl border border-gray-200 overflow-hidden relative">
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <MapPin size={32} className="text-red-500 drop-shadow-md" fill="currentColor" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[24px] shadow-sm border border-black/5 p-8">
            <h3 className="text-lg font-bold text-ecoeat-text mb-6 pb-4 border-b border-gray-100">Fasilitas Penyimpanan</h3>
            <div className="flex gap-3 flex-wrap">
              <span className="bg-[#eaf4eb] text-[#388e3c] border border-[#d4ecd7] px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                <Thermometer size={16} /> Chiller Available
              </span>
              <span className="bg-[#eaf4eb] text-[#388e3c] border border-[#d4ecd7] px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                <Package size={16} /> Dry Storage (Large)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Importing Package icon since it wasn't imported at the top
import { Package } from 'lucide-react';
