// app/[locale]/judge/layout.tsx | Task: FE-005 | Judge routes layout with sidebar
"use client"

import { Sidebar } from "@/components/layout/Sidebar"

export default function JudgeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
