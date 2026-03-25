"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { useTranslation } from "@/lib/locale-context"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Trophy, Medal, ArrowUpDown, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getMedals, type MedalEntry } from "@/lib/api/medals"

export function NationsGrid() {
  const { dictionary, locale } = useTranslation()
  const t = dictionary.nations?.overview || {}
  const medalTable = dictionary.medalTable || {}
  
  const [countries, setCountries] = useState<MedalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterMedals, setFilterMedals] = useState<"all" | "withMedals">("all")
  const [sortBy, setSortBy] = useState<"name" | "medals">("medals")

  useEffect(() => {
    getMedals(undefined, 200, 0)
      .then((res) => setCountries(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filteredCountries = useMemo(() => {
    let filtered = countries

    if (searchQuery) {
      filtered = filtered.filter(country => 
        country.countryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        country.countryCode.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (filterMedals === "withMedals") {
      filtered = filtered.filter(country => country.total > 0)
    }

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "medals") {
        if (b.total !== a.total) return b.total - a.total
        return a.countryName.localeCompare(b.countryName)
      } else {
        return a.countryName.localeCompare(b.countryName)
      }
    })

    return sorted
  }, [countries, searchQuery, filterMedals, sortBy])

  const totalNations = countries.length
  const nationsWithMedals = countries.filter(c => c.total > 0).length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border bg-card p-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-sky-500" />
            <div>
              <div className="text-2xl font-bold">{totalNations}</div>
              <div className="text-sm text-muted-foreground">{t.participatingNations}</div>
            </div>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Medal className="h-5 w-5 text-yellow-500" />
            <div>
              <div className="text-2xl font-bold">{nationsWithMedals}</div>
              <div className="text-sm text-muted-foreground">{t.withMedals}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="border-0 shadow-md">
        <CardContent className="px-4 py-2">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Medal className="h-4 w-4" />
                    {filterMedals === "all" ? t.allCountries : t.withMedals}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setFilterMedals("all")}>
                    {t.allCountries}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterMedals("withMedals")}>
                    {t.withMedals}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <ArrowUpDown className="h-4 w-4" />
                    {t.sortBy}: {sortBy === "name" ? t.sortByName : t.sortByMedals}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSortBy("medals")}>
                    {t.sortByMedals}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("name")}>
                    {t.sortByName}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Countries Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredCountries.map((country) => (
          <Link key={country.countryCode} href={`/${locale}/nations/${country.countryCode.toLowerCase()}`}>
            <Card className="group cursor-pointer border-0 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-lg font-bold text-white shadow-md">
                    {country.countryAbbr}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold group-hover:text-sky-500">{country.countryName}</h3>
                  </div>
                </div>

                {country.total > 0 ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{medalTable.gold}</span>
                      <Badge className="border border-yellow-400/30 bg-yellow-400/20 text-yellow-400">
                        {country.gold}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{medalTable.silver}</span>
                      <Badge className="border border-gray-400/30 bg-gray-400/20 text-gray-300">
                        {country.silver}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{medalTable.bronze}</span>
                      <Badge className="border border-orange-400/30 bg-orange-400/20 text-orange-400">
                        {country.bronze}
                      </Badge>
                    </div>
                    <div className="mt-3 border-t pt-2">
                      <div className="flex items-center justify-between font-bold">
                        <span>{medalTable.total}</span>
                        <span className="text-sky-500">{country.total}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-32 items-center justify-center text-center text-sm text-muted-foreground">
                    {dictionary.common?.noMedalsYet || "No medals yet"}
                  </div>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filteredCountries.length === 0 && (
        <div className="py-12 text-center">
          <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
          <h3 className="mb-2 text-lg font-semibold">
            {dictionary.common?.noResults || "No results found"}
          </h3>
          <p className="text-muted-foreground">
            {dictionary.common?.tryDifferentSearch || "Try a different search term"}
          </p>
        </div>
      )}
    </div>
  )
}