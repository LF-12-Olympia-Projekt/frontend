"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
  Target,
  Disc3,
  Snowflake,
  Mountain,
  Car,
  Music2,
  CircleDot,
} from "lucide-react"
import { useTranslation } from "@/lib/locale-context"

const colorClasses: Record<string, string> = {
  "olympic-blue": "bg-sky-500/10 text-sky-500 group-hover:bg-sky-500 group-hover:text-white",
  "olympic-red": "bg-red-600/10 text-red-600 group-hover:bg-red-600 group-hover:text-white",
  "olympic-yellow": "bg-yellow-400/20 text-yellow-400 group-hover:bg-yellow-400 group-hover:text-foreground",
  "olympic-green": "bg-green-600/10 text-green-600 group-hover:bg-green-600 group-hover:text-white",
  "olympic-black": "bg-muted text-foreground group-hover:bg-foreground group-hover:text-background",
}

export function SportsGrid() {
  const { dictionary } = useTranslation()
  const t = dictionary.sports || { items: {} }

  const sportsList = [
    { name: t.items?.biathlon, icon: Target, color: "olympic-blue" },
    { name: t.items?.iceHockey, icon: Disc3, color: "olympic-black" },
    { name: t.items?.crossCountrySkiing, icon: Snowflake, color: "olympic-green" },
    { name: t.items?.skiJumping, icon: Mountain, color: "olympic-red" },
    { name: t.items?.bobsled, icon: Car, color: "olympic-yellow" },
    { name: t.items?.figureSkating, icon: Music2, color: "olympic-blue" },
    { name: t.items?.curling, icon: CircleDot, color: "olympic-red" },
  ]

  return (
    <section id="sports" className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {t.title}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {sportsList.map((sport) => {
            const Icon = sport.icon
            return (
              <Card
                key={sport.name}
                className="group cursor-pointer border-0 bg-card shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <CardContent className="flex flex-col items-center gap-3 p-6">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-xl transition-all duration-300 ${colorClasses[sport.color]}`}
                  >
                    <Icon className="h-7 w-7" />
                  </div>
                  <span className="text-center text-sm font-medium leading-tight">
                    {sport.name}
                  </span>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
