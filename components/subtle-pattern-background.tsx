"use client"

import { useEffect, useState, useRef } from "react"
import { useAnimation } from "@/components/animation-provider"

export function SubtlePatternBackground() {
  const { paused, decelerating, accelerating, finishDeceleration, finishAcceleration } = useAnimation()
  const [pattern, setPattern] = useState("")
  const [time, setTime] = useState(0)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const speedRef = useRef(1.0)

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    // Listen for changes to the preference
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    if (prefersReducedMotion || paused) return

    if (!decelerating && !accelerating) {
      speedRef.current = 1.0
    }

    const interval = setInterval(() => {
      if (decelerating) {
        speedRef.current *= 0.9
        if (speedRef.current < 0.05) {
          finishDeceleration()
          return
        }
      } else if (accelerating) {
        speedRef.current += (1.0 - speedRef.current) * 0.1
        if (speedRef.current > 0.95) {
          speedRef.current = 1.0
          finishAcceleration()
          return
        }
      }
      setTime(t => t + 0.05 * speedRef.current)
    }, 60)

    return () => clearInterval(interval)
  }, [prefersReducedMotion, paused, decelerating, accelerating, finishDeceleration, finishAcceleration])

  useEffect(() => {
    const chars = ["░", "▒", "▓", "█", "▄", "▀", "▌", "▐", "■", "□", " "]
    // Calculate dimensions to fill entire viewport (assuming ~8px char width, ~12px line height)
    const width = Math.ceil(window.innerWidth / 6) || 250 // Wider characters to fill screen width
    const height = Math.ceil(window.innerHeight / 10) || 150 // Taller to fill screen height
    
    // Use static time value (0) if reduced motion is preferred
    const currentTime = prefersReducedMotion ? 0 : time
    
    let newPattern = ""
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // Flowing wave patterns (more predictable, less random)
        const wave1 = Math.sin(x * 0.15 + currentTime * 1.2)
        const wave2 = Math.cos(y * 0.12 + currentTime * 0.8)
        const diagonal = Math.sin((x + y) * 0.1 + currentTime * 0.6)
        const verticalFlow = Math.sin(y * 0.08 - currentTime * 1.5) // Downward flowing effect
        
        const combined = wave1 * wave2 + diagonal * 0.5 + verticalFlow * 0.7
        
        // More deterministic character selection based on wave intensity
        const intensity = (combined + 2) / 4 // Normalize to 0-1
        
        let charIndex
        if (intensity > 0.7) {
          // High intensity - solid blocks
          charIndex = Math.floor(intensity * 4) % 4 + 6 // █, ▄, ▀, ▌
        } else if (intensity > 0.4) {
          // Medium intensity - shaded blocks  
          charIndex = Math.floor(intensity * 3) % 3 // ░, ▒, ▓
        } else if (intensity > 0.2) {
          // Low intensity - light patterns
          charIndex = Math.floor(intensity * 2) % 2 + 8 // ■, □
        } else {
          // Very low intensity - space
          charIndex = chars.length - 1
        }
        
        newPattern += chars[charIndex]
      }
      newPattern += "\n"
    }
    
    setPattern(newPattern)
  }, [time, prefersReducedMotion])

  return (
    <div className="fixed top-0 left-0 w-screen h-screen pointer-events-none overflow-hidden opacity-10 z-0">
      <pre className="text-xs leading-tight text-gray-300 dark:text-gray-400 whitespace-pre font-mono absolute top-0 left-0">{pattern}</pre>
    </div>
  )
}
