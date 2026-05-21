import { create } from 'zustand';

export const useEcoPayStore = create((set) => ({
  balance: 50000, // Initial mock balance
  addBalance: (amount) => set((state) => ({ balance: state.balance + amount })),
  deductBalance: (amount) => set((state) => ({ balance: state.balance - amount })),
}));
