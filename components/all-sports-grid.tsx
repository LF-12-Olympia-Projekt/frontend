"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy } from "lucide-react"
import {
    Target,
    Tent,
    Mountain,
    Disc,
    Flame,
    Circle,
    Siren,
    Wind,
    Zap,
    Skull,
    Flag,
    CloudSnow,
    Snowflake,
    Box,
    Gauge,
} from "lucide-react"

interface Sport {
    id: string
    name: string
    events: number
    medals: number
}

interface AllSportsGridProps {
    sports: Sport[]
    locale: string
    eventsLabel: string
    medalsLabel: string
}

const iconMap: Record<string, { icon: React.ComponentType<any>; color: string }> = {
    biathlon: { icon: Target, color: "bg-sky-500/10 text-sky-500" },
    bobsled: { icon: Tent, color: "bg-amber-700/10 text-amber-700" },
    crossCountrySkiing: { icon: Mountain, color: "bg-green-700/10 text-green-700" },
    curling: { icon: Disc, color: "bg-red-700/10 text-red-700" },
    figureSkating: { icon: Flame, color: "bg-sky-500/10 text-sky-500" },
    iceHockey: { icon: Circle, color: "bg-gray-600/10 text-gray-600" },
    luge: { icon: Siren, color: "bg-red-700/10 text-red-700" },
    nordicCombined: { icon: Wind, color: "bg-green-700/10 text-green-700" },
    shortTrack: { icon: Zap, color: "bg-amber-700/10 text-amber-700" },
    skeleton: { icon: Skull, color: "bg-sky-500/10 text-sky-500" },
    alpineSkiing: { icon: Flag, color: "bg-blue-700/10 text-blue-700" },
    skiJumping: { icon: CloudSnow, color: "bg-cyan-600/10 text-cyan-600" },
    freestyle: { icon: Snowflake, color: "bg-purple-600/10 text-purple-600" },
    snowboard: { icon: Box, color: "bg-orange-600/10 text-orange-600" },
    speedSkating: { icon: Gauge, color: "bg-indigo-600/10 text-indigo-600" },
}

// Maps slug-format sport IDs (derived from API names) to iconMap keys
const slugToIconKey: Record<string, string> = {
    "biathlon": "biathlon",
    "bobsled": "bobsled",
    "bobsport": "bobsled",
    "cross-country-skiing": "crossCountrySkiing",
    "skilanglauf": "crossCountrySkiing",
    "curling": "curling",
    "figure-skating": "figureSkating",
    "eiskunstlauf": "figureSkating",
    "ice-hockey": "iceHockey",
    "eishockey": "iceHockey",
    "luge": "luge",
    "rennrodeln": "luge",
    "nordic-combined": "nordicCombined",
    "nordische-kombination": "nordicCombined",
    "short-track": "shortTrack",
    "short-track-speed-skating": "shortTrack",
    "shorttrack": "shortTrack",
    "skeleton": "skeleton",
    "alpine-skiing": "alpineSkiing",
    "alpiner-skisport": "alpineSkiing",
    "ski-jumping": "skiJumping",
    "skispringen": "skiJumping",
    "freestyle": "freestyle",
    "freestyle-skiing": "freestyle",
    "snowboard": "snowboard",
    "speed-skating": "speedSkating",
    "eisschnelllauf": "speedSkating",
}

function getIconForSport(sportId: string) {
    const key = slugToIconKey[sportId] || sportId
    return iconMap[key] ?? iconMap.biathlon
}

export function AllSportsGrid({
                                  sports,
                                  locale,
                                  eventsLabel,
                                  medalsLabel,
                              }: AllSportsGridProps) {
    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sports.map((sport) => {
                const iconConfig = getIconForSport(sport.id)
                const IconComponent = iconConfig.icon

                return (
                    <Link key={sport.id} href={`/${locale}/sports/${sport.id}`}>
                        <Card className="group h-full border bg-background shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-0 dark:bg-[#1a1a1a]">
                            <CardContent className="flex flex-col gap-4 p-6">
                                {/* Icon */}
                                <div
                                    className={`flex h-16 w-16 items-center justify-center rounded-2xl ${iconConfig.color}`}
                                >
                                    <IconComponent className="h-8 w-8" />
                                </div>

                                {/* Sport name */}
                                <div>
                                    <h3 className="mb-1 text-xl font-bold">{sport.name}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {sport.events} {eventsLabel}
                                    </p>
                                </div>

                                {/* Medals */}
                                <div className="flex items-center gap-2 text-sm">
                                    <Trophy className="h-4 w-4 text-yellow-400" />
                                    <span className="font-medium">
                    {sport.medals} {medalsLabel}
                  </span>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                )
            })}
        </div>
    )
}
