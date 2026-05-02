'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** Donation selection happens in `/seller/donations` — preserve URL for bookmarks. */
export default function SelectDonationRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/seller/donations');
  }, [router]);
  return (
    <div className="max-w-xl mx-auto py-20 text-center text-gray-500 font-medium px-4">
      Mengalihkan ke alur donasi…
    </div>
  );
}
