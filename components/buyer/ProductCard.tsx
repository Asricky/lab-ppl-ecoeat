import Link from 'next/link';
import { Heart, ShoppingCart, MapPin, Clock } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useState, useEffect } from 'react';

export default function ProductCard({ product }: { product: any }) {
  const addItem = useCartStore(state => state.addItem);
  const [isLoved, setIsLoved] = useState(false);

  useEffect(() => {
    fetch('/api/saved-items').then(res => res.json()).then(data => {
      if (data.find((item: any) => item.id === product.id)) {
        setIsLoved(true);
      }
    }).catch(() => {});
  }, [product.id]);

  const handleLoveClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoved(!isLoved);
    try {
      await fetch('/api/saved-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
    } catch (err) {}
  };

  const formatRp = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount * 10000);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({ ...product, quantity: 1 });
  };

  return (
    <Link href={`/dashboard/buyer/product/${product.id}`} className="block bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-[#eef3e8] relative group">
      <div className="relative h-48 w-full bg-[#f4f7ed]">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        <div className="absolute top-4 left-4 bg-[#dc2626] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
          -{product.discountPercentage}%
        </div>
        <button onClick={handleLoveClick} className={`absolute top-4 right-4 bg-white/90 backdrop-blur p-2 rounded-full transition-colors shadow-sm ${isLoved ? 'text-red-500 bg-white' : 'text-gray-400 hover:text-red-500 hover:bg-white'}`}>
          <Heart className={`w-4 h-4 ${isLoved ? 'fill-current' : ''}`} />
        </button>
      </div>
      <div className="p-5">
        <div className="flex items-center text-[10px] font-bold text-red-600 mb-2 uppercase tracking-wider">
          <Clock className="w-3 h-3 mr-1" /> EXPIRES IN {product.expiresIn}
        </div>
        <h3 className="font-bold text-lg text-gray-900 mb-1 leading-tight">{product.name}</h3>
        <div className="flex items-center text-xs text-gray-500 mb-5 font-medium">
          <MapPin className="w-3 h-3 mr-1" />
          {product.vendor} • {product.distance} miles
        </div>
        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-gray-400 line-through text-xs font-medium">{formatRp(product.price)}</span>
            <div className="text-xl font-extrabold text-green-700">{formatRp(product.discountPrice)}</div>
          </div>
          <button 
            onClick={handleAddToCart}
            className="bg-green-700 hover:bg-green-800 text-white p-3 rounded-xl transition-colors shadow-md hover:shadow-lg"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Link>
  );
}
