// components/country-flag.tsx | Task: FE-002 | Country flag by ISO code
interface CountryFlagProps {
  countryCode: string
  size?: "sm" | "md" | "lg"
  className?: string
}

function codeToEmoji(code: string): string {
  const cc = code.toUpperCase().slice(0, 2)
  return cc
    .split("")
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join("")
}

const sizeClasses = {
  sm: "text-base",
  md: "text-xl",
  lg: "text-3xl",
}

export function CountryFlag({ countryCode, size = "md", className = "" }: CountryFlagProps) {
  if (!countryCode) return null
  return (
    <span className={`${sizeClasses[size]} leading-none ${className}`} role="img" aria-label={countryCode}>
      {codeToEmoji(countryCode)}
    </span>
  )
}
