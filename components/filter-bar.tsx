// components/filter-bar.tsx | Task: FE-002 | Filter bar for results with URL search params
"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search, CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => {
  const dateValue = searchParams.get("date")
  return dateValue ? new Date(dateValue) : undefined
})
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

  const formatDateForQuery = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
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
        <Select
          value={searchParams.get("sport") || "__all__"}
          onValueChange={(value) => pushParams("sport", value === "__all__" ? "" : value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t.allSports || "All Sports"} />
          </SelectTrigger>
          <SelectContent position="popper" className="max-h-72 overflow-y-auto">
            <SelectItem value="__all__">{t.allSports || "All Sports"}</SelectItem>
            {sports.map((s) => (
              <SelectItem key={s.id} value={s.name}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {showCountryFilter && (
        <Select
          value={searchParams.get("country") || "__all__"}
          onValueChange={(value) => pushParams("country", value === "__all__" ? "" : value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t.allCountries || "All Countries"} />
          </SelectTrigger>
          <SelectContent position="popper" className="max-h-72 overflow-y-auto">
            <SelectItem value="__all__">{t.allCountries || "All Countries"}</SelectItem>
            {countries.map((c) => (
              <SelectItem key={c.code} value={c.code}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {showDateFilter && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-auto justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate
                ? selectedDate.toLocaleDateString("de-DE")
                : "tt.mm.jjjj"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date)
                pushParams("date", date ? formatDateForQuery(date) : "")
              }}
              initialFocus
              captionLayout="dropdown"
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}
