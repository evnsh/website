import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { AnimationProvider } from "@/components/animation-provider"
import { SubtlePatternBackground } from "@/components/subtle-pattern-background"
import "./globals.css"

export const metadata: Metadata = {
  title: "evan.sh",
  description: "22-year-old engineer with a focus on backend architecture and real-time systems",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <AnimationProvider>
            <SubtlePatternBackground />
            <Suspense fallback={null}>{children}</Suspense>
          </AnimationProvider>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
