"use client";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Heart, ShoppingCart, MapPin, Clock } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useState, useEffect } from 'react';

export default function ProductCard({ product }: { product: any }) {
  const router = useRouter();
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
    return 'Rp' + (amount * 10000).toLocaleString('id-ID');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (addItem) {
      addItem({ ...product, quantity: 1 });
      alert("Ditambahkan ke keranjang!");
    }
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    if (addItem) {
      addItem({ ...product, quantity: 1 });
    }
    router.push('/buyer/checkout');
  };

  const getImageUrl = () => {
    if (product.image && product.image.trim() !== '') return product.image;
    
    const nameLower = (product.name || '').toLowerCase();
    if (nameLower.includes('roti') || nameLower.includes('bakery') || nameLower.includes('pastry') || nameLower.includes('bread') || nameLower.includes('cookie')) {
      return "https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=500&auto=format&fit=crop&q=60";
    }
    if (nameLower.includes('nasi') || nameLower.includes('rice') || nameLower.includes('bowl') || nameLower.includes('meal')) {
      return "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&auto=format&fit=crop&q=60";
    }
    if (nameLower.includes('minum') || nameLower.includes('drink') || nameLower.includes('juice') || nameLower.includes('brew') || nameLower.includes('coffee')) {
      return "https://images.unsplash.com/photo-1622597467836-f38240662c8c?w=500&auto=format&fit=crop&q=60";
    }
    // Fallback resmi EcoEat
    return "/images/garden-bg.png";
  };

  return (
    <Link href={`/buyer/product/${product.id}`} className="block bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-[#eef3e8] relative group flex flex-col h-full">
      <div className="relative h-48 w-full bg-[#f4f7ed] flex-shrink-0">
        <img 
          src={getImageUrl()} 
          alt={product.name} 
          className="w-full h-full object-cover" 
          onError={(e) => { e.currentTarget.src = "/images/garden-bg.png" }} 
        />
        <div className="absolute top-4 left-4 bg-[#dc2626] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
          -{product.discountPercentage}%
        </div>
        <button onClick={handleLoveClick} className={`absolute top-4 right-4 bg-white/90 backdrop-blur p-2 rounded-full transition-colors shadow-sm ${isLoved ? 'text-red-500 bg-white' : 'text-gray-400 hover:text-red-500 hover:bg-white'}`}>
          <Heart className={`w-4 h-4 ${isLoved ? 'fill-current' : ''}`} />
        </button>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center text-[10px] font-bold text-red-600 mb-2 uppercase tracking-wider">
          <Clock className="w-3 h-3 mr-1" /> EXPIRES IN {product.expiresIn}
        </div>
        <h3 className="font-bold text-lg text-gray-900 mb-1 leading-tight">{product.name}</h3>
        <div className="flex items-center text-xs text-gray-500 mb-5 font-medium">
          <MapPin className="w-3 h-3 mr-1" />
          {product.vendor} • {product.distance} miles
        </div>
        
        <div className="mt-auto flex flex-col gap-4">
          <div>
            <span className="text-gray-400 line-through text-xs font-medium">{formatRp(product.price)}</span>
            <div className="text-xl font-extrabold text-green-700">{formatRp(product.discountPrice)}</div>
          </div>
          
          <div className="flex gap-2 w-full">
            <button 
              onClick={handleAddToCart}
              className="flex-1 border border-green-700 text-green-700 hover:bg-green-50 font-bold py-2 rounded-xl transition-colors flex items-center justify-center gap-1 group/btn"
            >
              <ShoppingCart className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
              <span className="text-sm">Cart</span>
            </button>
            <button 
              onClick={handleBuyNow}
              className="flex-1 bg-green-700 hover:bg-green-800 text-white font-bold py-2 rounded-xl transition-colors shadow-md text-sm"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
