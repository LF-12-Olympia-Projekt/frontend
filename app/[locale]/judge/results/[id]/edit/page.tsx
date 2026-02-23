// app/[locale]/judge/results/[id]/edit/page.tsx | Task: FE-003 | Edit draft result page
"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useTranslation } from "@/lib/locale-context"
import { ProtectedRoute } from "@/components/protected-route"
import { ResultForm } from "@/components/judge/ResultForm"
import { ConfirmModal } from "@/components/judge/ConfirmModal"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Send } from "lucide-react"
import * as judgeApi from "@/lib/api/judge"
import type { JudgeResultDetail } from "@/types/judge"
import type { CreateResultRequest } from "@/types/judge"
import { toast } from "sonner"

export default function EditResultPage() {
  const params = useParams()
  const id = params.id as string
  const { getToken } = useAuth()
  const { locale, dictionary } = useTranslation()
  const router = useRouter()
  const tForm = dictionary.judge?.form ?? {}
  const tActions = dictionary.judge?.actions ?? {}
  const tModal = dictionary.judge?.modal ?? {}

  const [result, setResult] = useState<JudgeResultDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [showSubmit, setShowSubmit] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      const token = getToken()
      if (!token) return
      try {
        const data = await judgeApi.getJudgeResultDetail(token, id)
        if (data.status !== "Draft") {
          router.push(`/${locale}/judge/results/${id}`)
          return
        }
        setResult(data)
      } catch {
        toast.error("Failed to load result")
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id, getToken, locale, router])

  const handleSave = async (data: CreateResultRequest) => {
    const token = getToken()
    if (!token) return
    try {
      await judgeApi.updateResult(token, id, data)
      toast.success("Draft updated")
      const updated = await judgeApi.getJudgeResultDetail(token, id)
      setResult(updated)
    } catch {
      toast.error("Failed to update draft")
    }
  }

  const handleAutoSave = async (data: CreateResultRequest) => {
    const token = getToken()
    if (!token) return
    try {
      await judgeApi.updateResult(token, id, data)
    } catch {
      // silent fail for auto-save
    }
  }

  const handleSubmit = async () => {
    const token = getToken()
    if (!token) return
    try {
      await judgeApi.submitResult(token, id)
      toast.success("Result submitted for review")
      setShowSubmit(false)
      router.push(`/${locale}/judge/results`)
    } catch {
      toast.error("Failed to submit")
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
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            onClick={() => router.push(`/${locale}/judge/results`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {tActions.back ?? "Back"}
          </Button>
          <Button onClick={() => setShowSubmit(true)}>
            <Send className="mr-2 h-4 w-4" />
            {tActions.submit ?? "Submit for Review"}
          </Button>
        </div>

        <h1 className="text-3xl font-bold mb-2">
          {tForm.editResult ?? "Edit Result"}
        </h1>
        <p className="text-sm text-muted-foreground mb-6">
          Version: {result.version} · Last modified: {result.lastModifiedAt ? new Date(result.lastModifiedAt).toLocaleString() : "–"}
        </p>

        <ResultForm
          initialData={{
            eventId: result.event?.id,
            athleteId: result.athlete?.id,
            value: result.value,
            unit: result.unit,
            rank: result.rank,
            notes: result.notes,
            sportSpecificFields: result.sportSpecificFields,
          }}
          version={result.version}
          onSave={handleSave}
          onAutoSave={handleAutoSave}
          labels={{
            ...tForm,
            saveDraft: tActions.saveDraft ?? "Save Draft",
          }}
          isEdit
        />

        <ConfirmModal
          open={showSubmit}
          title={tModal.confirmSubmit ?? "Submit Result?"}
          message={tModal.confirmSubmitMessage ?? "The result will be submitted for review and can no longer be edited."}
          confirmLabel={tActions.submit ?? "Submit"}
          cancelLabel={tActions.cancel ?? "Cancel"}
          onConfirm={handleSubmit}
          onCancel={() => setShowSubmit(false)}
        />
      </div>
    </ProtectedRoute>
  )
}
