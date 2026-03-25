"use client"

import { PageWrapper } from "@/components/page-wrapper"
import { useTranslation } from "@/lib/locale-context"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { SportHero } from "@/components/sport-hero"
import { SportEventsList } from "@/components/sport-events-list"
import { Clipboard, Loader2 } from "lucide-react"
import { notFound, useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { getSportById, getSportEvents, type SportEventItem } from "@/lib/api/results"
import type { SportDetail } from "@/types/api"

const STATUS_MAP: Record<number, string> = {
  0: "scheduled",
  1: "live",
  2: "final",
}

export default function SportDetailPage() {
  const params = useParams()
  const { dictionary, locale } = useTranslation()
  const t = dictionary.sports || {}
  const tDetail = t.detail || {}
  const tEventInfo = tDetail.eventInfo || {}
  const tStatus = tEventInfo.status || {}
  const tCommon = dictionary.common || {}

  const sportId = params.sportId as string

  const [sportData, setSportData] = useState<SportDetail | null>(null)
  const [events, setEvents] = useState<SportEventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [notFoundState, setNotFoundState] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    getSportById(sportId)
      .then((sport) => {
        if (cancelled) return
        setSportData(sport)
        return getSportEvents(sport.id)
      })
      .then((evts) => {
        if (!cancelled && evts) setEvents(evts)
      })
      .catch(() => {
        if (!cancelled) setNotFoundState(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [sportId])

  if (notFoundState) {
    notFound()
  }

  if (loading || !sportData) {
    return (
      <PageWrapper>
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </PageWrapper>
    )
  }

  const mappedEvents = events.map((e) => ({
    id: e.id,
    title: e.title,
    date: e.date,
    time: e.time,
    location: e.location,
    status: (STATUS_MAP[e.status] || "scheduled") as "live" | "final" | "draft" | "scheduled",
  }))

  return (
    <PageWrapper>
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${locale}`}>{tCommon.home || "Home"}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${locale}/sports`}>
                {tDetail.breadcrumb || "Sportarten"}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{sportData.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Hero Section */}
      <SportHero
        sportId={sportId}
        sportName={sportData.name}
        description={sportData.description}
        disciplinesCount={sportData.events}
        medalsCount={sportData.medals}
        disciplinesLabel={tDetail.disciplinesCount || "Disziplinen"}
        medalsLabel={tDetail.medalsCount || "Medaillen"}
      />

      {/* Events Section */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/10">
            <Clipboard className="h-5 w-5 text-sky-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {tDetail.eventsAndResults || "Wettkampfplan & Ergebnisse"}
            </h2>
          </div>
        </div>

        {mappedEvents.length > 0 ? (
          <SportEventsList
            events={mappedEvents}
            locale={locale}
            statusLabels={{
              live: tStatus.live || "Live",
              final: tStatus.final || "Final",
              draft: tStatus.draft || "Entwurf",
              scheduled: tStatus.scheduled || "Geplant",
            }}
            viewResultsLabel={tEventInfo.viewResults || "Ergebnisse"}
          />
        ) : (
          <div className="py-12 text-center text-muted-foreground">
            {tCommon.noResults || "Noch keine Wettbewerbe verfügbar"}
          </div>
        )}
      </div>
    </PageWrapper>
  )
}