// components/judge/VersionHistory.tsx | Task: FE-003 | Timeline of result version changes
"use client"

import type { ResultHistoryEntry } from "@/types/judge"
import { Clock, User, FileText } from "lucide-react"

interface VersionHistoryProps {
  history: ResultHistoryEntry[]
  labels?: {
    changedBy?: string
    changedAt?: string
    changeType?: string
  }
}

export function VersionHistory({ history, labels }: VersionHistoryProps) {
  if (!history.length) return null

  return (
    <div className="space-y-4">
      {history.map((entry, index) => (
        <div key={entry.id} className="relative flex gap-4">
          {index < history.length - 1 && (
            <div className="absolute left-[15px] top-8 bottom-0 w-px bg-border" />
          )}
          <div className="flex-shrink-0 mt-1">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
              <FileText className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <div className="flex-1 min-w-0 pb-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">v{entry.version}</span>
              {entry.changeType && (
                <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                  {entry.changeType}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
              {entry.changedBy && (
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {entry.changedBy}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(entry.changedAt).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
