
import { apiClient } from "@/lib/api/client"

export interface SportOverview {
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

export type EventStatus = "live" | "final" | "draft" | "scheduled"

export interface SportEvent {
    id: string
    title: string
    date: string
    time: string
    location: string
    status: EventStatus
}

// GET /api/sports
export async function getSports(search?: string): Promise<SportOverview[]> {
    const params = search
        ? `?search=${encodeURIComponent(search)}`
        : ""

    return apiClient<SportOverview[]>(`/api/sports${params}`)
}

// GET /api/sports/{sportId}
export async function getSportDetail(
    sportId: string
): Promise<SportDetail> {
    return apiClient<SportDetail>(`/api/sports/${sportId}`)
}

// GET /api/sports/{sportId}/events
export async function getSportEvents(
    sportId: string
): Promise<SportEvent[]> {
    return apiClient<SportEvent[]>(`/api/sports/${sportId}/events`)
}