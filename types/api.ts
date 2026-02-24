// types/api.ts | Task: FE-002 | API response types for public results

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

export interface ResultListItem {
  id: string
  rank: number | null
  medal: string
  athleteName: string
  countryCode: string
  value: string
  unit: string
  eventName: string
  sportName: string
  lastModifiedBy: string | null
  lastModifiedAt: string | null
  sportSpecificFields?: string | null
}

export interface ResultDetail {
  id: string
  rank: number | null
  medal: string
  value: string
  unit: string
  version: number
  lastModifiedBy: string | null
  lastModifiedAt: string | null
  athlete: AthleteInfo | null
  event: EventInfo | null
}

export interface AthleteInfo {
  id: string
  name: string
  countryCode: string
  dateOfBirth: string | null
  age: number | null
  photoUrl: string | null
}

export interface AthleteDetail extends AthleteInfo {
  disciplines: string[]
  results: ResultListItem[]
}

export interface EventInfo {
  id: string
  name: string
  date: string
  location: string
  sportName: string
  sportId: string
}

export interface MedalStanding {
  country: CountryInfo
  rank: number
  gold: number
  silver: number
  bronze: number
}

export interface CountryInfo {
  id: string
  name: string
  countryCode: string
  countryAbbr: string
  isActive: boolean
  kind: number
}

export interface MedalListResponse {
  data: MedalStanding[]
  total: number
}

export interface CountryMedalDetail {
  country: CountryInfo
  medals: MedalStanding
  results: ResultListItem[]
}

export interface SportInfo {
  id: string
  name: string
  events: number
  medals: number
}

export interface SportDetail {
  id: string
  name: string
  description: string
  events: number
  medals: number
}
