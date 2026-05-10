import GameMode from '@/components/custom/game-mode';
import React from 'react'

type Props = {}

function HomePage({}: Props) {
  return (
    <div
      className="w-full h-screen font-inter bg-black flex items-center justify-center"
    >
      <GameMode/>
    </div>
  )
}

export default HomePage