import { apiClient } from "./client"

export interface LoginResponse {
    token: string
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