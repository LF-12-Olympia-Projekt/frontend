"use client"

import { Calendar, Clock, MapPin, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface SportEvent {
  id: string
  title: string
  date: string
  time: string
  location: string
  status: "live" | "final" | "draft" | "scheduled"
}

interface SportEventsListProps {
  events: SportEvent[]
  locale: string
  statusLabels: {
    live: string
    final: string
    draft: string
    scheduled: string
  }
  viewResultsLabel: string
}

export function SportEventsList({ events, locale, statusLabels, viewResultsLabel }: SportEventsListProps) {
  const getStatusBadge = (status: SportEvent["status"]) => {
    const statusConfig = {
      live: { variant: "default" as const, className: "bg-red-500 hover:bg-red-600" },
      final: { variant: "default" as const, className: "bg-green-500 hover:bg-green-600" },
      draft: { variant: "secondary" as const, className: "" },
      scheduled: { variant: "outline" as const, className: "" },
    }

    const config = statusConfig[status]
    return (
      <Badge variant={config.variant} className={config.className}>
        {statusLabels[status]}
      </Badge>
    )
  }

  const canViewResults = (status: SportEvent["status"]) => {
    return status === "live" || status === "final"
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div
          key={event.id}
          className="flex flex-col gap-4 rounded-lg border border-border bg-[#1a1a1a] p-6 transition-colors hover:bg-[#222222] sm:flex-row sm:items-center sm:justify-between"
        >
          {/* Left: Event Info */}
          <div className="flex-1">
            <h3 className="mb-3 text-lg font-bold">{event.title}</h3>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
              </div>
            </div>
          </div>

          {/* Right: Status and Action */}
          <div className="flex items-center gap-3">
            {getStatusBadge(event.status)}
            {canViewResults(event.status) && (
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/${locale}/results/${event.id}`} className="flex items-center gap-1">
                  {viewResultsLabel}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}