// app/[locale]/admin/athletes/[id]/page.tsx | Admin athlete detail/edit page
"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useTranslation } from "@/lib/locale-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ConfirmModal } from "@/components/judge/ConfirmModal"
import { ArrowLeft, Save, Trash2 } from "lucide-react"
import * as adminApi from "@/lib/api/admin"
import type { AdminAthleteDetail, UpdateAthleteRequest } from "@/types/admin"

export default function AdminAthleteDetailPage() {
  const { getToken } = useAuth()
  const { locale } = useTranslation()
  const router = useRouter()
  const params = useParams()
  const athleteId = params.id as string

  const [athlete, setAthlete] = useState<AdminAthleteDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [editForm, setEditForm] = useState<UpdateAthleteRequest>({})
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState("")
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const fetchAthlete = async () => {
      const token = getToken()
      if (!token) return
      try {
        const data = await adminApi.getAdminAthlete(token, athleteId)
        setAthlete(data)
        setEditForm({
          name: data.name,
          countryCode: data.countryCode,
          dateOfBirth: data.dateOfBirth ?? undefined,
          photoUrl: data.photoUrl ?? undefined,
        })
      } catch {
        // handle
      } finally {
        setLoading(false)
      }
    }
    fetchAthlete()
  }, [getToken, athleteId])

  const handleSave = async () => {
    const token = getToken()
    if (!token || !athlete) return
    setSaving(true)
    setSaveError("")
    try {
      const updated = await adminApi.updateAthlete(token, athleteId, editForm)
      setAthlete(updated)
      setEditForm({
        name: updated.name,
        countryCode: updated.countryCode,
        dateOfBirth: updated.dateOfBirth ?? undefined,
        photoUrl: updated.photoUrl ?? undefined,
      })
    } catch (e: any) {
      setSaveError(e?.message ?? "Fehler beim Speichern")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    const token = getToken()
    if (!token) return
    setDeleting(true)
    try {
      await adminApi.deleteAthlete(token, athleteId)
      router.push(`/${locale}/admin/athletes`)
    } catch {
      setDeleting(false)
    }
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

  if (!athlete) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto px-4 py-8">
          <p className="text-muted-foreground">Athlet nicht gefunden.</p>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" className="mb-4" onClick={() => router.push(`/${locale}/admin/athletes`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Zurück zur Liste
        </Button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{athlete.name}</h1>
            <p className="text-muted-foreground mt-1">
              {athlete.countryCode}
              {athlete.age !== null ? ` · ${athlete.age} Jahre` : ""}
            </p>
          </div>
          <Button variant="destructive" size="sm" onClick={() => setConfirmDelete(true)}>
            <Trash2 className="h-4 w-4 mr-2" />
            Löschen
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Edit Form */}
          <Card>
            <CardHeader>
              <CardTitle>Stammdaten bearbeiten</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input
                  value={editForm.name ?? ""}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Länder-Code *</Label>
                <Input
                  value={editForm.countryCode ?? ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, countryCode: e.target.value.toUpperCase().slice(0, 3) })
                  }
                  maxLength={3}
                  placeholder="z.B. GER"
                />
              </div>
              <div className="space-y-2">
                <Label>Geburtsdatum</Label>
                <Input
                  type="date"
                  value={
                    editForm.dateOfBirth
                      ? (editForm.dateOfBirth as string).split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    setEditForm({ ...editForm, dateOfBirth: e.target.value || undefined })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Foto-URL</Label>
                <Input
                  value={editForm.photoUrl ?? ""}
                  onChange={(e) => setEditForm({ ...editForm, photoUrl: e.target.value || undefined })}
                  placeholder="https://..."
                />
              </div>
              {saveError && <p className="text-sm text-destructive">{saveError}</p>}
              <Button
                onClick={handleSave}
                disabled={saving || !editForm.name || !editForm.countryCode || editForm.countryCode.length !== 3}
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Speichern..." : "Speichern"}
              </Button>
            </CardContent>
          </Card>

          {/* Info + Results */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {athlete.photoUrl && (
                  <img
                    src={athlete.photoUrl}
                    alt={athlete.name}
                    className="w-20 h-20 rounded-full object-cover mb-2"
                  />
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Angelegt</span>
                  <span>{new Date(athlete.createdAt).toLocaleDateString("de-DE")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Zuletzt geändert</span>
                  <span>{new Date(athlete.updatedAt).toLocaleDateString("de-DE")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ergebnisse gesamt</span>
                  <span>{athlete.resultsCount}</span>
                </div>
              </CardContent>
            </Card>

            {athlete.results?.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Letzte Ergebnisse</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {athlete.results.slice(0, 10).map((r) => (
                      <div
                        key={r.id}
                        className="flex items-center justify-between text-sm py-1.5 border-b last:border-0"
                      >
                        <div>
                          <span className="font-medium">{r.eventName}</span>
                          <span className="text-muted-foreground ml-2 text-xs">{r.sportName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-right">
                          <span className="text-muted-foreground">
                            {r.value} {r.unit}
                          </span>
                          {r.medal !== "none" && (
                            <span className="text-xs font-semibold capitalize">{r.medal}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <ConfirmModal
          open={confirmDelete}
          title="Athlet löschen?"
          message={`Soll ${athlete.name} wirklich gelöscht werden? Die Ergebnisse des Athleten bleiben erhalten.`}
          danger
          confirmLabel={deleting ? "Löschen..." : "Löschen"}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(false)}
        />
      </div>
    </ProtectedRoute>
  )
}
