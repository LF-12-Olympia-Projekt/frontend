"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, ArrowUpDown, ChevronRight, Loader2 } from "lucide-react"
import { useTranslation } from "@/lib/locale-context"
import { getMedals, type MedalEntry } from "@/lib/api/medals"

type SortKey = "rank" | "gold" | "silver" | "bronze" | "total"

export function MedalTable() {
  const { dictionary, locale } = useTranslation()
  const router = useRouter()
  const [medals, setMedals] = useState<MedalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<SortKey>("rank")
  const [sortAsc, setSortAsc] = useState(true)
  const t = dictionary.medalTable || {}

  useEffect(() => {
    getMedals(undefined, 10, 0)
      .then((res) => setMedals(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const sortedMedals = [...medals].sort((a, b) => {
    const aVal = a[sortBy]
    const bVal = b[sortBy]
    return sortAsc ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1)
  })

  const handleSort = (key: SortKey) => {
    if (sortBy === key) {
      setSortAsc(!sortAsc)
    } else {
      setSortBy(key)
      setSortAsc(key === "rank")
    }
  }

  const SortButton = ({ sortKey, children }: { sortKey: SortKey; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(sortKey)}
      className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
      aria-label={`Sort by ${sortKey}`}
    >
      {children}
      <ArrowUpDown className={`h-3 w-3 ${sortBy === sortKey ? "opacity-100" : "opacity-40"}`} />
    </button>
  )

  return (
    <section id="medals" className="flex min-h-screen items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <Card className="overflow-hidden border-0 shadow-lg">
          <CardHeader className="border-b bg-card">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400/20">
                  <Trophy className="h-5 w-5 text-yellow-400" />
                </div>
                <div>
                  <CardTitle className="text-xl">{t.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{t.subtitle}</p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : medals.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                {dictionary.common?.noResults || "No data available"}
              </div>
            ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50 text-left text-sm font-medium text-muted-foreground">
                    <th className="whitespace-nowrap px-4 py-3 text-center">
                      <SortButton sortKey="rank">{t.rank}</SortButton>
                    </th>
                    <th className="whitespace-nowrap px-4 py-3">{t.country}</th>
                    <th className="whitespace-nowrap px-4 py-3 text-center">
                      <SortButton sortKey="gold">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-yellow-400 text-xs">G</span>
                      </SortButton>
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 text-center">
                      <SortButton sortKey="silver">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-300 text-xs">S</span>
                      </SortButton>
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 text-center">
                      <SortButton sortKey="bronze">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-600 text-xs text-white">B</span>
                      </SortButton>
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 text-center">
                      <SortButton sortKey="total">{t.total}</SortButton>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedMedals.map((country, index) => (
                    <tr
                      key={country.countryCode}
                      className={`border-b transition-colors last:border-0 hover:bg-muted/50 ${
                        index < 3 ? "bg-muted/30" : ""
                      }`}
                    >
                      <td className="px-4 py-4 text-center">
                        <span className={`text-lg font-bold ${index < 3 ? "text-yellow-400" : ""}`}>
                          {country.rank}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <span className="rounded bg-muted px-2 py-1 text-xs font-bold">
                            {country.countryAbbr}
                          </span>
                          <span className="font-medium">{country.countryName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400/20 font-bold">
                          {country.gold}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-300/20 font-bold">
                          {country.silver}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-600/20 font-bold">
                          {country.bronze}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="font-bold">{country.total}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}
            <div className="border-t p-4">
              <Button variant="outline" className="w-full sm:w-auto bg-transparent" onClick={() => router.push(`/${locale}/medaillenspiegel`)}>
                {t.viewAll}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
