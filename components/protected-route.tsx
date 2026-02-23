// components/protected-route.tsx | Task: FE-001 | Protected route wrapper component
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useTranslation } from "@/lib/locale-context"

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth()
  const { locale } = useTranslation()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(`/${locale}/login`)
    }
  }, [isAuthenticated, locale, router])

  if (!isAuthenticated) {
    return fallback ?? null
  }

  return <>{children}</>
}
