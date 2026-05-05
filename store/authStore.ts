import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Role = 'admin' | 'seller' | 'buyer' | 'kurir' | null;

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
      setUser: (user, token) => set({ user, token }),
      setSelectedRole: (role) => set({ selectedRole: role }),
      updateUser: (updates) => set((state) => ({ user: state.user ? { ...state.user, ...updates } : null })),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
