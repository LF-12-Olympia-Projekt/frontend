// frontend/lib/api/client.ts | Task: BE-FIX-001 | API client with 401 interceptor
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

export function registerUnauthorizedHandler(handler: () => void) {
    _onUnauthorized = handler
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

    if (res.status === 401) {
        _onUnauthorized?.()
        throw new ApiError(401, "Unauthorized")
    }

    if (!res.ok) {
        const text = await res.text()
        let parsed = text || "Request failed"
        try {
            const json = JSON.parse(text)
            if (json.message) parsed = json.message
        } catch { /* not JSON, use raw text */ }
        throw new ApiError(res.status, parsed)
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