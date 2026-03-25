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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Eye, FileEdit } from "lucide-react"
import * as adminApi from "@/lib/api/admin"
import type { SportTemplateListItem } from "@/types/admin"
import { toast } from "sonner"

export default function AdminTemplatesPage() {
  const { getToken } = useAuth()
  const { locale, dictionary } = useTranslation()
  const router = useRouter()
  const t = dictionary.admin?.templates ?? {}

  const [templates, setTemplates] = useState<SportTemplateListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [createSportId, setCreateSportId] = useState("")
  const [createFields, setCreateFields] = useState("[]")

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
  }, [fetchTemplates])

  const handleCreate = async () => {
    const token = getToken()
    if (!token || !createSportId) return
    try {
      const parsedFields = JSON.parse(createFields)
      await adminApi.createTemplate(token, {
        sportId: createSportId,
        fields: parsedFields,
      })
      setShowCreate(false)
      setCreateSportId("")
      setCreateFields("[]")
      fetchTemplates()
    } catch (err: any) {
      if (err instanceof SyntaxError) {
        toast.error("Invalid JSON in fields")
      } else {
        toast.error(err?.message || "Failed to create template")
      }
    }
  }

  const getFieldCount = (fields: any[]) => {
    return Array.isArray(fields) ? fields.length : 0
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{t.title ?? "Sport Templates"}</h1>
            <p className="text-muted-foreground mt-1">{t.subtitle ?? "Manage result input templates per sport"}</p>
          </div>
          <Button onClick={() => setShowCreate(true)}>
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
                  <TableCell className="text-right space-x-1">
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
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{t.createTemplate ?? "Create Template"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t.sportId ?? "Sport ID"}</Label>
                <Input
                  value={createSportId}
                  onChange={(e) => setCreateSportId(e.target.value)}
                  placeholder="GUID of the sport"
                />
              </div>
              <div className="space-y-2">
                <Label>{t.fieldsJson ?? "Fields (JSON)"}</Label>
                <Textarea
                  value={createFields}
                  onChange={(e) => setCreateFields(e.target.value)}
                  className="min-h-[120px] font-mono text-xs"
                  placeholder='[{"name":"time","type":"time","required":true,"label":{"de":"Zeit","fr":"Temps","en":"Time"}}]'
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreate(false)}>
                {t.cancel ?? "Cancel"}
              </Button>
              <Button onClick={handleCreate} disabled={!createSportId}>
                {t.create ?? "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}
