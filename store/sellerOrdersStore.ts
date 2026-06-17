import { create } from 'zustand';

export interface SellerOrder {
  id: string;
  productName: string;
  quantity: number;
  price: string;
  status: string;
  refundStatus: string;
}

interface SellerOrdersState {
  orders: SellerOrder[];
  addOrder: (order: SellerOrder) => void;
}

export const useSellerOrdersStore = create<SellerOrdersState>((set) => ({
  orders: [
    { id: 'ORD-1029', productName: 'Artisan Sourdough Bundle', quantity: 2, price: 'Rp 45.000', status: 'Completed', refundStatus: '-' },
    { id: 'ORD-1030', productName: 'Pastry Box (Assorted)', quantity: 1, price: 'Rp 65.000', status: 'Active', refundStatus: '-' }
  ],
  addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
}));
