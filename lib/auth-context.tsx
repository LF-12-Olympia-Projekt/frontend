// lib/auth-context.tsx | Task: REM-003 | Auth context with localStorage JWT persistence
"use client"

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react"
import * as authApi from "@/lib/api/auth"

// .NET ClaimTypes URIs used in JWT
const CLAIM_ROLE = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
const CLAIM_NAME = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
const TOKEN_KEY = "auth_token"

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
  login: (email: string, password: string) => Promise<authApi.LoginResponse | void>
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

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    return payload.exp ? payload.exp * 1000 < Date.now() : false
  } catch {
    return true
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Restore session from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(TOKEN_KEY)
    if (saved && !isTokenExpired(saved)) {
      const { username, role } = parseJwtPayload(saved)
      setUser({ token: saved, username, role })
    } else if (saved) {
      localStorage.removeItem(TOKEN_KEY)
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const response = await authApi.login(email, password)
    if (!response.token) {
      return response
    }
    localStorage.setItem(TOKEN_KEY, response.token)
    const { username, role } = parseJwtPayload(response.token)
    setUser({ token: response.token, username, role })
    return response
  }, [])

  const loginWithToken = useCallback((token: string) => {
    localStorage.setItem(TOKEN_KEY, token)
    const { username, role } = parseJwtPayload(token)
    setUser({ token, username, role })
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
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
