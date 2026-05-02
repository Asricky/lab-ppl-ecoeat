"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Heart, Truck, User, X } from 'lucide-react';

export default function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (val: boolean) => void }) {
  const pathname = usePathname();
  
  const links = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/buyer' },
    { name: 'Explore', icon: ShoppingBag, path: '/buyer/explore' },
    { name: 'Orders', icon: ShoppingBag, path: '/buyer/orders' },
    { name: 'Saved Items', icon: Heart, path: '/buyer/saved' },
    { name: 'Tracking', icon: Truck, path: '/buyer/tracking' },
    { name: 'Profile', icon: User, path: '/buyer/profile' },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <div className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-[#eef3e8] border-r border-[#d4dec4] transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 flex justify-between items-center">
          <div>
            <div className="flex items-center text-green-800 font-extrabold text-xl">
              <svg className="w-8 h-8 mr-2 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                 <path d="M12 6c-3.31 0-6 2.69-6 6h12c0-3.31-2.69-6-6-6z"/>
              </svg>
              ECOEAT
            </div>
            <p className="text-xs text-gray-500 mt-1 font-medium">Sustainable Buyer</p>
          </div>
          <button className="lg:hidden text-gray-600" onClick={() => setIsOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {links.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link 
                key={link.name} 
                href={link.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${isActive ? 'bg-white text-green-800 font-bold shadow-[0_2px_10px_rgba(0,0,0,0.02)]' : 'text-gray-600 hover:bg-white/50 hover:text-green-800 font-medium'}`}
              >
                <link.icon className="w-5 h-5" />
                <span>{link.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  );
}
