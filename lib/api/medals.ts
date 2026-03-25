// lib/api/medals.ts | Real API client for medal data

import { getMedalStandings } from "./results"
import type { MedalStanding } from "@/types/api"

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

function toMedalEntry(standing: MedalStanding): MedalEntry {
  return {
    rank: standing.rank,
    countryCode: standing.country.countryCode,
    countryName: standing.country.name,
    countryAbbr: standing.country.countryAbbr,
    gold: standing.gold,
    silver: standing.silver,
    bronze: standing.bronze,
    total: standing.gold + standing.silver + standing.bronze,
  }
}

export async function getMedals(
  search?: string,
  limit: number = 10,
  offset: number = 0
): Promise<MedalsResponse> {
  const response = await getMedalStandings({ search, limit, offset })
  return {
    data: response.data.map(toMedalEntry),
    total: response.total,
    limit,
    offset,
  }
}