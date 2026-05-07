import React from 'react'

type Props = {
  score: number
  message: string
  error: string | null
  baseSpeed: number
  snakeSpeed: number
  randomFruitIcon: string | null
  onClearError: () => void
  gameState: "idle" | "playing" | "paused" | "gameover"
  onPause: () => void
  onResume: () => void
  username?: string | null
  onEditName?: () => void
}

function ScoreBoard({
  error,
  message,
  score,
  baseSpeed,
  randomFruitIcon,
  snakeSpeed,
  onClearError,
  gameState,
  onPause,
  onResume,
  username,
  onEditName,
}: Props) {
  const speedPct = Math.round(
    Math.max(0, Math.min(100, ((baseSpeed - snakeSpeed) / baseSpeed) * 100))
  )

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.2s ease; }
        .speed-fill { transition: width 0.4s ease; }
        .font-jetbrains { font-family: 'Inter', monospace; }
        .font-syne { font-family: 'Inter', sans-serif; }
      `}</style>

      <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center p-8 mx-auto w-full max-w-md">
        <div className="w-full max-w-[380px] flex flex-col gap-3">

          {/* Username section */}
          {username && (
            <div className="bg-[#131313] border-[0.5px] border-[#222] rounded-md p-4 mb-2">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#555] mb-1">
                    Welcome
                  </p>
                  <p className="text-[16px] font-semibold text-[#e8e8e0]">
                    {username}
                  </p>
                </div>
                {onEditName && (
                  <button
                    onClick={onEditName}
                    title="Edit name"
                    className="px-3 py-2 rounded-lg bg-[#0a0a0a] border-[0.5px] border-[#1e1e1e] text-[#999] hover:text-[#e8e8e0] hover:bg-[#161616] hover:border-[#333] transition-all duration-150 cursor-pointer text-xs"
                  >
                    ✎ Edit
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Section title */}
          <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#555] mb-1">
            Dashboard
          </p>

          {/* Main panel */}
          <div className="bg-[#131313] border-[0.5px] border-[#222] rounded-md p-5">
            <div className="flex items-center  justify-between gap-4">

              {/* Score box */}
              <div>
                <p className="text-[11px] font-medium tracking-wider uppercase text-[#444] mb-2">
                  Score
                </p>
                <div className="font-jetbrains bg-[#0a0a0a] border-[0.5px] border-[#1e1e1e] rounded-lg w-22 h-22 flex items-center justify-center text-[28px] font-semibold text-[#e8e8e0] relative overflow-hidden"
                     style={{ width: 88, height: 88 }}>
                  {randomFruitIcon && (
                    <span className="absolute top-1.5 right-2 text-[11px] opacity-50 select-none">
                      {randomFruitIcon}
                    </span>
                  )}
                  {score ?? 0}
                </div>
              </div>
                <div className="w-4 border border-[#333]"/>
              {/* Actions */}
              <div className="">
                <p className="text-[11px] font-medium tracking-wider uppercase text-[#444] mb-2">
                  {gameState}
                </p>
                {gameState === "playing" && (
                  <button
                    title="Pause Game"
                    className="font-inter bg-[#0a0a0a] border-[0.5px] border-[#1e1e1e] rounded-lg w-22 h-22 flex items-center justify-center font-semibold text-[#e8e8e0] relative overflow-hidden hover:bg-[#161616] hover:border-[#333] cursor-pointer"
                    onClick={onPause}
                  >
                    ⏸
                  </button>
                )}
                {gameState === "paused" && (
                  <button
                    title="Play Game"
                    className="font-inter bg-[#0a0a0a] border-[0.5px] border-[#1e1e1e] rounded-lg w-22 h-22 flex items-center justify-center font-semibold text-[#e8e8e0] relative overflow-hidden hover:bg-[#161616] hover:border-[#333] cursor-pointer"
                    onClick={onResume}
                  >
                    ▶
                  </button>
                )}
                {message && (
                  <p className="text-[11px] text-[#2e5e2e] tracking-[0.04em] min-h-4 m-0">
                    {message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Error banner */}
          {error && (
            <div className="animate-fade-in bg-[rgba(162,45,45,0.12)] border-[0.5px] border-[rgba(162,45,45,0.3)] rounded-lg px-3.5 py-2.5 flex items-center justify-between gap-3">
              <p className="text-xs text-[#c07070] flex-1 leading-relaxed m-0">
                {error}
              </p>
              <button
                className="font-jetbrains text-xs text-[#555] bg-[#0e0e0e] border-[0.5px] border-[#1e1e1e] rounded-[5px] w-6 h-6 flex items-center justify-center cursor-pointer shrink-0 transition-all duration-150 hover:text-[#aaa] hover:bg-[#161616] p-0"
                onClick={onClearError}
                aria-label="Dismiss error"
              >
                ✕
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  )
}

export default ScoreBoard