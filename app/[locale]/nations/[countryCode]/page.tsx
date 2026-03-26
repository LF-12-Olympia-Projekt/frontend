"use client"

import { use, useState, useEffect } from "react"
import { PageWrapper } from "@/components/page-wrapper"
import { useTranslation } from "@/lib/locale-context"
import { CountryHero } from "@/components/country-hero"
import { MedalSummaryCards } from "@/components/medal-summary-cards"
import { CountryResultsTable } from "@/components/country-results-table"
import { TopAthletesSidebar } from "@/components/top-athletes-sidebar"
import { MedalTimelineSidebar } from "@/components/medal-timeline-sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { ChevronRight, Loader2 } from "lucide-react"
import { getCountryMedals } from "@/lib/api/results"
import type { CountryMedalDetail } from "@/types/api"

interface PageProps {
  params: Promise<{
    locale: string
    countryCode: string
  }>
}

export default function NationPage({ params }: PageProps) {
  const { dictionary } = useTranslation()
  const t = dictionary.nations || {}
  const common = dictionary.common || {}

  // Unwrap params Promise
  const { countryCode } = use(params)

  const [data, setData] = useState<CountryMedalDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCountryMedals(countryCode.toUpperCase())
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [countryCode])

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </PageWrapper>
    )
  }

  const countryData = {
    code: data?.country?.countryCode || countryCode.toUpperCase(),
    name: data?.country?.name || countryCode.toUpperCase(),
    gold: data?.medals?.gold ?? 0,
    silver: data?.medals?.silver ?? 0,
    bronze: data?.medals?.bronze ?? 0,
    total: (data?.medals?.gold ?? 0) + (data?.medals?.silver ?? 0) + (data?.medals?.bronze ?? 0),
  }

  const results = data?.results ?? []

  return (
    <PageWrapper>
      <div className="min-h-screen bg-background">
        {/* Breadcrumb */}
        <div className="border-b bg-muted/30 px-4 py-3 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">{common.home}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/nations">{t.breadcrumb}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage>{countryData.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* Hero Section */}
        <CountryHero country={countryData} />

        {/* Medal Summary Cards */}
        <div className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <MedalSummaryCards 
              gold={countryData.gold}
              silver={countryData.silver}
              bronze={countryData.bronze}
              total={countryData.total}
            />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
              {/* Left Column - Results Table */}
              <div>
                <CountryResultsTable countryCode={countryData.code} />
              </div>

              {/* Right Column - Sidebar */}
              <div className="space-y-6">
                <TopAthletesSidebar countryCode={countryData.code} results={results} />
                <MedalTimelineSidebar countryCode={countryData.code} results={results} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}