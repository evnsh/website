"use client"

import { useEffect } from "react"
import { useAnimation } from "@/components/animation-provider"

export function AnimationResume() {
  const { resume } = useAnimation()
  useEffect(() => { resume() }, [resume])
  return null
}

export function AnimationDecelerate() {
  const { startDeceleration } = useAnimation()
  useEffect(() => { startDeceleration() }, [startDeceleration])
  return null
}
