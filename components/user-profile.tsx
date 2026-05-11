'use client';

import React from 'react';
import { useAuth } from '@/hooks/use-auth';

export function UserProfile() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="text-slate-400">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      {user.image && (
        <img
          src={user.image}
          alt={user.name || user.email}
          className="w-8 h-8 rounded-full"
        />
      )}
      <div>
        <p className="text-sm font-medium text-white">{user.name || user.email}</p>
        <p className="text-xs text-slate-400">{user.email}</p>
      </div>
    </div>
  );
}
