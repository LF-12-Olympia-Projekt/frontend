// app/[locale]/admin/dashboard/page.tsx | Task: FE-004 | Admin dashboard with overview stats
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useTranslation } from "@/lib/locale-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Scale,
  Clock,
  AlertTriangle,
  ClipboardList,
  FileText,
  Shield,
  Image,
} from "lucide-react"
import * as adminApi from "@/lib/api/admin"

export default function AdminDashboardPage() {
  const { getToken } = useAuth()
  const { locale, dictionary } = useTranslation()
  const router = useRouter()
  const t = dictionary.admin?.dashboard ?? {}

  const [stats, setStats] = useState({
    totalUsers: 0,
    activeJudges: 0,
    pendingResults: 0,
    openProtests: 0,
    recentForcePublish: false,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      const token = getToken()
      if (!token) return
      try {
        const [users, pending, protests, audit] = await Promise.all([
          adminApi.getUsers(token, { pageSize: 1 }),
          adminApi.getAdminResults(token, { status: "PendingReview", pageSize: 1 }),
          adminApi.getAdminResults(token, { status: "ProtestFiled", pageSize: 1 }),
          adminApi.getAuditLog(token, { action: "FORCE_PUBLISH", pageSize: 1 }),
        ])
        const judges = await adminApi.getUsers(token, { role: "Judge", isLocked: false, pageSize: 1 })
        const recentFP = audit.data.length > 0
          && new Date(audit.data[0].timestamp).getTime() > Date.now() - 24 * 60 * 60 * 1000
        setStats({
          totalUsers: users.total,
          activeJudges: judges.total,
          pendingResults: pending.total,
          openProtests: protests.total,
          recentForcePublish: recentFP,
        })
      } catch {
        // API unavailable
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [getToken])

  const statCards = [
    { key: "totalUsers", label: t.totalUsers ?? "Total Users", count: stats.totalUsers, icon: Users, color: "text-blue-600", bg: "bg-blue-500/10" },
    { key: "activeJudges", label: t.activeJudges ?? "Active Judges", count: stats.activeJudges, icon: Scale, color: "text-green-600", bg: "bg-green-500/10" },
    { key: "pendingResults", label: t.pendingResults ?? "Pending Results", count: stats.pendingResults, icon: Clock, color: "text-yellow-600", bg: "bg-yellow-500/10" },
    { key: "openProtests", label: t.openProtests ?? "Open Protests", count: stats.openProtests, icon: AlertTriangle, color: "text-orange-600", bg: "bg-orange-500/10" },
  ]

  const quickLinks = [
    { label: t.userManagement ?? "User Management", icon: Users, path: `/${locale}/admin/users` },
    { label: t.resultManagement ?? "Result Management", icon: ClipboardList, path: `/${locale}/admin/results` },
    { label: t.templates ?? "Templates", icon: FileText, path: `/${locale}/admin/templates` },
    { label: t.auditLog ?? "Audit Log", icon: Shield, path: `/${locale}/admin/audit` },
    { label: t.assets ?? "Medal Assets", icon: Image, path: `/${locale}/admin/assets` },
  ]

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t.title ?? "Admin Dashboard"}</h1>
          <p className="text-muted-foreground mt-1">{t.subtitle ?? "System overview and management"}</p>
        </div>

        {stats.recentForcePublish && (
          <div className="mb-6 p-4 rounded-lg border border-orange-500/30 bg-orange-500/5">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <span className="font-semibold text-orange-600">
                {t.forcePublishAlert ?? "Force-publish actions detected in the last 24 hours"}
              </span>
            </div>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {statCards.map((card) => {
            const Icon = card.icon
            return (
              <Card key={card.key}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{card.label}</p>
                      <p className="text-2xl font-bold mt-1">{loading ? "–" : card.count}</p>
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

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {quickLinks.map((link) => {
            const Icon = link.icon
            return (
              <Button
                key={link.path}
                size="lg"
                variant="outline"
                className="h-auto py-5 flex flex-col gap-2"
                onClick={() => router.push(link.path)}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs">{link.label}</span>
              </Button>
            )
          })}
        </div>
      </div>
    </ProtectedRoute>
  )
}
