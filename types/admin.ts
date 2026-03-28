// types/admin.ts | Task: FE-004 | TypeScript types for admin interface

export type UserRole = "Admin" | "Judge"

export interface AdminUserListItem {
  id: string
  userName: string
  email: string
  roles: string[]
  isActive: boolean
  lastLogin: string | null
  createdAt: string
  delegatedReviewerUntil: string | null
}

export interface AdminUserDetail {
  id: string
  userName: string
  email: string
  roles: string[]
  isActive: boolean
  lastLogin: string | null
  createdAt: string
  updatedAt: string
  delegatedReviewerUntil: string | null
  delegatedBy: string | null
}

export interface CreateUserRequest {
  userName: string
  email: string
  role: string
  temporaryPassword: string
}

export interface UpdateUserRequest {
  email?: string
  role?: string
  isActive?: boolean
}

export interface DelegateReviewerRequest {
  validUntil: string
}

export interface AdminResultListItem {
  id: string
  rank: number | null
  medal: string
  athleteName: string
  countryCode: string
  value: string
  unit: string
  eventName: string
  sportName: string
  status: string
  version: number
  createdByUser: string | null
  lastModifiedBy: string | null
  lastModifiedAt: string | null
  submittedAt: string | null
}

export interface RestoreResultRequest {
  reason: string
}

export interface ForcePublishRequest {
  reason: string
}

export interface PermanentDeleteRequest {
  confirmationToken: string
  reason: string
}

export interface SportTemplateListItem {
  id: string
  sportId: string
  sportName: string
  fields: string
  version: number
  isActive: boolean
  createdByUser: string | null
  updatedAt: string
}

export interface CreateTemplateRequest {
  sportId: string
  fields: string
}

export interface UpdateTemplateRequest {
  fields?: string
}

export interface TemplateField {
  name: string
  type: "text" | "number" | "time" | "dropdown"
  required: boolean
  unit?: string
  label: {
    de: string
    fr: string
    en: string
  }
  options?: string[]
}

export interface AuditLogListItem {
  id: string
  userId: string | null
  action: string
  entity: string
  entityId: string | null
  oldValue: string | null
  newValue: string | null
  ipAddress: string | null
  details: string | null
  timestamp: string
}

export interface MedalAssetInfo {
  type: string
  exists: boolean
  hasBackup: boolean
  lastModified: string | null
  url: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

export interface AdminDashboardStats {
  totalUsers: number
  activeJudges: number
  pendingResults: number
  openProtests: number
  recentForcePublish: boolean
}

// ── Athlete Management ──

export interface AdminAthleteListItem {
  id: string
  name: string
  countryCode: string
  dateOfBirth: string | null
  age: number | null
  photoUrl: string | null
  resultsCount: number
}

export interface AdminAthleteResult {
  id: string
  rank: number | null
  medal: string
  athleteId: string
  athleteName: string
  countryCode: string
  value: string
  unit: string
  eventName: string
  sportName: string
  status: string
}

export interface AdminAthleteDetail extends AdminAthleteListItem {
  createdAt: string
  updatedAt: string
  results: AdminAthleteResult[]
}

export interface CreateAthleteRequest {
  name: string
  countryCode: string
  dateOfBirth?: string | null
  photoUrl?: string | null
}

export interface UpdateAthleteRequest {
  name?: string
  countryCode?: string
  dateOfBirth?: string | null
  photoUrl?: string | null
}

