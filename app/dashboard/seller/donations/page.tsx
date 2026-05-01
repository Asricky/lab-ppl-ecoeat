"use client";

import React from 'react';
import { HeartHandshake, Leaf, MapPin, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const DONATION_HISTORY = [
  {
    id: 'DON-9021',
    productName: 'Organic Heirloom Tomatoes',
    weight: '10kg',
    recipient: 'Green Valley Community Kitchen',
    date: 'Yesterday, 10:00 AM',
    status: 'Delivered',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200&q=80'
  },
  {
    id: 'DON-8842',
    productName: 'Artisan Sourdough Loaf',
    weight: '5kg',
    recipient: 'Hope Harbor Shelter',
    date: 'Oct 22, 2023',
    status: 'Delivered',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&q=80'
  }
];

export default function DonationsPage() {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header & Impact Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Donations</h1>
          <p className="text-gray-500">Manage your surplus food donations and track your community impact.</p>
        </div>
        <div className="bg-[#E8F3EB] text-[#1A5632] px-4 py-2 rounded-full font-bold flex items-center space-x-2 self-start md:self-auto shadow-sm border border-[#D1E8D7]">
          <Leaf size={18} />
          <span>Your community has saved 1,240 lbs of food this week.</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">Transaction Summary</h2>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            {DONATION_HISTORY.map((donation) => (
              <div key={donation.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 border border-gray-100 rounded-2xl hover:border-green-200 transition-colors bg-white">
                <div className="flex items-center space-x-6 mb-4 md:mb-0">
                  <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={donation.image} alt={donation.productName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Product Info</p>
                    <h3 className="text-lg font-bold text-gray-900">{donation.productName}</h3>
                    <p className="text-sm font-medium text-gray-500 mt-1">{donation.weight} • Grade A, Salvaged</p>
                  </div>
                </div>

                <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-12">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Recipient Kitchen</p>
                    <div className="flex items-start space-x-2">
                      <div className="mt-0.5 bg-[#E8F3EB] p-1.5 rounded-lg text-[#1A5632]">
                        <HeartHandshake size={16} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{donation.recipient}</p>
                        <p className="text-xs text-green-600 font-bold flex items-center mt-1">
                          <CheckCircle2 size={12} className="mr-1" /> Verified Recipient
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Pickup Details</p>
                    <div className="flex items-start space-x-2">
                      <div className="mt-0.5 bg-gray-100 p-1.5 rounded-lg text-gray-600">
                         <MapPin size={16} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{donation.date}</p>
                        <p className="text-xs text-gray-500 font-medium mt-1">Status: {donation.status}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex justify-center mt-8">
        <Link href="/dashboard/seller/donations/select">
          <button className="bg-[#1A5632] hover:bg-[#0F351F] text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors shadow-md flex items-center space-x-3">
            <HeartHandshake size={24} />
            <span>New Donation</span>
          </button>
        </Link>
      </div>
    </div>
  );
}
