// types/admin.ts | Task: FE-004 | TypeScript types for admin interface

export type UserRole = "Admin" | "Judge"

export interface AdminUserListItem {
  id: string
  userName: string
  email: string
  roles: string[]
  isLocked: boolean
  lastLogin: string | null
  createdAt: string
  delegatedReviewerUntil: string | null
}

export interface AdminUserDetail {
  id: string
  userName: string
  email: string
  roles: string[]
  isLocked: boolean
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
  fields: TemplateFieldDto[]
  version: number
  isActive: boolean
  createdByUser: string | null
  updatedAt: string
}

export interface TemplateFieldDto {
  id: string
  name: string
  fieldType: string
  required: boolean
  unit?: string
  displayOrder: number
  labels?: Record<string, string>
}

export interface CreateTemplateRequest {
  sportId: string
  fields: TemplateFieldRequest[]
}

export interface TemplateFieldRequest {
  name: string
  fieldType: string
  required: boolean
  unit?: string
  displayOrder: number
  labels?: Record<string, string>
}

export interface UpdateTemplateRequest {
  sportId: string
  fields: TemplateFieldRequest[]
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
