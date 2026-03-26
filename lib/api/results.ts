// lib/api/results.ts | Task: FE-002 | API client functions for public results

import type {
  PaginatedResponse,
  ResultListItem,
  ResultDetail,
  AthleteInfo,
  AthleteDetail,
  MedalListResponse,
  CountryMedalDetail,
  CountryInfo,
  SportInfo,
  SportDetail,
  SportEventInfo,
} from "@/types/api"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || ""

async function fetchApi<T>(path: string, revalidate: number = 60): Promise<T> {
  const isServer = typeof window === "undefined"
  const options: RequestInit = {
    headers: { "Content-Type": "application/json" },
  }
  if (isServer) {
    ;(options as any).next = { revalidate }
  }
  const res = await fetch(`${API_BASE}${path}`, options)
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`)
  }
  const text = await res.text()
  if (!text) return undefined as T
  return JSON.parse(text) as T
}

export async function getResults(params?: {
  sport?: string
  country?: string
  date?: string
  eventId?: string
  athleteName?: string
  page?: number
  pageSize?: number
}): Promise<PaginatedResponse<ResultListItem>> {
  const searchParams = new URLSearchParams()
  if (params?.sport) searchParams.set("sport", params.sport)
  if (params?.country) searchParams.set("country", params.country)
  if (params?.date) searchParams.set("date", params.date)
  if (params?.eventId) searchParams.set("eventId", params.eventId)
  if (params?.athleteName) searchParams.set("athleteName", params.athleteName)
  if (params?.page) searchParams.set("page", String(params.page))
  if (params?.pageSize) searchParams.set("pageSize", String(params.pageSize))
  const qs = searchParams.toString()
  return fetchApi<PaginatedResponse<ResultListItem>>(`/api/results${qs ? `?${qs}` : ""}`)
}

export async function getResultById(id: string): Promise<ResultDetail> {
  return fetchApi<ResultDetail>(`/api/results/${id}`)
}

export async function getAthleteById(id: string): Promise<AthleteDetail> {
  return fetchApi<AthleteDetail>(`/api/athletes/${id}`)
}

export async function getMedalStandings(params?: {
  search?: string
  limit?: number
  offset?: number
}): Promise<MedalListResponse> {
  const searchParams = new URLSearchParams()
  if (params?.search) searchParams.set("search", params.search)
  if (params?.limit) searchParams.set("limit", String(params.limit))
  if (params?.offset) searchParams.set("offset", String(params.offset))
  const qs = searchParams.toString()
  return fetchApi<MedalListResponse>(`/api/medals${qs ? `?${qs}` : ""}`)
}

export async function getCountryMedals(countryCode: string): Promise<CountryMedalDetail> {
  return fetchApi<CountryMedalDetail>(`/api/medals/${countryCode}`)
}

export async function getCountries(): Promise<CountryInfo[]> {
  return fetchApi<CountryInfo[]>("/api/countries")
}

export async function getAthletes(params?: {
  country?: string
  search?: string
  limit?: number
  offset?: number
}): Promise<PaginatedResponse<AthleteInfo>> {
  const searchParams = new URLSearchParams()
  if (params?.country) searchParams.set("country", params.country)
  if (params?.search) searchParams.set("search", params.search)
  if (params?.limit) searchParams.set("limit", String(params.limit))
  if (params?.offset) searchParams.set("offset", String(params.offset))
  const qs = searchParams.toString()
  return fetchApi<PaginatedResponse<AthleteInfo>>(`/api/athletes${qs ? `?${qs}` : ""}`)
}

export async function getSports(): Promise<SportInfo[]> {
  return fetchApi<SportInfo[]>("/api/sports")
}

export async function getSportBySlug(slug: string): Promise<SportDetail> {
  return fetchApi<SportDetail>(`/api/sports/by-slug/${slug}`)
}

export async function getSportEvents(sportId: string): Promise<SportEventInfo[]> {
  return fetchApi<SportEventInfo[]>(`/api/sports/${sportId}/events`)
}

export async function getSportResults(slug: string, params?: {
  page?: number
  pageSize?: number
}): Promise<PaginatedResponse<ResultListItem>> {
  const searchParams = new URLSearchParams()
  if (params?.page) searchParams.set("page", String(params.page))
  if (params?.pageSize) searchParams.set("pageSize", String(params.pageSize))
  const qs = searchParams.toString()
  return fetchApi<PaginatedResponse<ResultListItem>>(`/api/sports/by-slug/${slug}/results${qs ? `?${qs}` : ""}`)
}
