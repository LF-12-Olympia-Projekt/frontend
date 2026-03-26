"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useTranslation } from "@/lib/locale-context"
import { getSports, getMedalStandings } from "@/lib/api/results"

export function HeroSection() {
  const { dictionary, locale } = useTranslation()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [stats, setStats] = useState({ events: 0, nations: 0, medals: 0 })
  const t = dictionary.hero || {}
  const common = dictionary.common || {}

  useEffect(() => {
    Promise.all([getSports(), getMedalStandings({ limit: 100 })])
      .then(([sports, medalData]) => {
        const totalEvents = sports.reduce((sum, s) => sum + s.events, 0)
        const totalMedals = medalData.data.reduce(
          (sum, s) => sum + s.gold + s.silver + s.bronze,
          0
        )
        setStats({
          events: totalEvents,
          nations: medalData.total,
          medals: totalMedals,
        })
      })
      .catch(() => {})
  }, [])

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/${locale}/results?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
      {/* Decorative Olympic ring pattern */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-5">
        <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full border-[20px] border-sky-500" />
        <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full border-[20px] border-red-600" />
        <div className="absolute -bottom-10 left-1/4 h-60 w-60 rounded-full border-[16px] border-yellow-400" />
        <div className="absolute right-1/4 top-10 h-60 w-60 rounded-full border-[16px] border-green-600" />
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        {/* Headline */}
        <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          {t.headline}
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl">
          {t.subtitle}
        </p>

        {/* Search Bar */}
        <div className="mx-auto mt-8 max-w-xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="h-14 rounded-full pl-12 pr-4 text-base shadow-lg transition-shadow focus:shadow-xl"
            />
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-8">
          <Button
            size="lg"
            className="h-12 rounded-full bg-sky-600 px-8 text-base font-semibold text-white shadow-lg transition-all hover:bg-sky-600/90 hover:shadow-xl"
            onClick={() => router.push(`/${locale}/results`)}
          >
            {t.cta}
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground sm:gap-10">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-foreground">{stats.events || "–"}</span>
            <span>{common.events}</span>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-foreground">{stats.nations || "–"}</span>
            <span>{common.nations}</span>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-foreground">{stats.medals || "–"}</span>
            <span>{common.medals}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
