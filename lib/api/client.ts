// frontend/lib/api/client.ts | Task: FINAL-002 | API client with 401 interceptor + silent refresh
"use client"

import { getToken } from "@/lib/auth"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!

export class ApiError extends Error {
    constructor(
        public status: number,
        message: string
    ) {
        super(message)
    }
}

/** Callback set by AuthProvider to handle 401 responses */
let _onUnauthorized: (() => void) | null = null
/** Callback to update in-memory token after silent refresh */
let _onTokenRefreshed: ((token: string) => void) | null = null

export function registerUnauthorizedHandler(handler: () => void) {
    _onUnauthorized = handler
}

export function registerTokenRefreshHandler(handler: (token: string) => void) {
    _onTokenRefreshed = handler
}

let _isRefreshing = false

async function attemptSilentRefresh(): Promise<string | null> {
    if (_isRefreshing) return null
    _isRefreshing = true
    try {
        const res = await fetch(`${API_BASE}/api/auth/refresh`, {
            method: "POST",
            credentials: "include",
        })
        if (res.ok) {
            const data = await res.json()
            if (data.token) {
                _onTokenRefreshed?.(data.token)
                return data.token
            }
        }
    } catch {
        // Refresh failed
    } finally {
        _isRefreshing = false
    }
    return null
}

export async function apiClient<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getToken()
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
    }

    if (token) {
        headers["Authorization"] = `Bearer ${token}`
    }

    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers,
        credentials: "include",
    })

    // On 401: attempt one silent refresh before giving up
    if (res.status === 401) {
        const newToken = await attemptSilentRefresh()
        if (newToken) {
            headers["Authorization"] = `Bearer ${newToken}`
            const retryRes = await fetch(`${API_BASE}${path}`, {
                ...options,
                headers,
                credentials: "include",
            })
            if (retryRes.ok || retryRes.status !== 401) {
                return handleResponse<T>(retryRes)
            }
        }
        _onUnauthorized?.()
        throw new ApiError(401, "Unauthorized")
    }

    return handleResponse<T>(res)
}

async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const text = await res.text()
        throw new ApiError(res.status, text || "Request failed")
    }

    const contentLength = res.headers.get("content-length")
    if (res.status === 204 || contentLength === "0") {
        return undefined as T
    }

    const text = await res.text()
    if (!text) {
        return undefined as T
    }

    return JSON.parse(text) as T
}