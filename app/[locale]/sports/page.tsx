"use client"

import { PageWrapper } from "@/components/page-wrapper"
import { useTranslation } from "@/lib/locale-context"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { SportsStatsCards } from "@/components/sports-stats-cards"
import { AllSportsGrid } from "@/components/all-sports-grid"
import { useState } from "react"

export default function SportsPage() {
  const { dictionary, locale } = useTranslation()
  const t = dictionary.sports || {}
  const tOverview = t.overview || {}
  const tItems = t.items || {}
  const tCommon = dictionary.common || {}

  const [searchQuery, setSearchQuery] = useState("")

  // Mock data for all 15 winter sports
  const allSports = [
    { id: "biathlon", name: tItems.biathlon || "Biathlon", events: 11, medals: 33 },
    { id: "bobsled", name: tItems.bobsled || "Bobsport", events: 4, medals: 12 },
    { id: "crossCountrySkiing", name: tItems.crossCountrySkiing || "Skilanglauf", events: 12, medals: 36 },
    { id: "curling", name: tItems.curling || "Curling", events: 3, medals: 9 },
    { id: "figureSkating", name: tItems.figureSkating || "Eiskunstlauf", events: 5, medals: 15 },
    { id: "iceHockey", name: tItems.iceHockey || "Eishockey", events: 2, medals: 6 },
    { id: "luge", name: tItems.luge || "Rennrodeln", events: 4, medals: 12 },
    { id: "nordicCombined", name: tItems.nordicCombined || "Nordische Kombination", events: 3, medals: 9 },
    { id: "shortTrack", name: tItems.shortTrack || "Shorttrack", events: 9, medals: 27 },
    { id: "skeleton", name: tItems.skeleton || "Skeleton", events: 2, medals: 6 },
    { id: "alpineSkiing", name: tItems.alpineSkiing || "Alpiner Skisport", events: 11, medals: 33 },
    { id: "skiJumping", name: tItems.skiJumping || "Skispringen", events: 4, medals: 12 },
    { id: "freestyle", name: tItems.freestyle || "Freestyle-Skiing", events: 13, medals: 39 },
    { id: "snowboard", name: tItems.snowboard || "Snowboard", events: 11, medals: 33 },
    { id: "speedSkating", name: tItems.speedSkating || "Eisschnelllauf", events: 14, medals: 42 },
  ]

  const filteredSports = allSports.filter((sport) =>
    sport.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalEvents = allSports.reduce((sum, sport) => sum + sport.events, 0)
  const totalMedals = allSports.reduce((sum, sport) => sum + sport.medals, 0)

  return (
    <PageWrapper>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${locale}`}>{tCommon.home || "Home"}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{tOverview.title || "Sportarten"}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {tOverview.title || "Sportarten"}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {tOverview.subtitle || "Alle 15 olympischen Wintersportarten"}
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder={tOverview.searchPlaceholder || "Sportart suchen..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-12">
          <SportsStatsCards
            totalSports={15}
            totalEvents={totalEvents}
            totalMedals={totalMedals}
            totalNations={93}
            labels={{
              sports: tOverview.totalSports || "Sportarten",
              events: tOverview.totalEvents || "Wettbewerbe",
              medals: tOverview.totalMedals || "Medaillen",
              nations: tOverview.totalNations || "Nationen",
            }}
          />
        </div>

        {/* Sports Grid */}
        <AllSportsGrid
          sports={filteredSports}
          locale={locale}
          eventsLabel={tOverview.events || "Wettbewerbe"}
          medalsLabel={tOverview.medals || "Medaillen"}
        />

        {/* No results */}
        {filteredSports.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">{tCommon.noResults || "Keine Ergebnisse gefunden"}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {tCommon.tryDifferentSearch || "Versuchen Sie einen anderen Suchbegriff"}
            </p>
          </div>
        )}
      </div>
    </PageWrapper>
  )
}