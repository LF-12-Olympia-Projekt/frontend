const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!

export class ApiError extends Error {
    constructor(
        public status: number,
        message: string
    ) {
        super(message)
    }
}

export async function apiClient<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
        ...options,
    })

    if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "Request failed")
    }

    // ⬇️ IMPORTANT PART
    const contentLength = res.headers.get("content-length")
    if (res.status === 204 || contentLength === "0") {
        return undefined as T
    }

    // Some servers don't send content-length
    const text = await res.text()
    if (!text) {
        return undefined as T
    }

    return JSON.parse(text) as T
}