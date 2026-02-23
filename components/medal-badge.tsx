// components/medal-badge.tsx | Task: FE-002 | Medal badge SVG component
import Image from "next/image"

interface MedalBadgeProps {
  medal: string | null | undefined
  size?: number
  className?: string
}

const medalMap: Record<string, { src: string; alt: string }> = {
  gold: { src: "/icons/medal-gold.svg", alt: "Gold Medal" },
  silver: { src: "/icons/medal-silver.svg", alt: "Silver Medal" },
  bronze: { src: "/icons/medal-bronze.svg", alt: "Bronze Medal" },
}

export function MedalBadge({ medal, size = 24, className = "" }: MedalBadgeProps) {
  if (!medal || medal === "none") return null
  const info = medalMap[medal.toLowerCase()]
  if (!info) return null

  return (
    <Image
      src={info.src}
      alt={info.alt}
      width={size}
      height={size}
      className={className}
    />
  )
}
