import { create } from 'zustand';

export type NotificationKind = 'order' | 'review' | 'favorite';

export interface AppNotification {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

const seed: AppNotification[] = [
  {
    id: 'n1',
    kind: 'order',
    title: 'Order on the way',
    body: 'Order #OP-7729 is out for delivery. Track it from your orders page.',
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'n2',
    kind: 'review',
    title: 'Rate your last purchase',
    body: 'How was Organic Heirloom Tomatoes? Leave a quick review to help other buyers.',
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'n3',
    kind: 'favorite',
    title: 'New listing from Sweet Haven',
    body: 'Evening Pastry Box just dropped near you — 60% off surplus price.',
    read: true,
    createdAt: new Date().toISOString(),
  },
];

interface NotificationState {
  items: AppNotification[];
  markRead: (id: string) => void;
  markAllRead: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  items: seed,
  markRead: (id) =>
    set((s) => ({
      items: s.items.map((i) => (i.id === id ? { ...i, read: true } : i)),
    })),
  markAllRead: () =>
    set((s) => ({
      items: s.items.map((i) => ({ ...i, read: true })),
    })),
}));
