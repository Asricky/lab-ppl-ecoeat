import { create } from 'zustand';
import { courierTasks as initialTasks, CourierTask } from '@/lib/dashboardData';
import { useAuthStore } from './authStore';

interface TaskState {
  tasks: CourierTask[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  completeTask: (id: string, photo: string, note: string) => void;
  failTask: (id: string, reason: string) => void;
  addTask: (task: CourierTask) => void;
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

export const useTaskStore = create<TaskState>((set) => ({
  tasks: getInitialTasks(),
  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),
  completeTask: (id, photo, note) => set((state) => ({
    tasks: state.tasks.map(t => t.id === id ? {
      ...t,
      status: 'completed',
      proofUploaded: true,
      photoProofUrl: photo,
      handoverNote: note,
      completedAt: new Date().toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short', year: 'numeric' })
    } : t)
  })),
  failTask: (id, reason) => set((state) => ({
    tasks: state.tasks.map(t => t.id === id ? {
      ...t,
      status: 'failed',
      proofUploaded: false,
      handoverNote: reason,
      completedAt: new Date().toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short', year: 'numeric' })
    } : t)
  })),
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
