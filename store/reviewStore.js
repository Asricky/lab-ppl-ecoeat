import { create } from 'zustand';

export const useReviewStore = create((set) => ({
  reviews: [
    {
      id: 'rev1',
      productId: '8', // ID of 'Organic Heirloom Tomatoes' in mock
      userName: 'Siti R.',
      rating: 5,
      comment: 'Tomatnya masih sangat segar dan ukurannya besar-besar. Sangat cocok buat bikin saus pasta. Pengirimannya juga cepat dan aman!',
      date: '2026-05-01T10:00:00Z'
    },
    {
      id: 'rev2',
      productId: '8',
      userName: 'Ahmad B.',
      rating: 4,
      comment: 'Kualitas oke meski ada beberapa yang sedikit memar, tapi wajar untuk barang surplus. Harganya super murah.',
      date: '2026-05-02T08:30:00Z'
    }
  ],
  addReview: (review) => set((state) => ({
    reviews: [
      { id: Date.now().toString(), date: new Date().toISOString(), ...review },
      ...state.reviews
    ]
  })),
  getReviewsByProduct: (productId) => (state) => state.reviews.filter(r => r.productId === productId),
}));
