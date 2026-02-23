// app/[locale]/admin/audit/page.tsx | Task: FE-004 | Admin audit log page
"use client"

import { useEffect, useState, useCallback } from "react"
import { useAuth } from "@/lib/auth-context"
import { useTranslation } from "@/lib/locale-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuditLogTable } from "@/components/admin/AuditLogTable"
import { Download, Search } from "lucide-react"
import * as adminApi from "@/lib/api/admin"
import type { AuditLogListItem } from "@/types/admin"

export default function AdminAuditPage() {
  const { getToken } = useAuth()
  const { dictionary } = useTranslation()
  const t = dictionary.admin?.audit ?? {}

  const [entries, setEntries] = useState<AuditLogListItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  const [filterUser, setFilterUser] = useState("")
  const [filterAction, setFilterAction] = useState("")
  const [filterFrom, setFilterFrom] = useState("")
  const [filterTo, setFilterTo] = useState("")

  const fetchAudit = useCallback(async () => {
    const token = getToken()
    if (!token) return
    setLoading(true)
    try {
      const res = await adminApi.getAuditLog(token, {
        userId: filterUser || undefined,
        action: filterAction || undefined,
        from: filterFrom || undefined,
        to: filterTo || undefined,
        page,
        pageSize: 50,
      })
      setEntries(res.data)
      setTotal(res.total)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [getToken, page, filterUser, filterAction, filterFrom, filterTo])

  useEffect(() => {
    fetchAudit()
  }, [fetchAudit])

  const handleExport = () => {
    const token = getToken()
    if (!token) return
    const url = adminApi.getAuditExportUrl({
      userId: filterUser || undefined,
      action: filterAction || undefined,
      from: filterFrom || undefined,
      to: filterTo || undefined,
    })
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL!
    // Open CSV download in new tab with auth header via fetch
    fetch(`${apiBase}${url}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.blob())
      .then((blob) => {
        const a = document.createElement("a")
        a.href = URL.createObjectURL(blob)
        a.download = `audit-log-${new Date().toISOString().slice(0, 10)}.csv`
        a.click()
      })
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{t.title ?? "Audit Log"}</h1>
            <p className="text-muted-foreground mt-1">{t.subtitle ?? "Complete system audit trail"}</p>
          </div>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            {t.exportCsv ?? "Export CSV"}
          </Button>
        </div>

        {/* Filters */}
        <div className="grid gap-3 sm:grid-cols-4 mb-6">
          <div className="space-y-1">
            <Label className="text-xs">{t.filterUser ?? "User"}</Label>
            <Input
              value={filterUser}
              onChange={(e) => { setFilterUser(e.target.value); setPage(1) }}
              placeholder={t.filterUserPlaceholder ?? "Username"}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">{t.filterAction ?? "Action"}</Label>
            <Input
              value={filterAction}
              onChange={(e) => { setFilterAction(e.target.value); setPage(1) }}
              placeholder={t.filterActionPlaceholder ?? "e.g. FORCE_PUBLISH"}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">{t.from ?? "From"}</Label>
            <Input
              type="date"
              value={filterFrom}
              onChange={(e) => { setFilterFrom(e.target.value); setPage(1) }}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">{t.to ?? "To"}</Label>
            <Input
              type="date"
              value={filterTo}
              onChange={(e) => { setFilterTo(e.target.value); setPage(1) }}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <>
            <AuditLogTable entries={entries} labels={t.table} />
            {total > 50 && (
              <div className="flex justify-center gap-2 mt-4">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>←</Button>
                <span className="text-sm py-2">{page} / {Math.ceil(total / 50)}</span>
                <Button variant="outline" size="sm" disabled={page >= Math.ceil(total / 50)} onClick={() => setPage(page + 1)}>→</Button>
              </div>
            )}
            {entries.length === 0 && !loading && (
              <p className="text-center text-muted-foreground py-8">
                {t.noEntries ?? "No audit log entries found"}
              </p>
            )}
          </>
        )}
      </div>
    </ProtectedRoute>
  )
}
