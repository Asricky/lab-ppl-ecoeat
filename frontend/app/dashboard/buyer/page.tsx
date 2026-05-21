import MapContainer from '@/components/MapContainer';
import ProductCard from '@/components/ProductCard';

export default function BuyerDashboard() {
  const dummyLocations = [
    { lat: -6.200000, lng: 106.816666, name: 'Warung Bu Ani', type: 'seller' },
    { lat: -6.210000, lng: 106.820000, name: 'Panti Asuhan Berkah', type: 'lks' },
  ];

  const dummyProduct = {
    name: 'Nasi Kotak Ayam Bakar Spesial',
    seller_name: 'Warung Bu Ani',
    distance: 2.4,
    original_price: 25000,
    discount_price: 15000,
    expired_hours_left: 1.5,
  };

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
          <ProductCard product={dummyProduct} />
          <ProductCard product={{...dummyProduct, name: 'Kue Basah Campur', expired_hours_left: 0.5}} />
          <ProductCard product={{...dummyProduct, name: 'Sayur Asem Segar', expired_hours_left: 0}} />
          <ProductCard product={{...dummyProduct, name: 'Ayam Goreng Lengkuas', expired_hours_left: 2}} />
        </div>
      </div>
    </div>
  );
}
