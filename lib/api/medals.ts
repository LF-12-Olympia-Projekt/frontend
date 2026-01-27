/**
 * Mock API controller for medal data
 * 
 * API Specification:
 * GET /api/medals
 * Query Parameters:
 *   - search?: string (filter by country name)
 *   - limit?: number (pagination limit, default: 10)
 *   - offset?: number (pagination offset, default: 0)
 * 
 * Response:
 *   {
 *     data: MedalEntry[],
 *     total: number,
 *     limit: number,
 *     offset: number
 *   }
 * 
 * Expected Errors:
 *   - 500: Internal server error
 *   - 400: Invalid query parameters
 */

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

// Mock data for all countries
const mockMedalData: MedalEntry[] = [
  { rank: 1, countryCode: "NO", countryName: "Norwegen", countryAbbr: "NOR", gold: 16, silver: 8, bronze: 13, total: 37 },
  { rank: 2, countryCode: "DE", countryName: "Deutschland", countryAbbr: "GER", gold: 14, silver: 10, bronze: 7, total: 31 },
  { rank: 3, countryCode: "US", countryName: "USA", countryAbbr: "USA", gold: 10, silver: 12, bronze: 7, total: 29 },
  { rank: 4, countryCode: "CA", countryName: "Kanada", countryAbbr: "CAN", gold: 11, silver: 8, bronze: 10, total: 29 },
  { rank: 5, countryCode: "AT", countryName: "Österreich", countryAbbr: "AUT", gold: 9, silver: 7, bronze: 8, total: 24 },
  { rank: 6, countryCode: "SE", countryName: "Schweden", countryAbbr: "SWE", gold: 7, silver: 6, bronze: 8, total: 21 },
  { rank: 7, countryCode: "NL", countryName: "Niederlande", countryAbbr: "NED", gold: 8, silver: 6, bronze: 6, total: 20 },
  { rank: 8, countryCode: "JP", countryName: "Japan", countryAbbr: "JPN", gold: 5, silver: 9, bronze: 5, total: 19 },
  { rank: 9, countryCode: "FR", countryName: "Frankreich", countryAbbr: "FRA", gold: 5, silver: 7, bronze: 7, total: 19 },
  { rank: 10, countryCode: "CH", countryName: "Schweiz", countryAbbr: "SUI", gold: 5, silver: 6, bronze: 7, total: 18 },
  { rank: 11, countryCode: "IT", countryName: "Italien", countryAbbr: "ITA", gold: 4, silver: 6, bronze: 6, total: 16 },
  { rank: 12, countryCode: "KR", countryName: "Südkorea", countryAbbr: "KOR", gold: 4, silver: 5, bronze: 5, total: 14 },
  { rank: 13, countryCode: "CN", countryName: "China", countryAbbr: "CHN", gold: 3, silver: 5, bronze: 4, total: 12 },
  { rank: 14, countryCode: "FI", countryName: "Finnland", countryAbbr: "FIN", gold: 3, silver: 4, bronze: 4, total: 11 },
  { rank: 15, countryCode: "GB", countryName: "Großbritannien", countryAbbr: "GBR", gold: 2, silver: 4, bronze: 3, total: 9 },
  { rank: 16, countryCode: "CZ", countryName: "Tschechien", countryAbbr: "CZE", gold: 2, silver: 3, bronze: 3, total: 8 },
  { rank: 17, countryCode: "RU", countryName: "Russland", countryAbbr: "RUS", gold: 2, silver: 2, bronze: 3, total: 7 },
  { rank: 18, countryCode: "PL", countryName: "Polen", countryAbbr: "POL", gold: 1, silver: 2, bronze: 3, total: 6 },
  { rank: 19, countryCode: "AU", countryName: "Australien", countryAbbr: "AUS", gold: 1, silver: 1, bronze: 2, total: 4 },
  { rank: 20, countryCode: "ES", countryName: "Spanien", countryAbbr: "ESP", gold: 0, silver: 1, bronze: 2, total: 3 },
]

/**
 * Fetch medal standings with optional filtering and pagination
 */
export async function getMedals(
  search?: string,
  limit: number = 10,
  offset: number = 0
): Promise<MedalsResponse> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300))

  // Simulate random errors (5% chance)
  if (Math.random() < 0.05) {
    throw new Error("Internal server error")
  }

  // Validate parameters
  if (limit < 1 || offset < 0) {
    throw new Error("Invalid query parameters")
  }

  // Filter by search term if provided
  let filteredData = mockMedalData
  if (search && search.trim()) {
    const searchLower = search.toLowerCase()
    filteredData = mockMedalData.filter(
      entry =>
        entry.countryName.toLowerCase().includes(searchLower) ||
        entry.countryCode.toLowerCase().includes(searchLower) ||
        entry.countryAbbr.toLowerCase().includes(searchLower)
    )
  }

  // Apply pagination
  const paginatedData = filteredData.slice(offset, offset + limit)

  return {
    data: paginatedData,
    total: filteredData.length,
    limit,
    offset,
  }
}