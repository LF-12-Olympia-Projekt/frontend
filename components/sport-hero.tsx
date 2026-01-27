"use client"

import { Target, Tent, Mountain, Disc, Flame, Circle, Siren, Wind, Zap, Skull, Flag, CloudSnow, Snowflake, Box, Gauge } from "lucide-react"

interface SportHeroProps {
  sportId: string
  sportName: string
  description: string
  disciplinesCount: number
  medalsCount: number
  disciplinesLabel: string
  medalsLabel: string
}

const iconMap: Record<string, { icon: React.ComponentType<any>; bgColor: string; iconColor: string }> = {
  biathlon: { icon: Target, bgColor: "bg-sky-500/10", iconColor: "text-sky-500" },
  bobsled: { icon: Tent, bgColor: "bg-amber-700/10", iconColor: "text-amber-700" },
  crossCountrySkiing: { icon: Mountain, bgColor: "bg-green-700/10", iconColor: "text-green-700" },
  curling: { icon: Disc, bgColor: "bg-red-700/10", iconColor: "text-red-700" },
  figureSkating: { icon: Flame, bgColor: "bg-sky-500/10", iconColor: "text-sky-500" },
  iceHockey: { icon: Circle, bgColor: "bg-gray-600/10", iconColor: "text-gray-600" },
  luge: { icon: Siren, bgColor: "bg-red-700/10", iconColor: "text-red-700" },
  nordicCombined: { icon: Wind, bgColor: "bg-green-700/10", iconColor: "text-green-700" },
  shortTrack: { icon: Zap, bgColor: "bg-amber-700/10", iconColor: "text-amber-700" },
  skeleton: { icon: Skull, bgColor: "bg-sky-500/10", iconColor: "text-sky-500" },
  alpineSkiing: { icon: Flag, bgColor: "bg-blue-700/10", iconColor: "text-blue-700" },
  skiJumping: { icon: CloudSnow, bgColor: "bg-cyan-600/10", iconColor: "text-cyan-600" },
  freestyle: { icon: Snowflake, bgColor: "bg-purple-600/10", iconColor: "text-purple-600" },
  snowboard: { icon: Box, bgColor: "bg-orange-600/10", iconColor: "text-orange-600" },
  speedSkating: { icon: Gauge, bgColor: "bg-indigo-600/10", iconColor: "text-indigo-600" },
}

export function SportHero({
  sportId,
  sportName,
  description,
  disciplinesCount,
  medalsCount,
  disciplinesLabel,
  medalsLabel,
}: SportHeroProps) {
  const iconConfig = iconMap[sportId] || iconMap.biathlon
  const IconComponent = iconConfig.icon

  return (
    <div className="border-b border-border bg-muted/30 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          {/* Left: Icon and Title */}
          <div className="flex items-center gap-4">
            <div className={`flex h-20 w-20 items-center justify-center rounded-2xl ${iconConfig.bgColor}`}>
              <IconComponent className={`h-10 w-10 ${iconConfig.iconColor}`} />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {sportName}
              </h1>
              <p className="mt-1 text-muted-foreground">{description}</p>
            </div>
          </div>

          {/* Right: Stats */}
          <div className="flex gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold">{disciplinesCount}</div>
              <div className="text-sm text-muted-foreground">{disciplinesLabel}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{medalsCount}</div>
              <div className="text-sm text-muted-foreground">{medalsLabel}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}