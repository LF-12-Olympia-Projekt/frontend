// components/judge/StatusBadge.tsx | Task: FE-003 | Color-coded status badge component
"use client"

import { Badge } from "@/components/ui/badge"
import {
  FileEdit,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react"
import type { JudgeResultStatus } from "@/types/judge"

const statusConfig: Record<
  JudgeResultStatus,
  { color: string; icon: React.ElementType; label: string }
> = {
  Draft: {
    color: "bg-gray-500/10 text-gray-500 border-gray-500/20",
    icon: FileEdit,
    label: "Draft",
  },
  PendingReview: {
    color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    icon: Clock,
    label: "Pending Review",
  },
  Published: {
    color: "bg-green-500/10 text-green-600 border-green-500/20",
    icon: CheckCircle,
    label: "Published",
  },
  ProtestFiled: {
    color: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    icon: AlertTriangle,
    label: "Protest Filed",
  },
  Invalid: {
    color: "bg-red-500/10 text-red-600 border-red-500/20",
    icon: XCircle,
    label: "Invalid",
  },
}

interface StatusBadgeProps {
  status: JudgeResultStatus
  labels?: Record<string, string>
  className?: string
}

export function StatusBadge({ status, labels, className }: StatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig.Draft
  const Icon = config.icon
  const displayLabel = labels?.[status.charAt(0).toLowerCase() + status.slice(1)] ?? config.label

  return (
    <Badge
      variant="outline"
      className={`${config.color} gap-1 ${className ?? ""}`}
    >
      <Icon className="h-3 w-3" />
      {displayLabel}
    </Badge>
  )
}
