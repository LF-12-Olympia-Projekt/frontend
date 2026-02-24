// components/judge/ResultForm.tsx | Task: FINAL-002 | Template-driven dynamic result form
"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, Loader2 } from "lucide-react"
import type { CreateResultRequest } from "@/types/judge"

export interface TemplateFormField {
  name: string
  type: "text" | "number" | "time" | "dropdown" | string
  required?: boolean
  unit?: string
  label?: string
  options?: string[]
}

interface ResultFormProps {
  initialData?: {
    eventId?: string
    athleteId?: string
    value?: string
    unit?: string
    rank?: number | null
    notes?: string | null
    sportSpecificFields?: string | null
  }
  version?: number
  onSave: (data: CreateResultRequest) => Promise<void>
  onAutoSave?: (data: CreateResultRequest) => void
  labels?: Record<string, string>
  isEdit?: boolean
  templateFields?: TemplateFormField[]
}

export function ResultForm({
  initialData,
  version,
  onSave,
  onAutoSave,
  labels = {},
  isEdit = false,
  templateFields,
}: ResultFormProps) {
  const [eventId, setEventId] = useState(initialData?.eventId ?? "")
  const [athleteId, setAthleteId] = useState(initialData?.athleteId ?? "")
  const [value, setValue] = useState(initialData?.value ?? "")
  const [unit, setUnit] = useState(initialData?.unit ?? "")
  const [rank, setRank] = useState<string>(initialData?.rank?.toString() ?? "")
  const [notes, setNotes] = useState(initialData?.notes ?? "")
  const [saving, setSaving] = useState(false)
  const [autoSaved, setAutoSaved] = useState(false)

  // Dynamic template field values
  const [dynamicFields, setDynamicFields] = useState<Record<string, string>>(() => {
    try {
      const parsed = initialData?.sportSpecificFields
        ? JSON.parse(initialData.sportSpecificFields)
        : {}
      return parsed
    } catch {
      return {}
    }
  })

  const setDynamicField = useCallback((name: string, val: string) => {
    setDynamicFields((prev) => ({ ...prev, [name]: val }))
  }, [])

  const getData = useCallback((): CreateResultRequest => ({
    eventId,
    athleteId,
    value,
    unit,
    rank: rank ? parseInt(rank, 10) : null,
    notes: notes || null,
    sportSpecificFields: Object.keys(dynamicFields).length > 0
      ? JSON.stringify(dynamicFields)
      : null,
  }), [eventId, athleteId, value, unit, rank, notes, dynamicFields])

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!onAutoSave) return
    const interval = setInterval(() => {
      if (value && eventId && athleteId) {
        onAutoSave(getData())
        setAutoSaved(true)
        setTimeout(() => setAutoSaved(false), 2000)
      }
    }, 30000)
    return () => clearInterval(interval)
  }, [onAutoSave, getData, value, eventId, athleteId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!eventId || !athleteId || !value || !unit) return
    // Validate required template fields
    if (templateFields) {
      for (const f of templateFields) {
        if (f.required && !dynamicFields[f.name]) return
      }
    }
    setSaving(true)
    try {
      await onSave(getData())
    } finally {
      setSaving(false)
    }
  }

  const isValid = eventId && athleteId && value && unit

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {labels.selectEvent ?? "Event & Athlete"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="eventId">{labels.selectEvent ?? "Event ID"} *</Label>
              <Input
                id="eventId"
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                placeholder={labels.selectEvent ?? "Enter Event ID"}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="athleteId">{labels.selectAthlete ?? "Athlete ID"} *</Label>
              <Input
                id="athleteId"
                value={athleteId}
                onChange={(e) => setAthleteId(e.target.value)}
                placeholder={labels.selectAthlete ?? "Enter Athlete ID"}
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {labels.enterValue ?? "Result Values"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="value">{labels.enterValue ?? "Value"} *</Label>
              <Input
                id="value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="e.g. 9.58"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">{labels.enterUnit ?? "Unit"} *</Label>
              <Input
                id="unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g. seconds"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rank">{labels.enterRank ?? "Rank"}</Label>
              <Input
                id="rank"
                type="number"
                min="1"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                placeholder="e.g. 1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Template-driven dynamic fields */}
      {templateFields && templateFields.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {labels.sportSpecific ?? "Sport-Specific Fields"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {templateFields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={`tf-${field.name}`}>
                    {field.label ?? field.name}
                    {field.unit ? ` (${field.unit})` : ""}
                    {field.required ? " *" : ""}
                  </Label>
                  {field.type === "dropdown" && field.options ? (
                    <select
                      id={`tf-${field.name}`}
                      value={dynamicFields[field.name] ?? ""}
                      onChange={(e) => setDynamicField(field.name, e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      required={field.required}
                    >
                      <option value="">--</option>
                      {field.options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      id={`tf-${field.name}`}
                      type={field.type === "number" ? "number" : field.type === "time" ? "time" : "text"}
                      value={dynamicFields[field.name] ?? ""}
                      onChange={(e) => setDynamicField(field.name, e.target.value)}
                      required={field.required}
                    />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fallback: raw JSON field when no template is loaded */}
      {(!templateFields || templateFields.length === 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {labels.notes ?? "Additional Information"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sportSpecific">{labels.sportSpecific ?? "Sport-specific Fields (JSON)"}</Label>
              <Textarea
                id="sportSpecific"
                value={dynamicFields ? JSON.stringify(dynamicFields) : ""}
                onChange={(e) => {
                  try {
                    setDynamicFields(JSON.parse(e.target.value))
                  } catch {
                    // Let user keep typing
                  }
                }}
                placeholder='e.g. {"windSpeed": "1.2m/s"}'
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {labels.notes ?? "Notes"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notes">{labels.notes ?? "Internal Notes"}</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={labels.notes ?? "Internal notes..."}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {autoSaved && (
            <span className="text-green-600">{labels.autoSaved ?? "Auto-saved"} ✓</span>
          )}
          {version != null && (
            <span className="ml-4">Version: {version}</span>
          )}
        </div>
        <Button type="submit" disabled={!isValid || saving}>
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {labels.saveDraft ?? "Save Draft"}
        </Button>
      </div>
    </form>
  )
}
