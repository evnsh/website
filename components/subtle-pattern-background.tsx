"use client"

import { useEffect, useState, useRef } from "react"
import { useAnimation } from "@/components/animation-provider"

const SEED_COUNT = 8

// SplitMix32 — expands a single 32-bit hash into a stream of well-distributed floats
function splitmix32(seed: number): () => number {
  let state = seed | 0
  return () => {
    state = (state + 0x9e3779b9) | 0
    let t = state ^ (state >>> 16)
    t = Math.imul(t, 0x21f0aaad)
    t = t ^ (t >>> 15)
    t = Math.imul(t, 0x735a2d97)
    t = t ^ (t >>> 15)
    return (t >>> 0) / 0x100000000
  }
}

const FNV_OFFSET = 2166136261
const FNV_PRIME = 16777619

// FNV-1a — feeds a string's bytes into a running 32-bit hash
function fnv1a(hash: number, str: string): number {
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i)
    hash = Math.imul(hash, FNV_PRIME)
  }
  return hash
}

// --- Signal 1: Canvas fingerprint ---
// Drawing text, curves, gradients, and shadows to a canvas produces
// pixel data that varies by GPU, font engine, OS, and browser.
// Privacy browsers (Brave, Firefox w/ resistFingerprinting) inject
// per-session deterministic noise into getImageData — this makes the
// hash stable within a session but different across sessions. The noise
// cannot be removed from JS because it is keyed, deterministic, and
// consistent across reads, not random per call.
function canvasHash(): number {
  let hash = FNV_OFFSET
  const canvas = document.createElement("canvas")
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext("2d")
  if (!ctx) return hash

  // Opaque background — ensures all alpha bytes are 0xFF after compositing
  ctx.fillStyle = "#f0f0f0"
  ctx.fillRect(0, 0, 64, 64)

  // Gradient — interpolation algorithms differ across renderers
  const grad = ctx.createLinearGradient(0, 0, 64, 64)
  grad.addColorStop(0, "#ff6b6b")
  grad.addColorStop(0.5, "#4ecdc4")
  grad.addColorStop(1, "#45b7d1")
  ctx.fillStyle = grad
  ctx.fillRect(0, 50, 64, 14)

  // Text with emoji — sub-pixel positions force anti-aliasing variance
  ctx.font = "18px serif"
  ctx.fillStyle = "#333"
  ctx.fillText("evan.sh\u{1F30D}", 2.7, 20.3)
  ctx.font = "11px monospace"
  ctx.fillText("Cwm fjord", 4.2, 40.6)

  // Arc and bezier — stroke rasterization varies per GPU/driver
  ctx.beginPath()
  ctx.arc(32, 48, 12, 0, Math.PI * 2)
  ctx.strokeStyle = "rgba(100,200,100,0.7)"
  ctx.lineWidth = 2.5
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.bezierCurveTo(16, 60, 48, 4, 64, 64)
  ctx.strokeStyle = "rgba(200,100,100,0.5)"
  ctx.stroke()

  // Shadow — blur implementations differ significantly across engines
  ctx.shadowBlur = 3
  ctx.shadowColor = "rgba(0,0,0,0.5)"
  ctx.fillStyle = "#666"
  ctx.fillRect(20.5, 8.5, 24, 6)

  // FNV-1a over RGB channels only (alpha is 0xFF because the opaque
  // background means all composited pixels are fully opaque)
  const pixels = ctx.getImageData(0, 0, 64, 64).data
  for (let i = 0; i < pixels.length; i += 4) {
    hash ^= pixels[i];     hash = Math.imul(hash, FNV_PRIME)
    hash ^= pixels[i + 1]; hash = Math.imul(hash, FNV_PRIME)
    hash ^= pixels[i + 2]; hash = Math.imul(hash, FNV_PRIME)
  }
  return hash >>> 0
}

// --- Signal 2: WebGL renderer ---
// The unmasked GPU vendor/renderer string. Privacy browsers increasingly
// spoof this too, but it's still exposed in many configurations where
// canvas 2D noise is active.
function webglHash(): number {
  let hash = FNV_OFFSET
  try {
    const gl = document.createElement("canvas").getContext("webgl")
    if (!gl) return hash
    const dbg = gl.getExtension("WEBGL_debug_renderer_info")
    if (dbg) {
      hash = fnv1a(hash, gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) || "")
      hash = fnv1a(hash, gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || "")
    } else {
      hash = fnv1a(hash, gl.getParameter(gl.RENDERER) || "")
    }
    gl.getExtension("WEBGL_lose_context")?.loseContext()
  } catch { /* WebGL unavailable */ }
  return hash >>> 0
}

// --- Signal 3: AudioContext fingerprint ---
// Render a short audio signal through an OfflineAudioContext and hash
// the resulting float samples. The output varies by audio stack and DSP
// implementation — one of the hardest signals for browsers to spoof
// because altering the audio pipeline would break real audio playback.
// Returns null if the signal is unstable (e.g. Safari private browsing
// injects non-deterministic noise into OfflineAudioContext).
async function audioHash(): Promise<number | null> {
  async function renderOnce(): Promise<number> {
    let hash = FNV_OFFSET
    const ctx = new OfflineAudioContext(1, 4500, 44100)
    const osc = ctx.createOscillator()
    osc.type = "triangle"
    osc.frequency.value = 10000

    const comp = ctx.createDynamicsCompressor()
    comp.threshold.value = -50
    comp.knee.value = 40
    comp.ratio.value = 12
    comp.attack.value = 0
    comp.release.value = 0.25

    osc.connect(comp)
    comp.connect(ctx.destination)
    osc.start(0)

    const buffer = await ctx.startRendering()
    const samples = buffer.getChannelData(0)

    // Hash the last 500 rendered samples — DSP rounding differences
    // between audio stacks show up clearly in the compressed signal
    const bytes = new Uint8Array(samples.buffer, samples.byteOffset + 4000 * 4, 500 * 4)
    for (let i = 0; i < bytes.length; i++) {
      hash ^= bytes[i]
      hash = Math.imul(hash, FNV_PRIME)
    }
    return hash >>> 0
  }

  try {
    const [h1, h2] = await Promise.all([renderOnce(), renderOnce()])
    if (h1 !== h2) return null // unstable — exclude this signal
    return h1
  } catch { /* AudioContext unavailable */ }
  return null
}

// --- Signal 4: Font detection ---
// Measure text width in various font families. If a named font is
// installed, its metrics differ from the generic fallback. This works
// even when canvas pixel readback is poisoned because measureText
// returns layout metrics, not pixel data.
function fontHash(): number {
  let hash = FNV_OFFSET
  try {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return hash

    const testStr = "mmmmmmmmmmlli"
    const testFonts = [
      "serif", "sans-serif", "monospace",
      "Arial, sans-serif", "Courier New, monospace", "Georgia, serif",
      "Helvetica, sans-serif", "Times New Roman, serif",
      "Verdana, sans-serif", "Segoe UI, sans-serif",
      "Roboto, sans-serif", "SF Pro, sans-serif",
    ]

    for (const font of testFonts) {
      ctx.font = `72px ${font}`
      hash = fnv1a(hash, `${font}:${ctx.measureText(testStr).width}`)
    }
  } catch { /* Canvas unavailable */ }
  return hash >>> 0
}

// --- Signal 5: System properties ---
// Properties that are hard to fully spoof without breaking web compat.
function systemHash(): number {
  let hash = FNV_OFFSET
  const signals = [
    navigator.userAgent,
    navigator.language,
    `${screen.width}x${screen.height}x${screen.colorDepth}`,
    `${navigator.hardwareConcurrency || 0}`,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    `${navigator.maxTouchPoints || 0}`,
    `${window.devicePixelRatio || 1}`,
  ]
  for (const s of signals) {
    hash = fnv1a(hash, s)
  }
  return hash >>> 0
}

// Fold a 32-bit signal hash into a running FNV-1a accumulator
function foldSignal(acc: number, signal: number): number {
  acc ^= signal & 0xff;         acc = Math.imul(acc, FNV_PRIME)
  acc ^= (signal >>> 8) & 0xff; acc = Math.imul(acc, FNV_PRIME)
  acc ^= (signal >>> 16) & 0xff; acc = Math.imul(acc, FNV_PRIME)
  acc ^= (signal >>> 24) & 0xff; acc = Math.imul(acc, FNV_PRIME)
  return acc
}

// Combine all signals into a single 32-bit fingerprint hash.
// Each signal is computed independently so that an unstable signal
// (e.g., audio in Safari private browsing) can be excluded without
// cascading to downstream signals.
async function fingerprint(): Promise<number> {
  const dbgCanvas = canvasHash()
  const dbgWebgl = webglHash()
  const dbgAudio = await audioHash() // null if unstable
  const dbgFont = fontHash()
  const dbgSystem = systemHash()

  const hex = (n: number | null) =>
    n !== null ? `0x${n.toString(16).padStart(8, "0")}` : "unstable"

  console.table({
    canvas:  { hash: hex(dbgCanvas) },
    webgl:   { hash: hex(dbgWebgl) },
    audio:   { hash: hex(dbgAudio) },
    fonts:   { hash: hex(dbgFont) },
    system:  { hash: hex(dbgSystem) },
  })

  // Fold each stable signal into a final hash
  let hash = FNV_OFFSET
  hash = foldSignal(hash, dbgCanvas)
  hash = foldSignal(hash, dbgWebgl)
  if (dbgAudio !== null) hash = foldSignal(hash, dbgAudio)
  hash = foldSignal(hash, dbgFont)
  hash = foldSignal(hash, dbgSystem)

  return hash >>> 0
}

async function generateSeeds(): Promise<number[]> {
  const hash = await fingerprint()
  console.log(
    `%cYour device fingerprint: %c0x${hash.toString(16).toUpperCase().padStart(8, "0")}%c (${hash})\n` +
    `This page uses your browser's rendering pipeline to generate a unique pattern.\n` +
    `Same device → same hash → same pattern. No cookies or storage involved.\n` +
    `Read more: /blog/fingerprinting-you-right-now`,
    "color: inherit",
    "color: #4ecdc4; font-weight: bold; font-size: 1.2em",
    "color: inherit",
  )
  const rng = splitmix32(hash)
  return Array.from({ length: SEED_COUNT }, rng)
}

export function SubtlePatternBackground() {
  const { paused, decelerating, accelerating, finishDeceleration, finishAcceleration } = useAnimation()
  const [pattern, setPattern] = useState("")
  const [time, setTime] = useState(0)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const speedRef = useRef(1.0)
  const [seeds, setSeeds] = useState<number[] | null>(null)

  useEffect(() => {
    generateSeeds().then(setSeeds)
  }, [])

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
    if (!seeds) return

    const chars = ["░", "▒", "▓", "█", "▄", "▀", "▌", "▐", "■", "□", " "]
    // Calculate dimensions to fill entire viewport (assuming ~8px char width, ~12px line height)
    const width = Math.ceil(window.innerWidth / 6) || 250 // Wider characters to fill screen width
    const height = Math.ceil(window.innerHeight / 10) || 150 // Taller to fill screen height

    // Use static time value (0) if reduced motion is preferred
    const currentTime = prefersReducedMotion ? 0 : time

    const s = seeds
    let newPattern = ""
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // Flowing wave patterns seeded per user
        const wave1 = Math.sin(x * (0.1 + s[0] * 0.1) + currentTime * (0.8 + s[1] * 0.8))
        const wave2 = Math.cos(y * (0.08 + s[2] * 0.08) + currentTime * (0.5 + s[3] * 0.6))
        const diagonal = Math.sin((x + y) * (0.06 + s[4] * 0.08) + currentTime * (0.4 + s[5] * 0.4))
        const verticalFlow = Math.sin(y * (0.05 + s[6] * 0.06) - currentTime * (1.0 + s[7] * 1.0))

        const combined = wave1 * wave2 + diagonal * 0.5 + verticalFlow * 0.7

        // Normalize to [0, 1]: combined ranges over [-2.2, 2.2]
        const intensity = (combined + 2.2) / 4.4
        
        let charIndex
        if (intensity > 0.7) {
          charIndex = Math.floor(intensity * 4) % 4 + 6 // ▌, ▐, ■, □
        } else if (intensity > 0.4) {
          charIndex = Math.floor(intensity * 3) % 3 // ░, ▒, ▓
        } else if (intensity > 0.2) {
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
  }, [time, prefersReducedMotion, seeds])

  return (
    <div className="fixed top-0 left-0 w-screen h-screen pointer-events-none overflow-hidden opacity-10 z-0">
      <pre className="text-xs leading-tight text-gray-300 dark:text-gray-400 whitespace-pre font-mono absolute top-0 left-0">{pattern}</pre>
    </div>
  )
}
