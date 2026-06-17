import { create } from 'zustand';
import { courierTasks as initialTasks, CourierTask } from '@/lib/dashboardData';
import { useAuthStore } from './authStore';

interface TaskState {
  tasks: CourierTask[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  completeTask: (id: string, photo: string, note: string) => Promise<void>;
  failTask: (id: string, reason: string) => Promise<void>;
  addTask: (task: CourierTask) => void;
  fetchTasks: () => Promise<void>;
}

const getInitialTasks = (): CourierTask[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('auth-storage');
    if (stored) {
      const parsed = JSON.parse(stored);
      const user = parsed.state?.user;
      if (user) {
        const isDemo = ['buyer@ecoeat.com', 'seller@ecoeat.com', 'courier@ecoeat.com', 'lks@ecoeat.com', 'admin@ecoeat.com', 'lukas.buyer@ecoeat.com', 'lukas.seller@ecoeat.com', 'lukas.kurir@ecoeat.com', 'lukas.lks@ecoeat.com'].includes(user.email);
        if (!isDemo) {
          return [];
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
  return initialTasks;
};

import { supabase } from '@/lib/supabase';

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),
  fetchTasks: async () => {
    try {
      const { data, error } = await supabase
        .from('deliveries')
        .select(`
          id,
          pickup_address,
          destination_address,
          distance_km,
          estimated_arrival_time,
          delivery_status,
          delivered_at,
          order:orders!order_id(
            order_type,
            delivery_fee
          )
        `);

      if (error) throw error;

      if (data && data.length > 0) {
        const mappedTasks: CourierTask[] = data.map((d: any) => {
          let status: CourierTaskState = 'assigned';
          if (d.delivery_status === 'in_transit') status = 'in_progress';
          else if (d.delivery_status === 'delivered') status = 'completed';
          else if (d.delivery_status === 'failed') status = 'failed';

          let eta = '-';
          if (d.estimated_arrival_time) {
            eta = new Date(d.estimated_arrival_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
          }

          let completedAt = undefined;
          if (d.delivered_at) {
            completedAt = new Date(d.delivered_at).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short', year: 'numeric' });
          }

          return {
            id: d.id,
            type: d.order?.order_type === 'donation' ? 'donation' : 'purchase',
            pickup: d.pickup_address || 'Unknown Pickup',
            destination: d.destination_address || 'Unknown Destination',
            distance: d.distance_km ? `${d.distance_km} km` : '0 km',
            eta,
            reward: d.order?.delivery_fee || 0,
            status,
            proofUploaded: status === 'completed',
            completedAt,
          };
        });
        set({ tasks: mappedTasks });
      } else {
        // Fallback to dummy data for testing purposes
        set({ tasks: getInitialTasks() });
      }
    } catch (err) {
      console.error('Failed to fetch tasks, falling back to dummy data:', err);
      set({ tasks: getInitialTasks() });
    }
  },
  completeTask: async (id, photo, note) => {
    try {
      const { error } = await supabase
        .from('deliveries')
        .update({ 
          delivery_status: 'delivered',
          delivered_at: new Date().toISOString()
        })
        .eq('id', id);

      if (!error) {
        await supabase.from('delivery_tracking_logs').insert({
          delivery_id: id,
          status: 'delivered',
          notes: note || 'Proof uploaded'
        });
      }

      if (error) {
        console.warn('Supabase update skipped (might be a dummy task):', error.message);
      }
    } catch (err) {
      console.warn('Supabase connection failed, updating local state only:', err);
    }

    // Always update local state to support dummy tasks
    set((state) => {
      const task = state.tasks.find(t => t.id === id);
      if (task && task.status !== 'completed') {
        const authState = useAuthStore.getState();
        if (authState.user) {
          useAuthStore.setState({
            user: {
              ...authState.user,
              ecoPayBalance: (authState.user.ecoPayBalance || 0) + (Number(task.reward) || 0)
            }
          });
        }
      }

      return {
        tasks: state.tasks.map(t => t.id === id ? {
          ...t,
          status: 'completed',
          proofUploaded: true,
          photoProofUrl: photo,
          handoverNote: note,
          completedAt: new Date().toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short', year: 'numeric' })
        } : t)
      };
    });
  },
  failTask: async (id, reason) => {
    try {
      const { error } = await supabase
        .from('deliveries')
        .update({ 
          delivery_status: 'failed' 
        })
        .eq('id', id);

      if (!error) {
        await supabase.from('delivery_tracking_logs').insert({
          delivery_id: id,
          status: 'failed',
          notes: reason || 'Task failed'
        });
      }

      if (error) {
        console.warn('Supabase update skipped (might be a dummy task):', error.message);
      }
    } catch (err) {
      console.warn('Supabase connection failed, updating local state only:', err);
    }

    // Always update local state to support dummy tasks
    set((state) => ({
      tasks: state.tasks.map(t => t.id === id ? {
        ...t,
        status: 'failed',
        proofUploaded: false,
        handoverNote: reason,
        completedAt: new Date().toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short', year: 'numeric' })
      } : t)
    }));
  },
  addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] }))
}));

if (typeof window !== 'undefined') {
  useAuthStore.subscribe((state) => {
    const user = state.user;
    if (!user) {
      useTaskStore.setState({ tasks: [] });
    } else {
      const isDemo = ['buyer@ecoeat.com', 'seller@ecoeat.com', 'courier@ecoeat.com', 'lks@ecoeat.com', 'admin@ecoeat.com', 'lukas.buyer@ecoeat.com', 'lukas.seller@ecoeat.com', 'lukas.kurir@ecoeat.com', 'lukas.lks@ecoeat.com'].includes(user.email);
      if (!isDemo) {
        useTaskStore.setState({ tasks: [] });
      }
    }
  });
}
