"use client"

import { useState } from "react"
import { useTranslation } from "@/lib/locale-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trophy, Search, Filter, ArrowUpDown } from "lucide-react"

interface CountryResultsTableProps {
  countryCode: string
}

interface Result {
  sport: string
  discipline: string
  athlete: string
  result: string
  medal: "gold" | "silver" | "bronze"
  status: "final"
  date: string
}

export function CountryResultsTable({ countryCode }: CountryResultsTableProps) {
  const { dictionary } = useTranslation()
  const t = dictionary.nations || {}
  const liveResults = dictionary.liveResults || {}
  
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data - in real app this would come from API
  const results: Result[] = [
    {
      sport: "Biathlon",
      discipline: "10km Sprint Herren",
      athlete: "Johannes Thingnes Bø",
      result: "23:44.3",
      medal: "gold",
      status: "final",
      date: "2026-02-07"
    },
    {
      sport: "Skilanglauf",
      discipline: "15km klassisch",
      athlete: "Hans Christer Holund",
      result: "33:48.2",
      medal: "gold",
      status: "final",
      date: "2026-02-08"
    },
    {
      sport: "Skispringen",
      discipline: "Normalschanze Einzel",
      athlete: "Halvor Egner Granerud",
      result: "291.3 Punkte",
      medal: "gold",
      status: "final",
      date: "2026-02-07"
    },
    {
      sport: "Biathlon",
      discipline: "12.5km Verfolgung",
      athlete: "Johannes Thingnes Bø",
      result: "31:15.6",
      medal: "silver",
      status: "final",
      date: "2026-02-09"
    },
    {
      sport: "Skispringen",
      discipline: "Großschanze Einzel",
      athlete: "Marius Lindvik",
      result: "285.7 Punkte",
      medal: "bronze",
      status: "final",
      date: "2026-02-15"
    },
    {
      sport: "Skilanglauf",
      discipline: "50km Massenstart",
      athlete: "Simen Hegstad Krüger",
      result: "1:59:26.5",
      medal: "gold",
      status: "final",
      date: "2026-02-23"
    },
    {
      sport: "Biathlon",
      discipline: "4x7.5km Staffel",
      athlete: "Norwegen",
      result: "1:15:23.1",
      medal: "gold",
      status: "final",
      date: "2026-02-18"
    },
    {
      sport: "Skilanglauf",
      discipline: "4x10km Staffel",
      athlete: "Norwegen",
      result: "1:32:08.9",
      medal: "bronze",
      status: "final",
      date: "2026-02-16"
    }
  ]

  const filteredResults = results.filter(result => 
    result.athlete.toLowerCase().includes(searchQuery.toLowerCase()) ||
    result.sport.toLowerCase().includes(searchQuery.toLowerCase()) ||
    result.discipline.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getMedalBadge = (medal: string) => {
    const styles = {
      gold: "bg-yellow-400/20 text-yellow-400 border-yellow-400/30",
      silver: "bg-gray-400/20 text-gray-300 border-gray-400/30",
      bronze: "bg-orange-400/20 text-orange-400 border-orange-400/30"
    }
    
    const labels = {
      gold: dictionary.medalTable?.gold || "Gold",
      silver: dictionary.medalTable?.silver || "Silver",
      bronze: dictionary.medalTable?.bronze || "Bronze"
    }

    return (
      <Badge className={`${styles[medal as keyof typeof styles]} border`}>
        {labels[medal as keyof typeof labels]}
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

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-2 pt-4">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            {t.filters?.allSports || "All Sports"}
          </Button>
          <Button variant="outline" size="sm">
            {t.filters?.all || "All"}
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowUpDown className="h-4 w-4" />
            {t.filters?.date || "Date"}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
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
              {filteredResults.map((result, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{result.sport}</div>
                      <div className="text-sm text-muted-foreground">{result.discipline}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <a href="#" className="font-medium text-sky-500 hover:text-sky-400 hover:underline">
                      {result.athlete}
                    </a>
                  </TableCell>
                  <TableCell className="font-medium">{result.result}</TableCell>
                  <TableCell>{getMedalBadge(result.medal)}</TableCell>
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
      </CardContent>
    </Card>
  )
}