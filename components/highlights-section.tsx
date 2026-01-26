"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, ChevronRight, Play } from "lucide-react"
import { useTranslation } from "@/lib/locale-context"

interface Highlight {
  id: number
  athlete: string
  country: string
  countryCode: string
  sport: string
  event: string
  medal: "gold" | "silver" | "bronze"
  imageGradient: string
}

const mockHighlights: Highlight[] = [
  {
    id: 1,
    athlete: "Johannes Thingnes Bø",
    country: "Norwegen",
    countryCode: "NOR",
    sport: "Biathlon",
    event: "10km Sprint",
    medal: "gold",
    imageGradient: "from-sky-500 to-sky-500/60",
  },
  {
    id: 2,
    athlete: "Natalie Geisenberger",
    country: "Deutschland",
    countryCode: "GER",
    sport: "Rodeln",
    event: "Einsitzer Damen",
    medal: "gold",
    imageGradient: "from-red-600 to-red-600/60",
  },
  {
    id: 3,
    athlete: "Mikaela Shiffrin",
    country: "USA",
    countryCode: "USA",
    sport: "Ski Alpin",
    event: "Slalom",
    medal: "silver",
    imageGradient: "from-green-600 to-green-600/60",
  },
  {
    id: 4,
    athlete: "Yuzuru Hanyu",
    country: "Japan",
    countryCode: "JPN",
    sport: "Eiskunstlauf",
    event: "Herren Kür",
    medal: "bronze",
    imageGradient: "from-yellow-400 to-yellow-400/60",
  },
]

const medalConfig = {
  gold: { label: "🥇", className: "bg-yellow-400 text-foreground" },
  silver: { label: "🥈", className: "bg-slate-300 text-foreground" },
  bronze: { label: "🥉", className: "bg-amber-600 text-white" },
}

export function HighlightsSection() {
  const { dictionary } = useTranslation()
  const t = dictionary.highlights || {}

  return (
    <section id="highlights" className="flex min-h-screen items-center justify-center bg-muted/50 px-4 py-16 sm:px-6 lg:px-8">
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
          <Button variant="outline" className="bg-transparent">
            {t.viewAll}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {mockHighlights.map((highlight) => (
            <Card
              key={highlight.id}
              className="group cursor-pointer overflow-hidden border-0 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Image placeholder with gradient */}
              <div className={`relative aspect-[4/3] bg-gradient-to-br ${highlight.imageGradient}`}>
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform duration-300 group-hover:scale-110">
                    <Play className="h-6 w-6 fill-current text-foreground" />
                  </div>
                </div>
                {/* Medal badge */}
                <div className="absolute right-3 top-3">
                  <Badge className={medalConfig[highlight.medal].className}>
                    {medalConfig[highlight.medal].label}
                  </Badge>
                </div>
                {/* Sport/Event label */}
                <div className="absolute bottom-3 left-3">
                  <Badge variant="secondary" className="bg-white/90 text-foreground backdrop-blur-sm">
                    {highlight.sport}
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold leading-tight">{highlight.athlete}</h3>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="rounded bg-muted px-1.5 py-0.5 text-xs font-bold">
                    {highlight.countryCode}
                  </span>
                  <span>{highlight.event}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}