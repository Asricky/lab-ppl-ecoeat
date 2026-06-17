import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * In-app queue for LKS-facing notifications when a seller confirms a donation.
 * A future LKS dashboard can subscribe to this store or replace with API polling.
 */
export const useLksInboxStore = create(
  persist(
    (set) => ({
      donationAlerts: [],
      addDonationAlert: (payload) =>
        set((state) => ({
          donationAlerts: [
            {
              id: `AL-${Date.now()}`,
              createdAt: new Date().toISOString(),
              ...payload,
            },
            ...state.donationAlerts,
          ],
        })),
      clearAlerts: () => set({ donationAlerts: [] }),
    }),
    { name: 'ecoeat-lks-inbox' }
  )
);
