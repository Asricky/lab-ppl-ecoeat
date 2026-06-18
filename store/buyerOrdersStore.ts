import { create } from 'zustand';
import { useEcoPayStore } from './ecoPayStore';
import { useAuthStore } from './authStore';

/** Display unit scales to IDR via × 1000 (same as formatRp elsewhere) */
export function displayToIdr(display: number) {
  return Math.round(display * 1000);
}

export interface OrderLine {
  productId: string;
  name: string;
  image: string;
  quantity: number;
  /** price per unit in display units */
  unitPriceDisplay: number;
}

export interface BuyerOrder {
  id: string;
  tab: 'Active Orders' | 'Completed' | 'Cancelled' | 'Refunded';
  statusLabel: string;
  shipmentStatus: string;
  vendorName?: string;
  lines: OrderLine[];
  shippingAddress: string;
  shippingCity: string;
  shippingPhone?: string;
  orderedAtLabel: string;
  /** Biaya kirim (display units × 1000 = IDR) */
  deliveryFeeDisplay?: number;
  /** Biaya layanan platform (display units) */
  platformFeeDisplay?: number;
  /** Estimasi tiba — ringkas (pesanan aktif & tracking) */
  estimatedArrivalLabel?: string;
  /** refundable until user completes request */
  refundEligible?: boolean;
  refundAmountDisplay?: number;
  deliveryMethod?: 'delivery' | 'pickup';
}

export function formatDisplayLineTotal(order: BuyerOrder): number {
  return order.lines.reduce((acc, l) => acc + l.quantity * l.unitPriceDisplay, 0);
}

/** Subtotal barang, biaya kirim & layanan, total pembayaran (satuan display × 1000 = IDR) */
export function orderPaymentBreakdown(order: BuyerOrder) {
  const subtotalItems = formatDisplayLineTotal(order);
  const delivery = order.deliveryFeeDisplay ?? 0;
  const platform = order.platformFeeDisplay ?? 0;
  return {
    subtotalItems,
    delivery,
    platform,
    grandTotal: subtotalItems + delivery + platform,
  };
}

const INITIAL: BuyerOrder[] = [
  {
    id: 'OP-7729',
    tab: 'Active Orders',
    statusLabel: 'Out for Delivery',
    shipmentStatus: 'Courier is on the way — estimated arrival today before 18:00.',
    vendorName: 'Green Basket Co-op',
    lines: [
      {
        productId: 'veg-box-1',
        name: 'Local Organic Veggie Box',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500',
        quantity: 1,
        unitPriceDisplay: 24,
      },
    ],
    shippingAddress: 'Jl. Melati Dalam No. 12A',
    shippingCity: 'Bandung, Jawa Barat 40115',
    shippingPhone: '+62 812-3456-7890',
    orderedAtLabel: 'Today',
    deliveryFeeDisplay: 3,
    platformFeeDisplay: 0.5,
    estimatedArrivalLabel: 'Hari ini, 15:30 – 18:00 WIB',
  },
  {
    id: 'OP-9921',
    tab: 'Refunded',
    statusLabel: 'Item not delivered',
    shipmentStatus: 'Delivery failed — refund available.',
    vendorName: 'Heirloom Harvest',
    lines: [
      {
        productId: 'box-harvest',
        name: 'Heirloom Harvest Box',
        image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500',
        quantity: 1,
        unitPriceDisplay: 45,
      },
    ],
    shippingAddress: 'Perumahan Cendana Blok C2 No. 8',
    shippingCity: 'Jakarta Selatan, DKI Jakarta 12310',
    shippingPhone: '+62 821-9988-7766',
    orderedAtLabel: 'Oct 14, 2023',
    deliveryFeeDisplay: 5,
    platformFeeDisplay: 0.5,
    refundEligible: true,
    refundAmountDisplay: 45,
  },
  {
    id: 'OP-8834',
    tab: 'Refunded',
    statusLabel: 'Refund completed',
    shipmentStatus: 'Refund has been credited to your EcoPay wallet.',
    vendorName: 'Berry Lane',
    lines: [
      {
        productId: 'berry-1',
        name: 'Organic Berry Medley',
        image: 'https://images.unsplash.com/photo-1596199050105-6d5d32222916?w=500',
        quantity: 1,
        unitPriceDisplay: 32.5,
      },
    ],
    shippingAddress: 'Jl. Bamboo Raya No. 20',
    shippingCity: 'Surabaya, Jawa Timur 60256',
    orderedAtLabel: 'Oct 10, 2023',
    refundEligible: false,
    refundAmountDisplay: 32.5,
    deliveryFeeDisplay: 4,
    platformFeeDisplay: 0.5,
  },
  {
    id: 'CK-2201',
    tab: 'Cancelled',
    statusLabel: 'Cancelled',
    shipmentStatus: 'Order cancelled before dispatch.',
    lines: [
      {
        productId: 'meal-kit',
        name: 'Community Kitchen Meal Kit',
        image: 'https://images.unsplash.com/photo-1622597467836-f38240662c8c?w=500',
        quantity: 1,
        unitPriceDisplay: 18,
      },
    ],
    shippingAddress: 'Jl. Veteran III No. 5',
    shippingCity: 'Yogyakarta, DIY 55161',
    orderedAtLabel: 'Oct 20, 2024',
    refundEligible: true,
    refundAmountDisplay: 18,
    deliveryFeeDisplay: 2,
    platformFeeDisplay: 0.5,
  },
  {
    id: 'OP-7710',
    tab: 'Completed',
    statusLabel: 'Delivered',
    shipmentStatus: 'Delivered successfully.',
    lines: [
      {
        productId: '8',
        name: 'Organic Heirloom Tomatoes',
        image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200',
        quantity: 2,
        unitPriceDisplay: 3.5,
      },
    ],
    shippingAddress: 'Apartemen Lavender Tower B / 904',
    shippingCity: 'Tangerang, Banten 15143',
    shippingPhone: '+62 817-8899-0011',
    orderedAtLabel: 'Sep 28, 2024',
    deliveryFeeDisplay: 2.5,
    platformFeeDisplay: 0.5,
  },
  {
    id: 'OP-7711',
    tab: 'Completed',
    statusLabel: 'Delivered',
    shipmentStatus: 'Delivered successfully.',
    lines: [
      {
        productId: '9',
        name: 'Leafy Green Bundle',
        image: 'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?w=200',
        quantity: 1,
        unitPriceDisplay: 12,
      },
    ],
    shippingAddress: 'Jl. Anggrek Lestari No. 44',
    shippingCity: 'Depok, Jawa Barat 16451',
    shippingPhone: '+62 831-7654-2233',
    orderedAtLabel: 'Sep 30, 2024',
    deliveryFeeDisplay: 2.5,
    platformFeeDisplay: 0.5,
  },
];

interface BuyerOrdersState {
  orders: BuyerOrder[];
  refundCompletedIds: string[];
  completeRefund: (orderId: string, amountIdr: number) => void;
  getOrder: (orderId: string) => BuyerOrder | undefined;
  addOrder: (order: BuyerOrder) => void;
  completeOrder: (orderId: string) => void;
}

const getInitialOrders = (): BuyerOrder[] => {
  if (typeof window === 'undefined') return [];
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
  return INITIAL;
};

export const useBuyerOrdersStore = create<BuyerOrdersState>((set, get) => ({
  orders: getInitialOrders(),
  refundCompletedIds: [],
  getOrder: (orderId) => get().orders.find((o) => o.id === orderId),
  addOrder: (order) => set((s) => ({ orders: [order, ...s.orders] })),
  completeOrder: (orderId) => set((s) => ({
    orders: s.orders.map((o) =>
      o.id === orderId
        ? {
            ...o,
            tab: 'Completed',
            statusLabel: 'Delivered',
            shipmentStatus: 'Delivered successfully.',
          }
        : o
    ),
  })),
  completeRefund: (orderId, amountIdr) => {
    const s = get();
    if (s.refundCompletedIds.includes(orderId)) return;
    const target = s.orders.find((o) => o.id === orderId);
    if (!target?.refundEligible) return;
    useEcoPayStore.getState().updateSaldo(amountIdr, 'Refund');
    set({
      refundCompletedIds: [...s.refundCompletedIds, orderId],
      orders: s.orders.map((o) =>
        o.id === orderId
          ? {
              ...o,
              refundEligible: false,
              statusLabel: 'Refund completed',
              shipmentStatus: 'Refund has been credited to your EcoPay wallet.',
            }
          : o
      ),
    });
  },
}));

if (typeof window !== 'undefined') {
  useAuthStore.subscribe((state) => {
    const user = state.user;
    if (!user) {
      useBuyerOrdersStore.setState({ orders: [] });
    } else {
      const isDemo = ['buyer@ecoeat.com', 'seller@ecoeat.com', 'courier@ecoeat.com', 'lks@ecoeat.com', 'admin@ecoeat.com'].includes(user.email);
      if (!isDemo) {
        useBuyerOrdersStore.setState({ orders: [] });
      }
    }
  });
}
