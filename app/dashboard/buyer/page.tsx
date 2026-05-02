import { redirect } from 'next/navigation';

/** Canonical buyer UX lives under `/app/buyer`. */
export default function LegacyBuyerDashboardRedirect() {
  redirect('/buyer/explore');
}
