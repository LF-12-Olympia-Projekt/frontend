// app/[locale]/admin/templates/page.tsx | Task: FE-004 | Admin sport templates management page
"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useTranslation } from "@/lib/locale-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { TemplateEditor } from "@/components/admin/TemplateEditor"
import { Plus, FileEdit } from "lucide-react"
import * as adminApi from "@/lib/api/admin"
import { getSports } from "@/lib/api/results"
import type { SportTemplateListItem, TemplateField, TemplateFieldDto } from "@/types/admin"
import { templateFieldsToRequest, backendFieldsToEditor } from "@/types/admin"
import type { SportInfo } from "@/types/api"

export default function AdminTemplatesPage() {
  const { getToken } = useAuth()
  const { locale, dictionary } = useTranslation()
  const router = useRouter()
  const t = dictionary.admin?.templates ?? {}

  const [templates, setTemplates] = useState<SportTemplateListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [sports, setSports] = useState<SportInfo[]>([])

  const [showCreate, setShowCreate] = useState(false)
  const [createSportId, setCreateSportId] = useState("")
  const [createFields, setCreateFields] = useState<TemplateField[]>([])
  const [creating, setCreating] = useState(false)

  const fetchTemplates = useCallback(async () => {
    const token = getToken()
    if (!token) return
    setLoading(true)
    try {
      const data = await adminApi.getTemplates(token)
      setTemplates(data)
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [getToken])

  useEffect(() => {
    fetchTemplates()
    getSports().then(setSports).catch(() => {})
  }, [fetchTemplates])

  const openCreate = () => {
    setCreateSportId(sports[0]?.id ?? "")
    setCreateFields([])
    setShowCreate(true)
  }

  const handleCreate = async () => {
    const token = getToken()
    if (!token || !createSportId) return
    setCreating(true)
    try {
      await adminApi.createTemplate(token, {
        sportId: createSportId,
        fields: templateFieldsToRequest(createFields),
      })
      setShowCreate(false)
      fetchTemplates()
    } catch {
      // handle
    } finally {
      setCreating(false)
    }
  }

  const getFieldCount = (fields: TemplateFieldDto[]) => fields?.length ?? 0

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{t.title ?? "Sport Templates"}</h1>
            <p className="text-muted-foreground mt-1">{t.subtitle ?? "Manage result input templates per sport"}</p>
          </div>
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4 mr-2" />
            {t.createTemplate ?? "Create Template"}
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.sport ?? "Sport"}</TableHead>
                <TableHead>{t.fields ?? "Fields"}</TableHead>
                <TableHead>{t.version ?? "Version"}</TableHead>
                <TableHead>{t.status ?? "Status"}</TableHead>
                <TableHead>{t.lastUpdated ?? "Last Updated"}</TableHead>
                <TableHead className="text-right">{t.actions ?? "Actions"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map((tmpl) => (
                <TableRow key={tmpl.id}>
                  <TableCell className="font-medium">{tmpl.sportName}</TableCell>
                  <TableCell>{getFieldCount(tmpl.fields)} {t.fieldCount ?? "fields"}</TableCell>
                  <TableCell>v{tmpl.version}</TableCell>
                  <TableCell>
                    <Badge variant={tmpl.isActive ? "outline" : "secondary"}>
                      {tmpl.isActive ? (t.active ?? "Active") : (t.inactive ?? "Inactive")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(tmpl.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => router.push(`/${locale}/admin/templates/${tmpl.id}/edit`)}
                      title={t.edit ?? "Edit"}
                    >
                      <FileEdit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {templates.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    {t.noTemplates ?? "No templates found"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}

        {/* Create Template Modal */}
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t.createTemplate ?? "Create Template"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Sport *</Label>
                <select
                  className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm"
                  value={createSportId}
                  onChange={(e) => setCreateSportId(e.target.value)}
                >
                  {sports.length === 0 && <option value="">Lädt...</option>}
                  {sports.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Felder</Label>
                <TemplateEditor fields={createFields} onChange={setCreateFields} />
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button variant="outline" onClick={() => setShowCreate(false)}>Abbrechen</Button>
              <Button onClick={handleCreate} disabled={creating || !createSportId}>
                {creating ? "Erstellen..." : "Vorlage erstellen"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}
