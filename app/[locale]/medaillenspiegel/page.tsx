"use client"

import { useState, useEffect } from "react"
import { PageWrapper } from "@/components/page-wrapper"
import { useTranslation } from "@/lib/locale-context"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Trophy, Search, Scale, X, Check } from "lucide-react"
import { getMedals, type MedalEntry } from "@/lib/api/medals"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import GradientHero from "@/components/GradientHero";

export default function MedalTableDetailPage() {
  const { dictionary, locale } = useTranslation()
  const t = dictionary.medalTableDetail || {}
  const common = dictionary.common || {}
  
  const [medals, setMedals] = useState<MedalEntry[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [compareMode, setCompareMode] = useState(false)
  const [selectedCountries, setSelectedCountries] = useState<MedalEntry[]>([])
  const limit = 10

  const loadMedals = async (searchTerm: string, page: number) => {
    setLoading(true)
    try {
      const offset = (page - 1) * limit
      const response = await getMedals(searchTerm, limit, offset)
      setMedals(response.data)
      setTotal(response.total)
    } catch (error) {
      toast.error("Failed to load medal data")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMedals(search, currentPage)
  }, [search, currentPage])

  const totalPages = Math.ceil(total / limit)
  const startItem = total > 0 ? (currentPage - 1) * limit + 1 : 0
  const endItem = Math.min(currentPage * limit, total)

  const toggleCountrySelection = (entry: MedalEntry) => {
    setSelectedCountries((prev) => {
      const isSelected = prev.some((c) => c.rank === entry.rank)
      if (isSelected) {
        return prev.filter((c) => c.rank !== entry.rank)
      } else {
        if (prev.length >= 5) {
          toast.error("Maximum 5 countries can be compared")
          return prev
        }
        return [...prev, entry]
      }
    })
  }

  const clearComparison = () => {
    setSelectedCountries([])
    setCompareMode(false)
  }

  const isCountrySelected = (entry: MedalEntry) => {
    return selectedCountries.some((c) => c.rank === entry.rank)
  }

  return (
    <PageWrapper>
      {/* Breadcrumb */}
      <section className="border-b border-border bg-background px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href={`/${locale}`}>{common.home}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{common.medalTable}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </section>

      {/* Page Title */}
      
      <GradientHero title={t.title} subtitle={t.subtitle} />


      {/* Filter Bar */}
      <section className="border-b border-t border-border bg-card/50 px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* All Nations Count */}
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500/10">
                <Trophy className="h-4 w-4 text-sky-500" />
              </div>
              <span className="font-medium">
                {t.allNations} ({total})
              </span>
            </div>

            {/* Search */}
            <div className="relative flex-1 sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t.searchPlaceholder}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-9"
              />
            </div>

            {/* Compare Button */}
            <Button
              variant={compareMode ? "default" : "outline"}
              className={`gap-2 ${compareMode ? "bg-sky-600 hover:bg-sky-700" : ""}`}
              onClick={() => {
                if (compareMode && selectedCountries.length === 0) {
                  setCompareMode(false)
                } else {
                  setCompareMode(!compareMode)
                }
              }}
            >
              <Scale className="h-4 w-4" />
              {t.compare}
              {selectedCountries.length > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 py-0">
                  {selectedCountries.length}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </section>

      {/* Comparison View */}
      {compareMode && selectedCountries.length > 0 && (
        <section className="bg-sky-50 px-4 py-6 dark:bg-sky-950/20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Scale className="h-5 w-5 text-sky-600" />
                <h3 className="text-lg font-semibold">
                  Comparing {selectedCountries.length} {selectedCountries.length === 1 ? "Country" : "Countries"}
                </h3>
              </div>
              <Button variant="ghost" size="sm" onClick={clearComparison}>
                <X className="h-4 w-4" />
                Clear
              </Button>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {selectedCountries.map((country) => (
                <Card key={country.rank} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold">{country.rank}</span>
                          <span className="text-sm text-muted-foreground">{country.countryCode}</span>
                        </div>
                        <h4 className="mt-1 font-semibold">{country.countryName}</h4>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => toggleCountrySelection(country)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div
                          className="mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                          style={{ backgroundColor: "oklch(0.55 0.12 70)" }}
                        >
                          {country.gold}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">Gold</p>
                      </div>
                      <div>
                        <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-gray-500 text-xs font-bold text-white">
                          {country.silver}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">Silver</p>
                      </div>
                      <div>
                        <div
                          className="mx-auto flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                          style={{ backgroundColor: "oklch(0.50 0.10 40)" }}
                        >
                          {country.bronze}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">Bronze</p>
                      </div>
                    </div>
                    <div className="mt-3 border-t pt-3 text-center">
                      <p className="text-2xl font-bold">{country.total}</p>
                      <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Medal Table */}
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Card className="overflow-hidden border-0 shadow-lg">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border bg-muted/50">
                    <tr>
                      <th className="px-4 py-4 text-left text-sm font-semibold sm:px-6">
                        {dictionary.medalTable?.rank}
                      </th>
                      <th className="px-4 py-4 text-left text-sm font-semibold sm:px-6">
                        {dictionary.medalTable?.country}
                      </th>
                      <th className="px-4 py-4 text-center text-sm font-semibold sm:px-6">
                        <div className="flex items-center justify-center">
                          <div className="h-6 w-6 rounded-full" style={{ backgroundColor: "oklch(0.65 0.15 85)" }} />
                        </div>
                      </th>
                      <th className="px-4 py-4 text-center text-sm font-semibold sm:px-6">
                        <div className="flex items-center justify-center">
                          <div className="h-6 w-6 rounded-full bg-gray-400" />
                        </div>
                      </th>
                      <th className="px-4 py-4 text-center text-sm font-semibold sm:px-6">
                        <div className="flex items-center justify-center">
                          <div className="h-6 w-6 rounded-full" style={{ backgroundColor: "oklch(0.55 0.15 40)" }} />
                        </div>
                      </th>
                      <th className="px-4 py-4 text-center text-sm font-semibold sm:px-6">
                        {dictionary.medalTable?.total}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      Array.from({ length: limit }).map((_, i) => (
                        <tr key={i} className="border-b border-border">
                          <td className="px-4 py-5 sm:px-6">
                            <Skeleton className="h-6 w-8" />
                          </td>
                          <td className="px-4 py-5 sm:px-6">
                            <Skeleton className="h-6 w-40" />
                          </td>
                          <td className="px-4 py-5 text-center sm:px-6">
                            <Skeleton className="mx-auto h-10 w-10 rounded-full" />
                          </td>
                          <td className="px-4 py-5 text-center sm:px-6">
                            <Skeleton className="mx-auto h-10 w-10 rounded-full" />
                          </td>
                          <td className="px-4 py-5 text-center sm:px-6">
                            <Skeleton className="mx-auto h-10 w-10 rounded-full" />
                          </td>
                          <td className="px-4 py-5 text-center sm:px-6">
                            <Skeleton className="h-6 w-8" />
                          </td>
                        </tr>
                      ))
                    ) : medals.length > 0 ? (
                      medals.map((entry) => (
                        <tr
                          key={entry.rank}
                          className={`border-b border-border transition-colors ${
                            compareMode ? "cursor-pointer" : ""
                          } ${
                            isCountrySelected(entry)
                              ? "bg-sky-100 dark:bg-sky-950/30"
                              : "hover:bg-muted/50"
                          }`}
                          onClick={() => compareMode && toggleCountrySelection(entry)}
                        >
                          <td className="px-4 py-5 sm:px-6">
                            <div className="flex items-center gap-2">
                              {compareMode && (
                                <div
                                  className={`flex h-5 w-5 items-center justify-center rounded border-2 ${
                                    isCountrySelected(entry)
                                      ? "border-sky-600 bg-sky-600"
                                      : "border-muted-foreground/30"
                                  }`}
                                >
                                  {isCountrySelected(entry) && <Check className="h-3 w-3 text-white" />}
                                </div>
                              )}
                              <span className="text-lg font-semibold">{entry.rank}</span>
                            </div>
                          </td>
                          <td className="px-4 py-5 sm:px-6">
                            <div className="flex items-center gap-3">
                              <span className="text-lg font-medium">{entry.countryCode}</span>
                              <span className="hidden sm:inline">|</span>
                              <span className="hidden sm:inline">{entry.countryName}</span>
                              <span className="text-sm text-muted-foreground">
                                {entry.countryAbbr}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-5 text-center sm:px-6">
                            <div className="flex items-center justify-center">
                              <div
                                className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                                style={{ backgroundColor: "oklch(0.55 0.12 70)" }}
                              >
                                {entry.gold}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-5 text-center sm:px-6">
                            <div className="flex items-center justify-center">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-500 text-sm font-bold text-white">
                                {entry.silver}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-5 text-center sm:px-6">
                            <div className="flex items-center justify-center">
                              <div
                                className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                                style={{ backgroundColor: "oklch(0.50 0.10 40)" }}
                              >
                                {entry.bronze}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-5 text-center text-lg font-semibold sm:px-6">
                            {entry.total}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                          No results found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex flex-col items-center justify-between gap-4 border-t border-border bg-muted/30 px-4 py-4 sm:flex-row sm:px-6">
                <p className="text-sm text-muted-foreground">
                  {t.showing} {startItem} {t.to} {endItem} {t.of} {total} {t.nations}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1 || loading}
                  >
                    ‹
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      disabled={loading}
                      className={page === currentPage ? "bg-sky-600 hover:bg-sky-700" : ""}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages || loading}
                  >
                    ›
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </PageWrapper>
  )
}