// app/[locale]/admin/results/[id]/page.tsx | Task: FE-004 | Admin result detail page
"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useTranslation } from "@/lib/locale-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/judge/StatusBadge"
import { VersionHistory } from "@/components/judge/VersionHistory"
import { DangerModal } from "@/components/admin/DangerModal"
import { ArrowLeft, RotateCcw, Zap, Trash2 } from "lucide-react"
import * as adminApi from "@/lib/api/admin"
import type { JudgeResultDetail, JudgeResultStatus } from "@/types/judge"

export default function AdminResultDetailPage() {
  const { getToken } = useAuth()
  const { locale, dictionary } = useTranslation()
  const router = useRouter()
  const params = useParams()
  const resultId = params.id as string
  const t = dictionary.admin?.results ?? {}
  const tModal = dictionary.admin?.modal ?? {}

  const [result, setResult] = useState<JudgeResultDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [showRestore, setShowRestore] = useState(false)
  const [showForcePublish, setShowForcePublish] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  useEffect(() => {
    const fetchResult = async () => {
      const token = getToken()
      if (!token) return
      try {
        const data = await adminApi.getAdminResultDetail(token, resultId)
        setResult(data)
      } catch {
        // handle
      } finally {
        setLoading(false)
      }
    }
    fetchResult()
  }, [getToken, resultId])

  const handleRestore = async (reason?: string) => {
    const token = getToken()
    if (!token || !reason) return
    try {
      await adminApi.restoreResult(token, resultId, { reason })
      setShowRestore(false)
      const updated = await adminApi.getAdminResultDetail(token, resultId)
      setResult(updated)
    } catch { /* handle */ }
  }

  const handleForcePublish = async (reason?: string) => {
    const token = getToken()
    if (!token || !reason) return
    try {
      await adminApi.forcePublish(token, resultId, { reason })
      setShowForcePublish(false)
      const updated = await adminApi.getAdminResultDetail(token, resultId)
      setResult(updated)
    } catch { /* handle */ }
  }

  const handleDelete = async (reason?: string) => {
    const token = getToken()
    if (!token || !reason) return
    try {
      await adminApi.permanentDelete(token, resultId, {
        confirmationToken: "CONFIRM-DELETE",
        reason,
      })
      setShowDelete(false)
      router.push(`/${locale}/admin/results`)
    } catch { /* handle */ }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </ProtectedRoute>
    )
  }

  if (!result) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto px-4 py-8">
          <p>{t.notFound ?? "Result not found"}</p>
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
          onClick={() => router.push(`/${locale}/admin/results`)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t.backToResults ?? "Back to Results"}
        </Button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">
              {result.event?.name ?? "–"} — {result.athlete?.name ?? "–"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {result.event?.sportName} • v{result.version}
            </p>
          </div>
          <StatusBadge status={result.status as JudgeResultStatus} />
        </div>

        {/* Result Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{t.resultInfo ?? "Result Information"}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">{t.value ?? "Value"}</p>
              <p className="font-medium">{result.value} {result.unit}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t.rank ?? "Rank"}</p>
              <p className="font-medium">{result.rank ?? "–"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t.createdBy ?? "Created by"}</p>
              <p className="font-medium">{result.createdByUser ?? "–"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t.submittedAt ?? "Submitted"}</p>
              <p className="font-medium">
                {result.submittedAt ? new Date(result.submittedAt).toLocaleString() : "–"}
              </p>
            </div>
            {result.firstApprovedBy && (
              <div>
                <p className="text-sm text-muted-foreground">{t.firstApproval ?? "1st Approval"}</p>
                <p className="font-medium">{result.firstApprovedBy}</p>
              </div>
            )}
            {result.secondApprovedBy && (
              <div>
                <p className="text-sm text-muted-foreground">{t.secondApproval ?? "2nd Approval"}</p>
                <p className="font-medium">{result.secondApprovedBy}</p>
              </div>
            )}
            {result.notes && (
              <div className="sm:col-span-2">
                <p className="text-sm text-muted-foreground">{t.notes ?? "Notes"}</p>
                <pre className="mt-1 p-2 bg-muted rounded text-sm whitespace-pre-wrap">{result.notes}</pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Protests */}
        {result.protests.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-orange-600">{t.protests ?? "Protests"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.protests.map((p) => (
                <div key={p.id} className="p-3 border rounded-lg">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{p.filedBy}</span>
                    <span className="text-muted-foreground">{new Date(p.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-sm">{p.reason}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Version History */}
        {result.history.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{t.versionHistory ?? "Version History"}</CardTitle>
            </CardHeader>
            <CardContent>
              <VersionHistory history={result.history} />
            </CardContent>
          </Card>
        )}

        {/* Admin Actions */}
        <Card>
          <CardHeader>
            <CardTitle>{t.adminActions ?? "Admin Actions"}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            {result.status === "Invalid" && (
              <Button variant="outline" onClick={() => setShowRestore(true)}>
                <RotateCcw className="h-4 w-4 mr-2" />
                {t.restore ?? "Restore Result"}
              </Button>
            )}
            {result.status !== "Published" && (
              <Button
                variant="outline"
                className="border-orange-500/30 text-orange-600 hover:bg-orange-500/10"
                onClick={() => setShowForcePublish(true)}
              >
                <Zap className="h-4 w-4 mr-2" />
                {t.forcePublish ?? "Force Publish"}
              </Button>
            )}
            <Button variant="destructive" onClick={() => setShowDelete(true)}>
              <Trash2 className="h-4 w-4 mr-2" />
              {t.permanentDelete ?? "Permanent Delete"}
            </Button>
          </CardContent>
        </Card>

        {/* Modals */}
        <DangerModal
          open={showRestore}
          title={t.restoreTitle ?? "Restore Result?"}
          message={t.restoreMessage ?? "This will restore the result to Published status."}
          confirmPhrase="RESTORE"
          confirmInstruction={tModal.confirmPhrase}
          requireReason
          reasonLabel={t.restoreReason ?? "Reason for restoration"}
          confirmLabel={t.restore ?? "Restore"}
          cancelLabel={tModal.cancel}
          onConfirm={handleRestore}
          onCancel={() => setShowRestore(false)}
        />

        <DangerModal
          open={showForcePublish}
          title={t.forcePublishTitle ?? "Force Publish?"}
          message={t.forcePublishMessage ?? "This bypasses the normal review process. This action is logged and audited."}
          confirmPhrase="FORCE-PUBLISH"
          confirmInstruction={tModal.confirmPhrase}
          requireReason
          reasonLabel={t.forcePublishReason ?? "Reason for force publish"}
          reasonMinLength={20}
          confirmLabel={t.forcePublish ?? "Force Publish"}
          cancelLabel={tModal.cancel}
          onConfirm={handleForcePublish}
          onCancel={() => setShowForcePublish(false)}
        />

        <DangerModal
          open={showDelete}
          title={t.deleteTitle ?? "Permanent Delete?"}
          message={t.deleteMessage ?? "This will PERMANENTLY delete this result and all associated data. This cannot be undone."}
          confirmPhrase="CONFIRM-DELETE"
          confirmInstruction={tModal.confirmPhrase}
          requireReason
          reasonLabel={t.deleteReason ?? "Reason for deletion"}
          reasonMinLength={10}
          confirmLabel={t.permanentDelete ?? "Delete Permanently"}
          cancelLabel={tModal.cancel}
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      </div>
    </ProtectedRoute>
  )
}
