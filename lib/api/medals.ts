import { apiClient } from "@/lib/api/client"

export interface MedalEntry {
  rank: number
  countryCode: string
  countryAbbr: string
  countryName: string
  gold: number
  silver: number
  bronze: number
  total: number
}

export interface MedalListResponse {
  data: MedalEntry[]
  total: number
}

export async function getMedals(
    search: string,
    limit: number,
    offset: number
): Promise<MedalListResponse> {
  const params = new URLSearchParams({
    search,
    limit: limit.toString(),
    offset: offset.toString(),
  })

  return apiClient<MedalListResponse>(`/api/medals?${params}`, {
    method: "GET",
  })
}