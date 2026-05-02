import Link from 'next/link';
import { Shield, ShoppingBag, Truck, Building2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
          Selamat datang di <span className="text-green-600">EcoEat</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Platform marketplace dan pengantaran makanan surplus untuk masa depan yang lebih berkelanjutan.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/dashboard/admin" className="group">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Admin Dashboard</h3>
            <p className="text-gray-500">Pusat kendali dan manajemen sistem keseluruhan.</p>
          </div>
        </Link>

        <Link href="/dashboard/seller" className="group">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Building2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Seller Dashboard</h3>
            <p className="text-gray-500">Kelola produk surplus makanan dan verifikasi toko.</p>
          </div>
        </Link>

        <Link href="/dashboard/buyer" className="group">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Buyer / LKS Dashboard</h3>
            <p className="text-gray-500">Eksplorasi makanan dengan peta interaktif & diskon.</p>
          </div>
        </Link>

        <Link href="/dashboard/kurir" className="group">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Truck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Kurir Dashboard</h3>
            <p className="text-gray-500">Manajemen pengantaran dan proses handover OTP.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
