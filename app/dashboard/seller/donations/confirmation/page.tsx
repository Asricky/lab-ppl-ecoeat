"use client";

import React, { useState, Suspense } from 'react';
import { CheckCircle2, Building, Clock, Leaf, ArrowLeft, Phone } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useProductStore } from '@/store/productStore';

const organizations = [
  {
    id: 1,
    name: "City Food Bank",
    distance: "2.4 miles",
    address: "1200 Market St.",
    description: "Central hub for urban food distribution, supporting over 50 local pantries and emergency shelters daily.",
    image: "https://images.unsplash.com/photo-1593113565694-c6f8716c0296?w=400&q=80",
    mapColor: "bg-orange-200",
    coords: [-6.200000, 106.816666],
    phone: "+62 812-3456-7890"
  },
  {
    id: 2,
    name: "Green Valley Kitchen",
    distance: "4.8 miles",
    address: "45 Valley Rd.",
    description: "Community-led kitchen providing hot, nutritious meals to seniors and low-income families in the valley district.",
    image: "https://images.unsplash.com/photo-1574314050516-e56593a1fa06?w=400&q=80",
    mapColor: "bg-green-200",
    coords: [-6.914744, 107.609810],
    phone: "+62 856-1111-2222"
  },
  {
    id: 3,
    name: "Hope Harbor Shelter",
    distance: "1.2 miles",
    address: "202 Harbor Ave.",
    description: "Sustainable shelter program focusing on fresh food access and temporary housing for displaced individuals.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80",
    mapColor: "bg-teal-200",
    coords: [-6.220000, 106.836666],
    phone: "+62 813-9999-8888"
  }
];

function ConfirmationContent() {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const searchParams = useSearchParams();
  const orgId = searchParams.get('orgId') || '2';
  const selectedOrg = organizations.find(org => org.id.toString() === orgId) || organizations[1];
  const { addDonation } = useProductStore();

  const handleConfirm = () => {
    addDonation({
      id: `DON-${Math.floor(Math.random() * 10000)}`,
      productName: 'ROTI GANDUM (SISA)',
      weight: '5 porsi',
      recipient: selectedOrg.name,
      recipientImage: selectedOrg.image,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Scheduled',
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&q=80"
    });
    setIsConfirmed(true);
  };

  if (isConfirmed) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <div className="w-24 h-24 bg-[#E8F3EB] rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={48} className="text-[#1A5632]" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Donation Confirmed!</h1>
        <p className="text-gray-500 text-lg mb-8">Thank you for your contribution. {selectedOrg.name} will pick up the items tomorrow at 10:00 AM.</p>
        <Link href="/dashboard/seller/donations">
          <button className="bg-[#1A5632] text-white px-8 py-3 rounded-xl font-bold shadow-md hover:bg-[#0F351F] transition-colors">
            View My Donations
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      {/* Breadcrumb equivalent */}
      <div className="flex items-center space-x-4 mb-8">
        <button onClick={() => window.history.back()} className="flex items-center space-x-2 text-gray-500 hover:text-[#1A5632] transition-colors font-bold text-sm bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
        <div className="text-sm font-bold text-gray-400 flex items-center space-x-2">
          <span>Donations</span>
          <span>›</span>
          <span className="text-gray-900">Confirm Donation</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">

        {/* Status Alert */}
        <div className="bg-[#F3F8F2] border border-[#D1E8D7] rounded-xl p-4 flex items-start space-x-4 mb-10">
          <CheckCircle2 size={24} className="text-[#1A5632] shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-gray-900">Review Required</h3>
            <p className="text-sm text-gray-600 font-medium mt-1">Please verify the following details to schedule your surplus pickup.</p>
          </div>
        </div>

        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">TRANSACTION SUMMARY</p>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">Finalize Donation</h1>

        {/* Product Info */}
        <div className="flex items-center space-x-6 pb-8 border-b border-gray-100 mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&q=80" alt="Roti Gandum" className="w-24 h-24 rounded-2xl object-cover shadow-sm" />
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">PRODUCT INFO</p>
            <h2 className="text-xl font-extrabold text-gray-900 mb-1">ROTI GANDUM (SISA)</h2>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">HAMPIR EXPIRED, MASIH LAYAK KONSUMSI</p>
          </div>
        </div>

        {/* Grid Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">RECIPIENT KITCHEN</p>
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={selectedOrg.image} alt={selectedOrg.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">{selectedOrg.name}</h4>
                <p className="text-[10px] font-bold text-[#1A5632] flex items-center mt-1 uppercase tracking-wider">
                  <CheckCircle2 size={12} className="mr-1" /> Verified Recipient
                </p>
                <p className="text-[11px] font-medium text-gray-500 mt-1 flex items-center">
                  <Phone size={12} className="mr-1" /> {selectedOrg.phone}
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">ESTIMATED PICKUP</p>
            <div className="flex items-start space-x-3">
              <div className="bg-gray-100 p-2 rounded-lg text-gray-500 shrink-0">
                <Clock size={20} />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Tomorrow, 10:00 AM</h4>
                <p className="text-[11px] font-medium text-gray-500 mt-1">Flexible window: ±30 min</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center">
          <button
            onClick={handleConfirm}
            className="w-full bg-[#1A5632] hover:bg-[#0F351F] text-white py-4 rounded-xl font-bold text-lg shadow-md transition-colors flex items-center justify-center space-x-2 mb-4"
          >
            <span>Confirm Donation</span>
            <span className="text-xl">→</span>
          </button>
          <button className="text-gray-500 font-bold text-sm hover:text-gray-900 transition-colors py-2">
            Edit Details
          </button>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs font-medium text-gray-500">
          Having trouble? <span className="font-bold text-[#1A5632] cursor-pointer hover:underline">Contact Ledger Support</span>
        </p>
      </div>
    </div>
  );
}

export default function DonationConfirmationPage() {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto py-16 text-center text-gray-500 font-bold">Loading donation details...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
