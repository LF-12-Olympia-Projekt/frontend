"use client"

import { useTranslation } from "@/lib/locale-context"
import { Card, CardContent } from "@/components/ui/card"

interface MedalSummaryCardsProps {
  gold: number
  silver: number
  bronze: number
  total: number
}

export function MedalSummaryCards({ gold, silver, bronze, total }: MedalSummaryCardsProps) {
  const { dictionary } = useTranslation()
  const medalTable = dictionary.medalTable || {}
  const t = dictionary.nations || {}

  const cards = [
    {
      count: gold,
      label: medalTable.gold || "Gold",
      bgColor: "bg-gradient-to-br from-yellow-900/40 to-yellow-950/40",
      badgeBg: "bg-yellow-400/20",
      badgeText: "text-yellow-400",
      borderColor: "border-yellow-400/20"
    },
    {
      count: silver,
      label: medalTable.silver || "Silver",
      bgColor: "bg-gradient-to-br from-gray-800/40 to-gray-900/40",
      badgeBg: "bg-gray-400/20",
      badgeText: "text-gray-300",
      borderColor: "border-gray-400/20"
    },
    {
      count: bronze,
      label: medalTable.bronze || "Bronze",
      bgColor: "bg-gradient-to-br from-orange-900/40 to-orange-950/40",
      badgeBg: "bg-orange-400/20",
      badgeText: "text-orange-400",
      borderColor: "border-orange-400/20"
    },
    {
      count: total,
      label: t.totalMedals || "Total",
      bgColor: "bg-gradient-to-br from-zinc-900/40 to-black/40",
      badgeBg: "bg-white/10",
      badgeText: "text-white",
      borderColor: "border-white/10"
    }
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card
          key={index}
          className={`${card.bgColor} ${card.borderColor} overflow-hidden border shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
        >
          <CardContent className="flex flex-col items-center gap-3 p-6">
            <div
              className={`flex h-20 w-20 items-center justify-center rounded-full ${card.badgeBg} ${card.badgeText} text-3xl font-bold`}
            >
              {card.count}
            </div>
            <div className={`text-lg font-semibold ${card.badgeText}`}>
              {card.label}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}