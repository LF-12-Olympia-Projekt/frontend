// app/[locale]/admin/athletes/page.tsx | Admin athlete management page
"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useTranslation } from "@/lib/locale-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ConfirmModal } from "@/components/judge/ConfirmModal"
import { UserPlus, Pencil, Trash2, Search } from "lucide-react"
import * as adminApi from "@/lib/api/admin"
import type { AdminAthleteListItem, CreateAthleteRequest } from "@/types/admin"

const PAGE_SIZE = 20

export default function AdminAthletesPage() {
  const { getToken } = useAuth()
  const { locale } = useTranslation()
  const router = useRouter()

  const [athletes, setAthletes] = useState<AdminAthleteListItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [loading, setLoading] = useState(true)

  const [showCreate, setShowCreate] = useState(false)
  const [createForm, setCreateForm] = useState<CreateAthleteRequest>({
    name: "",
    countryCode: "",
    dateOfBirth: null,
    photoUrl: null,
  })
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState("")

  const [deleteTarget, setDeleteTarget] = useState<AdminAthleteListItem | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchAthletes = useCallback(async () => {
    const token = getToken()
    if (!token) return
    setLoading(true)
    try {
      const res = await adminApi.getAdminAthletes(token, {
        search: search || undefined,
        page,
        pageSize: PAGE_SIZE,
      })
      setAthletes(res.data)
      setTotal(res.total)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [getToken, page, search])

  useEffect(() => {
    fetchAthletes()
  }, [fetchAthletes])

  const handleSearch = () => {
    setSearch(searchInput)
    setPage(1)
  }

  const handleCreate = async () => {
    const token = getToken()
    if (!token) return
    setCreating(true)
    setCreateError("")
    try {
      await adminApi.createAthlete(token, createForm)
      setShowCreate(false)
      setCreateForm({ name: "", countryCode: "", dateOfBirth: null, photoUrl: null })
      fetchAthletes()
    } catch (e: any) {
      setCreateError(e?.message ?? "Fehler beim Anlegen")
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    const token = getToken()
    if (!token) return
    setDeleting(true)
    try {
      await adminApi.deleteAthlete(token, deleteTarget.id)
      setDeleteTarget(null)
      fetchAthletes()
    } catch {
      // ignore
    } finally {
      setDeleting(false)
    }
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Athleten-Verwaltung</h1>
            <p className="text-muted-foreground mt-1">Athleten anlegen, bearbeiten und löschen</p>
          </div>
          <Button onClick={() => setShowCreate(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Athlet anlegen
          </Button>
        </div>

        {/* Search */}
        <div className="flex gap-2 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Name suchen..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button variant="outline" onClick={handleSearch}>Suchen</Button>
          {search && (
            <Button variant="ghost" onClick={() => { setSearch(""); setSearchInput(""); setPage(1) }}>
              Zurücksetzen
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <>
            <div className="rounded-md border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium">Name</th>
                    <th className="text-left px-4 py-3 font-medium">Land</th>
                    <th className="text-left px-4 py-3 font-medium">Alter</th>
                    <th className="text-left px-4 py-3 font-medium">Ergebnisse</th>
                    <th className="text-right px-4 py-3 font-medium">Aktionen</th>
                  </tr>
                </thead>
                <tbody>
                  {athletes.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-muted-foreground">
                        Keine Athleten gefunden
                      </td>
                    </tr>
                  ) : (
                    athletes.map((a) => (
                      <tr key={a.id} className="border-t hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-medium">{a.name}</td>
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">{a.countryCode}</span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {a.age !== null ? `${a.age} J.` : "–"}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{a.resultsCount}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => router.push(`/${locale}/admin/athletes/${a.id}`)}
                            >
                              <Pencil className="h-3 w-3 mr-1" />
                              Bearbeiten
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-destructive hover:text-destructive"
                              onClick={() => setDeleteTarget(a)}
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Löschen
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>←</Button>
                <span className="text-sm py-2">{page} / {totalPages}</span>
                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>→</Button>
              </div>
            )}
          </>
        )}

        {/* Create Modal */}
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Athlet anlegen</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  placeholder="Vollständiger Name"
                />
              </div>
              <div className="space-y-2">
                <Label>Länder-Code (3 Buchstaben) *</Label>
                <Input
                  value={createForm.countryCode ?? ""}
                  onChange={(e) => setCreateForm({ ...createForm, countryCode: e.target.value.toUpperCase().slice(0, 3) })}
                  placeholder="z.B. GER"
                  maxLength={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Geburtsdatum</Label>
                <Input
                  type="date"
                  value={createForm.dateOfBirth ?? ""}
                  onChange={(e) => setCreateForm({ ...createForm, dateOfBirth: e.target.value || null })}
                />
              </div>
              <div className="space-y-2">
                <Label>Foto-URL</Label>
                <Input
                  value={createForm.photoUrl ?? ""}
                  onChange={(e) => setCreateForm({ ...createForm, photoUrl: e.target.value || null })}
                  placeholder="https://..."
                />
              </div>
              {createError && <p className="text-sm text-destructive">{createError}</p>}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setShowCreate(false); setCreateError("") }}>
                Abbrechen
              </Button>
              <Button
                onClick={handleCreate}
                disabled={creating || !createForm.name || !createForm.countryCode || createForm.countryCode.length !== 3}
              >
                {creating ? "Anlegen..." : "Anlegen"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <ConfirmModal
          open={!!deleteTarget}
          title="Athlet löschen?"
          message={`Soll ${deleteTarget?.name} wirklich gelöscht werden? Diese Aktion kann nicht rückgängig gemacht werden.`}
          danger
          confirmLabel={deleting ? "Löschen..." : "Löschen"}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      </div>
    </ProtectedRoute>
  )
}
