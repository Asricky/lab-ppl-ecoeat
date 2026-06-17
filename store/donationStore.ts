import { create } from 'zustand';
import { incomingDonations as initialDonations, IncomingDonation } from '@/lib/dashboardData';

interface DonationState {
  donations: IncomingDonation[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  acceptDonation: (id: string) => void;
  addIncomingDonation: (donation: IncomingDonation) => void;
}

export const useDonationStore = create<DonationState>((set) => ({
  donations: initialDonations,
  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),
  acceptDonation: (id) => set((state) => ({
    donations: state.donations.map(d => d.id === id ? { ...d, status: 'Accepted' } as IncomingDonation : d)
  })),
  addIncomingDonation: (donation) => set((state) => ({ donations: [donation, ...state.donations] }))
}));
