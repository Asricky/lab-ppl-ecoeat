"use client";

import { useState, useEffect } from 'react';
import { Clock, MapPin, ShoppingBag } from 'lucide-react';

export default function ProductCard({ product }) {
  const [timeLeft, setTimeLeft] = useState(product.expired_hours_left * 3600); 

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isWarning = timeLeft > 0 && timeLeft < 3600; // Less than 1 hour

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
      <div className="h-48 bg-gray-100 relative overflow-hidden">
        <img src={product.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className={`absolute top-3 right-3 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center shadow-md backdrop-blur-sm ${timeLeft <= 0 ? 'bg-gray-800' : isWarning ? 'bg-red-500 animate-pulse' : 'bg-orange-500'}`}>
          <Clock className="w-3.5 h-3.5 mr-1.5" />
          {timeLeft > 0 ? formatTime(timeLeft) : 'Expired'}
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-4 flex items-center">
          <MapPin className="w-4 h-4 mr-1.5 text-green-600 flex-shrink-0" />
          <span className="truncate">{product.seller_name}</span>
          <span className="mx-2 text-gray-300">•</span>
          <span className="flex-shrink-0 font-medium text-gray-600">{product.distance} km</span>
        </p>
        <div className="flex justify-between items-end mt-4 pt-4 border-t border-gray-50">
          <div>
            <p className="text-xs text-gray-400 line-through mb-0.5">Rp {product.original_price.toLocaleString('id-ID')}</p>
            <p className="text-xl font-bold text-green-600">Rp {product.discount_price.toLocaleString('id-ID')}</p>
          </div>
          <button 
            disabled={timeLeft <= 0}
            className={`flex items-center justify-center px-4 py-2.5 rounded-xl font-medium transition-all text-sm shadow-sm ${timeLeft <= 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 hover:shadow-green-200/50 hover:shadow-lg text-white active:scale-95'}`}
          >
            <ShoppingBag className="w-4 h-4 mr-1.5" />
            Beli
          </button>
        </div>
      </div>
    </div>
  );
}
