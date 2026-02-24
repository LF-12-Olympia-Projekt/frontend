// frontend/lib/auth.ts | Task: BE-FIX-001 | In-memory JWT auth context (never localStorage)
"use client"

import React, { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from "react"

interface AuthContextType {
    token: string | null
    setToken: (token: string | null) => void
    isAuthenticated: boolean
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setTokenState] = useState<string | null>(null)

    const setToken = useCallback((newToken: string | null) => {
        setTokenState(newToken)
    }, [])

    const logout = useCallback(() => {
        setTokenState(null)
    }, [])

    const value = useMemo(() => ({
        token,
        setToken,
        isAuthenticated: !!token,
        logout,
    }), [token, setToken, logout])

    return React.createElement(AuthContext.Provider, { value }, children)
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}

/** Get token for use in API client ÔÇô returns current in-memory token */
let _getTokenFn: (() => string | null) | null = null

export function registerTokenGetter(fn: () => string | null) {
    _getTokenFn = fn
}

export function getToken(): string | null {
    return _getTokenFn ? _getTokenFn() : null
}
