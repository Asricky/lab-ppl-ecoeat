"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Alur donasi utama ada di `/dashboard/seller/donations` (tab Donate). */
export default function NewDonationRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard/seller/donations?tab=donate");
  }, [router]);
  return (
    <div className="max-w-xl mx-auto py-20 text-center text-gray-500 text-sm font-medium px-4">
      Mengalihkan ke halaman Donasi…
    </div>
  );
}
