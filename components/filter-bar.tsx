// components/filter-bar.tsx | Task: FE-002 | Filter bar for results with URL search params
"use client"

import { useEffect, useRef, useState } from "react"
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
  const isInitialMount = useRef(true)

  // Stable ref for current searchParams to avoid dependency loops
  const searchParamsRef = useRef(searchParams)
  searchParamsRef.current = searchParams

  const pushParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParamsRef.current.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete("page")
    router.push(`/${locale}${basePath}?${params.toString()}`)
  }

  // Debounced search — only fires after user types, not on mount
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    const timer = setTimeout(() => {
      pushParams("q", search)
    }, 400)
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

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
          onChange={(e) => pushParams("sport", e.target.value)}
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
          onChange={(e) => pushParams("country", e.target.value)}
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
          onChange={(e) => pushParams("date", e.target.value)}
          className="w-auto"
        />
      )}
    </div>
  )
}
