// components/judge/ResultForm.tsx | Dynamic result creation/edit form
"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Combobox, type ComboboxOption } from "@/components/ui/combobox"
import { Save, Loader2 } from "lucide-react"
import { getSports, getSportEvents, searchAthletes, type SportEventItem, type AthleteSearchItem } from "@/lib/api/results"
import type { SportInfo } from "@/types/api"
import type { CreateResultRequest } from "@/types/judge"

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
  const [eventId, setEventId] = useState(initialData?.eventId ?? "")
  const [athleteId, setAthleteId] = useState(initialData?.athleteId ?? "")
  const [value, setValue] = useState(initialData?.value ?? "")
  const [unit, setUnit] = useState(initialData?.unit ?? "")
  const [rank, setRank] = useState<string>(initialData?.rank?.toString() ?? "")
  const [notes, setNotes] = useState(initialData?.notes ?? "")
  const [sportSpecificFields, setSportSpecificFields] = useState(
    initialData?.sportSpecificFields ?? ""
  )
  const [saving, setSaving] = useState(false)
  const [autoSaved, setAutoSaved] = useState(false)

  // Sport & Event selection
  const [sports, setSports] = useState<SportInfo[]>([])
  const [selectedSportId, setSelectedSportId] = useState("")
  const [events, setEvents] = useState<SportEventItem[]>([])
  const [loadingSports, setLoadingSports] = useState(true)
  const [loadingEvents, setLoadingEvents] = useState(false)

  // Athlete selection
  const [athletes, setAthletes] = useState<AthleteSearchItem[]>([])
  const [loadingAthletes, setLoadingAthletes] = useState(true)

  useEffect(() => {
    getSports()
      .then(setSports)
      .catch(() => {})
      .finally(() => setLoadingSports(false))
    searchAthletes({ limit: 100 })
      .then((res) => setAthletes(res.data))
      .catch(() => {})
      .finally(() => setLoadingAthletes(false))
  }, [])

  useEffect(() => {
    if (!selectedSportId) {
      setEvents([])
      return
    }
    setLoadingEvents(true)
    getSportEvents(selectedSportId)
      .then(setEvents)
      .catch(() => setEvents([]))
      .finally(() => setLoadingEvents(false))
  }, [selectedSportId])

  const sportOptions: ComboboxOption[] = sports.map((s) => ({
    value: s.id,
    label: s.name,
    sublabel: `${s.events} events`,
  }))

  const eventOptions: ComboboxOption[] = events.map((e) => ({
    value: e.id,
    label: e.title,
    sublabel: `${e.location} — ${e.date}`,
  }))

  const athleteOptions: ComboboxOption[] = athletes.map((a) => ({
    value: a.id,
    label: a.name,
    sublabel: a.countryCode + (a.age ? ` · ${a.age} years` : ""),
  }))

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
          {/* Sport selector → Event selector */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{labels.selectSport ?? "Sport"} *</Label>
              <Combobox
                options={sportOptions}
                value={selectedSportId}
                onChange={(v) => {
                  setSelectedSportId(v)
                  setEventId("")
                }}
                placeholder={labels.selectSport ?? "Sport auswählen..."}
                searchPlaceholder="Suchen..."
                loading={loadingSports}
              />
            </div>
            <div className="space-y-2">
              <Label>{labels.selectEvent ?? "Event"} *</Label>
              <Combobox
                options={eventOptions}
                value={eventId}
                onChange={setEventId}
                placeholder={labels.selectEvent ?? "Wettbewerb auswählen..."}
                searchPlaceholder="Suchen..."
                loading={loadingEvents}
                disabled={!selectedSportId}
                emptyText={selectedSportId ? "Keine Wettbewerbe" : "Zuerst Sport wählen"}
              />
            </div>
          </div>

          {/* Athlete selector */}
          <div className="space-y-2">
            <Label>{labels.selectAthlete ?? "Athlet"} *</Label>
            <Combobox
              options={athleteOptions}
              value={athleteId}
              onChange={setAthleteId}
              placeholder={labels.selectAthlete ?? "Athlet auswählen..."}
              searchPlaceholder="Name suchen..."
              loading={loadingAthletes}
              emptyText="Keine Athleten gefunden"
            />
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
