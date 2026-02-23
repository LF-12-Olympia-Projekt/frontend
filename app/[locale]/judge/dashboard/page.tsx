// app/[locale]/judge/dashboard/page.tsx | Task: FE-003 | Judge dashboard with status overview
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useTranslation } from "@/lib/locale-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  FileEdit,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  PlusCircle,
  List,
  ClipboardCheck,
} from "lucide-react"
import * as judgeApi from "@/lib/api/judge"

export default function JudgeDashboardPage() {
  const { getToken } = useAuth()
  const { locale, dictionary } = useTranslation()
  const router = useRouter()
  const t = dictionary.judge?.dashboard ?? {}

  const [stats, setStats] = useState({
    drafts: 0,
    pendingReview: 0,
    published: 0,
    protests: 0,
    invalid: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      const token = getToken()
      if (!token) return

      try {
        const [drafts, pending, published, protests, invalid] = await Promise.all([
          judgeApi.getJudgeResults(token, { status: "Draft", pageSize: 1 }),
          judgeApi.getJudgeResults(token, { status: "PendingReview", pageSize: 1 }),
          judgeApi.getJudgeResults(token, { status: "Published", pageSize: 1 }),
          judgeApi.getJudgeResults(token, { status: "ProtestFiled", pageSize: 1 }),
          judgeApi.getJudgeResults(token, { status: "Invalid", pageSize: 1 }),
        ])
        setStats({
          drafts: drafts.total,
          pendingReview: pending.total,
          published: published.total,
          protests: protests.total,
          invalid: invalid.total,
        })
      } catch {
        // API may not be available
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [getToken])

  const statusCards = [
    { key: "drafts", label: t.drafts ?? "Drafts", count: stats.drafts, icon: FileEdit, color: "text-gray-500", bg: "bg-gray-500/10" },
    { key: "pendingReview", label: t.pendingReview ?? "Pending Review", count: stats.pendingReview, icon: Clock, color: "text-yellow-600", bg: "bg-yellow-500/10" },
    { key: "published", label: t.published ?? "Published", count: stats.published, icon: CheckCircle, color: "text-green-600", bg: "bg-green-500/10" },
    { key: "protests", label: t.protests ?? "Protests", count: stats.protests, icon: AlertTriangle, color: "text-orange-600", bg: "bg-orange-500/10" },
    { key: "invalid", label: t.invalid ?? "Invalid", count: stats.invalid, icon: XCircle, color: "text-red-600", bg: "bg-red-500/10" },
  ]

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t.title ?? "Judge Dashboard"}</h1>
          <p className="text-muted-foreground mt-1">{t.subtitle ?? "Overview of your results"}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-8">
          {statusCards.map((card) => {
            const Icon = card.icon
            return (
              <Card key={card.key}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{card.label}</p>
                      <p className="text-2xl font-bold mt-1">
                        {loading ? "–" : card.count}
                      </p>
                    </div>
                    <div className={`h-10 w-10 rounded-full ${card.bg} flex items-center justify-center`}>
                      <Icon className={`h-5 w-5 ${card.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Button
            size="lg"
            className="h-auto py-6 flex flex-col gap-2"
            onClick={() => router.push(`/${locale}/judge/results/new`)}
          >
            <PlusCircle className="h-6 w-6" />
            <span>{t.newResult ?? "New Result"}</span>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-auto py-6 flex flex-col gap-2"
            onClick={() => router.push(`/${locale}/judge/results`)}
          >
            <List className="h-6 w-6" />
            <span>{t.myDrafts ?? "My Drafts"}</span>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-auto py-6 flex flex-col gap-2"
            onClick={() => router.push(`/${locale}/judge/review`)}
          >
            <ClipboardCheck className="h-6 w-6" />
            <span>{t.reviewQueue ?? "Review Queue"}</span>
          </Button>
        </div>
      </div>
    </ProtectedRoute>
  )
}
