'use client';

import { signOut, useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function useAuth() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push('/auth');
            router.refresh();
          },
        },
      });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    session,
    user: session?.user,
    isLoading: isPending,
    isAuthenticated: !!session,
    logout,
  };
}
