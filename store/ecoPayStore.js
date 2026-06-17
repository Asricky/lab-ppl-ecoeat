import { create } from 'zustand';
import { useAuthStore } from './authStore';

const getInitialState = () => {
  if (typeof window === 'undefined') return { balance: 0, transactions: [] };
  
  // Try to read current auth state
  try {
    const stored = localStorage.getItem('auth-storage');
    if (stored) {
      const parsed = JSON.parse(stored);
      const user = parsed.state?.user;
      if (user) {
        // Always use the persisted ecoPayBalance from authStore for all users
        return { balance: Number(user.ecoPayBalance ?? 0), transactions: [] };
      }
    }
  } catch (e) {
    console.error(e);
  }

  return { balance: 0, transactions: [] };
};

const initial = getInitialState();

export const useEcoPayStore = create((set) => ({
  balance: initial.balance,
  transactions: initial.transactions,
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

// Subscribe to authStore changes to keep ecoPayStore synced with real database balance
if (typeof window !== 'undefined') {
  useAuthStore.subscribe((state) => {
    const user = state.user;
    if (user) {
      // Always sync ecoPayBalance from authStore for all users
      useEcoPayStore.setState({
        balance: Number(user.ecoPayBalance ?? 0),
      });
    } else {
      useEcoPayStore.setState({ balance: 0, transactions: [] });
    }
  });
}

