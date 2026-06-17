import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ---------------------------------------------------------
// INITIAL DATA
// ---------------------------------------------------------

export const INITIAL_PRODUCTS = [
  {
    id: 'PRD-01',
    name: 'Nasi Goreng Spesial',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=100&h=100&q=80',
    category: 'Prepared Meals',
    type: 'Sell',
    stock: 12,
    price: 'Rp 25.000',
    originalPrice: 'Rp 35.000',
    discountPercent: 29,
    expiry: '20/05/2026 18:00',
    expiryDatetime: '2026-05-20T18:00',
    status: 'Active',
    description: 'Nasi goreng dengan bumbu rahasia, telur, dan suwiran ayam. Cocok untuk makan malam.',
    seller: 'Toko Penyelamat Makanan'
  },
  {
    id: 'PRD-02',
    name: 'Ayam Penyet',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=100&h=100&q=80',
    category: 'Prepared Meals',
    type: 'Sell',
    stock: 8,
    price: 'Rp 15.000',
    originalPrice: 'Rp 30.000',
    discountPercent: 50,
    expiry: '18/06/2026 21:00',
    expiryDatetime: '2026-06-18T21:00',
    status: 'Active',
    description: 'Ayam penyet komplit dengan sambal dan lalapan. Berasal dari batch sisa penjualan.',
    seller: 'Warung Bu Sri'
  },
  {
    id: 'PRD-03',
    name: 'Keripik Singkong Balado',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=100&h=100&q=80',
    category: 'Snack',
    type: 'Sell',
    stock: 15,
    price: 'Rp 10.000',
    originalPrice: 'Rp 18.000',
    discountPercent: 44,
    expiry: '25/06/2026 12:00',
    expiryDatetime: '2026-06-25T12:00',
    status: 'Active',
    description: 'Keripik singkong renyah dengan bumbu balado pedas manis.',
    seller: 'Toko Snack Oye'
  },
  {
    id: 'PRD-04',
    name: 'Es Kopi Susu Aren',
    image: 'https://images.unsplash.com/photo-1495147466023-ff5a443385f5?auto=format&fit=crop&w=100&h=100&q=80',
    category: 'Drink',
    type: 'Sell',
    stock: 20,
    price: 'Rp 12.000',
    originalPrice: 'Rp 22.000',
    discountPercent: 45,
    expiry: '18/06/2026 19:00',
    expiryDatetime: '2026-06-18T19:00',
    status: 'Active',
    description: 'Es kopi susu dengan gula aren asli. Segar dinikmati di sore hari.',
    seller: 'Kopi Senja'
  },
  {
    id: 'PRD-05',
    name: 'Croissant Butter',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=100&h=100&q=80',
    category: 'Bakery',
    type: 'Sell',
    stock: 10,
    price: 'Rp 14.000',
    originalPrice: 'Rp 25.000',
    discountPercent: 44,
    expiry: '19/06/2026 10:00',
    expiryDatetime: '2026-06-19T10:00',
    status: 'Active',
    description: 'Croissant mentega klasik yang renyah di luar dan lembut di dalam.',
    seller: 'Bakehouse 19'
  },
  {
    id: 'PRD-06',
    name: 'Roti Gandum (Sisa Hari Ini)',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=100&h=100&q=80',
    category: 'Bakery',
    type: 'Donate',
    stock: 5,
    price: 'Free',
    expiry: '08/05/2026 14:30',
    expiryDatetime: '2026-05-08T14:30',
    status: 'Expiring Soon',
    description: 'Roti gandum segar dari oven, sisa penjualan hari ini. Masih sangat layak konsumsi.',
    seller: 'Toko Penyelamat Makanan'
  },
  {
    id: 'PRD-07',
    name: 'Sayur Sop Ayam',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=100&h=100&q=80',
    category: 'Prepared Meals',
    type: 'Sell',
    stock: 0,
    price: 'Rp 15.000',
    originalPrice: 'Rp 22.000',
    discountPercent: 32,
    expiry: '-',
    expiryDatetime: '',
    status: 'Sold Out',
    description: 'Sayur sop hangat dengan potongan ayam kampung dan sayuran segar.',
    seller: 'Toko Penyelamat Makanan'
  },
  {
    id: 'PRD-08',
    name: 'Pisang Sunpride',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=100&h=100&q=80',
    category: 'Fresh Produce',
    type: 'Donate',
    stock: 20,
    price: 'Free',
    expiry: '10/05/2026 09:00',
    expiryDatetime: '2026-05-10T09:00',
    status: 'Active',
    description: 'Pisang berkualitas tinggi yang bentuknya sedikit kurang sempurna untuk display supermarket.',
    seller: 'Toko Penyelamat Makanan'
  }
];

export const INITIAL_ORDERS = [
  {
    id: 'ORD-5432',
    productName: 'Nasi Goreng Spesial',
    quantity: 2,
    price: 'Rp 50.000',
    status: 'Active',
    refundStatus: '-',
    date: 'Hari ini, 10:30',
    buyer: 'Lukas Ricky Krisjatmiko'
  }
];

export const INITIAL_DONATIONS = [
  {
    id: 'DON-9021',
    productName: 'Organic Heirloom Tomatoes',
    product: 'Organic Heirloom Tomatoes',
    amountKg: 7.2,
    donor: 'Toko Penyelamat Makanan',
    status: 'Completed',
    eta: 'Delivered',
    dateReceived: '12/05/2026',
    recipient: 'Green Valley Kitchen',
    recipientImage: 'https://images.unsplash.com/photo-1574314050516-e56593a1fa06?w=400&q=80',
    weight: '24 porsi',
    date: '12 Mei 2026',
    image: 'https://images.unsplash.com/photo-1593113565694-c6f8716c0296?w=400&q=80'
  }
];

export const INITIAL_TASKS = [
  {
    id: 'TASK-1029',
    type: 'purchase',
    pickup: 'Toko Penyelamat Makanan',
    destination: 'Lukas Ricky Krisjatmiko',
    distance: '2.5 km',
    eta: '15-30 min',
    reward: 15000,
    status: 'assigned',
    proofUploaded: false
  }
];

// ---------------------------------------------------------
// ZUSTAND GLOBAL STORE
// ---------------------------------------------------------

export interface GlobalState {
  products: any[];
  orders: any[];
  donations: any[];
  tasks: any[];
  notifications: any[];

  // Products
  addProduct: (product: any) => void;
  reduceProductStock: (productId: string, quantity: number) => void;

  // Orders
  addOrder: (order: any) => void;

  // Donations
  addDonation: (donation: any) => void;
  updateDonationStatus: (id: string, status: string) => void;

  // Tasks (Courier)
  addTask: (task: any) => void;
  completeTask: (id: string, photoUrl: string, note: string) => void;
  failTask: (id: string, reason: string) => void;

  // Notifications (LKS/General)
  addNotification: (notif: any) => void;
}

export const useGlobalStore = create<GlobalState>()(
  persist(
    (set) => ({
      products: INITIAL_PRODUCTS,
      orders: INITIAL_ORDERS,
      donations: INITIAL_DONATIONS,
      tasks: INITIAL_TASKS,
      notifications: [],

      // Product Actions
      addProduct: (product) =>
        set((state) => ({ products: [product, ...state.products] })),

      reduceProductStock: (productId, quantity) =>
        set((state) => ({
          products: state.products.map(p => {
            if (p.id === productId) {
              const newStock = Math.max(0, p.stock - quantity);
              return {
                ...p,
                stock: newStock,
                status: newStock === 0 ? 'Sold Out' : p.status
              };
            }
            return p;
          })
        })),

      // Order Actions
      addOrder: (order) =>
        set((state) => ({ orders: [order, ...state.orders] })),

      // Donation Actions
      addDonation: (donation) =>
        set((state) => ({ donations: [donation, ...state.donations] })),
      updateDonationStatus: (id, status) =>
        set((state) => ({
          donations: state.donations.map(d =>
            d.id === id ? { ...d, status } : d
          )
        })),

      // Task Actions
      addTask: (task) =>
        set((state) => ({ tasks: [task, ...state.tasks] })),

      completeTask: (id, photoUrl, note) =>
        set((state) => ({
          tasks: state.tasks.map(t =>
            t.id === id
              ? {
                ...t,
                status: 'completed',
                proofUploaded: true,
                photoProofUrl: photoUrl,
                handoverNote: note,
                completedAt: new Date().toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short', year: 'numeric' })
              }
              : t
          )
        })),

      failTask: (id, reason) =>
        set((state) => ({
          tasks: state.tasks.map(t =>
            t.id === id
              ? {
                ...t,
                status: 'failed',
                proofUploaded: false,
                handoverNote: reason,
                completedAt: new Date().toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short', year: 'numeric' })
              }
              : t
          )
        })),

      // Notification Actions
      addNotification: (notif) =>
        set((state) => ({ notifications: [notif, ...state.notifications] }))
    }),
    {
      name: 'ecoeat-global-store', // key in localStorage
      version: 2,
      migrate: (persistedState: any, version: number) => {
        return persistedState;
      }
    }
  )
);
