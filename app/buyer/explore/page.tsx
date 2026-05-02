"use client";
import { useState } from "react";
import FilterBar from "@/components/buyer/FilterBar";
import ProductCard from "@/components/buyer/ProductCard";

const allProducts = [
  { id: '2', name: 'Artisan Sourdough Bundle', price: 9.00, discountPrice: 4.50, discountPercentage: 50, vendor: 'Hearth & Grain', distance: 1.2, expiresIn: '3 HOURS', image: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', category: 'Bakery' },
  { id: '5', name: 'Roasted Veggie Bowl', price: 12.00, discountPrice: 7.20, discountPercentage: 40, vendor: 'Green Garden Deli', distance: 0.8, expiresIn: '4 HOURS', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', category: 'Meals' },
  { id: '3', name: 'Evening Pastry Box', price: 12.50, discountPrice: 5.00, discountPercentage: 60, vendor: 'Sweet Haven', distance: 2.1, expiresIn: '1 HOUR', image: 'https://images.unsplash.com/photo-1495147466023-ff5a443385f5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', category: 'Bakery' },
  { id: '6', name: 'Salmon Poke Salad', price: 17.00, discountPrice: 8.50, discountPercentage: 50, vendor: 'Ocean Fresh', distance: 1.5, expiresIn: '2 HOURS', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', category: 'Meals' },
  { id: '4', name: 'Cold-Pressed Detox Duo', price: 13.00, discountPrice: 9.00, discountPercentage: 30, vendor: 'Pure Press', distance: 2.5, expiresIn: '5 HOURS', image: 'https://images.unsplash.com/photo-1622597467836-f38240662c8c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', category: 'Drinks' },
  { id: '7', name: 'Dark Cocoa Brownie Box', price: 12.00, discountPrice: 6.00, discountPercentage: 50, vendor: 'Sweet Haven', distance: 0.8, expiresIn: '2 HOURS', image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', category: 'Bakery' },
];

export default function ExplorePage() {
  const [filters, setFilters] = useState({
    category: 'Bakery',
    maxPrice: 25,
    maxDistance: 10,
    condition: 'Near expiry'
  });

  // Client-side filtering logic
  const filteredProducts = allProducts.filter(p => {
    if (filters.category && p.category !== filters.category) return false;
    if (p.discountPrice > filters.maxPrice) return false;
    if (p.distance > filters.maxDistance) return false;
    return true;
  });

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-8 pb-12">
      <FilterBar filters={filters} setFilters={setFilters} />
      
      <div className="flex-1">
        <div className="mb-6">
          <div className="flex items-center text-[10px] font-bold text-green-700 uppercase tracking-widest mb-1">
            <span className="w-8 h-[2px] bg-green-700 mr-2"></span> LIVE FEED
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Explore Food</h1>
          <p className="text-gray-500 font-medium">Browse {filteredProducts.length} surplus items near you in <span className="text-gray-900 font-bold">Portland</span></p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
          
          <div className="sm:col-span-2 bg-[#1b5e20] rounded-3xl p-8 text-white flex flex-col justify-between shadow-lg relative overflow-hidden border border-[#144517]">
            <div className="relative z-10">
              <h2 className="text-3xl font-extrabold mb-4 leading-tight">Save food, save money,<br/>save the planet.</h2>
              <p className="text-green-50 mb-8 max-w-sm font-medium">Our community has saved over 1.2M meals this year alone. Join the movement and find delicious surplus nearby.</p>
              <button className="bg-white text-green-900 font-bold px-6 py-3 rounded-xl hover:bg-green-50 transition-colors shadow-md">
                Learn Your Impact
              </button>
            </div>
            <div className="absolute right-0 bottom-0 w-64 h-64 bg-green-600 rounded-full translate-x-1/3 translate-y-1/3 opacity-40 blur-3xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
