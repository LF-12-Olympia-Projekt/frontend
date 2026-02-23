// lib/security/sanitize.ts | Task: FE-005 | Input sanitization for XSS prevention
const HTML_TAG_RE = /<[^>]*>/g
const CONTROL_CHAR_RE = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g

const ENTITY_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
}
const ESCAPE_RE = /[&<>"']/g

/**
 * Strip HTML tags and control characters from input.
 * Use before sending user input to the API.
 */
export function stripHtml(input: string): string {
  return input.replace(HTML_TAG_RE, '').replace(CONTROL_CHAR_RE, '').trim()
}

/**
 * Escape HTML entities for safe rendering in dynamic content.
 * Use when displaying user-generated content.
 */
export function escapeHtml(input: string): string {
  return input.replace(ESCAPE_RE, (char) => ENTITY_MAP[char] || char)
}

/**
 * Sanitize all string values in a form data object.
 * Returns a new object with sanitized strings.
 */
export function sanitizeFormData<T extends Record<string, unknown>>(data: T): T {
  const sanitized = { ...data }
  for (const key of Object.keys(sanitized)) {
    const val = sanitized[key]
    if (typeof val === 'string') {
      (sanitized as any)[key] = stripHtml(val)
    }
  }
  return sanitized
}

/**
 * Validate string length before sending to API.
 */
export function validateMaxLength(input: string | null | undefined, maxLength: number): boolean {
  if (!input) return true
  return input.length <= maxLength
}
