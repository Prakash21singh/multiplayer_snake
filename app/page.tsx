'use client';

import GameMode from '@/components/custom/game-mode';
import React from 'react'
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

type Props = {}

function HomePage({}: Props) {
  const { user, logout, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
  };

  return (
    <div className="w-full h-screen font-inter bg-black flex flex-col">
      {/* Header with user info and logout */}
      <div className=" px-6 py-4 flex justify-end items-center">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut || authLoading}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 text-white rounded-lg font-medium transition-colors"
        >
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center">
        <GameMode/>
      </div>
    </div>
  )
}

export default HomePage