import { create } from 'zustand';
import { courierTasks, getCreditedBalance } from '@/lib/dashboardData';

export const useEcoPayStore = create((set) => ({
  balance: getCreditedBalance(courierTasks), // Dynamic initial balance based on tasks
  transactions: [],
  addBalance: (amount, method = 'Top-up') => set((state) => ({ 
    balance: state.balance + amount,
    transactions: [{ id: Date.now(), type: 'topup', amount, method, date: new Date().toISOString() }, ...state.transactions]
  })),
  deductBalance: (amount, method = 'Payment') => set((state) => {
    if (state.balance < amount) return state; // Prevent negative balance
    return { 
      balance: state.balance - amount,
      transactions: [{ id: Date.now(), type: 'withdraw', amount, method, date: new Date().toISOString() }, ...state.transactions]
    };
  }),
  /** Credit wallet (e.g. refund) — updates balance and transaction log */
  updateSaldo: (amount, method = 'Refund') => set((state) => ({
    balance: state.balance + amount,
    transactions: [
      { id: Date.now(), type: 'refund', amount, method, date: new Date().toISOString() },
      ...state.transactions,
    ],
  })),
}));
