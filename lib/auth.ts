// lib/auth.ts | Task: FE-001 | Auth utilities (deprecated – use useAuth hook instead)
// This file is kept for backward compatibility.
// New code should use the useAuth() hook from lib/auth-context.tsx

export function isAuthenticated(): boolean {
  console.warn("isAuthenticated() is deprecated. Use useAuth().isAuthenticated instead.")
  return false
}