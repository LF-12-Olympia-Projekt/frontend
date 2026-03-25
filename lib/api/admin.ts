// lib/api/admin.ts | Task: FE-004 | Typed fetch functions for all admin API endpoints
import { apiClient } from "./client"
import type {
  AdminUserListItem,
  AdminUserDetail,
  CreateUserRequest,
  UpdateUserRequest,
  DelegateReviewerRequest,
  AdminResultListItem,
  RestoreResultRequest,
  ForcePublishRequest,
  PermanentDeleteRequest,
  SportTemplateListItem,
  CreateTemplateRequest,
  UpdateTemplateRequest,
  AuditLogListItem,
  MedalAssetInfo,
  PaginatedResponse,
} from "@/types/admin"
import type { JudgeResultDetail } from "@/types/judge"

function authHeaders(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` }
}

// ── User Management ──

export async function getUsers(
  token: string,
  params?: { role?: string; isLocked?: boolean; page?: number; pageSize?: number }
) {
  const sp = new URLSearchParams()
  if (params?.role) sp.set("role", params.role)
  if (params?.isLocked !== undefined) sp.set("isLocked", String(params.isLocked))
  if (params?.page) sp.set("page", String(params.page))
  if (params?.pageSize) sp.set("pageSize", String(params.pageSize))
  const qs = sp.toString()
  return apiClient<PaginatedResponse<AdminUserListItem>>(
    `/api/admin/users${qs ? `?${qs}` : ""}`,
    { headers: authHeaders(token) }
  )
}

export async function getUser(token: string, id: string) {
  return apiClient<AdminUserDetail>(`/api/admin/users/${id}`, {
    headers: authHeaders(token),
  })
}

export async function createUser(token: string, data: CreateUserRequest) {
  return apiClient<{ id: string; tempPassword: string; message: string }>("/api/admin/users", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  })
}

export async function updateUser(token: string, id: string, data: UpdateUserRequest) {
  return apiClient<AdminUserDetail>(`/api/admin/users/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  })
}

export async function lockUser(token: string, id: string) {
  return apiClient<{ message: string }>(`/api/admin/users/${id}/lock`, {
    method: "POST",
    headers: authHeaders(token),
  })
}

export async function unlockUser(token: string, id: string) {
  return apiClient<{ message: string }>(`/api/admin/users/${id}/unlock`, {
    method: "POST",
    headers: authHeaders(token),
  })
}

export async function deleteUser(token: string, id: string) {
  return apiClient<{ message: string }>(`/api/admin/users/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  })
}

export async function delegateReviewer(token: string, id: string, data: DelegateReviewerRequest) {
  return apiClient<{ message: string; validUntil: string }>(`/api/admin/users/${id}/delegate`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  })
}

// ── Result Management ──

export async function getAdminResults(
  token: string,
  params?: { status?: string; sport?: string; country?: string; date?: string; eventId?: string; page?: number; pageSize?: number }
) {
  const sp = new URLSearchParams()
  if (params?.status) sp.set("status", params.status)
  if (params?.sport) sp.set("sport", params.sport)
  if (params?.country) sp.set("country", params.country)
  if (params?.date) sp.set("date", params.date)
  if (params?.eventId) sp.set("eventId", params.eventId)
  if (params?.page) sp.set("page", String(params.page))
  if (params?.pageSize) sp.set("pageSize", String(params.pageSize))
  const qs = sp.toString()
  return apiClient<PaginatedResponse<AdminResultListItem>>(
    `/api/admin/results${qs ? `?${qs}` : ""}`,
    { headers: authHeaders(token) }
  )
}

export async function getAdminResultDetail(token: string, id: string) {
  return apiClient<JudgeResultDetail>(`/api/admin/results/${id}`, {
    headers: authHeaders(token),
  })
}

export async function restoreResult(token: string, id: string, data: RestoreResultRequest) {
  return apiClient<{ message: string; status: string }>(`/api/admin/results/${id}/restore`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  })
}

export async function forcePublish(token: string, id: string, data: ForcePublishRequest) {
  return apiClient<{ message: string; status: string }>(`/api/admin/results/${id}/force-publish`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  })
}

export async function permanentDelete(token: string, id: string, data: PermanentDeleteRequest) {
  return apiClient<{ message: string }>(`/api/admin/results/${id}/permanent`, {
    method: "DELETE",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  })
}

// ── Sport Templates ──

export async function getTemplates(token: string) {
  return apiClient<SportTemplateListItem[]>("/api/admin/templates", {
    headers: authHeaders(token),
  })
}

export async function getTemplate(token: string, id: string) {
  return apiClient<SportTemplateListItem>(`/api/admin/templates/${id}`, {
    headers: authHeaders(token),
  })
}

export async function createTemplate(token: string, data: CreateTemplateRequest) {
  return apiClient<SportTemplateListItem>("/api/admin/templates", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  })
}

export async function updateTemplate(token: string, id: string, data: UpdateTemplateRequest) {
  return apiClient<SportTemplateListItem>(`/api/admin/templates/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  })
}

// ── Audit Log ──

export async function getAuditLog(
  token: string,
  params?: { userId?: string; action?: string; entity?: string; from?: string; to?: string; page?: number; pageSize?: number }
) {
  const sp = new URLSearchParams()
  if (params?.userId) sp.set("userId", params.userId)
  if (params?.action) sp.set("action", params.action)
  if (params?.entity) sp.set("entity", params.entity)
  if (params?.from) sp.set("from", params.from)
  if (params?.to) sp.set("to", params.to)
  if (params?.page) sp.set("page", String(params.page))
  if (params?.pageSize) sp.set("pageSize", String(params.pageSize))
  const qs = sp.toString()
  return apiClient<PaginatedResponse<AuditLogListItem>>(
    `/api/admin/audit${qs ? `?${qs}` : ""}`,
    { headers: authHeaders(token) }
  )
}

export function getAuditExportUrl(params?: { userId?: string; action?: string; entity?: string; from?: string; to?: string }) {
  const sp = new URLSearchParams()
  sp.set("format", "csv")
  if (params?.userId) sp.set("userId", params.userId)
  if (params?.action) sp.set("action", params.action)
  if (params?.entity) sp.set("entity", params.entity)
  if (params?.from) sp.set("from", params.from)
  if (params?.to) sp.set("to", params.to)
  return `/api/admin/audit/export?${sp.toString()}`
}

// ── Medal Assets ──

export async function getMedalAssets(token: string) {
  return apiClient<MedalAssetInfo[]>("/api/admin/assets/medals", {
    headers: authHeaders(token),
  })
}

export async function updateMedalAsset(token: string, type: string, file: File) {
  const formData = new FormData()
  formData.append("file", file)
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!
  const res = await fetch(`${API_BASE}/api/admin/assets/medals/${type}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json() as Promise<{ message: string; type: string; hasBackup: boolean }>
}
