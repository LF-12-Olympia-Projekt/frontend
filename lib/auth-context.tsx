// lib/auth-context.tsx | Task: FE-003 | Auth context with sessionStorage-backed JWT
"use client"

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react"
import * as authApi from "@/lib/api/auth"

const TOKEN_KEY = "olympia_jwt"

interface User {
  token: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  getToken: () => string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function readStoredToken(): User | null {
  if (typeof window === "undefined") return null
  try {
    const token = sessionStorage.getItem(TOKEN_KEY)
    if (!token) return null
    // Check if token is expired by decoding the payload
    const payload = JSON.parse(atob(token.split(".")[1]))
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      sessionStorage.removeItem(TOKEN_KEY)
      return null
    }
    return { token }
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
    setUser({ token })
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY)
    setUser(null)
  }, [])

  const getToken = useCallback(() => {
    return user?.token ?? null
  }, [user])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, getToken }}>
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
