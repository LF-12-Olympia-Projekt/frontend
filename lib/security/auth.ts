// lib/security/auth.ts | Task: FE-005 | Auth security utilities
/**
 * Security rules enforced:
 * 1. JWT stored in sessionStorage only (never localStorage, never cookie)
 * 2. Token expiry checked before every API call
 * 3. Auto-logout on 401 response from any endpoint
 */

const TOKEN_KEY = 'olympia_jwt'

/**
 * Check if a JWT token is expired.
 */
export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    if (!payload.exp) return false
    return payload.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

/**
 * Get valid token or null. Removes expired tokens automatically.
 */
export function getValidToken(): string | null {
  if (typeof window === 'undefined') return null
  const token = sessionStorage.getItem(TOKEN_KEY)
  if (!token) return null
  if (isTokenExpired(token)) {
    sessionStorage.removeItem(TOKEN_KEY)
    return null
  }
  return token
}

/**
 * Create a fetch wrapper that auto-handles 401 responses.
 * On 401: clears token, redirects to login.
 */
export function createSecureFetch(onUnauthorized: () => void) {
  return async (url: string, options?: RequestInit): Promise<Response> => {
    const token = getValidToken()

    if (token && isTokenExpired(token)) {
      onUnauthorized()
      throw new Error('Token expired')
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options?.headers as Record<string, string>),
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch(url, { ...options, headers })

    if (response.status === 401) {
      sessionStorage.removeItem(TOKEN_KEY)
      onUnauthorized()
    }

    return response
  }
}
