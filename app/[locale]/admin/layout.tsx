// app/[locale]/admin/layout.tsx | Task: FE-005 | Admin routes layout with sidebar
"use client"

import { Sidebar } from "@/components/layout/Sidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
