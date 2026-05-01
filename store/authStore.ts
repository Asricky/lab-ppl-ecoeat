import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Role = 'admin' | 'seller' | 'buyer' | 'kurir' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  ecoPayBalance: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  selectedRole: Role;
  setUser: (user: User | null, token: string | null) => void;
  setSelectedRole: (role: Role) => void;
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
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
