"use client";

import React, { useState } from 'react';
import { Wallet, ArrowUpRight, ArrowDownRight, RefreshCcw, ShieldCheck, Download, History, ChevronRight, ArrowLeft, CheckCircle2, X } from 'lucide-react';
import Link from 'next/link';

export default function WalletPage() {
  const [modalAction, setModalAction] = useState<string | null>(null);

  const transactions = [
    { id: 'TRX-9921', type: 'Sale', amount: '+Rp 25.000', status: 'Completed', date: 'Today, 14:30', desc: 'Order #ORD-001' },
    { id: 'TRX-9920', type: 'Refund', amount: '-Rp 60.000', status: 'Completed', date: 'Today, 10:15', desc: 'Order #ORD-9110' },
    { id: 'TRX-9919', type: 'Fee', amount: '-Rp 1.500', status: 'Completed', date: 'Yesterday, 16:45', desc: 'Platform Fee (ORD-001)' },
    { id: 'TRX-9918', type: 'Withdrawal', amount: '-Rp 500.000', status: 'Processing', date: 'Yesterday, 09:00', desc: 'Transfer to Bank BCA' },
    { id: 'TRX-9917', type: 'Escrow Release', amount: '+Rp 45.000', status: 'Completed', date: 'Oct 24, 18:20', desc: 'Order #ORD-005' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <button onClick={() => window.history.back()} className="flex items-center space-x-2 text-gray-500 hover:text-[#1A5632] transition-colors font-bold text-sm bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 w-fit">
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
      </div>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">EcoPay Wallet</h1>
          <p className="text-sm font-medium text-gray-500">Manage your earnings, escrow funds, and withdrawals.</p>
        </div>
        <button onClick={() => setModalAction("Wallet Statement Downloaded")} className="bg-white border border-gray-200 shadow-sm px-4 py-2 rounded-xl flex items-center space-x-2 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
          <Download size={16} />
          <span>Statement</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Main Balance Card */}
        <div className="lg:col-span-2 bg-[#1A5632] rounded-3xl p-8 border border-[#144226] text-white shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10 transform translate-x-12 -translate-y-12">
            <Wallet size={180} />
          </div>
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <p className="text-sm font-bold text-[#A3D9B5] uppercase tracking-wider mb-2">Available Balance</p>
              <h2 className="text-5xl font-extrabold text-white mb-2">Rp 1.250.000</h2>
              <p className="text-sm font-medium text-gray-300">Ready for withdrawal to your bank account.</p>
            </div>
            
            <div className="mt-12 flex space-x-4">
              <button onClick={() => setModalAction("Withdrawal Requested")} className="bg-white text-[#1A5632] px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-sm">
                Withdraw Funds
              </button>
              <button onClick={() => setModalAction("Top Up Form Opened")} className="bg-[#2A7A4A] text-white border border-[#3A8A5A] px-6 py-3 rounded-xl font-bold hover:bg-[#3A8A5A] transition-colors">
                Top Up
              </button>
            </div>
          </div>
        </div>

        {/* Escrow Card */}
        <div className="bg-[#F0F7FF] rounded-3xl p-8 border border-[#D1E5FE] flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <ShieldCheck className="text-blue-600" size={24} />
              <h3 className="text-lg font-bold text-blue-900">Held in Escrow</h3>
            </div>
            <h2 className="text-3xl font-extrabold text-blue-900 mb-2">Rp 850.000</h2>
            <p className="text-sm font-medium text-blue-800/80 leading-relaxed">
              Funds from active orders are held securely. They will automatically transfer to your available balance once buyers confirm receipt.
            </p>
          </div>
          <Link href="/seller/orders">
            <button className="text-sm font-bold text-blue-700 mt-6 flex items-center hover:underline">
              View Active Orders <ArrowUpRight size={16} className="ml-1" />
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Transaction History */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <History size={20} className="text-gray-500" />
              <h3 className="text-lg font-bold text-gray-900">Recent Transactions</h3>
            </div>
            <button onClick={() => setModalAction("Showing All Transactions")} className="text-sm font-bold text-[#1A5632] hover:underline">View All</button>
          </div>
          
          <div className="divide-y divide-gray-50">
            {transactions.map((trx, index) => (
              <div key={index} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    trx.amount.startsWith('+') ? 'bg-[#E8F3EB] text-[#1A5632]' : 
                    trx.type === 'Withdrawal' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                  }`}>
                    {trx.amount.startsWith('+') ? <ArrowDownRight size={20} /> : 
                     trx.type === 'Withdrawal' ? <RefreshCcw size={20} /> : <ArrowUpRight size={20} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{trx.type}</h4>
                    <p className="text-xs font-medium text-gray-500">{trx.desc} • {trx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${trx.amount.startsWith('+') ? 'text-[#1A5632]' : 'text-gray-900'}`}>{trx.amount}</p>
                  <p className="text-xs font-medium text-gray-400">{trx.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bank Accounts */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Linked Accounts</h3>
          
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 mb-4 flex items-center justify-between cursor-pointer hover:border-gray-300 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black italic text-xs">BCA</div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Bank BCA</p>
                <p className="text-xs font-medium text-gray-500">**** **** 8921</p>
              </div>
            </div>
            <div className="bg-[#E8F3EB] text-[#1A5632] px-2 py-1 rounded text-[10px] font-bold uppercase">Primary</div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 mb-6 flex items-center justify-between cursor-pointer hover:border-gray-300 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#00A5CF] rounded-lg flex items-center justify-center text-white font-black italic text-xs">GOPAY</div>
              <div>
                <p className="font-bold text-gray-900 text-sm">GoPay E-Wallet</p>
                <p className="text-xs font-medium text-gray-500">+62 812-****-4451</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-gray-400" />
          </div>

          <button onClick={() => setModalAction("Add Bank Account Dialog Opened")} className="mt-auto w-full border-2 border-dashed border-gray-300 text-gray-600 hover:text-[#1A5632] hover:border-[#1A5632] hover:bg-[#F3F8F2] py-3 rounded-xl font-bold transition-colors flex items-center justify-center space-x-2">
            <span className="text-lg font-bold">+</span>
            <span>Add Account</span>
          </button>
        </div>
      </div>

      {/* Modal Output */}
      {modalAction && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center backdrop-blur-sm p-4">
          <div className={`${modalAction === "Showing All Transactions" ? "max-w-2xl" : "max-w-md"} bg-white rounded-3xl p-8 w-full shadow-2xl transform transition-all relative border border-gray-100`}>
            
            <button onClick={() => setModalAction(null)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors">
              <X size={24} />
            </button>

            {modalAction === "Withdrawal Requested" && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Withdraw Funds</h3>
                <p className="text-sm text-gray-500 mb-6 font-medium">Transfer available balance to your bank.</p>
                <div className="bg-[#F3F8F2] p-4 rounded-xl mb-6">
                  <p className="text-xs font-bold text-gray-500 uppercase">Available to withdraw</p>
                  <p className="text-3xl font-extrabold text-[#1A5632]">Rp 1.250.000</p>
                </div>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Amount</label>
                    <input type="text" defaultValue="Rp 500.000" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-lg font-bold text-gray-900 focus:ring-2 focus:ring-[#1A5632] outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Destination Bank</label>
                    <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium text-gray-900 focus:ring-2 focus:ring-[#1A5632] outline-none appearance-none">
                      <option>Bank BCA (**** 8921)</option>
                    </select>
                  </div>
                </div>
                <button onClick={() => setModalAction("Success")} className="w-full bg-[#1A5632] hover:bg-[#0F351F] text-white px-4 py-3.5 rounded-xl font-bold transition-colors shadow-sm">
                  Confirm Withdrawal
                </button>
              </div>
            )}

            {modalAction === "Top Up Form Opened" && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Top Up Balance</h3>
                <p className="text-sm text-gray-500 mb-6 font-medium">Add funds to pay for platform fees or buy products.</p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {['Rp 50.000', 'Rp 100.000', 'Rp 200.000', 'Rp 500.000'].map(amt => (
                    <button key={amt} className="border border-gray-200 hover:border-[#1A5632] hover:bg-[#F3F8F2] text-gray-700 font-bold py-3 rounded-xl transition-all">{amt}</button>
                  ))}
                </div>
                <div className="mb-6">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Custom Amount</label>
                  <input type="text" placeholder="Rp 0" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-lg font-bold text-gray-900 focus:ring-2 focus:ring-[#1A5632] outline-none" />
                </div>
                <button onClick={() => setModalAction("Success")} className="w-full bg-[#1A5632] hover:bg-[#0F351F] text-white px-4 py-3.5 rounded-xl font-bold transition-colors shadow-sm">
                  Proceed to Payment
                </button>
              </div>
            )}

            {modalAction === "Add Bank Account Dialog Opened" && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Link Bank Account</h3>
                <p className="text-sm text-gray-500 mb-6 font-medium">Add a bank or e-wallet to withdraw your funds.</p>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Bank Name</label>
                    <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium text-gray-900 focus:ring-2 focus:ring-[#1A5632] outline-none appearance-none">
                      <option>Bank Mandiri</option>
                      <option>Bank BNI</option>
                      <option>Bank BRI</option>
                      <option>OVO</option>
                      <option>DANA</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Account Number</label>
                    <input type="text" placeholder="e.g. 1122334455" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium text-gray-900 focus:ring-2 focus:ring-[#1A5632] outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Account Holder Name</label>
                    <input type="text" placeholder="e.g. John Doe" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-medium text-gray-900 focus:ring-2 focus:ring-[#1A5632] outline-none" />
                  </div>
                </div>
                <button onClick={() => setModalAction("Success")} className="w-full bg-[#1A5632] hover:bg-[#0F351F] text-white px-4 py-3.5 rounded-xl font-bold transition-colors shadow-sm">
                  Save Account
                </button>
              </div>
            )}

            {modalAction === "Showing All Transactions" && (
              <div className="flex flex-col max-h-[80vh]">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Transaction History</h3>
                <p className="text-sm text-gray-500 mb-6 font-medium">A complete list of your past financial activities.</p>
                <div className="overflow-y-auto pr-2 divide-y divide-gray-100 flex-1">
                  {[...transactions, ...transactions, ...transactions].map((trx, index) => (
                    <div key={index} className="py-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          trx.amount.startsWith('+') ? 'bg-[#E8F3EB] text-[#1A5632]' : 
                          trx.type === 'Withdrawal' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                        }`}>
                          {trx.amount.startsWith('+') ? <ArrowDownRight size={16} /> : 
                           trx.type === 'Withdrawal' ? <RefreshCcw size={16} /> : <ArrowUpRight size={16} />}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{trx.type}</h4>
                          <p className="text-xs font-medium text-gray-500">{trx.desc} • {trx.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${trx.amount.startsWith('+') ? 'text-[#1A5632]' : 'text-gray-900'}`}>{trx.amount}</p>
                        <p className="text-xs font-medium text-gray-400">{trx.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(modalAction === "Success" || modalAction === "Wallet Statement Downloaded") && (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-[#E8F3EB] rounded-full flex items-center justify-center mx-auto mb-6 border border-[#D1E8D7]">
                  <CheckCircle2 size={32} className="text-[#1A5632]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Action Successful</h3>
                <p className="text-sm text-gray-500 mb-8 font-medium">
                  {modalAction === "Wallet Statement Downloaded" ? "Your statement has been downloaded." : "Your request has been processed successfully."}
                </p>
                <button 
                  onClick={() => setModalAction(null)}
                  className="w-full bg-[#1A5632] hover:bg-[#0F351F] text-white px-4 py-3.5 rounded-xl font-bold transition-colors shadow-sm"
                >
                  Done
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
