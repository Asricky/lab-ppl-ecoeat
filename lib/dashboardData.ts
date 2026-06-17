import { dummyOrders } from '@/lib/data';

export type CourierTaskState = 'assigned' | 'in_progress' | 'completed' | 'failed';

export interface CourierTask {
  id: string;
  type: 'purchase' | 'donation';
  pickup: string;
  destination: string;
  distance: string;
  eta: string;
  reward: number;
  status: CourierTaskState;
  proofUploaded: boolean;
  isHighPriority?: boolean;
  photoProofUrl?: string;
  handoverNote?: string;
  completedAt?: string;
}

export function completeCourierTask(id: string, photoUrl: string, note: string) {
  const taskIndex = courierTasks.findIndex((t) => t.id === id);
  if (taskIndex !== -1) {
    courierTasks[taskIndex].status = 'completed';
    courierTasks[taskIndex].proofUploaded = true;
    courierTasks[taskIndex].photoProofUrl = photoUrl;
    courierTasks[taskIndex].handoverNote = note;
    courierTasks[taskIndex].completedAt = new Date().toLocaleString('id-ID', {
      hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short', year: 'numeric'
    });
  }
}

export function failCourierTask(id: string, reason: string) {
  const taskIndex = courierTasks.findIndex((t) => t.id === id);
  if (taskIndex !== -1) {
    courierTasks[taskIndex].status = 'failed';
    courierTasks[taskIndex].proofUploaded = false;
    courierTasks[taskIndex].handoverNote = reason;
    courierTasks[taskIndex].completedAt = new Date().toLocaleString('id-ID', {
      hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short', year: 'numeric'
    });
  }
}

export interface IncomingDonation {
  id: string;
  donor: string;
  product: string;
  amountKg: number;
  status: 'Assigned' | 'In Progress' | 'Completed' | 'Accepted';
  eta: string;
  dateReceived?: string;
  courierName?: string;
}

export const courierTasks: CourierTask[] = dummyOrders.map((order) => ({
  id: order.id,
  type: order.type,
  pickup: order.pickupName,
  destination: order.destinationName,
  distance: order.distance,
  eta: order.time,
  reward: order.reward,
  status: order.status === 'completed' ? 'completed' : order.status === 'in_progress' ? 'in_progress' : 'assigned',
  proofUploaded: Boolean(order.photoProofUrl),
  isHighPriority: order.isHighPriority,
}));

export const incomingDonations: IncomingDonation[] = dummyOrders
  .filter((order) => order.type === 'donation')
  .map((order) => ({
    id: order.id,
    donor: order.pickupName,
    product: order.productName,
    amountKg: Math.max(8, Math.round(order.reward / 1000)),
    status: order.status === 'completed' ? 'Completed' : order.status === 'in_progress' ? 'In Progress' : 'Assigned',
    eta: order.time,
    dateReceived: order.status === 'completed' ? new Date().toLocaleDateString('id-ID') : '-',
    courierName: 'Alex Green',
  }));

export function getCreditedBalance(tasks: CourierTask[]) {
  return tasks
    .filter((task) => task.status === 'completed' && task.proofUploaded)
    .reduce((sum, task) => sum + task.reward, 0);
}
