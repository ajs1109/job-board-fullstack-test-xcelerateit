'use client';

import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

export default function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { user, isAuthenticated, loading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }

    if (!loading && isAuthenticated && roles && !roles.includes(user?.role as string)) {
      router.push('/jobs');
    }
  }, [loading, isAuthenticated, user, roles, router]);

  if (loading || !isAuthenticated || (roles && !roles.includes(user?.role as string))) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}