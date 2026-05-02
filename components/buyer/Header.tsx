"use client";
import { Menu, Bell, ShoppingCart, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const { user } = useAuthStore();
  const { items } = useCartStore();
  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="bg-[#f4f7ed] sticky top-0 z-30 px-6 py-4 flex items-center justify-between border-b border-[#e1e8d5]">
      <div className="flex items-center">
        <button onClick={onMenuClick} className="lg:hidden mr-4 text-gray-600 hover:text-green-700">
          <Menu className="w-6 h-6" />
        </button>
        <div className="hidden md:flex space-x-8 text-sm font-bold text-gray-500">
          <Link href="/buyer/explore" className="hover:text-green-800 transition-colors">Marketplace</Link>
          <Link href="/buyer/orders" className="hover:text-green-800 transition-colors border-b-2 border-green-700 text-green-800 pb-1">My Orders</Link>
        </div>
      </div>
      
      <div className="flex items-center space-x-5">
        <button className="text-gray-500 hover:text-green-700 transition-colors">
          <Bell className="w-6 h-6" />
        </button>
        <Link href="/buyer/cart" className="relative text-gray-500 hover:text-green-700 transition-colors">
          <ShoppingCart className="w-6 h-6" />
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-green-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#f4f7ed]">
              {cartItemCount}
            </span>
          )}
        </Link>
        <div className="flex items-center space-x-3 pl-5 border-l border-[#d4dec4]">
          <span className="text-sm font-bold text-green-900 hidden md:block">{user?.name || "Guest"}</span>
          <div className="bg-white p-1.5 rounded-full shadow-sm border border-[#e1e8d5]">
            <UserIcon className="w-5 h-5 text-gray-600" />
          </div>
        </div>
      </div>
    </header>
  );
}
