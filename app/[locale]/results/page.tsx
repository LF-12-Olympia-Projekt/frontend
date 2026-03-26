// app/[locale]/results/page.tsx | Task: FE-002 | Results listing page
"use client"

import { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { PageWrapper } from "@/components/page-wrapper"
import { ResultsTable } from "@/components/results-table"
import { FilterBar } from "@/components/filter-bar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { getResults, getSports, getCountries } from "@/lib/api/results"
import { useTranslation } from "@/lib/locale-context"
import { Trophy } from "lucide-react"
import type { ResultListItem } from "@/types/api"
import type { SportInfo } from "@/types/api"

export default function ResultsPage() {
  const { dictionary, locale } = useTranslation()
  const searchParams = useSearchParams()
  const t = dictionary.resultsPage || {}

  const pageSize = 20
  const [allResults, setAllResults] = useState<ResultListItem[]>([])
  const [page, setPage] = useState(1)
  const [sports, setSports] = useState<SportInfo[]>([])
  const [countries, setCountries] = useState<{ code: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch all data once on mount
  useEffect(() => {
    setLoading(true)
    Promise.all([
      getResults({ pageSize: 100 }),
      getSports(),
      getCountries(),
    ])
      .then(([res, sp, ct]) => {
        setAllResults(res.data)
        setSports(sp)
        setCountries(
          ct.map((c) => ({ code: c.countryCode, name: c.name })).sort((a, b) => a.name.localeCompare(b.name))
        )
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Client-side filtering based on URL search params
  const sportFilter = searchParams.get("sport") || ""
  const countryFilter = searchParams.get("country") || ""
  const dateFilter = searchParams.get("date") || ""
  const searchQuery = (searchParams.get("q") || "").toLowerCase()

  const filteredResults = useMemo(() => {
    let results = allResults

    if (sportFilter) {
      results = results.filter((r) =>
        r.sportName?.toLowerCase().includes(sportFilter.toLowerCase())
      )
    }

    if (countryFilter) {
      results = results.filter((r) => r.countryCode === countryFilter)
    }

    if (dateFilter) {
      results = results.filter((r) => {
        if (!r.lastModifiedAt) return false
        return r.lastModifiedAt.startsWith(dateFilter)
      })
    }

    if (searchQuery) {
      // Build a set of country codes whose names match the search
      const matchingCountryCodes = new Set(
        countries
          .filter((c) => c.name.toLowerCase().includes(searchQuery))
          .map((c) => c.code)
      )

      results = results.filter((r) =>
        r.athleteName?.toLowerCase().includes(searchQuery) ||
        r.eventName?.toLowerCase().includes(searchQuery) ||
        r.sportName?.toLowerCase().includes(searchQuery) ||
        r.countryCode?.toLowerCase().includes(searchQuery) ||
        matchingCountryCodes.has(r.countryCode)
      )
    }

    return results
  }, [allResults, countries, sportFilter, countryFilter, dateFilter, searchQuery])

  // Reset page to 1 when filters change
  const filterKey = `${sportFilter}|${countryFilter}|${dateFilter}|${searchQuery}`
  useEffect(() => {
    setPage(1)
  }, [filterKey])

  const total = filteredResults.length
  const pagedResults = filteredResults.slice((page - 1) * pageSize, page * pageSize)

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <PageWrapper>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${locale}`}>{dictionary.common?.home}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{t.breadcrumb || "Results"}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mt-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Trophy className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{t.title || "Results"}</h1>
            <p className="text-sm text-muted-foreground">{t.subtitle}</p>
          </div>
        </div>

        <div className="mt-6">
          <FilterBar
            locale={locale}
            basePath="/results"
            dictionary={dictionary}
            sports={sports.map((s) => ({ id: s.id, name: s.name }))}
            countries={countries}
          />
        </div>

        <div className="mt-6 overflow-hidden rounded-lg border bg-card shadow-sm">
          <ResultsTable
            results={pagedResults}
            total={total}
            page={page}
            pageSize={pageSize}
            locale={locale}
            loading={loading}
            onPageChange={handlePageChange}
            dictionary={dictionary}
          />
        </div>
      </div>
    </PageWrapper>
  )
}
