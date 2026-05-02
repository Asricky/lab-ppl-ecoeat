export type OrderStatus = 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled' | 'failed';

export interface OrderData {
  id: string;
  type: 'purchase' | 'donation';
  productName: string;
  pickupName: string;
  pickupAddress: string;
  pickupPhone: string;
  pickupContact: string;
  pickupAvatar: string;
  destinationName: string;
  destinationAddress: string;
  destinationPhone: string;
  destinationContact: string;
  destinationAvatar: string;
  status: OrderStatus;
  distance: string;
  time: string;
  reward: number;
  photoProofUrl?: string;
  carbonSaved?: string;
  isHighPriority?: boolean;
  date?: string; // ISO date string for history filtering
}

export const dummyOrders: OrderData[] = [
  {
    id: 'ORD-1',
    type: 'purchase',
    productName: 'Sayur Organik Segar',
    pickupName: 'Pasar Swalayan Blok M',
    pickupAddress: 'Jl. Melawai No. 12, Jakarta',
    pickupContact: 'Budi Santoso',
    pickupPhone: '+62 812 3456 7890',
    pickupAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi',
    destinationName: 'Apartemen Sudirman',
    destinationAddress: 'Jl. Jend. Sudirman Kav 45, Tower A',
    destinationContact: 'Siti Aminah',
    destinationPhone: '+62 856 1234 5678',
    destinationAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siti',
    status: 'in_progress',
    distance: '2.4 km',
    time: '15 mins',
    reward: 15000,
    date: new Date().toISOString(), // Today
  },
  {
    id: 'ORD-2',
    type: 'donation',
    productName: 'Roti Sisa Penjualan',
    pickupName: 'Toko Roti Makmur',
    pickupAddress: 'Jl. Sabang No. 8, Jakarta',
    pickupContact: 'Andi Wijaya',
    pickupPhone: '+62 811 2222 3333',
    pickupAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Andi',
    destinationName: 'Panti Asuhan Kasih',
    destinationAddress: 'Jl. Pramuka Raya No. 10',
    destinationContact: 'Ibu Ratna',
    destinationPhone: '+62 877 3333 4444',
    destinationAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ratna',
    status: 'assigned',
    distance: '1.2 km',
    time: '8 mins',
    reward: 10000,
    date: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
  },
  {
    id: 'ORD-3',
    type: 'purchase',
    productName: 'Paket Makanan Vegan',
    pickupName: 'Vegan Resto Senopati',
    pickupAddress: 'Jl. Senopati No. 45, Jakarta',
    pickupContact: 'David Kurniawan',
    pickupPhone: '+62 899 5555 6666',
    pickupAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    destinationName: 'Gedung Perkantoran SCBD',
    destinationAddress: 'Kawasan SCBD Lot 3',
    destinationContact: 'Rina Kusuma',
    destinationPhone: '+62 888 7777 8888',
    destinationAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rina',
    status: 'completed',
    distance: '3.1 km',
    time: '20 mins',
    reward: 18000,
    photoProofUrl: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?q=80&w=400&auto=format&fit=crop',
    date: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
  },
  {
    id: 'ORD-4',
    type: 'purchase',
    productName: 'Paket Daging Premium',
    pickupName: 'Pasar Santa Daging',
    pickupAddress: 'Jl. Cipaku I, Kebayoran Baru',
    pickupContact: 'Agus Setiawan',
    pickupPhone: '+62 813 9999 0000',
    pickupAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Agus',
    destinationName: 'Perumahan Menteng',
    destinationAddress: 'Jl. Teuku Umar No. 10',
    destinationContact: 'Bapak Hendra',
    destinationPhone: '+62 812 8888 9999',
    destinationAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hendra',
    status: 'assigned',
    distance: '5.8 km',
    time: '22 mins',
    reward: 25000,
    isHighPriority: true,
    date: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 days ago
  }
];

export function getOrderById(id: string): OrderData | undefined {
  return dummyOrders.find(order => order.id === id);
}

export function updateOrderStatus(id: string, status: OrderStatus) {
  const order = dummyOrders.find(o => o.id === id);
  if (order) {
    order.status = status;
  }
}

export function updateOrderPhoto(id: string, photoUrl: string) {
  const order = dummyOrders.find(o => o.id === id);
  if (order) {
    order.photoProofUrl = photoUrl;
  }
}

export type NotificationType = 'new_order' | 'cancelled' | 'system';

export interface NotificationData {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

export const dummyNotifications: NotificationData[] = [
  {
    id: 'n1',
    type: 'new_order',
    title: 'New Order Available',
    message: 'New delivery request from Toko Kue Bu Ani',
    time: '2 mins ago',
    isRead: false,
  },
  {
    id: 'n2',
    type: 'system',
    title: 'Payout Confirmed',
    message: 'Rp25.000 has been credited to your EcoPay balance.',
    time: '1 hour ago',
    isRead: false,
  },
  {
    id: 'n3',
    type: 'cancelled',
    title: 'Order Cancelled',
    message: 'Order #EC-8891 has been cancelled by the buyer.',
    time: 'Yesterday',
    isRead: true,
  }
];
