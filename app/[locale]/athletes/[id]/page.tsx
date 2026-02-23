// app/[locale]/athletes/[id]/page.tsx | Task: FE-002 | Athlete profile page
import { notFound } from "next/navigation"
import { PageWrapper } from "@/components/page-wrapper"
import { MedalBadge } from "@/components/medal-badge"
import { CountryFlag } from "@/components/country-flag"
import { ResultsTable } from "@/components/results-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { getAthleteById } from "@/lib/api/results"
import { getDictionary, Locale } from "@/lib/dictionaries"
import { User } from "lucide-react"

export const revalidate = 60

export default async function AthleteProfilePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  const dictionary = await getDictionary(locale as Locale) as any
  const t = dictionary.athleteProfile || {}
  const tCommon = dictionary.common || {}

  let athlete
  try {
    athlete = await getAthleteById(id)
  } catch {
    notFound()
  }

  if (!athlete) notFound()

  const medalCounts = {
    gold: athlete.results?.filter((r: any) => r.medal === "gold").length || 0,
    silver: athlete.results?.filter((r: any) => r.medal === "silver").length || 0,
    bronze: athlete.results?.filter((r: any) => r.medal === "bronze").length || 0,
  }

  return (
    <PageWrapper>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${locale}`}>{tCommon.home}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${locale}/results`}>{dictionary.resultsPage?.breadcrumb || "Results"}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{athlete.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Profile card */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                    {athlete.photoUrl ? (
                      <img src={athlete.photoUrl} alt={athlete.name} className="h-24 w-24 rounded-full object-cover" />
                    ) : (
                      <User className="h-12 w-12 text-muted-foreground" />
                    )}
                  </div>
                  <h1 className="text-2xl font-bold">{athlete.name}</h1>
                  <div className="mt-2 flex items-center gap-2">
                    <CountryFlag countryCode={athlete.countryCode} size="lg" />
                    <span className="text-muted-foreground">{athlete.countryCode}</span>
                  </div>
                  {athlete.age && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {t.age || "Age"}: {athlete.age}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Disciplines */}
            {athlete.disciplines && athlete.disciplines.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t.disciplines || "Disciplines"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {athlete.disciplines.map((d: string) => (
                      <Badge key={d} variant="secondary">{d}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Medal summary */}
            {(medalCounts.gold + medalCounts.silver + medalCounts.bronze) > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{tCommon.medals || "Medals"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-around">
                    <div className="flex flex-col items-center gap-1">
                      <MedalBadge medal="gold" size={32} />
                      <span className="text-lg font-bold">{medalCounts.gold}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <MedalBadge medal="silver" size={32} />
                      <span className="text-lg font-bold">{medalCounts.silver}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <MedalBadge medal="bronze" size={32} />
                      <span className="text-lg font-bold">{medalCounts.bronze}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{t.results || "Results"}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {athlete.results && athlete.results.length > 0 ? (
                  <ResultsTable
                    results={athlete.results}
                    total={athlete.results.length}
                    page={1}
                    pageSize={athlete.results.length}
                    locale={locale}
                    dictionary={dictionary}
                  />
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    {t.noResults || "No published results yet"}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
