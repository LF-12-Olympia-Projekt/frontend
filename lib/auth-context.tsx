// lib/auth-context.tsx | Task: FE-003 | Auth context with sessionStorage-backed JWT
"use client"

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react"
import * as authApi from "@/lib/api/auth"

const TOKEN_KEY = "olympia_jwt"

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
  logout: () => void
  getToken: () => string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function parseJwtPayload(token: string): { username: string; role: UserRole } {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    const username = payload[CLAIM_NAME] ?? payload.name ?? "unknown"
    const rawRole = payload[CLAIM_ROLE] ?? payload.role
    // Role can be string or array; take first match
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

function readStoredToken(): User | null {
  if (typeof window === "undefined") return null
  try {
    const token = sessionStorage.getItem(TOKEN_KEY)
    if (!token) return null
    const payload = JSON.parse(atob(token.split(".")[1]))
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      sessionStorage.removeItem(TOKEN_KEY)
      return null
    }
    const { username, role } = parseJwtPayload(token)
    return { token, username, role }
  } catch {
    sessionStorage.removeItem(TOKEN_KEY)
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Restore token from sessionStorage on mount
  useEffect(() => {
    setUser(readStoredToken())
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const { token } = await authApi.login(email, password)
    sessionStorage.setItem(TOKEN_KEY, token)
    const { username, role } = parseJwtPayload(token)
    setUser({ token, username, role })
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY)
    setUser(null)
  }, [])

  const getToken = useCallback(() => {
    return user?.token ?? null
  }, [user])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, role: user?.role ?? null, login, logout, getToken }}>
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
