// components/filter-bar.tsx | Task: FE-002 | Filter bar for results with URL search params
"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface FilterBarProps {
  locale: string
  basePath: string
  dictionary?: any
  sports?: { id: string; name: string }[]
  countries?: { code: string; name: string }[]
  showSportFilter?: boolean
  showCountryFilter?: boolean
  showDateFilter?: boolean
}

export function FilterBar({
  locale,
  basePath,
  dictionary,
  sports = [],
  countries = [],
  showSportFilter = true,
  showCountryFilter = true,
  showDateFilter = true,
}: FilterBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = dictionary?.resultsPage || {}

  const [search, setSearch] = useState(searchParams.get("q") || "")

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      params.delete("page")
      router.push(`/${locale}${basePath}?${params.toString()}`)
    },
    [router, searchParams, locale, basePath]
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      updateParams("q", search)
    }, 300)
    return () => clearTimeout(timer)
  }, [search, updateParams])

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t.searchPlaceholder || "Search..."}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {showSportFilter && (
        <select
          className="rounded-md border bg-background px-3 py-2 text-sm"
          value={searchParams.get("sport") || ""}
          onChange={(e) => updateParams("sport", e.target.value)}
        >
          <option value="">{t.allSports || "All Sports"}</option>
          {sports.map((s) => (
            <option key={s.id} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>
      )}

      {showCountryFilter && (
        <select
          className="rounded-md border bg-background px-3 py-2 text-sm"
          value={searchParams.get("country") || ""}
          onChange={(e) => updateParams("country", e.target.value)}
        >
          <option value="">{t.allCountries || "All Countries"}</option>
          {countries.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
      )}

      {showDateFilter && (
        <Input
          type="date"
          value={searchParams.get("date") || ""}
          onChange={(e) => updateParams("date", e.target.value)}
          className="w-auto"
        />
      )}
    </div>
  )
}
