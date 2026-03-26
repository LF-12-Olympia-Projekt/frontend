"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, ChevronRight, Play, Loader2 } from "lucide-react"
import { useTranslation } from "@/lib/locale-context"
import { getResults } from "@/lib/api/results"
import type { ResultListItem } from "@/types/api"

const gradientOptions = [
  "from-sky-500 to-sky-500/60",
  "from-red-600 to-red-600/60",
  "from-green-600 to-green-600/60",
  "from-yellow-400 to-yellow-400/60",
]

function normalizeMedal(medal: string | null | undefined): "gold" | "silver" | "bronze" | null {
  if (!medal) return null
  const lower = medal.toLowerCase()
  if (lower === "gold" || lower === "1") return "gold"
  if (lower === "silver" || lower === "2") return "silver"
  if (lower === "bronze" || lower === "3") return "bronze"
  return null
}

const medalConfig = {
  gold: { label: "🥇", className: "bg-yellow-400 text-foreground" },
  silver: { label: "🥈", className: "bg-slate-300 text-foreground" },
  bronze: { label: "🥉", className: "bg-amber-600 text-white" },
}

export function HighlightsSection() {
  const { dictionary, locale } = useTranslation()
  const router = useRouter()
  const t = dictionary.highlights || {}
  const [highlights, setHighlights] = useState<ResultListItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getResults({ pageSize: 20 })
      .then((res) => {
        const withMedals = res.data.filter(
          (r) => normalizeMedal(r.medal) !== null
        )
        setHighlights(withMedals.slice(0, 4))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <section id="highlights" className="flex min-h-screen items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400/20">
              <Sparkles className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{t.title}</h2>
              <p className="text-muted-foreground">{t.subtitle}</p>
            </div>
          </div>
          <Button variant="outline" className="bg-transparent" onClick={() => router.push(`/${locale}/results`)}>
            {t.viewAll}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : highlights.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            {dictionary.common?.noResults || "No highlights available"}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((highlight, index) => {
              const medal = normalizeMedal(highlight.medal)!
              const gradient = gradientOptions[index % gradientOptions.length]
              return (
                <Card
                  key={highlight.id}
                  className="group cursor-pointer overflow-hidden border-0 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className={`relative aspect-[4/3] bg-gradient-to-br ${gradient}`}>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform duration-300 group-hover:scale-110">
                        <Play className="h-6 w-6 fill-current text-foreground" />
                      </div>
                    </div>
                    <div className="absolute right-3 top-3">
                      <Badge className={medalConfig[medal].className}>
                        {medalConfig[medal].label}
                      </Badge>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <Badge variant="secondary" className="bg-white/90 text-foreground backdrop-blur-sm">
                        {highlight.sportName}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold leading-tight">{highlight.athleteName}</h3>
                    <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="rounded bg-muted px-1.5 py-0.5 text-xs font-bold">
                        {highlight.countryCode}
                      </span>
                      <span>{highlight.eventName}</span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}