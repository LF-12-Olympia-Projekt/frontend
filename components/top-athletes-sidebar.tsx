"use client"

import { useMemo } from "react"
import { useTranslation } from "@/lib/locale-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, ChevronRight } from "lucide-react"
import type { ResultListItem } from "@/types/api"

interface TopAthletesSidebarProps {
  countryCode: string
  results: ResultListItem[]
}

interface Athlete {
  name: string
  sport: string
  gold: number
  silver: number
  bronze: number
}

export function TopAthletesSidebar({ countryCode, results }: TopAthletesSidebarProps) {
  const { dictionary } = useTranslation()
  const t = dictionary.nations || {}

  const topAthletes = useMemo(() => {
    const athleteMap = new Map<string, Athlete>()
    results.forEach((r) => {
      if (!r.athleteName || !["gold", "silver", "bronze"].includes(r.medal)) return
      const existing = athleteMap.get(r.athleteName)
      if (existing) {
        if (r.medal === "gold") existing.gold++
        else if (r.medal === "silver") existing.silver++
        else if (r.medal === "bronze") existing.bronze++
      } else {
        athleteMap.set(r.athleteName, {
          name: r.athleteName,
          sport: r.sportName || "",
          gold: r.medal === "gold" ? 1 : 0,
          silver: r.medal === "silver" ? 1 : 0,
          bronze: r.medal === "bronze" ? 1 : 0,
        })
      }
    })
    return Array.from(athleteMap.values())
      .sort((a, b) => {
        const totalA = a.gold * 3 + a.silver * 2 + a.bronze
        const totalB = b.gold * 3 + b.silver * 2 + b.bronze
        return totalB - totalA
      })
      .slice(0, 5)
  }, [results])

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
        {topAthletes.map((athlete, index) => (
          <div
            key={index}
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
        <Button variant="outline" className="w-full gap-2">
          {t.showAllAthletes}
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}