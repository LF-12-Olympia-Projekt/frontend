"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useTranslation } from "@/lib/locale-context"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Trophy, Medal, ArrowUpDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Country {
  code: string
  name: string
  gold: number
  silver: number
  bronze: number
  total: number
  athletes: number
}

export function NationsGrid() {
  const { dictionary, locale } = useTranslation()
  const t = dictionary.nations?.overview || {}
  const medalTable = dictionary.medalTable || {}
  
  const [searchQuery, setSearchQuery] = useState("")
  const [filterMedals, setFilterMedals] = useState<"all" | "withMedals">("all")
  const [sortBy, setSortBy] = useState<"name" | "medals">("medals")

  // Mock data - in real app this would come from API
  const countries: Country[] = [
    { code: "NO", name: "Norwegen", gold: 16, silver: 8, bronze: 13, total: 37, athletes: 109 },
    { code: "DE", name: "Deutschland", gold: 12, silver: 10, bronze: 5, total: 27, athletes: 150 },
    { code: "CA", name: "Kanada", gold: 11, silver: 8, bronze: 10, total: 29, athletes: 215 },
    { code: "US", name: "USA", gold: 10, silver: 12, bronze: 7, total: 29, athletes: 222 },
    { code: "SE", name: "Schweden", gold: 8, silver: 6, bronze: 7, total: 21, athletes: 116 },
    { code: "AT", name: "Österreich", gold: 7, silver: 7, bronze: 8, total: 22, athletes: 105 },
    { code: "CH", name: "Schweiz", gold: 7, silver: 5, bronze: 9, total: 21, athletes: 168 },
    { code: "NL", name: "Niederlande", gold: 6, silver: 5, bronze: 4, total: 15, athletes: 48 },
    { code: "FI", name: "Finnland", gold: 5, silver: 4, bronze: 5, total: 14, athletes: 95 },
    { code: "JP", name: "Japan", gold: 4, silver: 7, bronze: 5, total: 16, athletes: 124 },
    { code: "IT", name: "Italien", gold: 4, silver: 4, bronze: 6, total: 14, athletes: 139 },
    { code: "FR", name: "Frankreich", gold: 4, silver: 3, bronze: 7, total: 14, athletes: 123 },
    { code: "CN", name: "China", gold: 4, silver: 3, bronze: 2, total: 9, athletes: 176 },
    { code: "KR", name: "Südkorea", gold: 3, silver: 2, bronze: 2, total: 7, athletes: 63 },
    { code: "CZ", name: "Tschechien", gold: 2, silver: 3, bronze: 3, total: 8, athletes: 115 },
    { code: "RU", name: "Russland", gold: 2, silver: 4, bronze: 5, total: 11, athletes: 212 },
    { code: "GB", name: "Großbritannien", gold: 1, silver: 3, bronze: 4, total: 8, athletes: 58 },
    { code: "AU", name: "Australien", gold: 1, silver: 2, bronze: 1, total: 4, athletes: 44 },
    { code: "PL", name: "Polen", gold: 1, silver: 1, bronze: 2, total: 4, athletes: 65 },
    { code: "SK", name: "Slowakei", gold: 1, silver: 1, bronze: 1, total: 3, athletes: 48 },
    { code: "SI", name: "Slowenien", gold: 1, silver: 0, bronze: 2, total: 3, athletes: 43 },
    { code: "BE", name: "Belgien", gold: 1, silver: 0, bronze: 1, total: 2, athletes: 22 },
    { code: "ES", name: "Spanien", gold: 0, silver: 2, bronze: 1, total: 3, athletes: 57 },
    { code: "NZ", name: "Neuseeland", gold: 0, silver: 1, bronze: 1, total: 2, athletes: 16 },
    { code: "UA", name: "Ukraine", gold: 0, silver: 1, bronze: 0, total: 1, athletes: 45 },
    { code: "BR", name: "Brasilien", gold: 0, silver: 0, bronze: 0, total: 0, athletes: 12 },
    { code: "AR", name: "Argentinien", gold: 0, silver: 0, bronze: 0, total: 0, athletes: 8 },
    { code: "IN", name: "Indien", gold: 0, silver: 0, bronze: 0, total: 0, athletes: 6 },
  ]

  // Filter and sort countries
  const filteredCountries = useMemo(() => {
    let filtered = countries

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(country => 
        country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        country.code.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply medal filter
    if (filterMedals === "withMedals") {
      filtered = filtered.filter(country => country.total > 0)
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "medals") {
        // Sort by total medals (descending), then by name
        if (b.total !== a.total) {
          return b.total - a.total
        }
        return a.name.localeCompare(b.name)
      } else {
        // Sort alphabetically by name
        return a.name.localeCompare(b.name)
      }
    })

    return sorted
  }, [countries, searchQuery, filterMedals, sortBy])

  const totalNations = countries.length
  const nationsWithMedals = countries.filter(c => c.total > 0).length

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
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {/* Medal Filter */}
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

              {/* Sort */}
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
          <Link key={country.code} href={`/${locale}/nations/${country.code.toLowerCase()}`}>
            <Card className="group cursor-pointer border-0 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <CardContent className="p-6">
                {/* Flag and Name */}
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-lg font-bold text-white shadow-md">
                    {country.code}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold group-hover:text-sky-500">{country.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {country.athletes} {dictionary.common?.athletes || "Athletes"}
                    </p>
                  </div>
                </div>

                {/* Medals */}
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

      {/* No Results */}
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