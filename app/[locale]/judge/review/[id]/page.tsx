// app/[locale]/judge/review/[id]/page.tsx | Task: FE-003 | Review detail page with approve/reject
"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useTranslation } from "@/lib/locale-context"
import { ProtectedRoute } from "@/components/protected-route"
import { StatusBadge } from "@/components/judge/StatusBadge"
import { VersionHistory } from "@/components/judge/VersionHistory"
import { ConfirmModal } from "@/components/judge/ConfirmModal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import * as judgeApi from "@/lib/api/judge"
import type { JudgeResultDetail } from "@/types/judge"
import { toast } from "sonner"

export default function ReviewDetailPage() {
  const params = useParams()
  const id = params.id as string
  const { getToken } = useAuth()
  const { locale, dictionary } = useTranslation()
  const router = useRouter()
  const tReview = dictionary.judge?.review ?? {}
  const tDetail = dictionary.judge?.detail ?? {}
  const tStatus = dictionary.judge?.status ?? {}
  const tActions = dictionary.judge?.actions ?? {}
  const tModal = dictionary.judge?.modal ?? {}

  const [result, setResult] = useState<JudgeResultDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [showApprove, setShowApprove] = useState(false)
  const [showReject, setShowReject] = useState(false)
  const [rejectReason, setRejectReason] = useState("")

  useEffect(() => {
    const fetch = async () => {
      const token = getToken()
      if (!token) return
      try {
        const data = await judgeApi.getReviewResultDetail(token, id)
        setResult(data)
      } catch {
        toast.error("Failed to load result")
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id, getToken])

  const handleApprove = async () => {
    const token = getToken()
    if (!token) return
    try {
      const res = await judgeApi.approveResult(token, id)
      toast.success(res.message)
      setShowApprove(false)
      // Refresh or go back
      if (res.status === "Published") {
        router.push(`/${locale}/judge/review`)
      } else {
        const updated = await judgeApi.getReviewResultDetail(token, id)
        setResult(updated)
      }
    } catch (err: any) {
      toast.error(err?.message || "Approval failed")
    }
  }

  const handleReject = async () => {
    if (!rejectReason.trim()) return
    const token = getToken()
    if (!token) return
    try {
      await judgeApi.rejectResult(token, id, { rejectionReason: rejectReason })
      toast.success("Result rejected")
      setShowReject(false)
      setRejectReason("")
      router.push(`/${locale}/judge/review`)
    } catch {
      toast.error("Rejection failed")
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          Loading...
        </div>
      </ProtectedRoute>
    )
  }

  if (!result) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          Result not found
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => router.push(`/${locale}/judge/review`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {tActions.back ?? "Back"}
        </Button>

        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{tReview.reviewDetail ?? "Review Result"}</h1>
            <div className="flex items-center gap-3 mt-2">
              <StatusBadge status={result.status} labels={tStatus} />
              <span className="text-sm text-muted-foreground">v{result.version}</span>
            </div>
          </div>
          {result.status === "PendingReview" && (
            <div className="flex gap-2">
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => setShowApprove(true)}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                {tActions.approve ?? "Approve"}
              </Button>
              <Button variant="destructive" onClick={() => setShowReject(true)}>
                <XCircle className="mr-2 h-4 w-4" />
                {tActions.reject ?? "Reject"}
              </Button>
            </div>
          )}
        </div>

        {/* Vier-Augen info */}
        {result.firstApprovedBy && !result.secondApprovedBy && (
          <Card className="mb-6 border-yellow-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <span className="text-sm">
                  {tReview.awaitingSecond ?? "Awaiting second approval"} — {tReview.firstApproval ?? "First approval"}: <strong>{result.firstApprovedBy}</strong>
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{tDetail.resultInfo ?? "Result Information"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoRow label="Event" value={result.event?.name ?? "–"} />
              <InfoRow label="Sport" value={result.event?.sportName ?? "–"} />
              <InfoRow label="Location" value={result.event?.location ?? "–"} />
              <InfoRow label="Date" value={result.event?.date ? new Date(result.event.date).toLocaleDateString() : "–"} />
              <Separator />
              <InfoRow label="Athlete" value={result.athlete?.name ?? "–"} />
              <InfoRow label="Country" value={result.athlete?.countryCode ?? "–"} />
              <Separator />
              <InfoRow label="Value" value={`${result.value} ${result.unit}`} />
              <InfoRow label="Rank" value={result.rank?.toString() ?? "–"} />
              <InfoRow label="Medal" value={result.medal !== "none" ? result.medal : "–"} />
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <InfoRow label="Created by" value={result.createdByUser ?? "–"} />
                <InfoRow label="Submitted at" value={result.submittedAt ? new Date(result.submittedAt).toLocaleString() : "–"} />
                <InfoRow label="Version" value={`v${result.version}`} />
                {result.firstApprovedBy && (
                  <InfoRow label="First approved by" value={result.firstApprovedBy} />
                )}
                {result.secondApprovedBy && (
                  <InfoRow label="Second approved by" value={result.secondApprovedBy} />
                )}
              </CardContent>
            </Card>

            {result.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap">{result.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {result.history.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{tDetail.versionHistory ?? "Version History"}</CardTitle>
            </CardHeader>
            <CardContent>
              <VersionHistory history={result.history} />
            </CardContent>
          </Card>
        )}

        <ConfirmModal
          open={showApprove}
          title={tModal.confirmApprove ?? "Approve Result?"}
          message={tModal.confirmApproveMessage ?? "Do you want to approve this result?"}
          confirmLabel={tActions.approve ?? "Approve"}
          cancelLabel={tActions.cancel ?? "Cancel"}
          onConfirm={handleApprove}
          onCancel={() => setShowApprove(false)}
        />

        {/* Reject modal with reason */}
        {showReject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => { setShowReject(false); setRejectReason("") }}>
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
                <Button variant="outline" onClick={() => { setShowReject(false); setRejectReason("") }}>
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}
