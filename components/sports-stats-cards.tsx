"use client"

import { Trophy, Calendar, Medal, Globe } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface StatsCardProps {
  value: number
  label: string
  color: "blue" | "green" | "yellow" | "red"
  icon: React.ReactNode
}

function StatsCard({ value, label, color, icon }: StatsCardProps) {
  const colorClasses = {
    blue: "text-sky-500",
    green: "text-green-500",
    yellow: "text-yellow-400",
    red: "text-red-500",
  }

  return (
    <Card className="border-0 bg-[#1a1a1a] shadow-lg transition-all duration-300 hover:scale-105">
      <CardContent className="flex flex-col items-center justify-center p-6">
        <div className="mb-2">{icon}</div>
        <div className={`mb-1 text-4xl font-bold ${colorClasses[color]}`}>
          {value}
        </div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </CardContent>
    </Card>
  )
}

interface SportsStatsCardsProps {
  totalSports: number
  totalEvents: number
  totalMedals: number
  totalNations: number
  labels: {
    sports: string
    events: string
    medals: string
    nations: string
  }
}

export function SportsStatsCards({
  totalSports,
  totalEvents,
  totalMedals,
  totalNations,
  labels,
}: SportsStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatsCard
        value={totalSports}
        label={labels.sports}
        color="blue"
        icon={<Calendar className="h-6 w-6 text-sky-500" />}
      />
      <StatsCard
        value={totalEvents}
        label={labels.events}
        color="green"
        icon={<Trophy className="h-6 w-6 text-green-500" />}
      />
      <StatsCard
        value={totalMedals}
        label={labels.medals}
        color="yellow"
        icon={<Medal className="h-6 w-6 text-yellow-400" />}
      />
      <StatsCard
        value={totalNations}
        label={labels.nations}
        color="red"
        icon={<Globe className="h-6 w-6 text-red-500" />}
      />
    </div>
  )
}