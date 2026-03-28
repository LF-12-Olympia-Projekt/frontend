// lib/api/judge.ts | Task: FE-003 | Typed fetch functions for all judge/reviewer API endpoints
import { apiClient } from "./client"
import type {
  CreateResultRequest,
  UpdateResultRequest,
  ProtestRequest,
  InvalidateRequest,
  RejectRequest,
  JudgeResultListItem,
  JudgeResultDetail,
  ReviewQueueItem,
  PaginatedResponse,
} from "@/types/judge"

function authHeaders(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` }
}

// POST /api/judge/results — Create new result as draft
export async function createResult(token: string, data: CreateResultRequest) {
  return apiClient<JudgeResultListItem>("/api/judge/results", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  })
}

// PUT /api/judge/results/{id} — Edit existing draft result
export async function updateResult(token: string, id: string, data: UpdateResultRequest) {
  return apiClient<JudgeResultListItem>(`/api/judge/results/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  })
}

// POST /api/judge/results/{id}/submit — Submit draft for review
export async function submitResult(token: string, id: string) {
  return apiClient<JudgeResultListItem>(`/api/judge/results/${id}/submit`, {
    method: "POST",
    headers: authHeaders(token),
  })
}

// POST /api/judge/results/{id}/protest — File protest
export async function protestResult(token: string, id: string, data: ProtestRequest) {
  return apiClient<{ message: string; protestId: string }>(`/api/judge/results/${id}/protest`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  })
}

// POST /api/judge/results/{id}/invalidate — Invalidate result
export async function invalidateResult(token: string, id: string, data: InvalidateRequest) {
  return apiClient<{ message: string }>(`/api/judge/results/${id}/invalidate`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  })
}

// GET /api/judge/results — List own results
export async function getJudgeResults(
  token: string,
  params?: { status?: string; page?: number; pageSize?: number }
) {
  const searchParams = new URLSearchParams()
  if (params?.status) searchParams.set("status", params.status)
  if (params?.page) searchParams.set("page", String(params.page))
  if (params?.pageSize) searchParams.set("pageSize", String(params.pageSize))
  const qs = searchParams.toString()
  return apiClient<PaginatedResponse<JudgeResultListItem>>(
    `/api/judge/results${qs ? `?${qs}` : ""}`,
    { headers: authHeaders(token) }
  )
}

// GET /api/judge/results/{id} — Full detail of own result
export async function getJudgeResultDetail(token: string, id: string) {
  return apiClient<JudgeResultDetail>(`/api/judge/results/${id}`, {
    headers: authHeaders(token),
  })
}

// GET /api/reviewer/queue — Reviewer queue
export async function getReviewQueue(
  token: string,
  params?: { page?: number; pageSize?: number }
) {
  const searchParams = new URLSearchParams()
  if (params?.page) searchParams.set("page", String(params.page))
  if (params?.pageSize) searchParams.set("pageSize", String(params.pageSize))
  const qs = searchParams.toString()
  return apiClient<PaginatedResponse<ReviewQueueItem>>(
    `/api/reviewer/queue${qs ? `?${qs}` : ""}`,
    { headers: authHeaders(token) }
  )
}

// GET /api/reviewer/results/{id} — Reviewer detail
export async function getReviewResultDetail(token: string, id: string) {
  return apiClient<JudgeResultDetail>(`/api/reviewer/results/${id}`, {
    headers: authHeaders(token),
  })
}

// POST /api/reviewer/results/{id}/approve — Approve (Vier-Augen)
export async function approveResult(token: string, id: string) {
  return apiClient<{ message: string; status: string }>(`/api/reviewer/results/${id}/approve`, {
    method: "POST",
    headers: authHeaders(token),
  })
}

// POST /api/reviewer/results/{id}/reject — Reject
export async function rejectResult(token: string, id: string, data: RejectRequest) {
  return apiClient<{ message: string; status: string }>(`/api/reviewer/results/${id}/reject`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  })
}
