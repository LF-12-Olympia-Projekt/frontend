"use client"

import { useMemo } from "react"
import { useTranslation } from "@/lib/locale-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"
import type { ResultListItem } from "@/types/api"

interface MedalTimelineSidebarProps {
  countryCode: string
  results: ResultListItem[]
}

export function MedalTimelineSidebar({ countryCode, results }: MedalTimelineSidebarProps) {
  const { dictionary } = useTranslation()
  const t = dictionary.nations || {}

  const timelineEvents = useMemo(() => {
    return results
      .filter(r => r.medal && r.medal.toLowerCase() !== "none")
      .sort((a, b) => {
        const da = a.lastModifiedAt ? new Date(a.lastModifiedAt).getTime() : 0
        const db = b.lastModifiedAt ? new Date(b.lastModifiedAt).getTime() : 0
        return da - db
      })
      .map(r => ({
        date: r.lastModifiedAt
          ? new Date(r.lastModifiedAt).toLocaleDateString("de-DE", { day: "2-digit", month: "short" })
          : "—",
        sport: r.sportName,
        medal: r.medal.toLowerCase() as "gold" | "silver" | "bronze",
      }))
  }, [results])

  const getMedalColor = (medal: string) => {
    switch (medal) {
      case "gold": return "bg-yellow-400"
      case "silver": return "bg-gray-300"
      case "bronze": return "bg-orange-400"
      default: return "bg-gray-400"
    }
  }

  if (timelineEvents.length === 0) return null

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/10">
            <Calendar className="h-5 w-5 text-sky-500" />
          </div>
          <CardTitle className="text-xl font-bold">{t.medalTimeline}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {timelineEvents.map((event, index) => (
            <div key={index} className="flex items-start gap-3">
              <Badge variant="outline" className="shrink-0 font-normal">
                {event.date}
              </Badge>
              <div className={`mt-1 h-3 w-3 shrink-0 rounded-full ${getMedalColor(event.medal)}`} />
              <div className="min-w-0 flex-1 text-sm">{event.sport}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}