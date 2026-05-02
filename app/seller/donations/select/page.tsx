"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** Diganti oleh wizard `/donations/new` — pertahankan route untuk tautan lama. */
export default function SelectDonationRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/dashboard/seller/donations/new');
  }, [router]);
  return (
<<<<<<< HEAD:app/seller/donations/select/page.tsx
    <div className="max-w-7xl mx-auto pb-12">
      <div className="mb-8">
        <p className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-2">Surplus Management</p>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Select Donation Destination</h1>
        <p className="text-gray-600 text-lg max-w-2xl font-medium">Choose a verified organization to receive your surplus food and make a direct impact on local food security.</p>
        
        <div className="inline-flex items-center space-x-2 bg-[#F3F8F2] text-[#1A5632] px-4 py-2 rounded-xl text-sm font-bold mt-6">
          <Leaf size={16} />
          <span>Your community has saved 1,240 lbs of food this week.</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name or location..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-transparent rounded-xl shadow-sm focus:ring-2 focus:ring-[#1A5632] focus:border-[#1A5632] outline-none text-sm font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-4">
          <button onClick={() => alert("Category filter opened")} className="bg-white border border-transparent shadow-sm px-6 py-3 rounded-xl flex items-center space-x-2 text-sm font-bold text-gray-700 hover:bg-gray-50">
            <span>Category</span>
            <ChevronDown size={16} className="text-gray-400" />
          </button>
          <button onClick={() => alert("Radius filter opened")} className="bg-white border border-transparent shadow-sm px-6 py-3 rounded-xl flex items-center space-x-2 text-sm font-bold text-gray-700 hover:bg-gray-50">
            <MapPin size={16} className="text-gray-400" />
            <span>Radius</span>
          </button>
        </div>
      </div>

      {/* Organization Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {organizations.map((org) => (
          <div key={org.id} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col">
            <div className="h-48 relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={org.image} alt={org.name} className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 bg-[#1A5632] text-white px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-sm">
                <Verified size={12} className="mr-1" />
                Verified
              </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{org.name}</h3>
              <div className="flex items-center text-xs font-bold text-gray-500 mb-4">
                <MapPin size={14} className="mr-1" />
                <span>{org.distance}</span>
                <span className="mx-2">•</span>
                <span>{org.address}</span>
              </div>
              
              <p className="text-sm text-gray-600 font-medium mb-6 flex-1 leading-relaxed">
                {org.description}
              </p>
              
              {/* Real Zoomable Map View */}
              <div className="h-32 rounded-xl mb-6 overflow-hidden border border-gray-100 z-0 relative isolate">
                <MapContainer 
                  center={org.coords as [number, number]} 
                  zoom={14} 
                  scrollWheelZoom={false}
                  zoomControl={true}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                  />
                  <Marker position={org.coords as [number, number]} />
                </MapContainer>
                
                {/* Overlay indicator to show it's interactive */}
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-gray-800 shadow-sm z-[400] flex items-center pointer-events-none">
                  <Map size={10} className="mr-1" />
                  Interactive
                </div>
              </div>
              
              <Link href={`/seller/donations/confirmation`} className="block w-full">
                <button className="w-full py-3 rounded-xl bg-[#A3D9B5]/30 hover:bg-[#A3D9B5]/50 text-[#1A5632] font-bold text-sm transition-colors">
                  Select Organization
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Registration CTA */}
      <div className="bg-[#F3F8F2] border border-[#D1E8D7] rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between shadow-sm mb-8">
        <div className="mb-4 sm:mb-0">
          <h4 className="text-lg font-bold text-gray-900 mb-1">Don't see your preferred partner?</h4>
          <p className="text-sm font-medium text-gray-600">You can request a new organization to be verified on our platform.</p>
        </div>
        <button onClick={() => alert("Opening registration form")} className="bg-transparent border-2 border-[#1A5632] text-[#1A5632] hover:bg-[#1A5632] hover:text-white px-6 py-3 rounded-xl font-bold transition-colors whitespace-nowrap">
          Register New Partner
        </button>
      </div>

      {/* Footer Nav */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <Link href="/seller-entry">
          <button className="flex items-center space-x-2 text-gray-600 font-bold hover:text-gray-900 transition-colors">
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
        </Link>
        <div></div>
      </div>
=======
    <div className="max-w-xl mx-auto py-20 text-center text-gray-500 font-medium px-4">
      Mengalihkan ke alur donasi baru…
>>>>>>> repo-sridamai/Sridamai:app/dashboard/seller/donations/select/page.tsx
    </div>
  );
}
