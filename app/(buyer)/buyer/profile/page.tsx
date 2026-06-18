"use client";
import { useState, useEffect, Suspense, useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Wallet, MapPin, Settings, HelpCircle, LogOut, Download, Plus, CheckCircle2, AlertCircle, X, Info } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useEcoPayStore } from "@/store/ecoPayStore";
import { useBuyerAddressesStore } from "@/store/buyerAddressesStore";

function ProfileContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'ecopay';
  const [activeTab, setActiveTab] = useState(initialTab);
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const balance = useEcoPayStore((s) => s.balance);
  const addBalance = useEcoPayStore((s) => s.addBalance);
  const deductBalance = useEcoPayStore((s) => s.deductBalance);
  const transactions = useEcoPayStore((s) => s.transactions);

  const addresses = useBuyerAddressesStore((s) => s.addresses);
  const setPrimaryAddress = useBuyerAddressesStore((s) => s.setPrimary);

  const sortedAddresses = useMemo(() => [...addresses].sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary)), [addresses]);

  const [topupAmount, setTopupAmount] = useState('');
  const [topupBank, setTopupBank] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawBank, setWithdrawBank] = useState('');
  const [withdrawAccount, setWithdrawAccount] = useState('');
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);

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

  const formatRp = (amount: number) => {
    return 'Rp' + amount.toLocaleString('id-ID');
  };

  const handleLogout = () => {
    setUser(null, null);
    router.push('/login');
  };

  const handleTopup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topupAmount || !topupBank) return showToast("Pilih bank dan masukkan nominal!", "error");
    addBalance(Number(topupAmount), `Top-up via ${topupBank}`);
    showToast("Top-up berhasil!", "success");
    setTopupAmount('');
    setActiveTab('ecopay');
  };

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  const transactionDisplay = (t: { type: string; amount: number }) => {
    const isCredit = t.type === "topup" || t.type === "refund";
    const amountClass = t.type === "refund" ? "text-green-700" : t.type === "topup" ? "text-green-600" : "text-gray-800";
    return { prefix: isCredit ? "+" : "−", amountClass };
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawAmount || !withdrawBank || !withdrawAccount) return showToast("Lengkapi data penarikan!", "error");
    if (Number(withdrawAmount) > balance) return showToast("Saldo tidak mencukupi!", "error");
    deductBalance(Number(withdrawAmount), `Withdraw to ${withdrawBank}`);
    showToast("Penarikan berhasil!", "success");
    setWithdrawAmount('');
    setWithdrawAccount('');
    setActiveTab('ecopay');
  };

  return (
    <div className="max-w-6xl mx-auto pb-12 flex flex-col md:flex-row gap-8 mt-8">
      {/* Sidebar */}
      <div className="w-full md:w-64 flex-shrink-0">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#e1e8d5]">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xl">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div>
              <h2 className="font-bold text-gray-900">{user?.name || "User"}</h2>
              <p className="text-xs text-gray-500 font-medium">{user?.email || "user@example.com"}</p>
            </div>
          </div>

          <nav className="space-y-2">
            <button onClick={() => setActiveTab('ecopay')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'ecopay' || activeTab === 'topup' || activeTab === 'withdraw' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}>
              <Wallet className="w-5 h-5" />
              <span>EcoPay</span>
            </button>
            <button onClick={() => setActiveTab('address')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'address' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}>
              <MapPin className="w-5 h-5" />
              <span>Alamat Saya</span>
            </button>
            <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'settings' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}>
              <Settings className="w-5 h-5" />
              <span>Pengaturan</span>
            </button>
            <button onClick={() => setActiveTab('help')} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'help' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}>
              <HelpCircle className="w-5 h-5" />
              <span>Pusat Bantuan</span>
            </button>
            <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-bold text-red-600 hover:bg-red-50 transition-colors mt-4">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {(activeTab === 'ecopay' || activeTab === 'topup' || activeTab === 'withdraw') && (
          <div className="space-y-6">
            <div className="bg-[#388e3c] rounded-3xl p-8 text-white relative overflow-hidden shadow-lg border border-[#2e7d32]">
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-green-500 rounded-full opacity-30 blur-3xl"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-green-100 tracking-widest uppercase">SALDO ECOPAY</span>
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-4xl font-extrabold mb-8">{formatRp(balance)}</h3>

                <div className="flex space-x-4">
                  <button onClick={() => setActiveTab('topup')} className="bg-white text-green-800 font-bold px-6 py-2.5 rounded-full hover:bg-green-50 transition-colors shadow-sm flex items-center text-sm">
                    <Plus className="w-4 h-4 mr-1" /> Top Up
                  </button>
                  <button onClick={() => setActiveTab('withdraw')} className="bg-green-800 text-white font-bold px-6 py-2.5 rounded-full hover:bg-green-900 transition-colors shadow-sm flex items-center text-sm border border-green-700">
                    <Download className="w-4 h-4 mr-1" /> Withdraw
                  </button>
                </div>
              </div>
            </div>

            {activeTab === 'topup' && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#e1e8d5]">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Top Up Saldo</h3>
                <form onSubmit={handleTopup} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Pilih Metode Pembayaran</label>
                    <select value={topupBank} onChange={e => setTopupBank(e.target.value)} className="w-full bg-[#f4f7ed] border border-[#e1e8d5] rounded-xl p-4 text-sm font-medium text-gray-800 outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-all">
                      <option value="">Pilih Bank (Virtual Account/Transfer)</option>
                      <option value="BCA Virtual Account">BCA Virtual Account</option>
                      <option value="Mandiri Virtual Account">Mandiri Virtual Account</option>
                      <option value="BNI Virtual Account">BNI Virtual Account</option>
                      <option value="BRI Virtual Account">BRI Virtual Account</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Pilih Nominal Cepat</label>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {[50000, 100000, 250000].map(amount => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => setTopupAmount(amount.toString())}
                          className={`py-2 rounded-xl text-sm font-bold border transition-colors ${topupAmount === amount.toString() ? 'bg-green-700 text-white border-green-700 shadow-sm' : 'bg-white text-green-800 border-green-700 hover:bg-green-50'}`}
                        >
                          Rp{amount.toLocaleString('id-ID')}
                        </button>
                      ))}
                    </div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Atau Masukkan Nominal Lain (Rp)</label>
                    <input type="number" value={topupAmount} onChange={e => setTopupAmount(e.target.value)} placeholder="Contoh: 50000" className="w-full bg-[#f4f7ed] border border-[#e1e8d5] rounded-xl p-4 text-sm font-medium text-gray-800 outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-all" />
                  </div>
                  <button type="submit" className="bg-green-700 hover:bg-green-800 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md hover:shadow-lg w-full mt-2">Lanjutkan Pembayaran</button>
                </form>
              </div>
            )}

            {activeTab === 'withdraw' && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#e1e8d5]">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Tarik Saldo</h3>
                <form onSubmit={handleWithdraw} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Pilih Bank Tujuan</label>
                    <select value={withdrawBank} onChange={e => setWithdrawBank(e.target.value)} className="w-full bg-[#f4f7ed] border border-[#e1e8d5] rounded-xl p-4 text-sm font-medium text-gray-800 outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-all">
                      <option value="">Pilih Bank Tujuan</option>
                      <option value="BCA">Bank BCA</option>
                      <option value="Mandiri">Bank Mandiri</option>
                      <option value="BNI">Bank BNI</option>
                      <option value="BRI">Bank BRI</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Nomor Rekening</label>
                    <input type="text" value={withdrawAccount} onChange={e => setWithdrawAccount(e.target.value)} placeholder="Masukkan nomor rekening" className="w-full bg-[#f4f7ed] border border-[#e1e8d5] rounded-xl p-4 text-sm font-medium text-gray-800 outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Nominal Penarikan (Rp)</label>
                    <input type="number" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} placeholder="Contoh: 50000" max={balance} className="w-full bg-[#f4f7ed] border border-[#e1e8d5] rounded-xl p-4 text-sm font-medium text-gray-800 outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-all" />
                  </div>
                  <button type="submit" className="bg-green-700 hover:bg-green-800 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md hover:shadow-lg w-full mt-2">Tarik Sekarang</button>
                </form>
              </div>
            )}

            {activeTab === 'ecopay' && (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#e1e8d5]">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Riwayat Transaksi</h3>
                {transactions.length > 0 ? (
                  <div className="space-y-4">
                    {transactions.map((t: { id: number; type: string; amount: number; method: string; date: string }) => {
                      const { prefix, amountClass } = transactionDisplay(t);
                      const typeBadge =
                        t.type === 'refund' ? 'Refund' : t.type === 'topup' ? 'Top-up' : t.type === 'withdraw' ? 'Tarik tunai / bayar' : t.type;
                      return (
                        <div key={t.id} className="flex justify-between gap-4 items-start p-4 border-b border-gray-100 last:border-0 rounded-2xl hover:bg-[#f4f7ed]/50 transition-colors">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="text-[10px] font-bold uppercase tracking-wide text-green-900/70 bg-green-50 border border-green-100 px-2 py-0.5 rounded-lg">{typeBadge}</span>
                            </div>
                            <p className="font-bold text-gray-900 truncate">{t.method}</p>
                            <p className="text-xs text-gray-500" suppressHydrationWarning>{new Date(t.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                          <span className={`font-extrabold tabular-nums shrink-0 ${amountClass}`}>
                            {prefix}{formatRp(t.amount)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm font-medium text-center py-4">Belum ada transaksi.</p>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'address' && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#e1e8d5] space-y-5">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <h3 className="text-xl font-bold text-gray-900">Alamat Saya</h3>
              <Link
                href="/buyer/profile/addresses/new"
                className="inline-flex items-center gap-2 rounded-xl bg-green-800 hover:bg-green-900 text-white text-sm font-bold px-5 py-2.5 shadow-sm transition-colors"
              >
                <Plus className="w-4 h-4" /> Tambah Alamat
              </Link>
            </div>
            {sortedAddresses.length === 0 ? (
              <p className="text-gray-500 text-sm font-medium text-center py-8 rounded-2xl border border-dashed border-[#d4dec4] bg-[#f4f7ed]/50">
                Belum ada alamat. Tambahkan alamat pengiriman Anda.
              </p>
            ) : (
              <ul className="space-y-4">
                {sortedAddresses.map((a) => (
                  <li
                    key={a.id}
                    className={`rounded-2xl border p-5 transition-shadow ${a.isPrimary ? "border-green-700 bg-[#eef3e8] shadow-sm" : "border-[#d4dec4] bg-[#f4f7ed]/40 hover:border-green-700/35"
                      }`}
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {a.isPrimary && (
                        <span className="bg-green-800 text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-lg">Utama</span>
                      )}
                      <span className="font-bold text-gray-900">{a.label}</span>
                    </div>
                    <p className="font-bold text-gray-900 mb-1">
                      {a.fullName} <span className="text-green-900/70 font-semibold">•</span> {a.phone}
                    </p>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      {a.streetDetail}
                      <br />
                      Kec. {a.district}, {a.city}, {a.province} {a.postalCode}
                    </p>
                    <div className="flex gap-4 items-center mt-2">
                      {!a.isPrimary && (
                        <button
                          type="button"
                          onClick={() => setPrimaryAddress(a.id)}
                          className="text-sm font-bold text-green-800 hover:text-green-900 underline-offset-4 hover:underline"
                        >
                          Jadikan alamat utama
                        </button>
                      )}
                      <Link
                        href={`/buyer/profile/addresses/edit/${a.id}`}
                        className="text-sm font-bold text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => setAddressToDelete(a.id)}
                        className="text-sm font-bold text-red-600 hover:text-red-700 underline-offset-4 hover:underline"
                      >
                        Hapus
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#e1e8d5]">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Pengaturan</h3>
            <p className="text-gray-500 text-sm">Pengaturan akun dan privasi akan tersedia di sini.</p>
          </div>
        )}

        {activeTab === 'help' && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#e1e8d5]">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Pusat Bantuan</h3>
            <p className="text-gray-500 text-sm">Butuh bantuan? Hubungi support@ecoeat.id atau lihat FAQ kami.</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {addressToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative">
            <h3 className="text-xl font-extrabold text-gray-900 mb-2">Hapus Alamat?</h3>
            <p className="text-sm text-gray-500 font-medium mb-8">
              Apakah Anda yakin ingin menghapus alamat ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setAddressToDelete(null)}
                className="flex-1 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3.5 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  useBuyerAddressesStore.getState().deleteAddress(addressToDelete);
                  showToast("Alamat berhasil dihapus", "success");
                  setAddressToDelete(null);
                }}
                className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 shadow-md transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

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

export default function ProfilePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
