"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import {
  Target,
  Disc3,
  Snowflake,
  Mountain,
  Car,
  Music2,
  CircleDot,
  Loader2,
} from "lucide-react"
import { useTranslation } from "@/lib/locale-context"
import { getSports } from "@/lib/api/results"
import type { SportInfo } from "@/types/api"

const colorClasses: Record<string, string> = {
  "olympic-blue": "bg-sky-500/10 text-sky-500 group-hover:bg-sky-500 group-hover:text-white",
  "olympic-red": "bg-red-600/10 text-red-600 group-hover:bg-red-600 group-hover:text-white",
  "olympic-yellow": "bg-yellow-400/20 text-yellow-400 group-hover:bg-yellow-400 group-hover:text-foreground",
  "olympic-green": "bg-green-600/10 text-green-600 group-hover:bg-green-600 group-hover:text-white",
  "olympic-black": "bg-muted text-foreground group-hover:bg-foreground group-hover:text-background",
}

function getIconConfig(name: string): { icon: typeof Target; color: string } {
  const lower = name.toLowerCase()
  if (lower.includes("biathlon")) return { icon: Target, color: "olympic-blue" }
  if (lower.includes("eishockey") || lower.includes("hockey")) return { icon: Disc3, color: "olympic-black" }
  if (lower.includes("langlauf") || lower.includes("cross")) return { icon: Snowflake, color: "olympic-green" }
  if (lower.includes("springen") || lower.includes("jump")) return { icon: Mountain, color: "olympic-red" }
  if (lower.includes("bob")) return { icon: Car, color: "olympic-yellow" }
  if (lower.includes("eiskunst") || lower.includes("figure")) return { icon: Music2, color: "olympic-blue" }
  if (lower.includes("curling")) return { icon: CircleDot, color: "olympic-red" }
  return { icon: CircleDot, color: "olympic-blue" }
}

export function SportsGrid() {
  const { dictionary, locale } = useTranslation()
  const t = dictionary.sports || { items: {} }
  const [sports, setSports] = useState<SportInfo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSports()
      .then((data) => setSports(data.slice(0, 7)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <section id="sports" className="flex min-h-screen items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {t.title}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {t.subtitle}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
            {sports.map((sport) => {
              const { icon: Icon, color } = getIconConfig(sport.name)
              return (
                <Link key={sport.id} href={`/${locale}/sports/${sport.id}`}>
                  <Card
                    className="group cursor-pointer border-0 bg-card shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <CardContent className="flex flex-col items-center gap-3 p-6">
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-xl transition-all duration-300 ${colorClasses[color]}`}
                      >
                        <Icon className="h-7 w-7" />
                      </div>
                      <span className="text-center text-sm font-medium leading-tight">
                        {sport.name}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
