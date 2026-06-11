import { create } from "zustand";

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
  setPrimary: (id: string) => void;
}

export const useBuyerAddressesStore = create<BuyerAddressesState>((set) => ({
  addresses: [
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
  ],
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
  setPrimary: (id) => {
    set((s) => ({
      addresses: s.addresses.map((a) => ({ ...a, isPrimary: a.id === id })),
    }));
  },
}));
