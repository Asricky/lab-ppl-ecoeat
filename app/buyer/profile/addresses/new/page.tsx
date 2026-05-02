"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useBuyerAddressesStore } from "@/store/buyerAddressesStore";

export default function AddAddressPage() {
  const router = useRouter();
  const addAddress = useBuyerAddressesStore((s) => s.addAddress);

  const [label, setLabel] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [streetDetail, setStreetDetail] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const labelFinal = label.trim() || "Alamat";
    if (
      !fullName.trim() ||
      !phone.trim() ||
      !province.trim() ||
      !city.trim() ||
      !district.trim() ||
      !streetDetail.trim()
    ) {
      alert("Lengkapi semua kolom yang wajib diisi.");
      return;
    }
    const pos = postalCode.replace(/\D/g, "");
    if (pos.length !== 5) {
      alert("Kode pos wajib 5 digit.");
      return;
    }
    addAddress({
      label: labelFinal,
      fullName: fullName.trim(),
      phone: phone.trim(),
      province: province.trim(),
      city: city.trim(),
      district: district.trim(),
      postalCode: pos,
      streetDetail: streetDetail.trim(),
      isPrimary,
    });
    router.push("/buyer/profile?tab=address");
  };

  const fieldClass =
    "w-full rounded-xl border border-[#d4dec4] bg-[#f4f7ed] px-4 py-3 text-sm font-medium text-gray-900 outline-none focus:border-green-700 focus:ring-2 focus:ring-green-700/25 transition-shadow placeholder:text-gray-400";

  return (
    <div className="max-w-2xl mx-auto pb-16">
      <Link
        href="/buyer/profile?tab=address"
        className="inline-flex items-center gap-2 text-sm font-bold text-green-800 mb-8 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke Alamat Saya
      </Link>

      <div className="bg-white rounded-3xl border border-[#e1e8d5] shadow-sm p-6 md:p-10">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Tambah alamat baru</h1>
        <p className="text-sm text-gray-500 font-medium mb-8 leading-relaxed">Data akan tersimpan di akun Anda dan dapat dipilih sebagai alamat utama pengiriman.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Judul alamat <span className="text-gray-400 font-medium normal-case">(opsional)</span></label>
              <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Mis. Kantor / Kos" className={fieldClass} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Nama lengkap</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Sesuai KTP atau pengiriman" className={fieldClass} required />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Nomor telepon</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0812xxxxxxxx" className={fieldClass} required />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Provinsi</label>
              <input type="text" value={province} onChange={(e) => setProvince(e.target.value)} className={fieldClass} required />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Kota / Kabupaten</label>
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className={fieldClass} required />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Kecamatan</label>
              <input type="text" value={district} onChange={(e) => setDistrict(e.target.value)} className={fieldClass} required />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Kode pos</label>
              <input
                type="text"
                inputMode="numeric"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, "").slice(0, 5))}
                placeholder="40131"
                className={fieldClass}
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Nama jalan & detail alamat</label>
              <textarea
                value={streetDetail}
                onChange={(e) => setStreetDetail(e.target.value)}
                rows={4}
                placeholder="Blok/unit, nomor rumah, patokan, dll."
                className={`${fieldClass} resize-y min-h-[120px]`}
                required
              />
            </div>
          </div>

          <label className="flex items-start gap-3 cursor-pointer rounded-2xl border border-[#d4dec4] bg-[#f4f7ed]/60 p-4">
            <input type="checkbox" checked={isPrimary} onChange={(e) => setIsPrimary(e.target.checked)} className="mt-1 rounded border-[#d4dec4] text-green-700 focus:ring-green-700" />
            <span>
              <span className="block text-sm font-bold text-gray-900">Jadikan alamat utama</span>
              <span className="text-xs text-gray-500 font-medium">Alamat ini dipakai default untuk pengiriman.</span>
            </span>
          </label>

          <button type="submit" className="w-full rounded-xl bg-green-800 hover:bg-green-900 text-white font-bold py-3.5 shadow-md transition-colors">
            Simpan alamat
          </button>
        </form>
      </div>
    </div>
  );
}
