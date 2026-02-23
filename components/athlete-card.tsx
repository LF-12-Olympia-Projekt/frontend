// components/athlete-card.tsx | Task: FE-002 | Athlete summary card
import Link from "next/link"
import { User } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { CountryFlag } from "@/components/country-flag"
import type { AthleteInfo } from "@/types/api"

interface AthleteCardProps {
  athlete: AthleteInfo
  locale: string
  disciplines?: string[]
}

export function AthleteCard({ athlete, locale, disciplines }: AthleteCardProps) {
  return (
    <Link href={`/${locale}/athletes/${athlete.id}`}>
      <Card className="transition-colors hover:bg-muted/50">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-muted">
            {athlete.photoUrl ? (
              <img src={athlete.photoUrl} alt={athlete.name} className="h-12 w-12 rounded-full object-cover" />
            ) : (
              <User className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate font-medium">{athlete.name}</p>
              <CountryFlag countryCode={athlete.countryCode} size="sm" />
            </div>
            {athlete.age && (
              <p className="text-sm text-muted-foreground">{athlete.age} years</p>
            )}
            {disciplines && disciplines.length > 0 && (
              <p className="truncate text-sm text-muted-foreground">{disciplines.join(", ")}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
