"use client"

import { useAnimation } from "@/components/animation-provider"

export function AnimationToggle() {
  const { paused, decelerating, togglePaused } = useAnimation()

  const showPlayIcon = paused || decelerating

  return (
    <button
      onClick={togglePaused}
      className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 flex items-center justify-center transition-colors"
      aria-label={showPlayIcon ? "Resume background animation" : "Pause background animation"}
    >
      {showPlayIcon ? (
        <svg className="w-4 h-4 text-neutral-700 dark:text-neutral-300" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg className="w-4 h-4 text-neutral-700 dark:text-neutral-300" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </button>
  )
}
