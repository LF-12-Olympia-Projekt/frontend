"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Radio, ArrowRight, Loader2 } from "lucide-react"
import { useTranslation } from "@/lib/locale-context"
import { getResults } from "@/lib/api/results"
import type { ResultListItem } from "@/types/api"

const medalColors: Record<string, string> = {
  gold: "bg-yellow-400 text-foreground",
  silver: "bg-slate-300 text-foreground",
  bronze: "bg-amber-600 text-white",
}

function normalizeMedal(medal: string | null | undefined): "gold" | "silver" | "bronze" | null {
  if (!medal) return null
  const lower = medal.toLowerCase()
  if (lower === "gold" || lower === "1") return "gold"
  if (lower === "silver" || lower === "2") return "silver"
  if (lower === "bronze" || lower === "3") return "bronze"
  return null
}

export function LiveResults() {
  const { dictionary, locale } = useTranslation()
  const router = useRouter()
  const [results, setResults] = useState<ResultListItem[]>([])
  const [loading, setLoading] = useState(true)
  const t = dictionary.liveResults || { status: {} }

  useEffect(() => {
    getResults({ pageSize: 5 })
      .then((res) => setResults(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const statusConfig = {
    live: {
      label: t.status?.live,
      className: "bg-red-600 text-white animate-pulse",
    },
    final: {
      label: t.status?.final,
      className: "bg-green-600 text-white",
    },
    corrected: {
      label: t.status?.corrected,
      className: "bg-yellow-400 text-foreground",
    },
  }

  return (
    <section id="results" className="flex min-h-screen items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <Card className="overflow-hidden border-0 shadow-lg">
          <CardHeader className="border-b bg-card">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600/10">
                  <Radio className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">{t.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{t.subtitle}</p>
                </div>
              </div>
              <Badge className="w-fit animate-pulse bg-red-600 text-white">
                <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-white" />
                {t.status?.live}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50 text-left text-sm font-medium text-muted-foreground">
                    <th className="whitespace-nowrap px-4 py-3 text-center">{t.rank}</th>
                    <th className="whitespace-nowrap px-4 py-3">{t.athlete}</th>
                    <th className="whitespace-nowrap px-4 py-3">{t.country}</th>
                    <th className="whitespace-nowrap px-4 py-3 text-right">{t.result}</th>
                    <th className="whitespace-nowrap px-4 py-3 text-center">{t.medal}</th>
                    <th className="whitespace-nowrap px-4 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center">
                        <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
                      </td>
                    </tr>
                  ) : results.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-muted-foreground">
                        {dictionary.common?.noResults || "No results available"}
                      </td>
                    </tr>
                  ) : (
                    results.map((result, index) => {
                      const medal = normalizeMedal(result.medal)
                      return (
                        <tr
                          key={result.id}
                          className={`border-b transition-colors last:border-0 hover:bg-muted/50 ${
                            index < 3 ? "bg-muted/30" : ""
                          }`}
                        >
                          <td className="px-4 py-4 text-center">
                            <span className="text-lg font-bold">{result.rank ?? index + 1}</span>
                          </td>
                          <td className="px-4 py-4">
                            <span className="font-medium">{result.athleteName}</span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <span className="rounded bg-muted px-1.5 py-0.5 text-xs font-semibold">
                                {result.countryCode}
                              </span>
                              <span className="hidden text-sm text-muted-foreground sm:inline">
                                {result.sportName}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-right font-mono text-sm font-semibold">
                            {result.value} {result.unit}
                          </td>
                          <td className="px-4 py-4 text-center">
                            {medal && (
                              <Badge className={medalColors[medal]}>
                                {medal === "gold" && "🥇"}
                                {medal === "silver" && "🥈"}
                                {medal === "bronze" && "🥉"}
                              </Badge>
                            )}
                          </td>
                          <td className="px-4 py-4 text-center">
                            <Badge className={statusConfig.final.className}>
                              {statusConfig.final.label}
                            </Badge>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
            <div className="border-t p-4">
              <Button variant="outline" className="w-full sm:w-auto bg-transparent" onClick={() => router.push(`/${locale}/results`)}>
                {t.viewAll}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
