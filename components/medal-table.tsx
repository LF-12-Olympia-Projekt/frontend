"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, ArrowUpDown, ChevronRight } from "lucide-react"
import { useTranslation } from "@/lib/locale-context"

interface CountryMedals {
  rank: number
  country: string
  countryCode: string
  gold: number
  silver: number
  bronze: number
  total: number
}

const mockMedals: CountryMedals[] = [
  { rank: 1, country: "Norwegen", countryCode: "NOR", gold: 16, silver: 8, bronze: 13, total: 37 },
  { rank: 2, country: "Deutschland", countryCode: "GER", gold: 12, silver: 10, bronze: 5, total: 27 },
  { rank: 3, country: "USA", countryCode: "USA", gold: 8, silver: 10, bronze: 7, total: 25 },
  { rank: 4, country: "Kanada", countryCode: "CAN", gold: 7, silver: 6, bronze: 9, total: 22 },
  { rank: 5, country: "Niederlande", countryCode: "NED", gold: 6, silver: 5, bronze: 4, total: 15 },
  { rank: 6, country: "Schweden", countryCode: "SWE", gold: 5, silver: 7, bronze: 8, total: 20 },
  { rank: 7, country: "Schweiz", countryCode: "SUI", gold: 5, silver: 5, bronze: 6, total: 16 },
  { rank: 8, country: "Österreich", countryCode: "AUT", gold: 4, silver: 8, bronze: 6, total: 18 },
  { rank: 9, country: "Frankreich", countryCode: "FRA", gold: 4, silver: 6, bronze: 5, total: 15 },
  { rank: 10, country: "Italien", countryCode: "ITA", gold: 4, silver: 4, bronze: 8, total: 16 },
]

type SortKey = "rank" | "gold" | "silver" | "bronze" | "total"

export function MedalTable() {
  const { dictionary } = useTranslation()
  const [sortBy, setSortBy] = useState<SortKey>("rank")
  const [sortAsc, setSortAsc] = useState(true)
  const t = dictionary.medalTable || {}

  const sortedMedals = [...mockMedals].sort((a, b) => {
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
    <section id="medals" className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
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
                            {country.countryCode}
                          </span>
                          <span className="font-medium">{country.country}</span>
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
            <div className="border-t p-4">
              <Button variant="outline" className="w-full sm:w-auto bg-transparent">
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
