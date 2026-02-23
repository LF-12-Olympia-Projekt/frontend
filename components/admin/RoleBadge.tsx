// components/admin/RoleBadge.tsx | Task: FE-004 | Color-coded role badge component
"use client"

import { Badge } from "@/components/ui/badge"
import { Shield, Scale, User } from "lucide-react"

const roleConfig: Record<string, { color: string; icon: React.ElementType; label: string }> = {
  Admin: {
    color: "bg-red-500/10 text-red-600 border-red-500/20",
    icon: Shield,
    label: "Admin",
  },
  Judge: {
    color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    icon: Scale,
    label: "Judge",
  },
  Public: {
    color: "bg-gray-500/10 text-gray-500 border-gray-500/20",
    icon: User,
    label: "Public",
  },
}

interface RoleBadgeProps {
  role: string
  className?: string
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const config = roleConfig[role] ?? roleConfig.Public
  const Icon = config.icon

  return (
    <Badge variant="outline" className={`${config.color} gap-1 ${className ?? ""}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  )
}
