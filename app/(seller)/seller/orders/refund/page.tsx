"use client";

import React, { useState } from 'react';
import { ArrowLeft, AlertCircle, ShieldCheck, DollarSign } from 'lucide-react';
import Link from 'next/link';

export default function RefundPage() {
  const [reason, setReason] = useState('Out of stock');
  const [amount, setAmount] = useState('60.00');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRefund = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="max-w-3xl mx-auto py-12">
        <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-[#E8F3EB] rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck size={40} className="text-[#1A5632]" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Refund Processed Successfully</h2>
          <p className="text-gray-500 font-medium mb-8 max-w-md mx-auto">
            The funds have been released from EcoPay Escrow and returned to the buyer's wallet.
          </p>
          <Link href="/seller/orders">
            <button className="bg-[#1A5632] hover:bg-[#0F351F] text-white px-8 py-3 rounded-xl font-bold transition-colors">
              Return to Orders
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <Link href="/seller/orders" className="inline-flex items-center space-x-2 text-sm font-bold text-gray-500 hover:text-gray-900 mb-4 transition-colors">
          <ArrowLeft size={16} />
          <span>Back to Orders</span>
        </Link>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">Process Refund</h1>
        <p className="text-gray-500 font-medium">Order #ORD-9110 • Nasi Goreng Spesial</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* Refund Form */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Refund Details</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Reason for Refund</label>
                <select 
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-[#F3F8F2] border border-transparent rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1A5632] outline-none transition-colors text-gray-900 font-medium appearance-none"
                >
                  <option>Out of stock</option>
                  <option>Item damaged</option>
                  <option>Buyer requested cancellation</option>
                  <option>Quality issue</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Refund Amount</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-[#F3F8F2] border border-transparent rounded-xl pl-11 pr-4 py-3 focus:ring-2 focus:ring-[#1A5632] outline-none transition-colors text-gray-900 font-medium"
                  />
                </div>
                <p className="text-xs font-medium text-gray-500 mt-2">Maximum refund amount is $60.00</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Additional Comments (Optional)</label>
                <textarea 
                  rows={4}
                  placeholder="Explain why this refund is being issued..."
                  className="w-full bg-[#F3F8F2] border border-transparent rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1A5632] outline-none transition-colors text-gray-900 font-medium resize-none"
                ></textarea>
              </div>
            </div>
          </div>

          <button 
            onClick={handleRefund}
            disabled={isProcessing}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold text-lg shadow-sm transition-colors disabled:opacity-70 flex justify-center items-center"
          >
            {isProcessing ? (
              <span className="flex items-center space-x-2">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              "Issue Refund"
            )}
          </button>
        </div>

        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-gray-50 rounded-3xl p-6 border border-gray-200">
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Order Summary</h4>
            <div className="flex items-center space-x-4 mb-4 pb-4 border-b border-gray-200">
              <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=100&h=100&q=80" alt="Nasi Goreng" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Nasi Goreng Spesial</p>
                <p className="text-xs font-medium text-gray-500">2 portions</p>
              </div>
            </div>
            <div className="space-y-2 text-sm font-medium">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>$60.00</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Platform Fee</span>
                <span>-$3.00</span>
              </div>
              <div className="flex justify-between text-gray-900 font-bold pt-2 border-t border-gray-200">
                <span>Total Refund</span>
                <span>${amount}</span>
              </div>
            </div>
          </div>

          {/* EcoPay Protection */}
          <div className="bg-[#E8F3EB] rounded-2xl p-4 flex items-start space-x-3 border border-[#D1E8D7]">
            <ShieldCheck className="text-[#1A5632] shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="text-sm font-bold text-[#1A5632] mb-1">EcoPay Escrow</h4>
              <p className="text-xs font-medium text-[#1A5632]/80 leading-relaxed">
                Funds for this order are currently held in escrow. Issuing a refund will return the selected amount to the buyer.
              </p>
            </div>
          </div>
          
          <div className="bg-amber-50 rounded-2xl p-4 flex items-start space-x-3 border border-amber-200">
            <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="text-sm font-bold text-amber-800 mb-1">Important Notice</h4>
              <p className="text-xs font-medium text-amber-700 leading-relaxed">
                Refunds cannot be undone. Please ensure the items are returned or the refund is mutually agreed upon before proceeding.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Nav */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
        <Link href="/seller/orders">
          <button className="flex items-center space-x-2 text-gray-600 font-bold hover:text-gray-900 transition-colors">
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
        </Link>
        <div></div>
      </div>
    </div>
  );
}
