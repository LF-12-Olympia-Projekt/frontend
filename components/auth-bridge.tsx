// frontend/components/auth-bridge.tsx | Task: BE-FIX-001 | Bridges auth context to API client
"use client"

import { useEffect } from "react"
import { useAuth as useAuthSimple, registerTokenGetter } from "@/lib/auth"
import { useAuth } from "@/lib/auth-context"
import { registerUnauthorizedHandler } from "@/lib/api/client"
import { useRouter } from "next/navigation"
import { useTranslation } from "@/lib/locale-context"

export function AuthBridge() {
    const { token, setToken, logout: simpleLogout } = useAuthSimple()
    const { user, logout: contextLogout } = useAuth()
    const router = useRouter()
    const { locale } = useTranslation()

    // Sync auth-context token → simple auth (for API client)
    useEffect(() => {
        const contextToken = user?.token ?? null
        if (contextToken !== token) {
            setToken(contextToken)
        }
    }, [user?.token, token, setToken])

    useEffect(() => {
        registerTokenGetter(() => user?.token ?? token)
    }, [user?.token, token])

    useEffect(() => {
        registerUnauthorizedHandler(() => {
            simpleLogout()
            contextLogout()
            router.push(`/${locale}/login`)
        })
    }, [simpleLogout, contextLogout, router, locale])

    return null
}
