"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

const AnimationContext = createContext<{
  paused: boolean
  decelerating: boolean
  accelerating: boolean
  togglePaused: () => void
  finishDeceleration: () => void
  finishAcceleration: () => void
  startDeceleration: () => void
  resume: () => void
}>({
  paused: false,
  decelerating: false,
  accelerating: false,
  togglePaused: () => {},
  finishDeceleration: () => {},
  finishAcceleration: () => {},
  startDeceleration: () => {},
  resume: () => {},
})

export function AnimationProvider({ children }: { children: ReactNode }) {
  const [paused, setPaused] = useState(false)
  const [decelerating, setDecelerating] = useState(false)
  const [accelerating, setAccelerating] = useState(false)

  const togglePaused = useCallback(() => {
    if (paused || decelerating) {
      // Resume: accelerate back to full speed
      setPaused(false)
      setDecelerating(false)
      setAccelerating(true)
    } else {
      // Pause: decelerate to a stop
      setPaused(false)
      setDecelerating(true)
      setAccelerating(false)
    }
  }, [paused, decelerating])

  const finishDeceleration = useCallback(() => {
    setDecelerating(false)
    setAccelerating(false)
    setPaused(true)
  }, [])

  const finishAcceleration = useCallback(() => {
    setDecelerating(false)
    setAccelerating(false)
    setPaused(false)
  }, [])

  const startDeceleration = useCallback(() => {
    setPaused(false)
    setDecelerating(true)
    setAccelerating(false)
  }, [])

  const resume = useCallback(() => {
    setDecelerating(false)
    setAccelerating(false)
    setPaused(false)
  }, [])

  return (
    <AnimationContext.Provider value={{ paused, decelerating, accelerating, togglePaused, finishDeceleration, finishAcceleration, startDeceleration, resume }}>
      {children}
    </AnimationContext.Provider>
  )
}

export function useAnimation() {
  return useContext(AnimationContext)
}
