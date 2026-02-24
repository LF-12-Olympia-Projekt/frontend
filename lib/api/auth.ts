// frontend/lib/api/auth.ts | Task: BE-FIX-003 | Auth API with 2FA support
import { apiClient } from "./client"

export interface LoginResponse {
    token?: string
    requires2Fa?: boolean
    requires2FaSetup?: boolean
    tempToken?: string
}

export interface TwoFactorSetupResponse {
    secret: string
    qrCodeUri: string
}

export async function login(
    email: string,
    password: string
): Promise<LoginResponse> {
    return apiClient<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ "Email": email, "Password": password }),
    })
}

export async function setup2Fa(tempToken: string): Promise<TwoFactorSetupResponse> {
    return apiClient<TwoFactorSetupResponse>("/api/auth/2fa/setup", {
        method: "POST",
        body: JSON.stringify({ Code: tempToken }),
    })
}

export async function verify2Fa(tempToken: string, code: string): Promise<LoginResponse> {
    return apiClient<LoginResponse>("/api/auth/2fa/verify", {
        method: "POST",
        body: JSON.stringify({ TempToken: tempToken, Code: code }),
    })
}

export async function login2Fa(tempToken: string, code: string): Promise<LoginResponse> {
    return apiClient<LoginResponse>("/api/auth/2fa/login", {
        method: "POST",
        body: JSON.stringify({ TempToken: tempToken, Code: code }),
    })
}

export async function forgotPassword(
    usernameOrEmail: string
): Promise<void> {
    await apiClient<void>("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ "UsernameOrEmail": usernameOrEmail }),
    })
}

export async function resetPassword(
    token: string,
    newPassword: string
): Promise<void> {
    await apiClient<void>("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, newPassword }),
    })
}