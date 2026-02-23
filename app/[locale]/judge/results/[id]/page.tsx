// app/[locale]/judge/results/[id]/page.tsx | Task: FE-003 | Judge result detail view
"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useTranslation } from "@/lib/locale-context"
import { ProtectedRoute } from "@/components/protected-route"
import { StatusBadge } from "@/components/judge/StatusBadge"
import { VersionHistory } from "@/components/judge/VersionHistory"
import { ProtestModal } from "@/components/judge/ProtestModal"
import { InvalidateModal } from "@/components/judge/InvalidateModal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, AlertTriangle, XCircle } from "lucide-react"
import * as judgeApi from "@/lib/api/judge"
import type { JudgeResultDetail } from "@/types/judge"
import { toast } from "sonner"

export default function JudgeResultDetailPage() {
  const params = useParams()
  const id = params.id as string
  const { getToken } = useAuth()
  const { locale, dictionary } = useTranslation()
  const router = useRouter()
  const tDetail = dictionary.judge?.detail ?? {}
  const tStatus = dictionary.judge?.status ?? {}
  const tActions = dictionary.judge?.actions ?? {}
  const tModal = dictionary.judge?.modal ?? {}

  const [result, setResult] = useState<JudgeResultDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [showProtest, setShowProtest] = useState(false)
  const [showInvalidate, setShowInvalidate] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      const token = getToken()
      if (!token) return
      try {
        const data = await judgeApi.getJudgeResultDetail(token, id)
        setResult(data)
      } catch {
        toast.error("Failed to load result")
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id, getToken])

  const handleProtest = async (reason: string) => {
    const token = getToken()
    if (!token) return
    try {
      await judgeApi.protestResult(token, id, { reason })
      toast.success("Protest filed")
      setShowProtest(false)
      const updated = await judgeApi.getJudgeResultDetail(token, id)
      setResult(updated)
    } catch {
      toast.error("Failed to file protest")
    }
  }

  const handleInvalidate = async (reason: string) => {
    const token = getToken()
    if (!token) return
    try {
      await judgeApi.invalidateResult(token, id, { reason })
      toast.success("Result invalidated")
      setShowInvalidate(false)
      const updated = await judgeApi.getJudgeResultDetail(token, id)
      setResult(updated)
    } catch {
      toast.error("Failed to invalidate result")
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
          onClick={() => router.push(`/${locale}/judge/results`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {tActions.back ?? "Back"}
        </Button>

        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{tDetail.title ?? "Result Detail"}</h1>
            <div className="flex items-center gap-3 mt-2">
              <StatusBadge status={result.status} labels={tStatus} />
              <span className="text-sm text-muted-foreground">v{result.version}</span>
            </div>
          </div>
          {result.status === "Published" && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowProtest(true)}>
                <AlertTriangle className="mr-2 h-4 w-4" />
                {tActions.protest ?? "Protest"}
              </Button>
              <Button variant="destructive" onClick={() => setShowInvalidate(true)}>
                <XCircle className="mr-2 h-4 w-4" />
                {tActions.invalidate ?? "Invalidate"}
              </Button>
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{tDetail.resultInfo ?? "Result Information"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoRow label="Event" value={result.event?.name ?? "–"} />
              <InfoRow label="Sport" value={result.event?.sportName ?? "–"} />
              <InfoRow label="Athlete" value={result.athlete?.name ?? "–"} />
              <InfoRow label="Country" value={result.athlete?.countryCode ?? "–"} />
              <InfoRow label="Value" value={`${result.value} ${result.unit}`} />
              <InfoRow label="Rank" value={result.rank?.toString() ?? "–"} />
              <InfoRow label="Medal" value={result.medal !== "none" ? result.medal : "–"} />
              <Separator />
              <InfoRow label="Created by" value={result.createdByUser ?? "–"} />
              <InfoRow label="Created at" value={result.createdAt ? new Date(result.createdAt).toLocaleString() : "–"} />
              <InfoRow label="Last modified" value={result.lastModifiedAt ? new Date(result.lastModifiedAt).toLocaleString() : "–"} />
              {result.submittedAt && (
                <InfoRow label="Submitted at" value={new Date(result.submittedAt).toLocaleString()} />
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            {result.rejectionReason && (
              <Card className="border-red-500/30">
                <CardHeader>
                  <CardTitle className="text-red-600">{tDetail.reviewerFeedback ?? "Reviewer Feedback"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{result.rejectionReason}</p>
                </CardContent>
              </Card>
            )}

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

            {result.firstApprovedBy && (
              <Card>
                <CardHeader>
                  <CardTitle>{dictionary.judge?.review?.approvalHistory ?? "Approval History"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <InfoRow label="First approval" value={result.firstApprovedBy} />
                  {result.secondApprovedBy && (
                    <InfoRow label="Second approval" value={result.secondApprovedBy} />
                  )}
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

        {result.protests.length > 0 && (
          <Card className="mt-6 border-orange-500/30">
            <CardHeader>
              <CardTitle className="text-orange-600">{tDetail.protestHistory ?? "Protest History"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.protests.map((p) => (
                <div key={p.id} className="border rounded p-3">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{p.filedBy}</span>
                    <span className="text-muted-foreground">{new Date(p.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-sm mt-1">{p.reason}</p>
                  <span className="text-xs text-muted-foreground">{p.status}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <ProtestModal
          open={showProtest}
          title={tModal.protestTitle}
          message={tModal.protestMessage}
          placeholder={tModal.reasonPlaceholder}
          confirmLabel={tActions.protest ?? "Submit Protest"}
          cancelLabel={tActions.cancel ?? "Cancel"}
          onConfirm={handleProtest}
          onCancel={() => setShowProtest(false)}
        />

        <InvalidateModal
          open={showInvalidate}
          title={tModal.invalidateTitle}
          message={tModal.invalidateMessage}
          placeholder={tModal.reasonPlaceholder}
          confirmLabel={tActions.invalidate ?? "Invalidate"}
          cancelLabel={tActions.cancel ?? "Cancel"}
          onConfirm={handleInvalidate}
          onCancel={() => setShowInvalidate(false)}
        />
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
