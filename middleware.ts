// frontend/middleware.ts | Task: FE-FIX-001 | Corrected locale codes with browser detection
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['de', 'de-BA', 'fr-FR', 'en-GB']
const defaultLocale = 'de'

// Map common browser locale prefixes to our supported locales
function matchLocale(acceptLang: string | null): string {
  if (!acceptLang) return defaultLocale
  const preferred = acceptLang.split(',').map(l => l.split(';')[0].trim())
  for (const lang of preferred) {
    if (locales.includes(lang)) return lang
    if (lang.startsWith('de')) return 'de'
    if (lang.startsWith('fr')) return 'fr-FR'
    if (lang.startsWith('en')) return 'en-GB'
  }
  return defaultLocale
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  const locale = matchLocale(request.headers.get('accept-language'))
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|next.svg|vercel.svg).*)',
  ],
}
