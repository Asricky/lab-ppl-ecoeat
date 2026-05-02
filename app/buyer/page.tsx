"use client";
import { useAuthStore } from "@/store/authStore";
import ProductCard from "@/components/buyer/ProductCard";

const products = [
  { id: '1', name: 'Mediterranean Bowl', price: 14.00, discountPrice: 7.00, discountPercentage: 50, vendor: 'Green Garden Deli', distance: 0.4, expiresIn: '3 HOURS', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
  { id: '2', name: 'Artisan Sourdough', price: 8.50, discountPrice: 2.55, discountPercentage: 70, vendor: 'Hearth & Grain', distance: 1.2, expiresIn: '1 HOUR', image: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
  { id: '3', name: 'Pastry Surprise Box', price: 12.00, discountPrice: 7.20, discountPercentage: 40, vendor: 'Sweet Haven', distance: 0.8, expiresIn: '6 HOURS', image: 'https://images.unsplash.com/photo-1495147466023-ff5a443385f5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
  { id: '4', name: 'Green Vitality Juice', price: 9.00, discountPrice: 3.60, discountPercentage: 60, vendor: 'Pure Press', distance: 2.5, expiresIn: '2 HOURS', image: 'https://images.unsplash.com/photo-1622597467836-f38240662c8c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
];

export default function BuyerDashboardPage() {
  const { user } = useAuthStore();
  
  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 flex items-center">
          Hi, {user?.name || 'Julian Rivers'} <span className="ml-2">👋</span>
        </h1>
        <p className="text-gray-500 text-lg mt-1 font-medium">Find surplus food near you and reduce waste.</p>
      </div>

      <div className="bg-[#4aa04f] rounded-3xl p-8 md:p-10 text-white mb-10 relative overflow-hidden shadow-lg border border-[#3d8b42]">
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-green-600 rounded-full opacity-50 blur-3xl"></div>
        <div className="relative z-10">
          <span className="bg-white/20 px-4 py-1.5 rounded-full text-sm font-bold tracking-wider mb-6 inline-block">ECO IMPACT</span>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">You saved 5 meals this week 🌱</h2>
          <p className="text-green-50 max-w-2xl text-lg font-medium leading-relaxed">
            Your choices prevented 3.2kg of CO2 emissions. You're a hero of the digital ecosystem!
          </p>
        </div>
      </div>

      <div className="flex space-x-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {['All Surplus', 'Meals', 'Snacks', 'Drinks', 'Bakery'].map((cat, i) => (
          <button 
            key={cat} 
            className={`px-6 py-2.5 rounded-full font-bold whitespace-nowrap transition-colors ${i === 0 ? 'bg-green-800 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-green-50 border border-[#d4dec4]'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      <div className="mt-8 flex justify-end">
         <div className="bg-[#ebd9d1] px-6 py-4 rounded-full flex items-center space-x-3 shadow-sm border border-[#e1cfc7]">
            <div className="bg-green-800 rounded-full p-2 text-white">
               <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <div>
               <p className="text-[10px] font-bold text-[#8e6856] uppercase tracking-wider">GLOBAL IMPACT</p>
               <p className="text-gray-900 font-extrabold text-sm">450kg waste saved today</p>
            </div>
         </div>
      </div>
    </div>
  );
}
