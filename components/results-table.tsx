// components/results-table.tsx | Task: FE-002 | Reusable results table with pagination
"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { MedalBadge } from "@/components/medal-badge"
import { CountryFlag } from "@/components/country-flag"
import { LastModified } from "@/components/last-modified"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import type { ResultListItem } from "@/types/api"

interface ResultsTableProps {
  results: ResultListItem[]
  total: number
  page: number
  pageSize: number
  locale: string
  loading?: boolean
  onPageChange?: (page: number) => void
  dictionary?: any
  showSport?: boolean
}

export function ResultsTable({
  results,
  total,
  page,
  pageSize,
  locale,
  loading = false,
  onPageChange,
  dictionary,
  showSport = true,
}: ResultsTableProps) {
  const t = dictionary?.resultsPage || {}
  const totalPages = Math.ceil(total / pageSize)
  const router = useRouter()
  const searchParams = useSearchParams()

  const handlePageChange = (newPage: number) => {
    if (onPageChange) {
      onPageChange(newPage)
    } else {
      const params = new URLSearchParams(searchParams.toString())
      params.set("page", String(newPage))
      router.push(`?${params.toString()}`)
    }
  }

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Search className="mb-4 h-12 w-12 text-muted-foreground/50" />
        <p className="text-lg font-medium">{t.noResults || "No results found"}</p>
        <p className="text-sm text-muted-foreground">{t.noResultsHint || "Try adjusting your filters"}</p>
      </div>
    )
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50 text-left text-sm font-medium text-muted-foreground">
              <th className="whitespace-nowrap px-4 py-3 text-center">{t.rank || "Rank"}</th>
              <th className="whitespace-nowrap px-4 py-3 text-center">{t.medal || "Medal"}</th>
              <th className="whitespace-nowrap px-4 py-3">{t.athlete || "Athlete"}</th>
              <th className="whitespace-nowrap px-4 py-3">{t.country || "Country"}</th>
              <th className="whitespace-nowrap px-4 py-3">{t.result || "Result"}</th>
              {showSport && <th className="whitespace-nowrap px-4 py-3">{t.event || "Event"}</th>}
              <th className="whitespace-nowrap px-4 py-3">{t.lastModified || "Last modified"}</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.id} className="border-b transition-colors hover:bg-muted/50">
                <td className="px-4 py-3 text-center">
                  <span className={`font-bold ${r.rank && r.rank <= 3 ? "text-yellow-500" : ""}`}>
                    {r.rank ?? "-"}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <MedalBadge medal={r.medal} size={20} />
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/${locale}/results/${r.id}`}
                    className="font-medium hover:underline"
                  >
                    {r.athleteName}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <CountryFlag countryCode={r.countryCode} size="sm" />
                    <span className="text-sm">{r.countryCode}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  {r.value} {r.unit}
                </td>
                {showSport && (
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {r.eventName}
                  </td>
                )}
                <td className="px-4 py-3">
                  <LastModified name={r.lastModifiedBy} date={r.lastModifiedAt} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t px-4 py-3">
          <p className="text-sm text-muted-foreground">
            {t.page || "Page"} {page} {t.of || "of"} {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => handlePageChange(page - 1)}
              className="bg-transparent"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => handlePageChange(page + 1)}
              className="bg-transparent"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
