/**
 * API client for medal standings
 * Wraps the real backend /api/medals endpoint
 */

import { getMedalStandings } from "@/lib/api/results"

export interface MedalEntry {
  rank: number
  countryCode: string
  countryName: string
  countryAbbr: string
  gold: number
  silver: number
  bronze: number
  total: number
}

export interface MedalsResponse {
  data: MedalEntry[]
  total: number
  limit: number
  offset: number
}

export async function getMedals(
  search?: string,
  limit: number = 10,
  offset: number = 0
): Promise<MedalsResponse> {
  // Fetch all standings from real API (backend search/pagination also uses XPO,
  // so we fetch all and filter/paginate client-side for reliability)
  const response = await getMedalStandings({ limit: 100 })

  let entries: MedalEntry[] = response.data.map((s) => ({
    rank: s.rank,
    countryCode: s.country.countryCode,
    countryName: s.country.name,
    countryAbbr: s.country.countryAbbr,
    gold: s.gold,
    silver: s.silver,
    bronze: s.bronze,
    total: s.gold + s.silver + s.bronze,
  }))

  // Client-side search filter
  if (search && search.trim()) {
    const q = search.toLowerCase()
    entries = entries.filter(
      (e) =>
        e.countryName.toLowerCase().includes(q) ||
        e.countryCode.toLowerCase().includes(q) ||
        e.countryAbbr.toLowerCase().includes(q)
    )
  }

  // Re-rank after filtering
  entries.forEach((e, i) => (e.rank = i + 1))

  const paged = entries.slice(offset, offset + limit)

  return {
    data: paged,
    total: entries.length,
    limit,
    offset,
  }
}