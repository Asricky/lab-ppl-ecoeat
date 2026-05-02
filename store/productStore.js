import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const INITIAL_PRODUCTS = [
  {
    id: 'PRD-01',
    name: 'Nasi Goreng Spesial',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=100&h=100&q=80',
    type: 'Sell',
    stock: 12,
    price: 'Rp 25.000',
    expiry: '4 hours',
    status: 'Active',
    description: 'Nasi goreng dengan bumbu rahasia, telur, dan suwiran ayam. Cocok untuk makan malam.'
  },
  {
    id: 'PRD-02',
    name: 'Roti Gandum (Sisa Hari Ini)',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=100&h=100&q=80',
    type: 'Donate',
    stock: 5,
    price: 'Free',
    expiry: '45 mins',
    status: 'Expiring Soon',
    description: 'Roti gandum segar dari oven, sisa penjualan hari ini. Masih sangat layak konsumsi.'
  },
  {
    id: 'PRD-03',
    name: 'Sayur Sop Ayam',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=100&h=100&q=80',
    type: 'Sell',
    stock: 0,
    price: 'Rp 15.000',
    expiry: '-',
    status: 'Sold Out',
    description: 'Sayur sop hangat dengan potongan ayam kampung dan sayuran segar.'
  },
  {
    id: 'PRD-04',
    name: 'Pisang Sunpride',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=100&h=100&q=80',
    type: 'Donate',
    stock: 20,
    price: 'Free',
    expiry: '2 days',
    status: 'Active',
    description: 'Pisang berkualitas tinggi yang bentuknya sedikit kurang sempurna untuk display supermarket.'
  }
];

const INITIAL_DONATIONS = [
  {
    id: 'DON-9021',
    productName: 'Organic Heirloom Tomatoes',
    weight: '10kg',
    recipient: 'Green Valley Community Kitchen',
    recipientImage: 'https://images.unsplash.com/photo-1593113565694-c6f8716c0296?w=200&q=80',
    date: 'Yesterday, 10:00 AM',
    status: 'Delivered',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200&q=80'
  },
  {
    id: 'DON-8842',
    productName: 'Artisan Sourdough Loaf',
    weight: '5kg',
    recipient: 'Hope Harbor Shelter',
    recipientImage: 'https://images.unsplash.com/photo-1574314050516-e56593a1fa06?w=200&q=80',
    date: 'Oct 22, 2023',
    status: 'Delivered',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&q=80'
  }
];

export const useProductStore = create(
  persist(
    (set) => ({
      products: INITIAL_PRODUCTS,
      donations: INITIAL_DONATIONS,
      draftProduct: {
        name: '',
        category: '',
        type: 'Sell',
        stock: 0,
        originalPrice: '',
        price: '',
        expiry: '',
        description: '',
        image: ''
      },
      setDraftProduct: (data) => set((state) => ({ draftProduct: { ...state.draftProduct, ...data } })),
      clearDraft: () => set(() => ({ draftProduct: { name: '', category: '', type: 'Sell', stock: 0, originalPrice: '', price: '', expiry: '', description: '', image: '' } })),
      addProduct: (product) => set((state) => ({ products: [product, ...state.products] })),
      deleteProduct: (id) => set((state) => ({ products: state.products.filter(p => p.id !== id) })),
      updateProduct: (id, updatedData) => set((state) => ({
        products: state.products.map(p => p.id === id ? { ...p, ...updatedData } : p)
      })),
      addDonation: (donation) => set((state) => ({ donations: [donation, ...state.donations] }))
    }),
    {
      name: 'ecoeat-product-storage',
      version: 1, // forces clearing of old unversioned data to fix stale data issues
      migrate: (persistedState, version) => {
        if (version === 0 || !version) {
          return {
            products: INITIAL_PRODUCTS,
            donations: INITIAL_DONATIONS,
            draftProduct: {
              name: '', category: '', type: 'Sell', stock: 0, 
              originalPrice: '', price: '', expiry: '', description: '', image: ''
            }
          };
        }
        return persistedState;
      }
    }
  )
);
