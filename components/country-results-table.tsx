"use client"

import { useState, useMemo } from "react"
import { useTranslation } from "@/lib/locale-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trophy, Search, Filter, ArrowUpDown, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { ResultListItem } from "@/types/api"

interface CountryResultsTableProps {
  countryCode: string
  results: ResultListItem[]
}

export function CountryResultsTable({ countryCode, results }: CountryResultsTableProps) {
  const { dictionary } = useTranslation()
  const t = dictionary.nations || {}
  const liveResults = dictionary.liveResults || {}
  
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSport, setSelectedSport] = useState<string>("all")
  const [selectedMedal, setSelectedMedal] = useState<string>("all")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const uniqueSports = useMemo(() => {
    const sports = [...new Set(results.map(r => r.sportName))].sort()
    return sports
  }, [results])

  const filteredResults = useMemo(() => {
    let filtered = results

    if (searchQuery) {
      filtered = filtered.filter(result => 
        result.athleteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.sportName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.eventName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedSport !== "all") {
      filtered = filtered.filter(result => result.sportName === selectedSport)
    }

    if (selectedMedal !== "all") {
      filtered = filtered.filter(result => result.medal?.toLowerCase() === selectedMedal)
    }

    const sorted = [...filtered].sort((a, b) => {
      const dateA = a.lastModifiedAt ? new Date(a.lastModifiedAt).getTime() : 0
      const dateB = b.lastModifiedAt ? new Date(b.lastModifiedAt).getTime() : 0
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB
    })

    return sorted
  }, [results, searchQuery, selectedSport, selectedMedal, sortOrder])

  const getMedalBadge = (medal: string) => {
    const m = medal?.toLowerCase()
    const styles: Record<string, string> = {
      gold: "bg-yellow-400/20 text-yellow-400 border-yellow-400/30",
      silver: "bg-gray-400/20 text-gray-300 border-gray-400/30",
      bronze: "bg-orange-400/20 text-orange-400 border-orange-400/30"
    }
    
    const labels: Record<string, string> = {
      gold: dictionary.medalTable?.gold || "Gold",
      silver: dictionary.medalTable?.silver || "Silver",
      bronze: dictionary.medalTable?.bronze || "Bronze"
    }

    return (
      <Badge className={`${styles[m] || ""} border`}>
        {labels[m] || medal}
      </Badge>
    )
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/10">
              <Trophy className="h-5 w-5 text-sky-500" />
            </div>
            <CardTitle className="text-xl font-bold">{t.allResults}</CardTitle>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                {selectedSport === "all" ? (t.filters?.allSports || "All Sports") : selectedSport}
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => setSelectedSport("all")}>
                {t.filters?.allSports || "All Sports"}
              </DropdownMenuItem>
              {uniqueSports.map((sport) => (
                <DropdownMenuItem key={sport} onClick={() => setSelectedSport(sport)}>
                  {sport}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                {selectedMedal === "all" 
                  ? (t.filters?.all || "All")
                  : selectedMedal === "gold"
                  ? (dictionary.medalTable?.gold || "Gold")
                  : selectedMedal === "silver"
                  ? (dictionary.medalTable?.silver || "Silver")
                  : (dictionary.medalTable?.bronze || "Bronze")
                }
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => setSelectedMedal("all")}>
                {t.filters?.all || "All"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedMedal("gold")}>
                {dictionary.medalTable?.gold || "Gold"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedMedal("silver")}>
                {dictionary.medalTable?.silver || "Silver"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedMedal("bronze")}>
                {dictionary.medalTable?.bronze || "Bronze"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
          >
            <ArrowUpDown className="h-4 w-4" />
            {t.filters?.date || "Date"}
            <span className="text-xs opacity-50">
              {sortOrder === "desc" ? "↓" : "↑"}
            </span>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {filteredResults.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            {dictionary.common?.noResults || "No results found"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.table?.sport}</TableHead>
                  <TableHead>{t.table?.athlete}</TableHead>
                  <TableHead>{t.table?.result}</TableHead>
                  <TableHead>{t.table?.medal}</TableHead>
                  <TableHead>{t.table?.status}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{result.sportName}</div>
                        <div className="text-sm text-muted-foreground">{result.eventName}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-sky-500 hover:text-sky-400">
                        {result.athleteName}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">{result.value} {result.unit}</TableCell>
                    <TableCell>{result.medal && getMedalBadge(result.medal)}</TableCell>
                    <TableCell>
                      <Badge className="border border-green-500/30 bg-green-500/20 text-green-500">
                        {liveResults.status?.final || "Final"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}