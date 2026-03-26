"use client"

import { useState, useEffect } from "react"
import { PageWrapper } from "@/components/page-wrapper"
import { useTranslation } from "@/lib/locale-context"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { SportHero } from "@/components/sport-hero"
import { SportEventsList } from "@/components/sport-events-list"
import { Clipboard, Loader2 } from "lucide-react"
import { notFound, useParams } from "next/navigation"
import { getSportBySlug, getSportEvents } from "@/lib/api/results"
import type { SportDetail, SportEventInfo } from "@/types/api"

function mapEventStatus(status: number): "live" | "final" | "draft" | "scheduled" {
  switch (status) {
    case 0: return "draft"
    case 1: return "scheduled"
    case 2: return "final"
    case 3: return "live"
    default: return "scheduled"
  }
}

export default function SportDetailPage() {
  const params = useParams()
  const { dictionary, locale } = useTranslation()
  const t = dictionary.sports || {}
  const tDetail = t.detail || {}
  const tEventInfo = tDetail.eventInfo || {}
  const tStatus = tEventInfo.status || {}
  const tCommon = dictionary.common || {}

  const sportSlug = params.sportId as string

  const [sport, setSport] = useState<SportDetail | null>(null)
  const [events, setEvents] = useState<SportEventInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [notFoundState, setNotFoundState] = useState(false)

  useEffect(() => {
    setLoading(true)
    getSportBySlug(sportSlug)
      .then((data) => {
        setSport(data)
        return getSportEvents(data.id)
      })
      .then((evts) => setEvents(evts))
      .catch(() => setNotFoundState(true))
      .finally(() => setLoading(false))
  }, [sportSlug])

  if (notFoundState) {
    notFound()
  }

  if (loading || !sport) {
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
    status: mapEventStatus(e.status),
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
              <BreadcrumbPage>{sport.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Hero Section */}
      <SportHero
        sportId={sportSlug}
        sportName={sport.name}
        description={sport.description}
        disciplinesCount={sport.events}
        medalsCount={sport.medals}
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
      </div>
    </PageWrapper>
  )
}