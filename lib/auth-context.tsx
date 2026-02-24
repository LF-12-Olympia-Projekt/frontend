// lib/auth-context.tsx | Task: FINAL-002 | Auth context with in-memory JWT + refresh token on mount
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

  // On mount: attempt to get a new JWT via httpOnly refresh cookie
  useEffect(() => {
    let cancelled = false
    async function tryRefresh() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/refresh`,
          { method: "POST", credentials: "include" }
        )
        if (res.ok) {
          const data = await res.json()
          if (data.token && !cancelled) {
            const { username, role } = parseJwtPayload(data.token)
            setUser({ token: data.token, username, role })
          }
        }
      } catch {
        // No refresh cookie or server unavailable — stay logged out
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    tryRefresh()
    return () => { cancelled = true }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const resp = await authApi.login(email, password)
    if (!resp.token) throw new Error("No token received")
    const { username, role } = parseJwtPayload(resp.token)
    setUser({ token: resp.token, username, role })
  }, [])

  const loginWithToken = useCallback((token: string) => {
    const { username, role } = parseJwtPayload(token)
    setUser({ token, username, role })
  }, [])

  const logout = useCallback(async () => {
    setUser(null)
    // Clear httpOnly refresh cookie on server
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/logout`,
        { method: "POST", credentials: "include" }
      )
    } catch {
      // Best effort
    }
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
