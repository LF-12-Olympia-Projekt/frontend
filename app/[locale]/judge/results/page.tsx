// app/[locale]/judge/results/page.tsx | Task: FE-003 | Judge results list with status filtering
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useTranslation } from "@/lib/locale-context"
import { ProtectedRoute } from "@/components/protected-route"
import { StatusBadge } from "@/components/judge/StatusBadge"
import { ConfirmModal } from "@/components/judge/ConfirmModal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Eye, Pencil, Send, PlusCircle } from "lucide-react"
import * as judgeApi from "@/lib/api/judge"
import type { JudgeResultListItem, JudgeResultStatus } from "@/types/judge"

const STATUS_FILTERS: (JudgeResultStatus | "all")[] = [
  "all",
  "Draft",
  "PendingReview",
  "Published",
  "Invalid",
]

export default function JudgeResultsPage() {
  const { getToken } = useAuth()
  const { locale, dictionary } = useTranslation()
  const router = useRouter()
  const t = dictionary.judge?.results ?? {}
  const tActions = dictionary.judge?.actions ?? {}
  const tStatus = dictionary.judge?.status ?? {}
  const tModal = dictionary.judge?.modal ?? {}

  const [results, setResults] = useState<JudgeResultListItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState<JudgeResultStatus | "all">("all")
  const [loading, setLoading] = useState(true)
  const [submitId, setSubmitId] = useState<string | null>(null)

  const fetchResults = async () => {
    const token = getToken()
    if (!token) return
    setLoading(true)
    try {
      const res = await judgeApi.getJudgeResults(token, {
        status: filter === "all" ? undefined : filter,
        page,
        pageSize: 20,
      })
      setResults(res.data)
      setTotal(res.total)
    } catch {
      // API may not be available
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResults()
  }, [filter, page, getToken])

  const handleSubmit = async () => {
    if (!submitId) return
    const token = getToken()
    if (!token) return
    try {
      await judgeApi.submitResult(token, submitId)
      setSubmitId(null)
      fetchResults()
    } catch {
      // handle error
    }
  }

  const filterLabels: Record<string, string> = {
    all: t.all ?? "All",
    Draft: t.filterDraft ?? "Draft",
    PendingReview: t.filterPending ?? "Pending",
    Published: t.filterPublished ?? "Published",
    Invalid: t.filterInvalid ?? "Invalid",
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{t.title ?? "My Results"}</h1>
            <p className="text-muted-foreground mt-1">{t.subtitle ?? "Manage all your results"}</p>
          </div>
          <Button onClick={() => router.push(`/${locale}/judge/results/new`)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            {dictionary.judge?.dashboard?.newResult ?? "New Result"}
          </Button>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {STATUS_FILTERS.map((s) => (
            <Button
              key={s}
              variant={filter === s ? "default" : "outline"}
              size="sm"
              onClick={() => { setFilter(s); setPage(1) }}
            >
              {filterLabels[s] ?? s}
            </Button>
          ))}
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.event ?? "Event"}</TableHead>
                  <TableHead>{t.athlete ?? "Athlete"}</TableHead>
                  <TableHead>{t.sport ?? "Sport"}</TableHead>
                  <TableHead>{t.value ?? "Value"}</TableHead>
                  <TableHead>{t.status ?? "Status"}</TableHead>
                  <TableHead>{t.version ?? "Version"}</TableHead>
                  <TableHead>{t.lastModified ?? "Last Modified"}</TableHead>
                  <TableHead>{t.actions ?? "Actions"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : results.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      {t.noResults ?? "No results found"}
                    </TableCell>
                  </TableRow>
                ) : (
                  results.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.eventName}</TableCell>
                      <TableCell>{r.athleteName}</TableCell>
                      <TableCell>{r.sportName}</TableCell>
                      <TableCell>{r.value} {r.unit}</TableCell>
                      <TableCell>
                        <StatusBadge status={r.status} labels={tStatus} />
                      </TableCell>
                      <TableCell>v{r.version}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {r.lastModifiedAt ? new Date(r.lastModifiedAt).toLocaleDateString() : "–"}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {r.status === "Draft" && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                title={tActions.edit ?? "Edit"}
                                onClick={() => router.push(`/${locale}/judge/results/${r.id}/edit`)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                title={tActions.submit ?? "Submit"}
                                onClick={() => setSubmitId(r.id)}
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            title={tActions.view ?? "View"}
                            onClick={() => router.push(`/${locale}/judge/results/${r.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {total > 20 && (
          <div className="flex justify-center gap-2 mt-4">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
              ←
            </Button>
            <span className="text-sm text-muted-foreground self-center">
              {page} / {Math.ceil(total / 20)}
            </span>
            <Button variant="outline" size="sm" disabled={page >= Math.ceil(total / 20)} onClick={() => setPage(page + 1)}>
              →
            </Button>
          </div>
        )}

        <ConfirmModal
          open={!!submitId}
          title={tModal.confirmSubmit ?? "Submit Result?"}
          message={tModal.confirmSubmitMessage ?? "The result will be submitted for review and can no longer be edited."}
          confirmLabel={tActions.submit ?? "Submit"}
          cancelLabel={tActions.cancel ?? "Cancel"}
          onConfirm={handleSubmit}
          onCancel={() => setSubmitId(null)}
        />
      </div>
    </ProtectedRoute>
  )
}
