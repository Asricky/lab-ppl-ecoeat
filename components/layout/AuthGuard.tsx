"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, Role } from "@/store/authStore";

interface AuthGuardProps {
  children: React.ReactNode;
  expectedRole: Role;
}

export default function AuthGuard({ children, expectedRole }: AuthGuardProps) {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!token || !user) {
      router.push("/login");
      return;
    }

    if (user.role !== expectedRole) {
      if (user.role) {
        router.push(`/${user.role}`);
      } else {
        router.push("/login");
      }
      return;
    }

    setAuthorized(true);
  }, [user, token, expectedRole, router]);

  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#f4f7ed] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Checking authorization...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
