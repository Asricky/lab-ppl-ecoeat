"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** Diganti oleh wizard `/donations/new` — pertahankan route untuk tautan lama. */
export default function SelectDonationRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/dashboard/seller/donations/new');
  }, [router]);
  return (
    <div className="max-w-xl mx-auto py-20 text-center text-gray-500 font-medium px-4">
      Mengalihkan ke alur donasi baru…
    </div>
  );
}
