// components/medal-badge.tsx | Task: FE-002 | Medal badge SVG component

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? ""

const altMap: Record<string, string> = {
  gold: "Gold Medal",
  silver: "Silver Medal",
  bronze: "Bronze Medal",
}

interface MedalBadgeProps {
  medal: string | null | undefined
  size?: number
  className?: string
}

export function MedalBadge({ medal, size = 24, className = "" }: MedalBadgeProps) {
  if (!medal || medal === "none") return null
  const key = medal.toLowerCase()
  if (!altMap[key]) return null

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${API_BASE}/assets/medals/${key}.svg`}
      alt={altMap[key]}
      width={size}
      height={size}
      className={className}
    />
  )
}
