import React from 'react'

type Props = {
  isOpen: boolean
  title: string
  description?: string
  score?: number
  primaryBtnText: string
  onPrimaryClick: () => void
  secondaryBtnText?: string
  onSecondaryClick?: () => void
  disabled?: boolean
  nameInput?: {
    value: string
    onChange: (value: string) => void
    placeholder?: string
  }
}

function Modal({
  isOpen,
  title,
  description,
  score,
  primaryBtnText,
  onPrimaryClick,
  secondaryBtnText,
  onSecondaryClick,
  disabled,
  nameInput,
}: Props) {

  console.log({nameInput})
  if (!isOpen) return null

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Syne:wght@400;500;600;700&display=swap');
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fade-in { animation: fadeIn 0.2s ease; }
        .animate-slide-up { animation: slideUp 0.3s ease; }
        .font-jetbrains { font-family: 'JetBrains Mono', monospace; }
        .font-syne { font-family: 'Syne', sans-serif; }
      `}</style>

      {/* Overlay */}
      <div className="animate-fade-in fixed inset-0 bg-black/60 flex items-center justify-center z-[1000]">

        {/* Modal */}
        <div className="animate-slide-up bg-[#131313] border-[0.5px] border-[#222] rounded-2xl px-8 py-10 w-[380px] text-center">

          <h2 className="font-syne text-[28px] font-semibold text-[#e8e8e0] m-0 mb-3">
            {title}
          </h2>

          {description && (
            <p className="text-sm text-[#999] m-0 mb-6 leading-relaxed">
              {description}
            </p>
          )}

          {score !== undefined && (
            <div className="font-jetbrains text-[36px] font-semibold text-green-400 my-4 mb-6">
              Score: {score}
            </div>
          )}
{nameInput && (
            <div className="mb-6">
              <input
                type="text"
                value={nameInput.value}
                onChange={(e) => nameInput.onChange(e.target.value)}
                placeholder={nameInput.placeholder || "Enter your name"}
                className="w-full px-4 py-2 rounded-lg bg-[#0a0a0a] border-[0.5px] border-[#222] text-[#e8e8e0] text-sm focus:outline-none focus:border-[#3d7a3d] transition-colors"
              />
            </div>
          )}

          
          <div className="flex flex-col gap-3">
            <button
              onClick={onPrimaryClick}
              disabled={disabled}
              className="
                font-syne text-[13px] font-medium tracking-[0.06em]
                py-3 px-3 rounded-lg w-[200px] mx-auto
                border-[0.5px] border-[#3d7a3d]
                bg-[#2d5a2d] text-[#e8e8e0]
                transition-all duration-150 cursor-pointer
                hover:bg-[#3d7a3d] hover:border-green-400
                disabled:opacity-40 disabled:cursor-not-allowed
                disabled:hover:bg-[#2d5a2d] disabled:hover:border-[#3d7a3d]
              "
            >
              {primaryBtnText}
            </button>

            {secondaryBtnText && onSecondaryClick && (
              <button
                onClick={onSecondaryClick}
                disabled={disabled}
                className="
                  font-syne text-[13px] font-medium tracking-[0.06em]
                  py-3 px-3 rounded-lg w-[200px] mx-auto
                  border-[0.5px] border-[#333]
                  bg-transparent text-[#999]
                  transition-all duration-150 cursor-pointer
                  hover:bg-[#1a1a1a] hover:text-[#ccc]
                  disabled:opacity-40 disabled:cursor-not-allowed
                  disabled:hover:bg-transparent disabled:hover:text-[#999]
                "
              >
                {secondaryBtnText}
              </button>
            )}
          </div>

        </div>
      </div>
    </>
  )
}

export default Modal