import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

export type Role = 'admin' | 'seller' | 'buyer' | 'kurir' | 'lks-panti' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  ecoPayBalance: number;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  selectedRole: Role;
  setUser: (user: User | null, token: string | null) => void;
  setSelectedRole: (role: Role) => void;
  updateUser: (updates: Partial<User>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      selectedRole: null,
      setUser: (user, token) => {
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
          delete axios.defaults.headers.common['Authorization'];
        }
        set({ user, token });
      },
      setSelectedRole: (role) => set({ selectedRole: role }),
      updateUser: (updates) => set((state) => ({ user: state.user ? { ...state.user, ...updates } : null })),
      logout: () => {
        delete axios.defaults.headers.common['Authorization'];
        set({ user: null, token: null });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

// Initialize auth header on load if token exists in localStorage
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('auth-storage');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      const token = parsed.state?.token;
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    } catch (e) {
      console.error(e);
    }
  }
}
