"use client";

import { useState, useEffect } from 'react';
import { Building2, ShieldCheck, Users, Snowflake, Warehouse, Edit, X, Save, CheckCircle2, AlertCircle, Info, Mail, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function LksProfilePage() {
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);

  // Dynamic values with sensible defaults
  const name = user?.name || "Yayasan Berbagi Nusantara";
  const businessName = (user as any)?.businessName || "Yayasan Berbagi Nusantara";
  const email = user?.email || "lks@ecoeat.id";
  const lksType = (user as any)?.lksType || "Yayasan Sosial";
  const legalPermit = (user as any)?.legalPermit || "LKS-DINSOS/3174/2024";
  const capacity = (user as any)?.capacity || 135;
  const foodStorage = (user as any)?.foodStorage || "Chiller Active";

  // Form edit states
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    businessName: "",
    email: "",
    lksType: "",
    legalPermit: "",
    capacity: 0,
    foodStorage: "",
  });

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

  // Open modal and load current user details
  const handleOpenEdit = () => {
    setFormData({
      name,
      businessName,
      email,
      lksType,
      legalPermit,
      capacity: Number(capacity),
      foodStorage,
    });
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.businessName || !formData.email || !formData.legalPermit) {
      return showToast("Harap isi semua kolom yang wajib!", "error");
    }
    if (formData.capacity <= 0) {
      return showToast("Kapasitas harus lebih besar dari 0!", "error");
    }

    updateUser({
      ...formData,
    } as any);

    showToast("Profil LKS berhasil diperbarui!", "success");
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-emerald-700 font-bold">LKS Panel</p>
          <h1 className="text-3xl font-extrabold text-emerald-950">Profile LKS</h1>
        </div>
        <button
          onClick={handleOpenEdit}
          className="bg-emerald-800 hover:bg-emerald-950 text-white font-bold px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-sm transition-all hover:shadow-md"
        >
          <Edit size={16} /> Edit Profil
        </button>
      </div>

      {/* Profile Overview */}
      <section className="bg-white rounded-3xl border border-emerald-100 p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-8 border-b border-slate-100">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-inner">
              <Building2 size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-extrabold text-emerald-950">{businessName}</h2>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-lg">
                  {lksType}
                </span>
              </div>
              <p className="text-sm font-semibold text-emerald-700 inline-flex items-center gap-1 mt-1">
                <ShieldCheck size={16} /> Verified LKS Partner
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 text-sm text-slate-600 bg-slate-50 border border-slate-100 p-4 rounded-2xl md:min-w-[250px]">
            <div className="flex items-center gap-2">
              <UserIcon size={16} className="text-slate-400" />
              <span className="font-bold text-slate-800">{name}</span>
            </div>
            <div className="flex items-center gap-2 border-t border-slate-200/60 pt-2 mt-1">
              <Mail size={16} className="text-slate-400" />
              <span className="font-medium text-slate-700">{email}</span>
            </div>
          </div>
        </div>

        {/* LKS Details Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 hover:border-emerald-200 hover:bg-white transition-all duration-300">
            <p className="text-xs uppercase tracking-wider text-slate-500 font-extrabold mb-2">Legal Permit (Izin Resmi)</p>
            <p className="font-extrabold text-emerald-950 text-base">{legalPermit}</p>
            <p className="text-xs text-slate-500 mt-2 font-medium">Terdaftar di Dinas Sosial RI</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 hover:border-emerald-200 hover:bg-white transition-all duration-300">
            <p className="text-xs uppercase tracking-wider text-slate-500 font-extrabold mb-2">Capacity (Kapasitas Penerima)</p>
            <p className="font-extrabold text-emerald-950 text-base inline-flex items-center gap-2">
              <Users size={18} className="text-emerald-700" /> {capacity} beneficiaries
            </p>
            <p className="text-xs text-slate-500 mt-2 font-medium">Jiwa penerima manfaat terdaftar</p>
          </div>
          <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 hover:border-emerald-200 hover:bg-white transition-all duration-300">
            <p className="text-xs uppercase tracking-wider text-slate-500 font-extrabold mb-2">Food Storage System</p>
            <p className="font-extrabold text-emerald-950 text-base inline-flex items-center gap-2">
              <Snowflake size={18} className="text-emerald-700 animate-pulse" /> {foodStorage}
            </p>
            <p className="text-xs text-slate-600 inline-flex items-center gap-1.5 mt-2 font-semibold">
              <Warehouse size={14} className="text-slate-400" /> Dry storage 78% available
            </p>
          </div>
        </div>
      </section>

      {/* Edit Profile Glassmorphic Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white border border-slate-100 rounded-3xl shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setIsEditing(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-xl transition-colors"
            >
              <X size={20} />
            </button>

            <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Edit Profil Lembaga Kesejahteraan Sosial</h3>
            <p className="text-slate-500 text-sm mb-6 font-medium">Perbarui informasi legalitas, kapasitas, dan spesifikasi penyimpanan makanan panti Anda.</p>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Nama Lembaga (LKS)</label>
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Jenis LKS</label>
                  <select
                    value={formData.lksType}
                    onChange={(e) => setFormData({ ...formData, lksType: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 focus:bg-white transition-all"
                  >
                    <option value="Panti Asuhan">Panti Asuhan</option>
                    <option value="Panti Jompo">Panti Jompo</option>
                    <option value="Panti Wreda">Panti Wreda</option>
                    <option value="Panti Rehabilitasi">Panti Rehabilitasi</option>
                    <option value="Yayasan Sosial">Yayasan Sosial</option>
                    <option value="Komunitas Sosial">Komunitas Sosial</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Nama Kontak PIC</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Nomor Izin Operasional LKS</label>
                  <input
                    type="text"
                    required
                    value={formData.legalPermit}
                    onChange={(e) => setFormData({ ...formData, legalPermit: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Kapasitas (Jiwa)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">Sistem Penyimpanan Makanan</label>
                <select
                  value={formData.foodStorage}
                  onChange={(e) => setFormData({ ...formData, foodStorage: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 focus:bg-white transition-all"
                >
                  <option value="Chiller Active">Chiller Active</option>
                  <option value="Dry Storage Only">Dry Storage Only</option>
                  <option value="Chiller & Dry Storage">Chiller & Dry Storage</option>
                  <option value="No Specialized Storage">No Specialized Storage</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 text-sm transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-950 text-white font-bold flex items-center gap-2 text-sm shadow-md hover:shadow-lg transition-all"
                >
                  <Save size={16} /> Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Premium Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-[9999] animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl border backdrop-blur-md ${
            notification.type === 'success'
              ? 'bg-[#EAF3E1]/95 border-[#1A5632]/20 text-[#1A5632]'
              : notification.type === 'error'
                ? 'bg-red-50/95 border-red-200 text-red-950'
                : 'bg-blue-50/95 border-blue-200 text-blue-950'
          }`}>
            {notification.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />}
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
