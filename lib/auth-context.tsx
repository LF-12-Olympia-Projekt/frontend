// lib/auth-context.tsx | Task: FE-001 | Auth context with in-memory JWT storage
"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react"
import * as authApi from "@/lib/api/auth"

interface User {
  token: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  getToken: () => string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = useCallback(async (email: string, password: string) => {
    const { token } = await authApi.login(email, password)
    setUser({ token })
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  const getToken = useCallback(() => {
    return user?.token ?? null
  }, [user])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, getToken }}>
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
