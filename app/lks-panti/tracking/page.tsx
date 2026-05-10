import { redirect } from 'next/navigation';
import { incomingDonations } from '@/lib/dashboardData';

export default function TrackingIndexPage() {
  const firstDonation = incomingDonations[0];
  redirect(`/lks-panti/tracking/${firstDonation?.id ?? 'ORD-2'}`);
}
