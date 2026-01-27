"use client"

import { useTranslation } from "@/lib/locale-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"

interface MedalTimelineSidebarProps {
  countryCode: string
}

interface TimelineEvent {
  date: string
  sport: string
  medal: "gold" | "silver" | "bronze"
}

export function MedalTimelineSidebar({ countryCode }: MedalTimelineSidebarProps) {
  const { dictionary } = useTranslation()
  const t = dictionary.nations || {}

  // Mock data - in real app this would come from API
  const timelineEvents: TimelineEvent[] = [
    { date: "07. Feb.", sport: "Biathlon", medal: "gold" },
    { date: "07. Feb.", sport: "Skispringen", medal: "gold" },
    { date: "08. Feb.", sport: "Skilanglauf", medal: "gold" },
    { date: "09. Feb.", sport: "Biathlon", medal: "silver" },
    { date: "09. Feb.", sport: "Skilanglauf", medal: "bronze" },
    { date: "15. Feb.", sport: "Skispringen", medal: "bronze" },
    { date: "16. Feb.", sport: "Skilanglauf", medal: "bronze" },
    { date: "18. Feb.", sport: "Biathlon", medal: "gold" },
    { date: "23. Feb.", sport: "Skilanglauf", medal: "gold" }
  ]

  const getMedalColor = (medal: string) => {
    switch (medal) {
      case "gold":
        return "bg-yellow-400"
      case "silver":
        return "bg-gray-300"
      case "bronze":
        return "bg-orange-400"
      default:
        return "bg-gray-400"
    }
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/10">
            <Calendar className="h-5 w-5 text-sky-500" />
          </div>
          <CardTitle className="text-xl font-bold">{t.medalTimeline}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {timelineEvents.map((event, index) => (
            <div key={index} className="flex items-start gap-3">
              <Badge variant="outline" className="shrink-0 font-normal">
                {event.date}
              </Badge>
              <div className={`mt-1 h-3 w-3 shrink-0 rounded-full ${getMedalColor(event.medal)}`} />
              <div className="min-w-0 flex-1 text-sm">{event.sport}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}