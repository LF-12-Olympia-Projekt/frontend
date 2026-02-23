"use client"

import React from "react"

import { useState } from "react"
import * as authApi from "@/lib/api/auth"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { PageWrapper } from "@/components/page-wrapper"
import {
    User,
    Lock,
    Mail,
    Eye,
    EyeOff,
    AlertCircle,
    Loader2,
    Shield,
    ArrowRight,
} from "lucide-react"
import { useTranslation } from "@/lib/locale-context"
import { useAuth } from "@/lib/auth-context"

type AuthStep = "login" | "2fa" | "forgot-password" | "reset-sent"

export default function LoginPage() {
    const router = useRouter()
    const { dictionary, locale } = useTranslation()
    const t = dictionary.common
    const { login: authLogin } = useAuth()

    const [step, setStep]= useState<AuthStep>("login")
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Form state
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsLoading(true)

        try {
            await authLogin(email, password)
            router.push(`/${locale}/judge`)
        } catch {
            setError(t.invalidCredentials)
        } finally {
            setIsLoading(false)
        }
    }

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            await authApi.forgotPassword(email)
            setStep("reset-sent")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <PageWrapper>
            <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
                {/* Breadcrumb */}
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href={`/${locale}`}>{t.home}</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>
                                {step === "login" && t.login}
                                {step === "forgot-password" && t.forgotPasswordTitle}
                                {step === "reset-sent" && t.emailSentTitle}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                {/* Login Form */}
                {step === "login" && (
                    <Card className="mt-8 border-0 shadow-lg">
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-olympic-blue/10">
                                <User className="h-8 w-8 text-olympic-blue" />
                            </div>
                            <CardTitle className="text-2xl">{t.welcomeBack}</CardTitle>
                            <CardDescription>
                                {t.loginDescription}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleLogin} className="space-y-4">
                                {error && (
                                    <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                        <p>{error}</p>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="email">{t.email}</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="name@beispiel.de"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-9"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">{t.password}</Label>
                                        <button
                                            type="button"
                                            onClick={() => setStep("forgot-password")}
                                            className="text-sm text-olympic-blue hover:underline"
                                        >
                                            {t.forgotPassword}?
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="pl-9 pr-10"
                                            required
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {t.authenticating}
                                        </>
                                    ) : (
                                        <>
                                            {t.loginAction}
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Forgot Password Form */}
                {step === "forgot-password" && (
                    <Card className="mt-8 border-0 shadow-lg">
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-olympic-yellow/20">
                                <Mail className="h-8 w-8 text-olympic-yellow" />
                            </div>
                            <CardTitle className="text-2xl">{t.forgotPasswordTitle}</CardTitle>
                            <CardDescription>
                                {t.enterEmailForReset}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleForgotPassword} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="reset-email">{t.email}</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="reset-email"
                                            type="email"
                                            placeholder="name@beispiel.de"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-9"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {t.sending}
                                        </>
                                    ) : (
                                        t.loginAction
                                    )}
                                </Button>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="w-full"
                                    onClick={() => {
                                        setStep("login")
                                        setError(null)
                                    }}
                                >
                                    {t.backToLogin}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Reset Sent Confirmation */}
                {step === "reset-sent" && (
                    <Card className="mt-8 border-0 shadow-lg">
                        <CardHeader className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-olympic-green/10">
                                <Mail className="h-8 w-8 text-olympic-green" />
                            </div>
                            <CardTitle className="text-2xl">{t.emailSentTitle}</CardTitle>
                            <CardDescription>
                                {t.resetLinkSent}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button
                                className="w-full"
                                onClick={() => {
                                    setStep("login")
                                    setEmail("")
                                }}
                            >
                                {t.backToLogin}
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </PageWrapper>
    )
}
