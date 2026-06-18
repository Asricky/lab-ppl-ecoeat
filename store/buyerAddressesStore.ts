import { create } from "zustand";
import { useAuthStore } from "./authStore";

export type BuyerSavedAddress = {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  postalCode: string;
  streetDetail: string;
  isPrimary: boolean;
};

interface BuyerAddressesState {
  addresses: BuyerSavedAddress[];
  addAddress: (input: Omit<BuyerSavedAddress, "id">) => void;
  updateAddress: (id: string, input: Partial<Omit<BuyerSavedAddress, "id">>) => void;
  deleteAddress: (id: string) => void;
  setPrimary: (id: string) => void;
  setAddresses: (addresses: BuyerSavedAddress[]) => void;
}

const INITIAL_ADDRESSES = [
  {
    id: "addr-seed",
    label: "Rumah",
    fullName: "Default User",
    phone: "08123456789",
    province: "Jawa Barat",
    city: "Bandung",
    district: "Coblong",
    postalCode: "40131",
    streetDetail: "Jl. Ekologi No. 245, Gedung Emerald Suite 10",
    isPrimary: true,
  },
];

const getInitialAddresses = (): BuyerSavedAddress[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem('auth-storage');
    if (stored) {
      const parsed = JSON.parse(stored);
      const user = parsed.state?.user;
      if (user) {
        const isDemo = ['buyer@ecoeat.com', 'seller@ecoeat.com', 'courier@ecoeat.com', 'lks@ecoeat.com', 'admin@ecoeat.com'].includes(user.email);
        if (!isDemo) {
          return [];
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
  return INITIAL_ADDRESSES;
};

export const useBuyerAddressesStore = create<BuyerAddressesState>((set) => ({
  addresses: getInitialAddresses(),
  addAddress: (input) => {
    const id = `addr-${Date.now()}`;
    set((s) => {
      let next = s.addresses.map((a) =>
        input.isPrimary ? { ...a, isPrimary: false } : a,
      );
      next = [...next, { ...input, id }];
      return { addresses: next };
    });
  },
  updateAddress: (id, input) => {
    set((s) => {
      let next = s.addresses;
      if (input.isPrimary) {
        next = next.map((a) => ({ ...a, isPrimary: false }));
      }
      next = next.map((a) => (a.id === id ? { ...a, ...input } : a));
      return { addresses: next };
    });
  },
  deleteAddress: (id) => {
    set((s) => ({
      addresses: s.addresses.filter((a) => a.id !== id),
    }));
  },
  setPrimary: (id) => {
    set((s) => ({
      addresses: s.addresses.map((a) => ({ ...a, isPrimary: a.id === id })),
    }));
  },
  setAddresses: (addresses) => set({ addresses }),
}));

if (typeof window !== "undefined") {
  useAuthStore.subscribe((state) => {
    const user = state.user;
    if (!user) {
      useBuyerAddressesStore.setState({ addresses: [] });
    } else {
      const isDemo = ['buyer@ecoeat.com', 'seller@ecoeat.com', 'courier@ecoeat.com', 'lks@ecoeat.com', 'admin@ecoeat.com'].includes(user.email);
      if (!isDemo) {
        useBuyerAddressesStore.setState({ addresses: [] });
      }
    }
  });
}
