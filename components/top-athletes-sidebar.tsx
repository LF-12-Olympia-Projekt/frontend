"use client"

import { useMemo } from "react"
import { useTranslation } from "@/lib/locale-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"
import type { ResultListItem } from "@/types/api"

interface TopAthletesSidebarProps {
  countryCode: string
  results: ResultListItem[]
}

interface AthleteAggregate {
  name: string
  sport: string
  gold: number
  silver: number
  bronze: number
  total: number
}

export function TopAthletesSidebar({ countryCode, results }: TopAthletesSidebarProps) {
  const { dictionary } = useTranslation()
  const t = dictionary.nations || {}

  const topAthletes = useMemo<AthleteAggregate[]>(() => {
    const map = new Map<string, AthleteAggregate>()
    for (const r of results) {
      const medal = r.medal?.toLowerCase()
      if (!medal || medal === "none") continue
      const existing = map.get(r.athleteName) || {
        name: r.athleteName,
        sport: r.sportName,
        gold: 0,
        silver: 0,
        bronze: 0,
        total: 0,
      }
      if (medal === "gold") existing.gold++
      else if (medal === "silver") existing.silver++
      else if (medal === "bronze") existing.bronze++
      existing.total = existing.gold + existing.silver + existing.bronze
      map.set(r.athleteName, existing)
    }
    return [...map.values()]
      .sort((a, b) => b.gold - a.gold || b.total - a.total)
      .slice(0, 5)
  }, [results])

  if (topAthletes.length === 0) return null

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/10">
            <Star className="h-5 w-5 text-yellow-500" />
          </div>
          <CardTitle className="text-xl font-bold">{t.topAthletes}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {topAthletes.map((athlete) => (
          <div
            key={athlete.name}
            className="group cursor-pointer rounded-lg border border-transparent bg-muted/30 p-3 transition-all hover:border-sky-500/30 hover:bg-muted/50"
          >
            <div className="mb-1 font-medium">{athlete.name}</div>
            <div className="mb-2 text-sm text-sky-500">{athlete.sport}</div>
            <div className="flex gap-2">
              {athlete.gold > 0 && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400/20 text-xs font-bold text-yellow-400">
                  {athlete.gold}
                </div>
              )}
              {athlete.silver > 0 && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-400/20 text-xs font-bold text-gray-300">
                  {athlete.silver}
                </div>
              )}
              {athlete.bronze > 0 && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-400/20 text-xs font-bold text-orange-400">
                  {athlete.bronze}
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}