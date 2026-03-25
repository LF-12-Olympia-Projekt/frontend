"use client"

import { PageWrapper } from "@/components/page-wrapper"
import { useTranslation } from "@/lib/locale-context"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Input } from "@/components/ui/input"
import { Search, Loader2 } from "lucide-react"
import { SportsStatsCards } from "@/components/sports-stats-cards"
import { AllSportsGrid } from "@/components/all-sports-grid"
import { useState, useEffect, useMemo } from "react"
import { getSports } from "@/lib/api/results"
import type { SportInfo } from "@/types/api"

export default function SportsPage() {
  const { dictionary, locale } = useTranslation()
  const t = dictionary.sports || {}
  const tOverview = t.overview || {}
  const tCommon = dictionary.common || {}

  const [searchQuery, setSearchQuery] = useState("")
  const [allSports, setAllSports] = useState<SportInfo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSports()
      .then(setAllSports)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filteredSports = useMemo(() =>
    allSports.filter((sport) =>
      sport.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [allSports, searchQuery]
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
              {tOverview.subtitle || "Alle olympischen Wintersportarten"}
            </p>
          </div>

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

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="mb-12">
              <SportsStatsCards
                totalSports={allSports.length}
                totalEvents={totalEvents}
                totalMedals={totalMedals}
                totalNations={0}
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

            {filteredSports.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">{tCommon.noResults || "Keine Ergebnisse gefunden"}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {tCommon.tryDifferentSearch || "Versuchen Sie einen anderen Suchbegriff"}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </PageWrapper>
  )
}