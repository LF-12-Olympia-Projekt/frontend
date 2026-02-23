// app/[locale]/admin/templates/[id]/edit/page.tsx | Task: FE-004 | Template editor page
"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useTranslation } from "@/lib/locale-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TemplateEditor } from "@/components/admin/TemplateEditor"
import { ArrowLeft, Save } from "lucide-react"
import * as adminApi from "@/lib/api/admin"
import type { SportTemplateListItem, TemplateField } from "@/types/admin"

export default function AdminTemplateEditPage() {
  const { getToken } = useAuth()
  const { locale, dictionary } = useTranslation()
  const router = useRouter()
  const params = useParams()
  const templateId = params.id as string
  const t = dictionary.admin?.templates ?? {}

  const [template, setTemplate] = useState<SportTemplateListItem | null>(null)
  const [fields, setFields] = useState<TemplateField[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchTemplate = async () => {
      const token = getToken()
      if (!token) return
      try {
        const data = await adminApi.getTemplate(token, templateId)
        setTemplate(data)
        try {
          setFields(JSON.parse(data.fields))
        } catch {
          setFields([])
        }
      } catch {
        // handle
      } finally {
        setLoading(false)
      }
    }
    fetchTemplate()
  }, [getToken, templateId])

  const handleSave = async () => {
    const token = getToken()
    if (!token) return
    setSaving(true)
    try {
      const updated = await adminApi.updateTemplate(token, templateId, {
        fields: JSON.stringify(fields),
      })
      setTemplate(updated)
      router.push(`/${locale}/admin/templates`)
    } catch {
      // handle
    } finally {
      setSaving(false)
    }
  }

  // Preview of how the form will look
  const renderPreview = () => (
    <div className="space-y-3">
      {fields.map((field, i) => (
        <div key={i} className="space-y-1">
          <label className="text-sm font-medium">
            {field.label[locale?.substring(0, 2) as "de" | "fr" | "en"] || field.label.en || field.name}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {field.type === "dropdown" ? (
            <select className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm" disabled>
              {field.options?.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          ) : (
            <input
              type={field.type === "number" ? "number" : "text"}
              className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm"
              placeholder={field.type === "time" ? "HH:MM:SS.ms" : field.unit || ""}
              disabled
            />
          )}
        </div>
      ))}
      {fields.length === 0 && (
        <p className="text-sm text-muted-foreground">{t.noFields ?? "No fields defined"}</p>
      )}
    </div>
  )

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </ProtectedRoute>
    )
  }

  if (!template) {
    return (
      <ProtectedRoute>
        <div className="container mx-auto px-4 py-8">
          <p>{t.notFound ?? "Template not found"}</p>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => router.push(`/${locale}/admin/templates`)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t.backToTemplates ?? "Back to Templates"}
        </Button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">{template.sportName}</h1>
            <p className="text-muted-foreground mt-1">
              v{template.version} •{" "}
              <Badge variant={template.isActive ? "outline" : "secondary"}>
                {template.isActive ? (t.active ?? "Active") : (t.inactive ?? "Inactive")}
              </Badge>
            </p>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? (t.saving ?? "Saving...") : (t.save ?? "Save Template")}
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="text-lg font-semibold mb-4">{t.editFields ?? "Edit Fields"}</h2>
            <TemplateEditor
              fields={fields}
              onChange={setFields}
              labels={t.editor}
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-4">{t.preview ?? "Preview"}</h2>
            <Card>
              <CardContent className="pt-6">
                {renderPreview()}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
