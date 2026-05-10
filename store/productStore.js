import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const INITIAL_PRODUCTS = [
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
    description: 'Nasi goreng dengan bumbu rahasia, telur, dan suwiran ayam. Cocok untuk makan malam.'
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
    description: 'Roti gandum segar dari oven, sisa penjualan hari ini. Masih sangat layak konsumsi.'
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
    description: 'Sayur sop hangat dengan potongan ayam kampung dan sayuran segar.'
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
    description: 'Pisang berkualitas tinggi yang bentuknya sedikit kurang sempurna untuk display supermarket.'
  },
  {
    id: 'PRD-05',
    name: 'Ayam Bakar Madu',
    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c3?auto=format&fit=crop&w=100&h=100&q=80',
    category: 'Prepared Meals',
    type: 'Sell',
    stock: 2,
    price: 'Rp 28.000',
    originalPrice: 'Rp 40.000',
    discountPercent: 30,
    expiry: '08/05/2026 20:00',
    expiryDatetime: '2026-05-08T20:00',
    status: 'Active',
    description: 'Ayam bakar dengan bumbu madu khas, disajikan dengan lalapan segar.'
  },
  {
    id: 'PRD-06',
    name: 'Salad Buah Segar',
    image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&w=100&h=100&q=80',
    category: 'Fresh Produce',
    type: 'Sell',
    stock: 8,
    price: 'Rp 18.000',
    originalPrice: 'Rp 25.000',
    discountPercent: 28,
    expiry: '09/05/2026 12:00',
    expiryDatetime: '2026-05-09T12:00',
    status: 'Active',
    description: 'Campuran buah segar musiman dengan saus yogurt madu.'
  },
  {
    id: 'PRD-07',
    name: 'Croissant Mentega',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=100&h=100&q=80',
    category: 'Bakery & Pastry',
    type: 'Donate',
    stock: 10,
    price: 'Free',
    expiry: '08/05/2026 17:00',
    expiryDatetime: '2026-05-08T17:00',
    status: 'Active',
    description: 'Croissant mentega sisa display toko, masih segar dan layak konsumsi.'
  }
];

const INITIAL_DONATIONS = [
  {
    id: 'DON-9021',
    productName: 'Organic Heirloom Tomatoes',
    weight: '24 porsi',
    recipient: 'Green Valley Kitchen',
    recipientImage: 'https://images.unsplash.com/photo-1574314050516-e56593a1fa06?w=400&q=80',
    date: 'Yesterday, 10:00 AM',
    status: 'Delivered',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&q=80'
  },
  {
    id: 'DON-8842',
    productName: 'Artisan Sourdough Loaf',
    weight: '15 porsi',
    recipient: 'Hope Harbor Shelter',
    recipientImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80',
    date: 'Oct 22, 2023',
    status: 'Delivered',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80'
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
        expiryDatetime: '',
        description: '',
        image: '',
        discountPercent: 20,
      },
      setDraftProduct: (data) => set((state) => ({ draftProduct: { ...state.draftProduct, ...data } })),
      clearDraft: () =>
        set(() => ({
          draftProduct: {
            name: '',
            category: '',
            type: 'Sell',
            stock: 0,
            originalPrice: '',
            price: '',
            expiry: '',
            expiryDatetime: '',
            description: '',
            image: '',
            discountPercent: 20,
          },
        })),
      addProduct: (product) => set((state) => ({ products: [product, ...state.products] })),
      deleteProduct: (id) => set((state) => ({ products: state.products.filter(p => p.id !== id) })),
      updateProduct: (id, updatedData) => set((state) => ({
        products: state.products.map(p => p.id === id ? { ...p, ...updatedData } : p)
      })),
      addDonation: (donation) => set((state) => ({ donations: [donation, ...state.donations] }))
    }),
    {
      name: 'ecoeat-product-storage',
      version: 3,
      migrate: (persistedState, fromVersion) => {
        if (fromVersion < 3) {
          // Reset to fresh initial data so new products and expiry format are applied
          return {
            products: INITIAL_PRODUCTS,
            donations: INITIAL_DONATIONS,
            draftProduct: {
              name: '', category: '', type: 'Sell', stock: 0,
              originalPrice: '', price: '', expiry: '', expiryDatetime: '',
              description: '', image: '', discountPercent: 20,
            }
          };
        }
        return persistedState;
      }
    }
  )
);
