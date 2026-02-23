// app/[locale]/admin/results/page.tsx | Task: FE-004 | Admin results management page
"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useTranslation } from "@/lib/locale-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatusBadge } from "@/components/judge/StatusBadge"
import { Eye, RotateCcw, Zap, History } from "lucide-react"
import * as adminApi from "@/lib/api/admin"
import type { AdminResultListItem } from "@/types/admin"
import type { JudgeResultStatus } from "@/types/judge"

const statusFilters = ["", "Draft", "PendingReview", "Published", "Invalid", "ProtestFiled"]

export default function AdminResultsPage() {
  const { getToken } = useAuth()
  const { locale, dictionary } = useTranslation()
  const router = useRouter()
  const t = dictionary.admin?.results ?? {}

  const [results, setResults] = useState<AdminResultListItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState("")
  const [loading, setLoading] = useState(true)

  const fetchResults = useCallback(async () => {
    const token = getToken()
    if (!token) return
    setLoading(true)
    try {
      const res = await adminApi.getAdminResults(token, {
        status: statusFilter || undefined,
        page,
        pageSize: 20,
      })
      setResults(res.data)
      setTotal(res.total)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [getToken, page, statusFilter])

  useEffect(() => {
    fetchResults()
  }, [fetchResults])

  const statusLabels: Record<string, string> = {
    "": t.all ?? "All",
    Draft: t.draft ?? "Draft",
    PendingReview: t.pending ?? "Pending",
    Published: t.published ?? "Published",
    Invalid: t.invalid ?? "Invalid",
    ProtestFiled: t.protest ?? "Protest",
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{t.title ?? "Result Management"}</h1>
          <p className="text-muted-foreground mt-1">{t.subtitle ?? "All results across all statuses"}</p>
        </div>

        <div className="flex gap-2 mb-4 flex-wrap">
          {statusFilters.map((s) => (
            <Button
              key={s || "all"}
              variant={statusFilter === s ? "default" : "outline"}
              size="sm"
              onClick={() => { setStatusFilter(s); setPage(1) }}
            >
              {statusLabels[s]}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.event ?? "Event"}</TableHead>
                  <TableHead>{t.athlete ?? "Athlete"}</TableHead>
                  <TableHead>{t.sport ?? "Sport"}</TableHead>
                  <TableHead>{t.value ?? "Value"}</TableHead>
                  <TableHead>{t.status ?? "Status"}</TableHead>
                  <TableHead>{t.version ?? "Ver."}</TableHead>
                  <TableHead>{t.submittedBy ?? "Submitted by"}</TableHead>
                  <TableHead className="text-right">{t.actions ?? "Actions"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.eventName}</TableCell>
                    <TableCell>{r.athleteName}</TableCell>
                    <TableCell>{r.sportName}</TableCell>
                    <TableCell>{r.value} {r.unit}</TableCell>
                    <TableCell>
                      <StatusBadge status={r.status as JudgeResultStatus} />
                    </TableCell>
                    <TableCell>v{r.version}</TableCell>
                    <TableCell className="text-sm">{r.createdByUser ?? "–"}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => router.push(`/${locale}/admin/results/${r.id}`)}
                        title={t.view ?? "View"}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {results.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      {t.noResults ?? "No results found"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {total > 20 && (
              <div className="flex justify-center gap-2 mt-4">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>←</Button>
                <span className="text-sm py-2">{page} / {Math.ceil(total / 20)}</span>
                <Button variant="outline" size="sm" disabled={page >= Math.ceil(total / 20)} onClick={() => setPage(page + 1)}>→</Button>
              </div>
            )}
          </>
        )}
      </div>
    </ProtectedRoute>
  )
}
