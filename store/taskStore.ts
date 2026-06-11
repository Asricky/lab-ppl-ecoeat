import { create } from 'zustand';
import { courierTasks as initialTasks, CourierTask } from '@/lib/dashboardData';

interface TaskState {
  tasks: CourierTask[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  completeTask: (id: string, photo: string, note: string) => void;
  failTask: (id: string, reason: string) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: initialTasks,
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
  }))
}));
