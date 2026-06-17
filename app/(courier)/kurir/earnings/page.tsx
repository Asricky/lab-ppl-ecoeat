"use client";

import React, { useState, useEffect } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { useEcoPayStore } from '@/store/ecoPayStore';
import { Wallet, Info, ArrowRightLeft, Building2, Smartphone, CheckCircle2, AlertCircle, Clock, X } from 'lucide-react';

export default function KurirEarningsPage() {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState<'bank' | 'ewallet' | null>(null);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ message, type });
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const { balance, deductBalance } = useEcoPayStore();

  const { tasks } = useTaskStore();

  // Real calculations
  const creditedBalance = balance;
  const pendingTasks = tasks.filter((task) => task.status === 'completed' && !task.proofUploaded);
  const pendingBalance = pendingTasks.reduce((sum, task) => sum + task.reward, 0);

  // Today's Earnings (Simplified logic: assuming all 'completed' in mock data are today)
  const earnedToday = creditedBalance; 

  const recentTasks = [...tasks].sort((a, b) => b.id.localeCompare(a.id)).slice(0, 5);

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawAmount || !withdrawMethod) {
      showToast("Lengkapi nominal dan metode penarikan!", "error");
      return;
    }
    if (parseFloat(withdrawAmount) > balance) {
      showToast("Saldo tidak mencukupi!", "error");
      return;
    }
    
    setIsWithdrawing(true);
    setTimeout(() => {
      setIsWithdrawing(false);
      deductBalance(parseFloat(withdrawAmount), withdrawMethod === 'bank' ? 'Bank Transfer' : 'E-Wallet Transfer');
      showToast("Penarikan berhasil diinisiasi!", "success");
      setWithdrawSuccess(true);
      setTimeout(() => setWithdrawSuccess(false), 3000);
      setWithdrawAmount('');
      setWithdrawMethod(null);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-emerald-700 font-extrabold mb-1">INTERNAL WALLET ENGINE</p>
        <h1 className="text-3xl font-extrabold text-emerald-950">Earnings & Payouts</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Main Column (Wallet & Withdraw) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Wallet Header (PBI#11) */}
          <div className="bg-[#1A5632] rounded-[32px] p-8 text-white relative overflow-hidden shadow-lg border border-emerald-900">
            {/* Decorative background shapes */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Wallet size={18} className="text-emerald-200" />
                  <p className="text-xs font-bold text-emerald-200 uppercase tracking-widest">ECOPAY BALANCE</p>
                </div>
                <p className="text-5xl font-extrabold tracking-tight">Rp {creditedBalance.toLocaleString('id-ID')}</p>
              </div>
              
              <div className="md:text-right border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-8">
                <p className="text-[10px] font-bold text-emerald-200 uppercase tracking-widest mb-1">EARNED TODAY</p>
                <p className="text-2xl font-extrabold text-emerald-50">Rp {earnedToday.toLocaleString('id-ID')}</p>
              </div>
            </div>
          </div>

          {/* Withdraw Funds Simulation */}
          <div className="bg-white rounded-[24px] border border-black/5 shadow-sm p-8">
            <h2 className="text-xl font-extrabold text-emerald-950 mb-6 flex items-center gap-2">
              <ArrowRightLeft size={20} className="text-emerald-700" /> Withdraw Funds
            </h2>
            
            {withdrawSuccess ? (
              <div className="py-8 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
                <div className="w-16 h-16 bg-[#F2F6F0] text-emerald-600 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-lg">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-extrabold text-emerald-950">Withdrawal Initiated!</h3>
                <p className="text-sm text-slate-500 mt-2">Your funds are being transferred to your selected account.</p>
              </div>
            ) : (
              <form onSubmit={handleWithdraw} className="space-y-6">
                <div>
                  <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-3">SELECT METHOD</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      type="button"
                      onClick={() => setWithdrawMethod('bank')}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${withdrawMethod === 'bank' ? 'border-emerald-600 bg-emerald-50' : 'border-slate-100 hover:border-emerald-200 bg-white'}`}
                    >
                      <Building2 size={20} className={withdrawMethod === 'bank' ? 'text-emerald-700' : 'text-slate-400'} />
                      <p className={`font-bold mt-2 ${withdrawMethod === 'bank' ? 'text-emerald-950' : 'text-slate-600'}`}>Bank BCA</p>
                      <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Transfer (1-2 days)</p>
                    </button>
                    <button 
                      type="button"
                      onClick={() => setWithdrawMethod('ewallet')}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${withdrawMethod === 'ewallet' ? 'border-emerald-600 bg-emerald-50' : 'border-slate-100 hover:border-emerald-200 bg-white'}`}
                    >
                      <Smartphone size={20} className={withdrawMethod === 'ewallet' ? 'text-emerald-700' : 'text-slate-400'} />
                      <p className={`font-bold mt-2 ${withdrawMethod === 'ewallet' ? 'text-emerald-950' : 'text-slate-600'}`}>GoPay</p>
                      <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Instant</p>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2">AMOUNT TO WITHDRAW</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Rp</span>
                    <input 
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="0"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-24 text-lg font-bold text-emerald-950 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                    />
                    <button 
                      type="button"
                      onClick={() => setWithdrawAmount(creditedBalance.toString())}
                      disabled={creditedBalance === 0}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 bg-white border border-slate-200 text-emerald-700 text-[10px] font-extrabold uppercase px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors ${creditedBalance === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      Withdraw All
                    </button>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={creditedBalance === 0 || !withdrawAmount || !withdrawMethod || isWithdrawing || parseFloat(withdrawAmount) > creditedBalance}
                  className={`w-full font-extrabold py-4 rounded-xl transition-colors shadow-sm ${creditedBalance === 0 || !withdrawAmount || !withdrawMethod || parseFloat(withdrawAmount) > creditedBalance ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-emerald-900 text-white hover:bg-emerald-950'}`}
                >
                  {isWithdrawing ? 'Processing...' : 'Confirm Withdrawal'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Sidebar Column (Recent Tasks) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[24px] border border-black/5 shadow-sm p-6">
            <h3 className="text-sm font-extrabold text-emerald-950 uppercase tracking-widest mb-6">Recent Transactions</h3>
            
            <div className="space-y-4">
              {recentTasks.map((task) => (
                <div key={task.id} className="flex items-start justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      task.status === 'completed' && task.proofUploaded ? 'bg-[#F2F6F0] text-emerald-600' :
                      task.status === 'completed' && !task.proofUploaded ? 'bg-amber-50 text-amber-600' :
                      'bg-slate-50 text-slate-400'
                    }`}>
                      {task.status === 'completed' && task.proofUploaded ? <CheckCircle2 size={16} /> :
                       task.status === 'completed' && !task.proofUploaded ? <AlertCircle size={16} /> :
                       <Clock size={16} />}
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-emerald-950">{task.id}</p>
                      <p className="text-[10px] font-bold text-slate-500 mt-0.5">{task.pickup}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-xs font-extrabold ${task.status === 'completed' && task.proofUploaded ? 'text-emerald-700' : 'text-slate-400'}`}>
                      + Rp {task.reward.toLocaleString('id-ID')}
                    </p>
                    <p className="text-[9px] uppercase tracking-wider font-bold text-slate-400 mt-1">
                      {task.status === 'completed' && task.proofUploaded ? 'Credited' :
                       task.status === 'completed' && !task.proofUploaded ? 'Pending' :
                       'Active'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Premium Toast Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-[9999] animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl border backdrop-blur-md ${
            notification.type === 'success' 
              ? 'bg-[#EAF3E1]/95 border-[#1A5632]/20 text-[#1A5632]' 
              : notification.type === 'error'
              ? 'bg-red-50/95 border-red-200 text-red-955'
              : 'bg-blue-50/95 border-blue-200 text-blue-955'
          }`}>
            {notification.type === 'success' && <CheckCircle2 className="w-5 h-5 text-green-700 shrink-0" />}
            {notification.type === 'error' && <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />}
            {notification.type === 'info' && <Info className="w-5 h-5 text-blue-600 shrink-0" />}
            <p className="text-sm font-bold">{notification.message}</p>
            <button 
              onClick={() => setNotification(null)}
              className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
