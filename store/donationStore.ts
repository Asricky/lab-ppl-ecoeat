import { create } from 'zustand';
import { IncomingDonation } from '@/lib/dashboardData';
import { supabase } from '@/lib/supabase';

interface DonationState {
  donations: IncomingDonation[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  acceptDonation: (id: string) => Promise<void>;
  addIncomingDonation: (donation: IncomingDonation) => void;
  fetchDonations: () => Promise<void>;
}

export const useDonationStore = create<DonationState>((set, get) => ({
  donations: [],
  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),
  fetchDonations: async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          order_status,
          total_portions,
          completed_at,
          seller:users!seller_id(full_name),
          courier:users!courier_id(full_name),
          order_items(product:products(title)),
          delivery:deliveries(estimated_arrival_time)
        `)
        .eq('order_type', 'donation');

      if (error) throw error;

      if (data) {
        const mappedDonations: IncomingDonation[] = data.map((order: any) => {
          let status: IncomingDonation['status'] = 'Assigned';
          if (order.order_status === 'completed') status = 'Completed';
          else if (order.order_status === 'accepted') status = 'Accepted';
          else if (order.order_status === 'in_progress') status = 'In Progress';

          let eta = '-';
          if (order.delivery && order.delivery.length > 0 && order.delivery[0].estimated_arrival_time) {
            eta = new Date(order.delivery[0].estimated_arrival_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
          }

          let dateReceived = '-';
          if (order.completed_at) {
            dateReceived = new Date(order.completed_at).toLocaleDateString('id-ID');
          }

          const productTitle = order.order_items && order.order_items.length > 0 && order.order_items[0].product
            ? order.order_items[0].product.title
            : 'Unknown Product';

          return {
            id: order.id,
            donor: order.seller?.full_name || 'Unknown Donor',
            product: productTitle,
            amountKg: order.total_portions || 0,
            status,
            eta,
            dateReceived,
            courierName: order.courier?.full_name || '-',
          };
        });
        set({ donations: mappedDonations });
      }
    } catch (err) {
      console.error('Failed to fetch donations:', err);
    }
  },
  acceptDonation: async (id) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ order_status: 'accepted' })
        .eq('id', id);
        
      if (error) throw error;
      
      set((state) => ({
        donations: state.donations.map(d => d.id === id ? { ...d, status: 'Accepted' } as IncomingDonation : d)
      }));
    } catch (err) {
      console.error('Failed to accept donation:', err);
    }
  },
  addIncomingDonation: (donation) => set((state) => ({ donations: [donation, ...state.donations] }))
}));
