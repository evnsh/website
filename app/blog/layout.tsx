import { AnimationDecelerate } from "@/components/animation-effect"

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnimationDecelerate />
      {children}
    </>
  )
}
