"use client"

import { useEffect, useRef, useState } from "react"
import { getPreciseAge } from "@/lib/age"

const DECIMALS_HOVER = 9

export function Age() {
  const ref = useRef<HTMLSpanElement>(null)
  const [hovered, setHovered] = useState(false)
  const [age, setAge] = useState(() => Math.floor(getPreciseAge()).toString())

  useEffect(() => {
    const section = ref.current?.closest("section")
    if (!section) return
    const enter = () => setHovered(true)
    const leave = () => setHovered(false)
    section.addEventListener("mouseenter", enter)
    section.addEventListener("mouseleave", leave)
    return () => {
      section.removeEventListener("mouseenter", enter)
      section.removeEventListener("mouseleave", leave)
    }
  }, [])

  useEffect(() => {
    if (!hovered) {
      setAge(Math.floor(getPreciseAge()).toString())
      return
    }
    let raf: number
    const tick = () => {
      setAge(getPreciseAge().toFixed(DECIMALS_HOVER))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [hovered])

  const dotIndex = age.indexOf(".")

  if (dotIndex === -1) {
    return <span ref={ref}>{age}</span>
  }

  return (
    <span ref={ref}>
      {age.slice(0, dotIndex)}
      <span className="text-gray-600 dark:text-gray-400">{age.slice(dotIndex)}</span>
    </span>
  )
}
