// lib/auth-context.tsx | Task: REM-003 | Auth context with in-memory JWT (never sessionStorage)
"use client"

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react"
import * as authApi from "@/lib/api/auth"

// .NET ClaimTypes URIs used in JWT
const CLAIM_ROLE = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
const CLAIM_NAME = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"

export type UserRole = "admin" | "judge" | null

interface User {
  token: string
  username: string
  role: UserRole
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  role: UserRole
  login: (email: string, password: string) => Promise<void>
  loginWithToken: (token: string) => void
  logout: () => void
  getToken: () => string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function parseJwtPayload(token: string): { username: string; role: UserRole } {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    const username = payload[CLAIM_NAME] ?? payload.name ?? "unknown"
    const rawRole = payload[CLAIM_ROLE] ?? payload.role
    const roleStr = Array.isArray(rawRole) ? rawRole[0] : rawRole
    const role: UserRole =
      roleStr?.toLowerCase() === "admin" ? "admin" :
      roleStr?.toLowerCase() === "judge" ? "judge" :
      null
    return { username, role }
  } catch {
    return { username: "unknown", role: null }
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // On mount, try to restore session via refresh token cookie
  useEffect(() => {
    let cancelled = false
    authApi.refreshToken()
      .then((response) => {
        if (!cancelled && response.token) {
          const { username, role } = parseJwtPayload(response.token)
          setUser({ token: response.token, username, role })
        }
      })
      .catch(() => {
        // No valid refresh token — stay logged out
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const response = await authApi.login(email, password)
    if (!response.token) {
      throw new Error(response.requires2Fa ? '2FA_REQUIRED' : '2FA_SETUP_REQUIRED')
    }
    const { username, role } = parseJwtPayload(response.token)
    setUser({ token: response.token, username, role })
  }, [])

  const loginWithToken = useCallback((token: string) => {
    const { username, role } = parseJwtPayload(token)
    setUser({ token, username, role })
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    // Clear the server-side refresh cookie
    authApi.logoutServer().catch(() => {})
  }, [])

  const getToken = useCallback(() => {
    return user?.token ?? null
  }, [user])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, role: user?.role ?? null, login, loginWithToken, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
