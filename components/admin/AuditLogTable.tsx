// components/admin/AuditLogTable.tsx | Task: FE-004 | Read-only audit log table with expandable rows
"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronRight } from "lucide-react"
import type { AuditLogListItem } from "@/types/admin"

const forcePublishActions = ["FORCE_PUBLISH", "PERMANENT_DELETE"]

interface AuditLogTableProps {
  entries: AuditLogListItem[]
  labels?: Record<string, string>
}

export function AuditLogTable({ entries, labels }: AuditLogTableProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-8"></TableHead>
          <TableHead>{labels?.timestamp ?? "Timestamp"}</TableHead>
          <TableHead>{labels?.user ?? "User"}</TableHead>
          <TableHead>{labels?.action ?? "Action"}</TableHead>
          <TableHead>{labels?.entity ?? "Entity"}</TableHead>
          <TableHead>{labels?.entityId ?? "Entity ID"}</TableHead>
          <TableHead>{labels?.ip ?? "IP"}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {entries.map((entry) => {
          const isHighlight = forcePublishActions.includes(entry.action)
          const isExpanded = expandedIds.has(entry.id)
          return (
            <>
              <TableRow
                key={entry.id}
                className={isHighlight ? "bg-orange-500/5" : ""}
              >
                <TableCell>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleExpand(entry.id)}
                    className="h-6 w-6 p-0"
                  >
                    {isExpanded
                      ? <ChevronDown className="h-4 w-4" />
                      : <ChevronRight className="h-4 w-4" />}
                  </Button>
                </TableCell>
                <TableCell className="text-sm">
                  {new Date(entry.timestamp).toLocaleString()}
                </TableCell>
                <TableCell className="font-medium">{entry.userId ?? "–"}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={isHighlight
                      ? "bg-orange-500/10 text-orange-600 border-orange-500/20"
                      : ""}
                  >
                    {entry.action}
                  </Badge>
                </TableCell>
                <TableCell>{entry.entity}</TableCell>
                <TableCell className="font-mono text-xs">
                  {entry.entityId ? entry.entityId.substring(0, 8) + "…" : "–"}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {entry.ipAddress ?? "–"}
                </TableCell>
              </TableRow>
              {isExpanded && (
                <TableRow key={`${entry.id}-detail`} className="bg-muted/30">
                  <TableCell colSpan={7}>
                    <div className="p-3 space-y-2 text-sm">
                      {entry.oldValue && (
                        <div>
                          <span className="font-semibold">{labels?.oldValue ?? "Old Value"}:</span>
                          <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-x-auto whitespace-pre-wrap">{entry.oldValue}</pre>
                        </div>
                      )}
                      {entry.newValue && (
                        <div>
                          <span className="font-semibold">{labels?.newValue ?? "New Value"}:</span>
                          <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-x-auto whitespace-pre-wrap">{entry.newValue}</pre>
                        </div>
                      )}
                      {entry.details && (
                        <div>
                          <span className="font-semibold">{labels?.details ?? "Details"}:</span>
                          <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-x-auto whitespace-pre-wrap">{entry.details}</pre>
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          )
        })}
      </TableBody>
    </Table>
  )
}
