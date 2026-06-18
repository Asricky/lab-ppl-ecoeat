"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, AlertCircle, X, Info } from "lucide-react";
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

  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ message, type });
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleSubmit = async (e: React.FormEvent) => {
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
      showToast("Lengkapi semua kolom yang wajib diisi.", "error");
      return;
    }
    const pos = postalCode.replace(/\D/g, "");
    if (pos.length !== 5) {
      showToast("Kode pos wajib 5 digit.", "error");
      return;
    }

    try {
      const stored = localStorage.getItem('user');
      const userObj = stored ? JSON.parse(stored) : null;
      const currentUserId = userObj?.id || 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d';

      const response = await fetch('/api/buyer/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUserId
        },
        body: JSON.stringify({
          label: labelFinal,
          recipient_name: fullName.trim(),
          phone_number: phone.trim(),
          address: streetDetail.trim(),
          district: district.trim(),
          city: city.trim(),
          province: province.trim(),
          postal_code: pos,
          is_default: isPrimary
        })
      });

      const result = await response.json();

      if (result.success) {
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
        showToast("Alamat berhasil ditambahkan!", "success");
        setTimeout(() => {
          router.push("/buyer/profile?tab=address");
        }, 800);
      } else {
        showToast(result.error || "Gagal menyimpan alamat ke database.", "error");
      }
    } catch (err: any) {
      console.error(err);
      showToast("Terjadi kesalahan koneksi saat menyimpan alamat.", "error");
    }
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

      {/* Premium Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-[9999] animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl border backdrop-blur-md ${notification.type === 'success'
              ? 'bg-[#EAF3E1]/95 border-[#1A5632]/20 text-[#1A5632]'
              : notification.type === 'error'
                ? 'bg-red-50/95 border-red-200 text-red-950'
                : 'bg-blue-50/95 border-blue-200 text-blue-950'
            }`}>
            {notification.type === 'success' && <CheckCircle2 className="w-5 h-5 text-green-700 shrink-0" />}
            {notification.type === 'error' && <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />}
            {notification.type === 'info' && <Info className="w-5 h-5 text-blue-600 shrink-0" />}
            <p className="text-sm font-bold">{notification.message}</p>
            <button
              onClick={() => setNotification(null)}
              className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
