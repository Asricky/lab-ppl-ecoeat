"use client";
import { useState } from 'react';
import { Leaf, Clock, MapPin, Box, Utensils, ShieldCheck, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

// Mock product
const product = {
  id: '8', name: 'Organic Heirloom Tomatoes', price: 5.80, discountPrice: 3.50, discountPercentage: 40, vendor: 'Green Valley Farm', distance: 1.2, expiresIn: '02h 45m', unit: 'per 100gr',
  images: [
    'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    'https://images.unsplash.com/photo-1561136594-7f68413baa99?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    'https://images.unsplash.com/photo-1596199050105-6d5d32222916?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  ]
};

export default function ProductDetailPage() {
  const [mainImg, setMainImg] = useState(product.images[0]);
  const [qty, setQty] = useState(1);
  const addItem = useCartStore(state => state.addItem);

  const handleAddToCart = () => {
    addItem({ ...product, quantity: qty, image: product.images[0] });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    window.location.href = '/buyer/checkout';
  };

  const formatRp = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount * 10000);
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex flex-col lg:flex-row gap-12 mb-16">
        
        {/* Gallery */}
        <div className="w-full lg:w-1/2">
          <div className="bg-white rounded-3xl overflow-hidden aspect-square mb-4 shadow-sm border border-[#eef3e8]">
            <img src={mainImg} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((img, idx) => (
              <div 
                key={idx} 
                onClick={() => setMainImg(img)}
                className={`aspect-square rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${mainImg === img ? 'border-green-600 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'}`}
              >
                <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className="flex items-center space-x-3 mb-4">
            <span className="bg-[#fde8e8] text-red-700 text-xs font-bold px-2 py-1 rounded-md">-{product.discountPercentage}%</span>
            <span className="text-gray-500 text-xs font-bold tracking-widest uppercase bg-[#e1e8d5] px-3 py-1 rounded-full">Surplus Rescue</span>
            <span className="bg-[#eef3e8] text-green-800 text-xs font-bold px-3 py-1 rounded-full flex items-center shadow-sm">
              <Leaf className="w-3 h-3 mr-1 text-green-600" /> Saves 1.2kg CO2e
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">{product.name}</h1>
          
          <div className="flex items-baseline space-x-3 mb-8">
            <span className="text-4xl font-extrabold text-green-700">{formatRp(product.discountPrice)}</span>
            <span className="text-xl text-gray-400 line-through font-medium">{formatRp(product.price)}</span>
            <span className="text-gray-500 font-medium">{product.unit}</span>
          </div>

          {/* Expires widget */}
          <div className="bg-red-50 border border-red-100 rounded-2xl p-5 mb-8 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-600"></div>
            <div className="flex justify-between items-center mb-3 ml-2">
              <div className="flex items-center text-red-700 font-bold">
                <Clock className="w-5 h-5 mr-2" /> Expires in: {product.expiresIn}
              </div>
              <div className="flex space-x-2">
                <span className="bg-white text-gray-600 text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider">Near Expiry</span>
                <span className="bg-white text-gray-600 text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase tracking-wider">Surplus</span>
              </div>
            </div>
            <div className="w-full bg-red-200 rounded-full h-1.5 mb-2 ml-2 pr-4">
              <div className="bg-red-600 h-1.5 rounded-full" style={{ width: '15%' }}></div>
            </div>
            <p className="text-right text-[10px] font-bold text-red-700 uppercase tracking-wider pr-2">Only 4 left - Selling Fast!</p>
          </div>

          {/* Vendor */}
          <div className="bg-[#eef3e8] rounded-2xl p-5 mb-6 flex items-center justify-between border border-[#d4dec4] shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="bg-white p-3 rounded-xl text-green-700 shadow-sm border border-[#e1e8d5]">
                <Leaf className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{product.vendor}</h3>
                <p className="text-xs text-gray-500 flex items-center mt-1 font-medium">
                  <MapPin className="w-3 h-3 mr-1" /> Downtown Market, Sector 4
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-green-800 font-extrabold text-sm">{product.distance} miles away</div>
              <div className="text-[10px] text-green-700 font-bold uppercase tracking-wider mt-1">Local Vendor</div>
            </div>
          </div>

          {/* Handling & Storage */}
          <div className="bg-white rounded-2xl p-6 mb-8 border border-[#eef3e8] shadow-sm">
            <h4 className="flex items-center font-bold text-gray-900 mb-3 text-sm">
              <Box className="w-4 h-4 mr-2 text-gray-500" /> Handling & Storage
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed font-medium">
              Store at room temperature. Best used within 2 days of purchase. Eco-friendly compostable packaging provided to maintain freshness during transport.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-auto">
            <div className="flex items-center bg-[#eef3e8] rounded-full border border-[#d4dec4] w-full sm:w-auto p-1">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-5 py-2 text-gray-600 hover:text-green-800 transition-colors font-bold text-lg">−</button>
              <span className="w-8 text-center font-bold text-gray-900">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="px-5 py-2 text-gray-600 hover:text-green-800 transition-colors font-bold text-lg">+</button>
            </div>
            <p className="text-[10px] text-gray-500 italic mr-auto sm:mr-0 hidden sm:block font-medium">Max 4 per customer due to limited surplus stock</p>
            
            <div className="flex w-full flex-col sm:flex-row gap-3 ml-auto sm:justify-end mt-4 sm:mt-0">
              <button 
                onClick={handleAddToCart}
                className="w-full sm:w-auto sm:min-w-[160px] flex-1 max-w-full sm:max-w-[200px] bg-[#388e3c] hover:bg-[#2e7d32] text-white font-bold py-4 rounded-xl transition-colors shadow-md flex justify-center items-center"
              >
                <ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart
              </button>
              <button 
                onClick={handleBuyNow}
                className="w-full sm:w-auto sm:min-w-[160px] flex-1 max-w-full sm:max-w-[200px] bg-white hover:bg-green-50 text-green-800 border-2 border-[#388e3c] font-bold py-4 rounded-xl transition-colors shadow-sm flex justify-center items-center"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Why Rescue */}
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Why rescue this produce?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#eef3e8] rounded-3xl p-8 border border-[#d4dec4] shadow-sm">
          <Leaf className="w-8 h-8 text-green-800 mb-5" />
          <h3 className="font-extrabold text-green-900 text-lg mb-3">Environmental Impact</h3>
          <p className="text-sm text-green-800/80 leading-relaxed font-medium">Every rescue prevents methane emissions from landfill waste and honors the water and soil used in growth.</p>
        </div>
        <div className="bg-[#eef3e8] rounded-3xl p-8 border border-[#d4dec4] shadow-sm">
          <Utensils className="w-8 h-8 text-gray-700 mb-5" />
          <h3 className="font-extrabold text-gray-900 text-lg mb-3">Perfect for Sauces</h3>
          <p className="text-sm text-gray-600 leading-relaxed font-medium">Heirloom varieties near expiry are at their peak sweetness and softness—ideal for artisanal marinara or gazpacho.</p>
        </div>
        <div className="bg-[#eef3e8] rounded-3xl p-8 border border-[#d4dec4] shadow-sm">
          <ShieldCheck className="w-8 h-8 text-green-800 mb-5" />
          <h3 className="font-extrabold text-gray-900 text-lg mb-3">Quality Guarantee</h3>
          <p className="text-sm text-gray-600 leading-relaxed font-medium">Inspected daily by our regional advocates to ensure that 'near expiry' never means 'low quality'.</p>
        </div>
      </div>
    </div>
  );
}
