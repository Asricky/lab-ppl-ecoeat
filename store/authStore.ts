import { create } from 'zustand';

type Role = 'buyer' | 'seller' | 'courier' | null;

interface AuthState {
  selectedRole: Role;
  setSelectedRole: (role: Role) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  selectedRole: null,
  setSelectedRole: (role) => set({ selectedRole: role }),
}));
