"use client";

import MapContainer from '@/components/MapContainer';
import ProductCard from '@/components/ProductCard';
import { useProductStore } from '@/store/productStore';

export default function BuyerDashboard() {
  const { products } = useProductStore();

  const dummyLocations = [
    { lat: -6.200000, lng: 106.816666, name: 'Warung Bu Ani', type: 'seller' },
    { lat: -6.210000, lng: 106.820000, name: 'Panti Asuhan Berkah', type: 'lks' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Buyer Dashboard</h1>
      
      <div className="mb-10">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Marketplace Interaktif</h2>
        <MapContainer locations={dummyLocations} />
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-6">Rekomendasi Produk Surplus</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.filter((p: any) => p.type !== 'Donate').map((p: any) => {
             const original_price = parseInt(p.originalPrice?.replace(/\D/g, '') || p.price?.replace(/\D/g, '') || '25000');
             const discount_price = parseInt(p.price?.replace(/\D/g, '') || '15000');
             
             let expired_hours_left = 2;
             if (p.expiry?.includes('hour')) expired_hours_left = parseInt(p.expiry) || 2;
             if (p.expiry?.includes('min')) expired_hours_left = (parseInt(p.expiry) || 30) / 60;
             if (p.expiry?.includes('day')) expired_hours_left = (parseInt(p.expiry) || 1) * 24;

             return (
               <ProductCard key={p.id} product={{
                 name: p.name,
                 seller_name: 'Verdant Bakery',
                 distance: 1.5,
                 original_price,
                 discount_price,
                 expired_hours_left,
               }} />
             );
          })}
          {products.filter((p: any) => p.type !== 'Donate').length === 0 && (
            <div className="col-span-full py-12 text-center bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-gray-500 font-bold">No surplus products available right now.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
