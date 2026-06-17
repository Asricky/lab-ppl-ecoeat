import React from 'react';
import CourierLayout from '@/components/CourierLayout';
import AuthGuard from '@/components/layout/AuthGuard';

export default function KurirDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard expectedRole="kurir">
      <CourierLayout>{children}</CourierLayout>
    </AuthGuard>
  );
}
