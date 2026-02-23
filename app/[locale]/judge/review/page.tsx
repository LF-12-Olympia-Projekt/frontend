// app/[locale]/judge/review/page.tsx | Task: FE-003 | Reviewer queue page
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useTranslation } from "@/lib/locale-context"
import { ProtectedRoute } from "@/components/protected-route"
import { ConfirmModal } from "@/components/judge/ConfirmModal"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Eye, CheckCircle, XCircle } from "lucide-react"
import * as judgeApi from "@/lib/api/judge"
import type { ReviewQueueItem } from "@/types/judge"
import { toast } from "sonner"

export default function ReviewQueuePage() {
  const { getToken } = useAuth()
  const { locale, dictionary } = useTranslation()
  const router = useRouter()
  const t = dictionary.judge?.review ?? {}
  const tActions = dictionary.judge?.actions ?? {}
  const tModal = dictionary.judge?.modal ?? {}

  const [items, setItems] = useState<ReviewQueueItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [approveId, setApproveId] = useState<string | null>(null)
  const [rejectId, setRejectId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState("")

  const fetchQueue = async () => {
    const token = getToken()
    if (!token) return
    setLoading(true)
    try {
      const res = await judgeApi.getReviewQueue(token, { page, pageSize: 20 })
      setItems(res.data)
      setTotal(res.total)
    } catch {
      // API may not be available
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQueue()
  }, [page, getToken])

  const handleApprove = async () => {
    if (!approveId) return
    const token = getToken()
    if (!token) return
    try {
      const res = await judgeApi.approveResult(token, approveId)
      toast.success(res.message)
      setApproveId(null)
      fetchQueue()
    } catch (err: any) {
      toast.error(err?.message || "Approval failed")
    }
  }

  const handleReject = async () => {
    if (!rejectId || !rejectReason.trim()) return
    const token = getToken()
    if (!token) return
    try {
      await judgeApi.rejectResult(token, rejectId, { rejectionReason: rejectReason })
      toast.success("Result rejected")
      setRejectId(null)
      setRejectReason("")
      fetchQueue()
    } catch {
      toast.error("Rejection failed")
    }
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{t.title ?? "Review Queue"}</h1>
          <p className="text-muted-foreground mt-1">{t.subtitle ?? "Review submitted results"}</p>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.submittedBy ?? "Submitted by"}</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Athlete</TableHead>
                  <TableHead>Sport</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>{t.submittedAt ?? "Submitted at"}</TableHead>
                  <TableHead>{t.firstApproval ?? "First Approval"}</TableHead>
                  <TableHead>{tActions.actions ?? "Actions"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      {t.noItems ?? "No results to review"}
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.submittedBy}</TableCell>
                      <TableCell>{item.eventName}</TableCell>
                      <TableCell>{item.athleteName}</TableCell>
                      <TableCell>{item.sportName}</TableCell>
                      <TableCell>{item.value} {item.unit}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {item.submittedAt ? new Date(item.submittedAt).toLocaleDateString() : "–"}
                      </TableCell>
                      <TableCell>
                        {item.firstApprovedBy ? (
                          <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                            {item.firstApprovedBy}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">–</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            title={tActions.view ?? "View"}
                            onClick={() => router.push(`/${locale}/judge/review/${item.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title={tActions.approve ?? "Approve"}
                            className="text-green-600 hover:text-green-700"
                            onClick={() => setApproveId(item.id)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title={tActions.reject ?? "Reject"}
                            className="text-red-600 hover:text-red-700"
                            onClick={() => setRejectId(item.id)}
                          >
                            <XCircle className="h-4 w-4" />
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
          open={!!approveId}
          title={tModal.confirmApprove ?? "Approve Result?"}
          message={tModal.confirmApproveMessage ?? "Do you want to approve this result?"}
          confirmLabel={tActions.approve ?? "Approve"}
          cancelLabel={tActions.cancel ?? "Cancel"}
          onConfirm={handleApprove}
          onCancel={() => setApproveId(null)}
        />

        {/* Reject modal using Dialog for reason input */}
        {rejectId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => { setRejectId(null); setRejectReason("") }}>
            <div className="bg-background rounded-lg p-6 max-w-md w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-semibold mb-2">{tModal.confirmReject ?? "Reject Result?"}</h3>
              <p className="text-sm text-muted-foreground mb-4">{tModal.confirmRejectMessage ?? "Please provide a reason for rejection."}</p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder={tModal.rejectionPlaceholder ?? "Enter rejection reason..."}
                className="w-full border rounded p-2 text-sm min-h-[100px] bg-background resize-none"
              />
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => { setRejectId(null); setRejectReason("") }}>
                  {tActions.cancel ?? "Cancel"}
                </Button>
                <Button variant="destructive" disabled={!rejectReason.trim()} onClick={handleReject}>
                  {tActions.reject ?? "Reject"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
