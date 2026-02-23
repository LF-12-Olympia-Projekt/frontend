// components/last-modified.tsx | Task: FE-002 | Last modified display with tooltip
"use client"

interface LastModifiedProps {
  name: string | null | undefined
  date: string | null | undefined
  className?: string
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHour = Math.floor(diffMs / 3600000)
  const diffDay = Math.floor(diffMs / 86400000)

  if (diffMin < 1) return "just now"
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHour < 24) return `${diffHour}h ago`
  if (diffDay < 30) return `${diffDay}d ago`
  return date.toLocaleDateString()
}

export function LastModified({ name, date, className = "" }: LastModifiedProps) {
  if (!date) return null

  const exactDate = new Date(date).toLocaleString()

  return (
    <span className={`text-sm text-muted-foreground ${className}`} title={exactDate}>
      {name && <span>{name}, </span>}
      <span>{formatRelativeTime(date)}</span>
    </span>
  )
}
