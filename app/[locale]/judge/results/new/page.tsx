// app/[locale]/judge/results/new/page.tsx | Task: FE-003 | Create new result form page
"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useTranslation } from "@/lib/locale-context"
import { ProtectedRoute } from "@/components/protected-route"
import { ResultForm } from "@/components/judge/ResultForm"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import * as judgeApi from "@/lib/api/judge"
import type { CreateResultRequest } from "@/types/judge"
import { toast } from "sonner"

export default function NewResultPage() {
  const { getToken } = useAuth()
  const { locale, dictionary } = useTranslation()
  const router = useRouter()
  const tForm = dictionary.judge?.form ?? {}
  const tActions = dictionary.judge?.actions ?? {}

  const handleSave = async (data: CreateResultRequest) => {
    const token = getToken()
    if (!token) return
    try {
      const result = await judgeApi.createResult(token, data as CreateResultRequest)
      toast.success("Draft saved")
      router.push(`/${locale}/judge/results/${result.id}/edit`)
    } catch (err) {
      toast.error("Failed to save draft")
    }
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => router.push(`/${locale}/judge/results`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {tActions.back ?? "Back"}
        </Button>

        <h1 className="text-3xl font-bold mb-6">{tForm.newResult ?? "Create New Result"}</h1>

        <ResultForm
          onSave={handleSave}
          labels={{
            ...tForm,
            saveDraft: tActions.saveDraft ?? "Save Draft",
          }}
        />
      </div>
    </ProtectedRoute>
  )
}
