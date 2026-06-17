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
    name: 'Roti Gandum (Sisa Hari Ini)',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=100&h=100&q=80',
    category: 'Bakery & Pastry',
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
    id: 'PRD-03',
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
    id: 'PRD-04',
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
    product: 'Organic Heirloom Tomatoes',
    amountKg: 7.2,
    donor: 'Green Valley Kitchen',
    status: 'Completed',
    eta: 'Delivered',
    dateReceived: '12/05/2026'
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
      version: 1,
    }
  )
);
