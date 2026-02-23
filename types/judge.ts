// types/judge.ts | Task: FE-003 | TypeScript types for judge interface

export type JudgeResultStatus =
  | "Draft"
  | "PendingReview"
  | "Published"
  | "ProtestFiled"
  | "Invalid"

export interface CreateResultRequest {
  eventId: string
  athleteId: string
  value: string
  unit: string
  rank?: number | null
  sportSpecificFields?: string | null
  notes?: string | null
}

export interface UpdateResultRequest {
  eventId?: string
  athleteId?: string
  value?: string
  unit?: string
  rank?: number | null
  sportSpecificFields?: string | null
  notes?: string | null
}

export interface ProtestRequest {
  reason: string
}

export interface InvalidateRequest {
  reason: string
}

export interface RejectRequest {
  rejectionReason: string
}

export interface JudgeResultListItem {
  id: string
  rank: number | null
  medal: string
  athleteName: string
  countryCode: string
  value: string
  unit: string
  eventName: string
  sportName: string
  status: JudgeResultStatus
  version: number
  lastModifiedBy: string | null
  lastModifiedAt: string | null
  hasUnreadFeedback: boolean
}

export interface ResultHistoryEntry {
  id: string
  version: number
  changedBy: string | null
  changedAt: string
  changeType: string | null
  snapshot: string | null
}

export interface ResultProtestEntry {
  id: string
  reason: string
  filedBy: string
  status: string
  createdAt: string
}

export interface JudgeResultDetail {
  id: string
  rank: number | null
  medal: string
  value: string
  unit: string
  version: number
  status: JudgeResultStatus
  notes: string | null
  sportSpecificFields: string | null
  createdByUser: string | null
  createdAt: string
  lastModifiedBy: string | null
  lastModifiedAt: string | null
  submittedAt: string | null
  firstApprovedBy: string | null
  secondApprovedBy: string | null
  rejectionReason: string | null
  reviewerComment: string | null
  hasUnreadFeedback: boolean
  athlete: {
    id: string
    name: string
    countryCode: string
    dateOfBirth: string | null
    age: number | null
    photoUrl: string | null
  } | null
  event: {
    id: string
    name: string
    date: string
    location: string
    sportName: string
    sportId: string
  } | null
  history: ResultHistoryEntry[]
  protests: ResultProtestEntry[]
}

export interface ReviewQueueItem {
  id: string
  athleteName: string
  countryCode: string
  value: string
  unit: string
  eventName: string
  sportName: string
  submittedBy: string
  submittedAt: string | null
  firstApprovedBy: string | null
  version: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

export interface JudgeDashboardStats {
  drafts: number
  pendingReview: number
  published: number
  protests: number
  invalid: number
}
