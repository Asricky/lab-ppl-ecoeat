export type OrderStatus = 'assigned' | 'in_progress' | 'completed' | 'cancelled' | 'failed';

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
  carbonSaved?: string;
  isHighPriority?: boolean;
}

export const dummyOrders: OrderData[] = [
  {
    id: 'ORD-1',
    type: 'purchase',
    productName: 'Fresh Organic Produce Box',
    pickupName: 'Whole Foods Market, Broadway',
    pickupAddress: '250 E 57th St, NY 10022',
    pickupContact: 'Elena Rodriguez',
    pickupPhone: '+1 (555) 092-3314',
    pickupAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
    destinationName: 'Residential Apt',
    destinationAddress: '482 West End Ave, Apt 4C',
    destinationContact: 'Michael Smith',
    destinationPhone: '+1 (555) 882-9012',
    destinationAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    status: 'in_progress',
    distance: '2.4 km',
    time: '15 mins',
  },
  {
    id: 'ORD-2',
    type: 'donation',
    productName: 'Leftover Baked Goods',
    pickupName: 'Community Pantry Central',
    pickupAddress: '100 Bread Ave, Baker District',
    pickupContact: 'Sarah Jenkins',
    pickupPhone: '+1 (555) 111-2222',
    pickupAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    destinationName: 'River View Shelter',
    destinationAddress: '99 Riverside Drive',
    destinationContact: 'Manager Tom',
    destinationPhone: '+1 (555) 333-4444',
    destinationAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tom',
    status: 'assigned',
    distance: '1.2 km',
    time: '8 mins',
  },
  {
    id: 'ORD-3',
    type: 'purchase',
    productName: 'Vegan Meal Prep Kit',
    pickupName: 'Green Grocers Inc.',
    pickupAddress: '45 Veggie St.',
    pickupContact: 'David Lee',
    pickupPhone: '+1 (555) 555-5555',
    pickupAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    destinationName: 'Office Suite',
    destinationAddress: '22 Baker St.',
    destinationContact: 'Alice Johnson',
    destinationPhone: '+1 (555) 666-6666',
    destinationAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    status: 'completed',
    distance: '3.1 km',
    time: '20 mins',
    carbonSaved: '0.4kg Carbon Offset Saved'
  },
  {
    id: 'ORD-4',
    type: 'purchase',
    productName: 'Artisan Meat Selection',
    pickupName: 'The Organic Butcher',
    pickupAddress: '78 Meat St.',
    pickupContact: 'Chef Gordon',
    pickupPhone: '+1 (555) 777-7777',
    pickupAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gordon',
    destinationName: 'Penthouse',
    destinationAddress: '901 Fifth Avenue',
    destinationContact: 'Mr. Wayne',
    destinationPhone: '+1 (555) 888-8888',
    destinationAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Wayne',
    status: 'assigned',
    distance: '5.8 km',
    time: '22 mins',
    isHighPriority: true,
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
