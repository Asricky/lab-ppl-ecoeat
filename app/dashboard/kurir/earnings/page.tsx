"use client";

import React, { useState } from 'react';
import CourierLayout from '@/app/components/CourierLayout';
import { dummyOrders } from '@/lib/data';
import { DollarSign, Wallet, ArrowRight, Info, CheckCircle2, Building, Smartphone, FileText, ArrowUpRight } from 'lucide-react';

export default function Earnings() {
  const completedTasks = dummyOrders.filter(
    (o) => o.status === 'completed' && o.photoProofUrl
  );
  
  const totalEarnedToday = completedTasks.reduce((sum, order) => sum + (order.reward || 0), 0);
  const [totalWithdrawn, setTotalWithdrawn] = useState(0);
  const currentBalance = totalEarnedToday - totalWithdrawn;

  const [withdrawMethod, setWithdrawMethod] = useState<'bank' | 'ewallet'>('bank');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number | ''>('');
  const [lastWithdrawnAmount, setLastWithdrawnAmount] = useState(0);

  return (
    <CourierLayout>
      <div className="max-w-6xl mx-auto py-2">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-xs font-bold text-ecoeat-muted uppercase tracking-widest mb-1">FINANCIAL OVERVIEW</p>
            <h1 className="text-3xl font-extrabold text-ecoeat-text">Earnings & Payouts</h1>
          </div>
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-ecoeat-text font-bold py-2.5 px-5 rounded-xl hover:bg-gray-50 transition-colors shadow-sm text-sm">
            <FileText size={16} /> Download Statement
          </button>
        </div>

        {/* Top Header Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Main Balance Card */}
          <div className="lg:col-span-2 bg-ecoeat-primary rounded-[32px] p-8 sm:p-10 text-white relative overflow-hidden shadow-[0_8px_30px_rgb(18,88,36,0.2)]">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-black opacity-10 rounded-full blur-2xl"></div>
            
            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 h-full">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3 opacity-90 bg-white/10 w-max px-3 py-1.5 rounded-full backdrop-blur-sm">
                  <Wallet size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">Available Balance</span>
                </div>
                <h2 className="text-5xl sm:text-6xl font-extrabold tracking-tight">
                  <span className="text-3xl sm:text-4xl opacity-80 mr-1 font-medium">Rp</span>
                  {currentBalance.toLocaleString('id-ID')}
                </h2>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 text-center w-full sm:w-auto min-w-[160px]">
                <p className="text-xs font-bold uppercase tracking-wider opacity-80 mb-2">Earned Today</p>
                <p className="text-2xl font-bold">Rp {totalEarnedToday.toLocaleString('id-ID')}</p>
              </div>
            </div>
          </div>

          {/* How Earnings Work */}
          <div className="bg-[#eaf4eb] border border-[#c5e6ce] rounded-[32px] p-8 flex flex-col shadow-sm">
            <div className="bg-white rounded-2xl p-3 shrink-0 w-max mb-6 shadow-sm">
              <Info size={24} className="text-[#1e8932]" />
            </div>
            <h4 className="text-lg font-extrabold text-[#1e8932] mb-3">Earnings Lock Policy</h4>
            <p className="text-sm font-medium text-[#2d5d36] leading-relaxed">
              Rewards are credited to your balance <strong>only after</strong> you successfully complete a delivery and upload the <strong>Photo Proof of Handover</strong>. Ensure your photos are clear to avoid delays.
            </p>
          </div>
        </div>

        {/* Lower Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Withdrawal Section */}
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-black/5 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-ecoeat-text">Withdraw Funds</h3>
              <ArrowUpRight className="text-gray-300" size={28} />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button 
                onClick={() => setWithdrawMethod('bank')}
                className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${
                  withdrawMethod === 'bank' 
                    ? 'border-ecoeat-primary bg-ecoeat-primary/5 text-ecoeat-primary shadow-sm' 
                    : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                }`}
              >
                <Building size={28} className="mb-3" />
                <span className="text-sm font-bold">Bank Transfer</span>
              </button>
              <button 
                onClick={() => setWithdrawMethod('ewallet')}
                className={`flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all ${
                  withdrawMethod === 'ewallet' 
                    ? 'border-ecoeat-primary bg-ecoeat-primary/5 text-ecoeat-primary shadow-sm' 
                    : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                }`}
              >
                <Smartphone size={28} className="mb-3" />
                <span className="text-sm font-bold">E-Wallet</span>
              </button>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-8 flex items-center justify-between">
              <div className="flex-1 mr-4">
                <p className="text-xs font-bold text-ecoeat-muted uppercase tracking-wider mb-1">Amount to Withdraw (Rp)</p>
                <div className="flex items-center text-2xl font-extrabold text-ecoeat-text">
                  <span className="mr-2 opacity-50">Rp</span>
                  <input 
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-transparent outline-none placeholder-gray-300"
                    placeholder="0"
                    min="0"
                    max={currentBalance}
                  />
                </div>
              </div>
              <button 
                onClick={() => setWithdrawAmount(currentBalance)}
                className="text-sm font-bold text-ecoeat-primary hover:underline bg-ecoeat-primary/10 px-4 py-2 rounded-lg shrink-0"
              >
                Withdraw All
              </button>
            </div>

            <button 
              onClick={() => {
                if (typeof withdrawAmount === 'number' && withdrawAmount > 0 && withdrawAmount <= currentBalance) {
                  setLastWithdrawnAmount(withdrawAmount);
                  setTotalWithdrawn(totalWithdrawn + withdrawAmount);
                  setShowWithdrawModal(true);
                  setWithdrawAmount('');
                }
              }}
              disabled={!withdrawAmount || withdrawAmount <= 0 || withdrawAmount > currentBalance}
              className={`w-full mt-auto text-white font-bold py-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-lg ${
                (!withdrawAmount || withdrawAmount <= 0 || withdrawAmount > currentBalance)
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-ecoeat-primary hover:bg-ecoeat-accent active:scale-[0.98]'
              }`}
            >
              Confirm Withdrawal <ArrowRight size={20} />
            </button>
          </div>

          {/* Transaction History */}
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-black/5 flex flex-col h-full max-h-[600px]">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-ecoeat-text">Recent Transactions</h3>
              <button className="text-sm font-bold text-ecoeat-primary hover:underline bg-ecoeat-primary/5 px-4 py-2 rounded-lg">View All</button>
            </div>

            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
              {dummyOrders.map(order => {
                const isCredited = order.status === 'completed' && order.photoProofUrl;
                return (
                  <div key={order.id} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors border border-gray-100">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                      isCredited ? 'bg-[#eaf4eb] text-[#1e8932]' : 'bg-gray-100 text-gray-400'
                    }`}>
                      <DollarSign size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-extrabold text-ecoeat-text truncate">{order.pickupName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {isCredited ? (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-[#1e8932] uppercase bg-[#eaf4eb] px-2 py-0.5 rounded-full">
                            <CheckCircle2 size={10} /> Credited
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-ecoeat-muted uppercase bg-gray-100 px-2 py-0.5 rounded-full">
                            {order.status === 'in_progress' ? 'In Progress' : 'Pending'}
                          </span>
                        )}
                        <span className="text-gray-300">•</span>
                        <span className="text-[10px] font-bold text-gray-500">{order.date ? new Date(order.date).toLocaleDateString() : 'Today'}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-lg font-extrabold ${isCredited ? 'text-[#1e8932]' : 'text-ecoeat-text'}`}>
                        +Rp{order.reward?.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
        </div>
      </div>

      {/* Withdrawal Success Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-[24px] p-8 shadow-xl w-full max-w-sm text-center animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-[#eaf4eb] text-[#1e8932] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-2xl font-bold text-ecoeat-text mb-2">Withdrawal Processed!</h3>
            <p className="text-sm font-medium text-gray-500 mb-6">
              Rp {lastWithdrawnAmount.toLocaleString('id-ID')} is being transferred to your {withdrawMethod === 'bank' ? 'Bank Account' : 'E-Wallet'}.
            </p>
            <button 
              onClick={() => setShowWithdrawModal(false)}
              className="w-full bg-ecoeat-primary text-white font-bold py-3.5 rounded-xl hover:bg-[#025020] transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </CourierLayout>
  );
}
