// components/admin/TemplateEditor.tsx | Task: FE-004 | Sport template field editor
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, GripVertical, ChevronUp, ChevronDown } from "lucide-react"
import type { TemplateField } from "@/types/admin"

interface TemplateEditorProps {
  fields: TemplateField[]
  onChange: (fields: TemplateField[]) => void
  labels?: Record<string, string>
}

const fieldTypes: Array<{ value: TemplateField["type"]; label: string }> = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "time", label: "Time (HH:MM:SS.ms)" },
  { value: "dropdown", label: "Dropdown" },
]

export function TemplateEditor({ fields, onChange, labels }: TemplateEditorProps) {
  const addField = () => {
    onChange([
      ...fields,
      {
        name: "",
        type: "text",
        required: false,
        unit: "",
        label: { de: "", fr: "", en: "" },
      },
    ])
  }

  const removeField = (index: number) => {
    onChange(fields.filter((_, i) => i !== index))
  }

  const updateField = (index: number, updates: Partial<TemplateField>) => {
    onChange(fields.map((f, i) => (i === index ? { ...f, ...updates } : f)))
  }

  const moveField = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= fields.length) return
    const updated = [...fields]
    ;[updated[index], updated[newIndex]] = [updated[newIndex], updated[index]]
    onChange(updated)
  }

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <Card key={index}>
          <CardHeader className="py-3 px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-sm">
                  {labels?.field ?? "Field"} {index + 1}
                  {field.name && `: ${field.name}`}
                </CardTitle>
              </div>
              <div className="flex items-center gap-1">
                <Button size="sm" variant="ghost" onClick={() => moveField(index, -1)} disabled={index === 0}>
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => moveField(index, 1)} disabled={index === fields.length - 1}>
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => removeField(index)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">{labels?.fieldName ?? "Field Name"}</Label>
                <Input
                  value={field.name}
                  onChange={(e) => updateField(index, { name: e.target.value })}
                  placeholder="e.g. time, distance"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">{labels?.fieldType ?? "Type"}</Label>
                <select
                  className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm"
                  value={field.type}
                  onChange={(e) => updateField(index, { type: e.target.value as TemplateField["type"] })}
                >
                  {fieldTypes.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">{labels?.unit ?? "Unit"}</Label>
                <Input
                  value={field.unit ?? ""}
                  onChange={(e) => updateField(index, { unit: e.target.value })}
                  placeholder="e.g. m, s, kg"
                />
              </div>
              <div className="flex items-center gap-2 pt-5">
                <Checkbox
                  checked={field.required}
                  onCheckedChange={(checked) => updateField(index, { required: !!checked })}
                />
                <Label className="text-xs">{labels?.required ?? "Required"}</Label>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">{labels?.labels ?? "Labels (per locale)"}</Label>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  value={field.label.de}
                  onChange={(e) => updateField(index, { label: { ...field.label, de: e.target.value } })}
                  placeholder="DE"
                />
                <Input
                  value={field.label.fr}
                  onChange={(e) => updateField(index, { label: { ...field.label, fr: e.target.value } })}
                  placeholder="FR"
                />
                <Input
                  value={field.label.en}
                  onChange={(e) => updateField(index, { label: { ...field.label, en: e.target.value } })}
                  placeholder="EN"
                />
              </div>
            </div>
            {field.type === "dropdown" && (
              <div className="space-y-1">
                <Label className="text-xs">{labels?.options ?? "Options (comma separated)"}</Label>
                <Input
                  value={field.options?.join(", ") ?? ""}
                  onChange={(e) => updateField(index, { options: e.target.value.split(",").map((o) => o.trim()) })}
                  placeholder="Option 1, Option 2, ..."
                />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      <Button variant="outline" className="w-full" onClick={addField}>
        <Plus className="h-4 w-4 mr-2" />
        {labels?.addField ?? "Add Field"}
      </Button>
    </div>
  )
}
