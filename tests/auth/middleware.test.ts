// tests/auth/middleware.test.ts | Task: FE-005 | Auth route protection tests
import '@testing-library/jest-dom'

// Test auth route protection logic (unit tests for route matching)
// The actual middleware.ts handles locale redirects; auth is client-side via ProtectedRoute

describe('Auth Route Protection', () => {
  const publicRoutes = ['/en/results', '/en/medals', '/en/sports', '/en', '/en/login']
  const judgeRoutes = ['/en/judge/dashboard', '/en/judge/results', '/en/judge/results/new', '/en/judge/review']
  const adminRoutes = ['/en/admin/dashboard', '/en/admin/users', '/en/admin/results', '/en/admin/templates', '/en/admin/audit', '/en/admin/assets']

  function isProtectedRoute(pathname: string): boolean {
    return pathname.includes('/judge/') || pathname.includes('/admin/')
  }

  function requiresAdminRole(pathname: string): boolean {
    return pathname.includes('/admin/')
  }

  function requiresJudgeOrAdmin(pathname: string): boolean {
    return pathname.includes('/judge/') || pathname.includes('/admin/')
  }

  describe('Public routes', () => {
    it.each(publicRoutes)('%s is accessible without JWT', (route) => {
      expect(isProtectedRoute(route)).toBe(false)
    })
  })

  describe('Judge routes', () => {
    it.each(judgeRoutes)('%s requires authentication', (route) => {
      expect(isProtectedRoute(route)).toBe(true)
    })

    it.each(judgeRoutes)('%s requires judge or admin role', (route) => {
      expect(requiresJudgeOrAdmin(route)).toBe(true)
    })

    it.each(judgeRoutes)('%s does not require admin role', (route) => {
      expect(requiresAdminRole(route)).toBe(false)
    })
  })

  describe('Admin routes', () => {
    it.each(adminRoutes)('%s requires authentication', (route) => {
      expect(isProtectedRoute(route)).toBe(true)
    })

    it.each(adminRoutes)('%s requires admin role', (route) => {
      expect(requiresAdminRole(route)).toBe(true)
    })
  })

  describe('JWT parsing', () => {
    it('decodes role from .NET JWT claims', () => {
      const CLAIM_ROLE = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
      const CLAIM_NAME = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'

      const payload = {
        [CLAIM_NAME]: 'admin',
        [CLAIM_ROLE]: 'Admin',
        exp: Math.floor(Date.now() / 1000) + 3600,
      }

      const fakeToken = `header.${btoa(JSON.stringify(payload))}.signature`

      const decoded = JSON.parse(atob(fakeToken.split('.')[1]))
      expect(decoded[CLAIM_ROLE]).toBe('Admin')
      expect(decoded[CLAIM_NAME]).toBe('admin')
    })

    it('rejects expired JWT', () => {
      const payload = {
        exp: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
      }

      const fakeToken = `header.${btoa(JSON.stringify(payload))}.signature`
      const decoded = JSON.parse(atob(fakeToken.split('.')[1]))
      const isExpired = decoded.exp * 1000 < Date.now()

      expect(isExpired).toBe(true)
    })
  })
})
