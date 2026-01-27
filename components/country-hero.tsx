"use client"

import { useTranslation } from "@/lib/locale-context"
import { Badge } from "@/components/ui/badge"

interface CountryHeroProps {
  country: {
    code: string
    name: string
    gold: number
    silver: number
    bronze: number
    total: number
  }
}

export function CountryHero({ country }: CountryHeroProps) {
  const { dictionary } = useTranslation()
  const t = dictionary.nations || {}
  const medalTable = dictionary.medalTable || {}

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-black via-zinc-900 to-zinc-800 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          {/* Left Side - Country Info */}
          <div className="flex-1">
            <div className="mb-4 text-8xl font-black text-white/90 sm:text-9xl lg:text-[10rem]">
              {country.code}
            </div>
            <h1 className="mb-2 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              {country.name}
            </h1>
            <p className="text-lg text-zinc-400 sm:text-xl">
              {t.subtitle}
            </p>
          </div>

          {/* Right Side - Medal Counts */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400/20 text-2xl font-bold text-yellow-400">
                {country.gold}
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-400/20 text-2xl font-bold text-gray-300">
                {country.silver}
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-400/20 text-2xl font-bold text-orange-400">
                {country.bronze}
              </div>
            </div>
            <div className="flex flex-col items-center rounded-lg bg-white/5 px-6 py-3">
              <div className="text-3xl font-bold text-white">{country.total}</div>
              <div className="text-sm text-zinc-400">{t.totalMedals}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}