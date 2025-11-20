import type React from "react"
import { MobileNav } from "@/components/layout/mobile-nav"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
      <MobileNav />
    </>
  )
}
