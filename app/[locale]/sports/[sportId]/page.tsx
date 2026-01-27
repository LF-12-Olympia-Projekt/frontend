"use client"

import { PageWrapper } from "@/components/page-wrapper"
import { useTranslation } from "@/lib/locale-context"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { SportHero } from "@/components/sport-hero"
import { SportEventsList } from "@/components/sport-events-list"
import { Clipboard } from "lucide-react"
import { notFound, useParams } from "next/navigation"

export default function SportDetailPage() {
  const params = useParams()
  const { dictionary, locale } = useTranslation()
  const t = dictionary.sports || {}
  const tItems = t.items || {}
  const tDetail = t.detail || {}
  const tDescriptions = tDetail.description || {}
  const tEventInfo = tDetail.eventInfo || {}
  const tStatus = tEventInfo.status || {}
  const tCommon = dictionary.common || {}

  const sportId = params.sportId as string

  // Mock data for sports
  const sportsData: Record<string, { name: string; description: string; events: number; medals: number; mockEvents: any[] }> = {
    biathlon: {
      name: tItems.biathlon || "Biathlon",
      description: tDescriptions.biathlon || "Kombination aus Skilanglauf und Schießen",
      events: 11,
      medals: 33,
      mockEvents: [
        { id: "1", title: "10km Sprint Herren", date: "07. Feb. 2026", time: "14:00 Uhr", location: "Anterselva", status: "final" as const },
        { id: "2", title: "10km Sprint Damen", date: "08. Feb. 2026", time: "14:00 Uhr", location: "Anterselva", status: "final" as const },
        { id: "3", title: "20km Einzel Herren", date: "10. Feb. 2026", time: "10:00 Uhr", location: "Anterselva", status: "live" as const },
        { id: "4", title: "15km Einzel Damen", date: "11. Feb. 2026", time: "10:00 Uhr", location: "Anterselva", status: "draft" as const },
        { id: "5", title: "4x7.5km Staffel Herren", date: "14. Feb. 2026", time: "14:00 Uhr", location: "Anterselva", status: "draft" as const },
      ],
    },
    bobsled: {
      name: tItems.bobsled || "Bobsport",
      description: tDescriptions.bobsled || "Geschwindigkeit auf Eis",
      events: 4,
      medals: 12,
      mockEvents: [
        { id: "1", title: "Zweier Herren", date: "12. Feb. 2026", time: "10:00 Uhr", location: "Cortina", status: "final" as const },
        { id: "2", title: "Zweier Damen", date: "13. Feb. 2026", time: "10:00 Uhr", location: "Cortina", status: "scheduled" as const },
        { id: "3", title: "Vierer Herren", date: "20. Feb. 2026", time: "10:00 Uhr", location: "Cortina", status: "draft" as const },
        { id: "4", title: "Monobob Damen", date: "21. Feb. 2026", time: "10:00 Uhr", location: "Cortina", status: "draft" as const },
      ],
    },
    crossCountrySkiing: {
      name: tItems.crossCountrySkiing || "Skilanglauf",
      description: tDescriptions.crossCountrySkiing || "Ausdauer im Schnee",
      events: 12,
      medals: 36,
      mockEvents: [
        { id: "1", title: "Skiathlon 15+15km Damen", date: "08. Feb. 2026", time: "09:00 Uhr", location: "Tesero", status: "final" as const },
        { id: "2", title: "Skiathlon 30+30km Herren", date: "09. Feb. 2026", time: "09:00 Uhr", location: "Tesero", status: "live" as const },
        { id: "3", title: "Sprint Freistil Damen", date: "11. Feb. 2026", time: "12:00 Uhr", location: "Tesero", status: "scheduled" as const },
      ],
    },
    curling: {
      name: tItems.curling || "Curling",
      description: tDescriptions.curling || "Präzision auf dem Eis",
      events: 3,
      medals: 9,
      mockEvents: [
        { id: "1", title: "Doppel Mixed", date: "06. Feb. 2026", time: "10:00 Uhr", location: "Milano", status: "final" as const },
        { id: "2", title: "Herren Team", date: "14. Feb. 2026", time: "10:00 Uhr", location: "Milano", status: "live" as const },
        { id: "3", title: "Damen Team", date: "16. Feb. 2026", time: "10:00 Uhr", location: "Milano", status: "scheduled" as const },
      ],
    },
    figureSkating: {
      name: tItems.figureSkating || "Eiskunstlauf",
      description: tDescriptions.figureSkating || "Kunst und Athletik",
      events: 5,
      medals: 15,
      mockEvents: [
        { id: "1", title: "Team Event", date: "07. Feb. 2026", time: "18:00 Uhr", location: "Milano", status: "final" as const },
        { id: "2", title: "Einzellauf Herren", date: "11. Feb. 2026", time: "18:00 Uhr", location: "Milano", status: "scheduled" as const },
        { id: "3", title: "Einzellauf Damen", date: "13. Feb. 2026", time: "18:00 Uhr", location: "Milano", status: "draft" as const },
      ],
    },
    iceHockey: {
      name: tItems.iceHockey || "Eishockey",
      description: tDescriptions.iceHockey || "Schnelligkeit und Teamwork",
      events: 2,
      medals: 6,
      mockEvents: [
        { id: "1", title: "Herren Turnier", date: "06. Feb. 2026", time: "12:00 Uhr", location: "Milano", status: "live" as const },
        { id: "2", title: "Damen Turnier", date: "06. Feb. 2026", time: "12:00 Uhr", location: "Milano", status: "live" as const },
      ],
    },
    luge: {
      name: tItems.luge || "Rennrodeln",
      description: tDescriptions.luge || "Rasant auf Kufen",
      events: 4,
      medals: 12,
      mockEvents: [
        { id: "1", title: "Einsitzer Herren", date: "08. Feb. 2026", time: "10:00 Uhr", location: "Cortina", status: "final" as const },
        { id: "2", title: "Einsitzer Damen", date: "09. Feb. 2026", time: "10:00 Uhr", location: "Cortina", status: "scheduled" as const },
        { id: "3", title: "Doppelsitzer", date: "10. Feb. 2026", time: "10:00 Uhr", location: "Cortina", status: "draft" as const },
        { id: "4", title: "Team Staffel", date: "11. Feb. 2026", time: "10:00 Uhr", location: "Cortina", status: "draft" as const },
      ],
    },
    nordicCombined: {
      name: tItems.nordicCombined || "Nordische Kombination",
      description: tDescriptions.nordicCombined || "Springen und Langlauf",
      events: 3,
      medals: 9,
      mockEvents: [
        { id: "1", title: "Einzel Normal Herren", date: "12. Feb. 2026", time: "10:00 Uhr", location: "Val di Fiemme", status: "final" as const },
        { id: "2", title: "Einzel Groß Herren", date: "14. Feb. 2026", time: "10:00 Uhr", location: "Val di Fiemme", status: "scheduled" as const },
        { id: "3", title: "Team Herren", date: "17. Feb. 2026", time: "10:00 Uhr", location: "Val di Fiemme", status: "draft" as const },
      ],
    },
    shortTrack: {
      name: tItems.shortTrack || "Shorttrack",
      description: tDescriptions.shortTrack || "Geschwindigkeit auf kurzer Bahn",
      events: 9,
      medals: 27,
      mockEvents: [
        { id: "1", title: "500m Herren", date: "10. Feb. 2026", time: "19:00 Uhr", location: "Milano", status: "final" as const },
        { id: "2", title: "500m Damen", date: "11. Feb. 2026", time: "19:00 Uhr", location: "Milano", status: "live" as const },
        { id: "3", title: "1000m Herren", date: "13. Feb. 2026", time: "19:00 Uhr", location: "Milano", status: "scheduled" as const },
      ],
    },
    skeleton: {
      name: tItems.skeleton || "Skeleton",
      description: tDescriptions.skeleton || "Kopfüber ins Ziel",
      events: 2,
      medals: 6,
      mockEvents: [
        { id: "1", title: "Herren", date: "13. Feb. 2026", time: "10:00 Uhr", location: "Cortina", status: "final" as const },
        { id: "2", title: "Damen", date: "14. Feb. 2026", time: "10:00 Uhr", location: "Cortina", status: "scheduled" as const },
      ],
    },
    alpineSkiing: {
      name: tItems.alpineSkiing || "Alpiner Skisport",
      description: tDescriptions.alpineSkiing || "Geschwindigkeit am Berg",
      events: 11,
      medals: 33,
      mockEvents: [
        { id: "1", title: "Abfahrt Herren", date: "09. Feb. 2026", time: "11:30 Uhr", location: "Bormio", status: "final" as const },
        { id: "2", title: "Abfahrt Damen", date: "15. Feb. 2026", time: "11:00 Uhr", location: "Cortina", status: "live" as const },
        { id: "3", title: "Slalom Herren", date: "19. Feb. 2026", time: "10:00 Uhr", location: "Bormio", status: "scheduled" as const },
      ],
    },
    skiJumping: {
      name: tItems.skiJumping || "Skispringen",
      description: tDescriptions.skiJumping || "Fliegen durch die Luft",
      events: 4,
      medals: 12,
      mockEvents: [
        { id: "1", title: "Normal Herren", date: "08. Feb. 2026", time: "17:00 Uhr", location: "Val di Fiemme", status: "final" as const },
        { id: "2", title: "Groß Herren", date: "15. Feb. 2026", time: "17:00 Uhr", location: "Val di Fiemme", status: "scheduled" as const },
        { id: "3", title: "Team Herren", date: "17. Feb. 2026", time: "17:00 Uhr", location: "Val di Fiemme", status: "draft" as const },
      ],
    },
    freestyle: {
      name: tItems.freestyle || "Freestyle-Skiing",
      description: tDescriptions.freestyle || "Tricks und Stunts",
      events: 13,
      medals: 39,
      mockEvents: [
        { id: "1", title: "Moguls Herren", date: "08. Feb. 2026", time: "18:00 Uhr", location: "Livigno", status: "final" as const },
        { id: "2", title: "Moguls Damen", date: "09. Feb. 2026", time: "18:00 Uhr", location: "Livigno", status: "live" as const },
        { id: "3", title: "Aerials Herren", date: "12. Feb. 2026", time: "19:00 Uhr", location: "Livigno", status: "scheduled" as const },
      ],
    },
    snowboard: {
      name: tItems.snowboard || "Snowboard",
      description: tDescriptions.snowboard || "Style auf dem Board",
      events: 11,
      medals: 33,
      mockEvents: [
        { id: "1", title: "Halfpipe Herren", date: "11. Feb. 2026", time: "12:00 Uhr", location: "Livigno", status: "final" as const },
        { id: "2", title: "Halfpipe Damen", date: "12. Feb. 2026", time: "12:00 Uhr", location: "Livigno", status: "scheduled" as const },
        { id: "3", title: "Slopestyle Herren", date: "15. Feb. 2026", time: "10:00 Uhr", location: "Livigno", status: "draft" as const },
      ],
    },
    speedSkating: {
      name: tItems.speedSkating || "Eisschnelllauf",
      description: tDescriptions.speedSkating || "Tempo auf der langen Bahn",
      events: 14,
      medals: 42,
      mockEvents: [
        { id: "1", title: "500m Herren", date: "08. Feb. 2026", time: "14:00 Uhr", location: "Milano", status: "final" as const },
        { id: "2", title: "500m Damen", date: "09. Feb. 2026", time: "14:00 Uhr", location: "Milano", status: "live" as const },
        { id: "3", title: "1000m Herren", date: "11. Feb. 2026", time: "15:00 Uhr", location: "Milano", status: "scheduled" as const },
      ],
    },
  }

  const sportData = sportsData[sportId]

  if (!sportData) {
    notFound()
  }

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
        {/* Section Header */}
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

        {/* Events List */}
        <SportEventsList
          events={sportData.mockEvents}
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