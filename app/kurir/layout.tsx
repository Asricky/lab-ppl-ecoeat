import React from 'react';
import CourierLayout from '@/components/kurir/CourierLayout';

export default function KurirDashboardLayout({ children }: { children: React.ReactNode }) {
  return <CourierLayout>{children}</CourierLayout>;
}
