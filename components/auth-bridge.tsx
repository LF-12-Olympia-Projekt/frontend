// frontend/components/auth-bridge.tsx | Task: BE-FIX-001 | Bridges auth context to API client
"use client"

import { useEffect } from "react"
import { useAuth, registerTokenGetter } from "@/lib/auth"
import { registerUnauthorizedHandler } from "@/lib/api/client"
import { useRouter } from "next/navigation"
import { useTranslation } from "@/lib/locale-context"

export function AuthBridge() {
    const { token, logout } = useAuth()
    const router = useRouter()
    const { locale } = useTranslation()

    useEffect(() => {
        registerTokenGetter(() => token)
    }, [token])

    useEffect(() => {
        registerUnauthorizedHandler(() => {
            logout()
            router.push(`/${locale}/login`)
        })
    }, [logout, router, locale])

    return null
}
