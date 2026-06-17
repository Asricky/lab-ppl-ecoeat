"use client";
import Link from 'next/link';
import { Trash2, Leaf } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { items, updateQuantity, removeItem } = useCartStore();
  const router = useRouter();

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalDiscountPrice = items.reduce((acc, item) => acc + (item.discountPrice * item.quantity), 0);
  const discount = subtotal - totalDiscountPrice;

  const formatRp = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount * 10000);
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">My Basket</h1>
        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">REVIEW YOUR INTENTIONAL CHOICES</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1">
          {items.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#eef3e8] shadow-sm">
              <p className="text-gray-500 mb-6 font-medium text-lg">Your basket is empty.</p>
              <Link href="/buyer/explore" className="text-green-700 font-bold hover:underline">
                Explore today's latest surplus
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.id} className="bg-white rounded-3xl p-4 flex flex-col sm:flex-row items-center sm:items-start gap-6 border border-[#eef3e8] shadow-sm relative pr-12">
                  <div className="w-28 h-28 rounded-2xl overflow-hidden bg-[#f4f7ed] flex-shrink-0 border border-[#e1e8d5]">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 w-full text-center sm:text-left mt-2">
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{item.name}</h3>
                    <p className="text-xs text-gray-500 font-medium mb-4">Farm-fresh surplus from {item.vendor}</p>
                    
                    <div className="flex items-center justify-center sm:justify-start bg-[#eef3e8] rounded-full w-fit mx-auto sm:mx-0 border border-[#d4dec4]">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-4 py-1.5 text-gray-600 hover:text-green-800 font-bold transition-colors">−</button>
                      <span className="w-6 text-center font-bold text-gray-900 text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-4 py-1.5 text-gray-600 hover:text-green-800 font-bold transition-colors">+</button>
                    </div>
                  </div>
                  <div className="text-center sm:text-right mt-4 sm:mt-0 flex flex-col justify-end h-full w-full sm:w-auto self-stretch pb-2">
                    <div className="text-xs text-gray-400 line-through font-medium mb-1">{formatRp(item.price * item.quantity)}</div>
                    <div className="text-2xl font-extrabold text-green-700">{formatRp(item.discountPrice * item.quantity)}</div>
                  </div>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="absolute top-6 right-6 text-gray-400 hover:text-red-500 transition-colors bg-gray-50 hover:bg-red-50 p-2 rounded-full"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              
              <div className="bg-[#eef3e8] rounded-3xl p-8 border border-dashed border-[#c3d1b0] text-center flex flex-col items-center justify-center mt-8">
                <Leaf className="w-6 h-6 text-[#9eb680] mb-3" />
                <p className="text-gray-500 font-medium mb-4">Looking to save more?</p>
                <Link href="/buyer/explore" className="text-green-800 font-extrabold hover:underline">
                  Explore today's latest surplus
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="w-full lg:w-[400px]">
          <div className="bg-white rounded-3xl p-8 border border-[#eef3e8] shadow-sm sticky top-24">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600 font-medium text-sm">
                <span>Subtotal</span>
                <span>{formatRp(subtotal)}</span>
              </div>
              <div className="flex justify-between text-green-700 font-bold text-sm">
                <span className="flex items-center"><Leaf className="w-3 h-3 mr-1" /> Surplus Discount</span>
                <span>-{formatRp(discount)}</span>
              </div>
              <div className="flex justify-between text-gray-600 font-medium text-sm">
                <span>Eco-Delivery</span>
                <span className="italic text-gray-400">Free</span>
              </div>
            </div>

            <div className="bg-[#eef3e8] rounded-2xl p-4 mb-6 border border-[#d4dec4] flex items-center space-x-4">
              <div className="bg-[#d4dec4] p-2 rounded-full text-green-800">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-green-900/60 uppercase tracking-widest">IMPACT SCORE</p>
                <p className="text-sm font-extrabold text-green-900 mt-1">You are saving 4.2kg of food from surplus. 🌱</p>
              </div>
            </div>

            <div className="flex justify-between items-end mb-8 pt-6 border-t border-[#f4f7ed]">
              <span className="text-xl font-extrabold text-gray-900">Total</span>
              <div className="text-right">
                <div className="text-4xl font-extrabold text-gray-900">{formatRp(totalDiscountPrice)}</div>
                <div className="text-[10px] text-gray-400 font-medium mt-1">VAT included where applicable</div>
              </div>
            </div>

            <button 
              onClick={() => router.push('/buyer/checkout')}
              disabled={items.length === 0}
              className="w-full bg-[#388e3c] hover:bg-[#2e7d32] text-white font-bold py-4 rounded-xl transition-colors shadow-md disabled:opacity-50"
            >
              Proceed to Checkout
            </button>
            <p className="text-xs text-gray-400 text-center mt-4 leading-relaxed font-medium">
              By proceeding, you support local growers and reduce methane emissions from food waste.
            </p>
          </div>
          
          <div className="mt-6 flex justify-center items-center text-sm text-gray-500 font-medium cursor-pointer hover:text-gray-900 transition-colors">
            <span className="w-4 h-4 border border-gray-400 rounded-full flex items-center justify-center text-[10px] mr-2 font-bold">?</span> Questions about your order?
          </div>
        </div>
      </div>
    </div>
  );
}
