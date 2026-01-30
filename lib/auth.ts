export function getToken(): string | null {
    return localStorage.getItem("token")
}

export function logout() {
    localStorage.removeItem("token")
}

export function isAuthenticated(): boolean {
    return !!getToken()
}