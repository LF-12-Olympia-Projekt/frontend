// components/judge/ResultForm.tsx | Task: FE-003 | Dynamic result creation/edit form
"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, Loader2 } from "lucide-react"
import type { CreateResultRequest } from "@/types/judge"
import { SearchCombobox } from "@/components/judge/SearchCombobox"
import { getAthletes, getSports, getSportEvents } from "@/lib/api/results"
import type { SportInfo, SportEventInfo } from "@/types/api"

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
}

export function ResultForm({
  initialData,
  version,
  onSave,
  onAutoSave,
  labels = {},
  isEdit = false,
}: ResultFormProps) {
  const [sportId, setSportId] = useState("")
  const [eventId, setEventId] = useState(initialData?.eventId ?? "")
  const [athleteId, setAthleteId] = useState(initialData?.athleteId ?? "")
  const [athleteLabel, setAthleteLabel] = useState("")
  const [value, setValue] = useState(initialData?.value ?? "")
  const [unit, setUnit] = useState(initialData?.unit ?? "")
  const [rank, setRank] = useState<string>(initialData?.rank?.toString() ?? "")
  const [notes, setNotes] = useState(initialData?.notes ?? "")
  const [sportSpecificFields, setSportSpecificFields] = useState(
    initialData?.sportSpecificFields ?? ""
  )
  const [saving, setSaving] = useState(false)
  const [autoSaved, setAutoSaved] = useState(false)

  const [sports, setSports] = useState<SportInfo[]>([])
  const [events, setEvents] = useState<SportEventInfo[]>([])
  const [eventsLoading, setEventsLoading] = useState(false)

  useEffect(() => {
    getSports().then(setSports).catch(() => {})
  }, [])

  useEffect(() => {
    if (!sportId) { setEvents([]); setEventId(""); return }
    setEventsLoading(true)
    getSportEvents(sportId)
      .then(setEvents)
      .catch(() => {})
      .finally(() => setEventsLoading(false))
    setEventId("")
  }, [sportId])

  const searchAthletes = useCallback(async (q: string) => {
    const res = await getAthletes({ search: q, limit: 10 })
    return res.data.map(a => ({ id: a.id, label: a.name, sublabel: a.countryCode }))
  }, [])

  const getData = useCallback((): CreateResultRequest => ({
    eventId,
    athleteId,
    value,
    unit,
    rank: rank ? parseInt(rank, 10) : null,
    notes: notes || null,
    sportSpecificFields: sportSpecificFields || null,
  }), [eventId, athleteId, value, unit, rank, notes, sportSpecificFields])

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
          {isEdit ? (
            <p className="text-sm text-muted-foreground">
              {labels.eventAthleteLocked ?? "Event and athlete cannot be changed after creation."}
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="sport">{labels.selectSport ?? "Sport"} *</Label>
                <select
                  id="sport"
                  className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-50"
                  value={sportId}
                  onChange={(e) => setSportId(e.target.value)}
                  required
                >
                  <option value="">{labels.selectSportPlaceholder ?? "— Sport wählen —"}</option>
                  {sports.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventId">{labels.selectEvent ?? "Wettkampf"} *</Label>
                <select
                  id="eventId"
                  className="flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-50"
                  value={eventId}
                  onChange={(e) => setEventId(e.target.value)}
                  disabled={!sportId || eventsLoading}
                  required
                >
                  <option value="">
                    {eventsLoading
                      ? (labels.loading ?? "Laden…")
                      : !sportId
                        ? (labels.selectSportFirst ?? "— erst Sport wählen —")
                        : (labels.selectEventPlaceholder ?? "— Wettkampf wählen —")}
                  </option>
                  {events.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.title} ({e.date})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="athleteId">{labels.selectAthlete ?? "Athlet"} *</Label>
                <SearchCombobox
                  id="athleteId"
                  placeholder={labels.athleteSearch ?? "Name eingeben…"}
                  onSearch={searchAthletes}
                  onSelect={(item) => { setAthleteId(item.id); setAthleteLabel(item.label) }}
                  initialLabel={athleteLabel}
                  required
                />
              </div>
            </div>
          )}
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

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {labels.notes ?? "Additional Information"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sportSpecific">{labels.sportSpecific ?? "Sport-specific Fields"}</Label>
            <Textarea
              id="sportSpecific"
              value={sportSpecificFields}
              onChange={(e) => setSportSpecificFields(e.target.value)}
              placeholder='e.g. {"windSpeed": "1.2m/s"}'
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">{labels.notes ?? "Notes"}</Label>
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
