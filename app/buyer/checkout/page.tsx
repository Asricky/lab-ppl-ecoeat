"use client";
import { Truck, Store, MapPin, Wallet, Leaf, Info } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

export default function CheckoutPage() {
  const { items } = useCartStore();
  const total = items.reduce((acc, item) => acc + (item.discountPrice * item.quantity), 0);

  const formatRp = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount * 10000);
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-10">
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-2">SECURE CHECKOUT</p>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">Finalize Your Harvest</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1 space-y-10">
          
          {/* 1. Delivery Method */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="w-8 h-8 rounded-full bg-[#eef3e8] text-green-700 flex items-center justify-center text-sm mr-3">1</span>
              Delivery Method
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border-2 border-green-700 bg-white rounded-3xl p-6 cursor-pointer relative shadow-sm">
                <div className="flex items-start">
                  <Truck className="w-6 h-6 text-green-700 mr-4 mt-1" />
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Home Delivery</h3>
                    <p className="text-sm text-gray-500 font-medium mb-2 mt-1">Eco-friendly bike courier</p>
                    <p className="text-xs font-bold text-green-700">Free sustainable delivery</p>
                  </div>
                </div>
              </div>
              <div className="border-2 border-transparent bg-[#eef3e8] hover:bg-[#e6ebd9] rounded-3xl p-6 cursor-pointer transition-colors border-[#d4dec4]">
                <div className="flex items-start">
                  <Store className="w-6 h-6 text-gray-600 mr-4 mt-1" />
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Store Pickup</h3>
                    <p className="text-sm text-gray-500 font-medium mb-2 mt-1">Collect from our hub</p>
                    <p className="text-xs font-medium text-gray-500">Available today</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Delivery Address */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <span className="w-8 h-8 rounded-full bg-[#eef3e8] text-green-700 flex items-center justify-center text-sm mr-3">2</span>
                Delivery Address
              </h2>
              <button className="text-green-700 font-bold text-sm flex items-center hover:underline">
                <MapPin className="w-4 h-4 mr-1" /> Use saved address
              </button>
            </div>
            
            <div className="bg-[#eef3e8] rounded-t-2xl p-5 border-b-2 border-[#d4dec4]">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">STREET ADDRESS</p>
              <p className="font-bold text-gray-900 text-lg">245 Eco Lane, Suite 10</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-[#eef3e8] rounded-2xl p-5 border-b-2 border-[#d4dec4]">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">CITY</p>
                <p className="font-bold text-gray-900 text-lg">Greenwood</p>
              </div>
              <div className="bg-[#eef3e8] rounded-2xl p-5 border-b-2 border-[#d4dec4]">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">POSTAL CODE</p>
                <p className="font-bold text-gray-900 text-lg">90210</p>
              </div>
            </div>
          </section>

          {/* 3. Payment Method */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="w-8 h-8 rounded-full bg-[#eef3e8] text-green-700 flex items-center justify-center text-sm mr-3">3</span>
              Payment Method
            </h2>
            
            <div className="bg-[#388e3c] rounded-3xl p-8 text-white relative overflow-hidden shadow-lg border border-[#2e7d32]">
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-green-500 rounded-full opacity-30 blur-3xl"></div>
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-green-100 tracking-widest uppercase">ECOPAY WALLET</span>
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-extrabold mb-10">Organic Precision Balance</h3>
                
                <div className="flex justify-between items-end mt-auto">
                  <div className="bg-white/20 backdrop-blur rounded-2xl p-3 px-4 flex items-center space-x-3 border border-white/30">
                    <div className="bg-white p-1.5 rounded-full text-green-800">
                      <Leaf className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-green-100 font-bold uppercase tracking-wider">YOUR CURRENT IMPACT</p>
                      <p className="font-bold text-sm">1.2kg Carbon Offset Today</p>
                    </div>
                  </div>
                  <button className="bg-white text-green-800 font-bold px-6 py-3 rounded-full hover:bg-green-50 transition-colors shadow-sm flex items-center">
                    <span className="mr-2 text-xl">+</span> Top Up
                  </button>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Order Summary Right */}
        <div className="w-full lg:w-[400px]">
          <div className="bg-[#eef3e8] rounded-3xl p-8 sticky top-24 border border-[#d4dec4]">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-8">Order Summary</h2>
            
            <div className="space-y-6 mb-8">
              {items.map(item => (
                <div key={item.id} className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white shadow-sm flex-shrink-0 border border-[#e1e8d5]">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-sm leading-tight">{item.name}</h4>
                    <p className="text-[10px] text-gray-500 font-medium mt-1">{item.quantity} Units • {item.vendor}</p>
                  </div>
                  <div className="font-bold text-gray-900">
                    {formatRp(item.discountPrice * item.quantity)}
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <p className="text-sm text-gray-500 font-medium text-center">No items to checkout.</p>
              )}
            </div>

            <div className="border-t border-[#d4dec4] pt-6 space-y-4 mb-6">
              <div className="flex justify-between text-gray-600 font-medium text-sm">
                <span>Subtotal</span>
                <span>{formatRp(total)}</span>
              </div>
              <div className="flex justify-between text-gray-600 font-medium text-sm items-center">
                <span>Delivery Fee</span>
                <div>
                  <span className="bg-[#d4dec4] text-green-800 text-[10px] font-bold px-2 py-1 rounded mr-3">Sustainable</span>
                  <span className="font-bold text-green-700">{formatRp(0)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-end mb-8 border-t border-[#d4dec4] pt-6">
              <span className="text-2xl font-extrabold text-gray-900">Total</span>
              <span className="text-2xl font-extrabold text-green-700">{formatRp(total)}</span>
            </div>

            <button 
              disabled={items.length === 0}
              className="w-full bg-[#388e3c] hover:bg-[#2e7d32] text-white font-bold py-4 rounded-xl transition-colors shadow-md flex items-center justify-center disabled:opacity-50"
            >
              Pay Now <span className="ml-2">→</span>
            </button>

            <div className="bg-[#ebd9d1]/50 border border-[#e1cfc7] rounded-xl p-4 mt-6 flex items-start space-x-3">
              <Info className="w-4 h-4 text-[#8e6856] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-[#8e6856] font-medium leading-relaxed">
                Expired items will be automatically removed from your cart before processing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
