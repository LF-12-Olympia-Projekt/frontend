// app/[locale]/results/[id]/page.tsx | Task: FE-002 | Result detail page
import { notFound } from "next/navigation"
import { PageWrapper } from "@/components/page-wrapper"
import { MedalBadge } from "@/components/medal-badge"
import { CountryFlag } from "@/components/country-flag"
import { LastModified } from "@/components/last-modified"
import { ResultsTable } from "@/components/results-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { getResultById, getResults } from "@/lib/api/results"
import { getDictionary, Locale } from "@/lib/dictionaries"
import { User, MapPin, Calendar, Award } from "lucide-react"
import Link from "next/link"

export const revalidate = 60

export default async function ResultDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; id: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { locale, id } = await params
  const { page: pageParam } = await searchParams
  const currentPage = Math.max(1, parseInt(pageParam ?? "1", 10) || 1)
  const dictionary = await getDictionary(locale as Locale) as any
  const t = dictionary.resultDetail || {}
  const tCommon = dictionary.common || {}

  let result
  try {
    result = await getResultById(id)
  } catch {
    notFound()
  }

  if (!result) notFound()

  let relatedResults = { data: [] as any[], total: 0, page: 1, pageSize: 20 }
  if (result.event) {
    try {
      relatedResults = await getResults({ eventId: result.event.id, pageSize: 10, page: currentPage, revalidate: 0 })
    } catch {
      // ignore
    }
  }

  const medalLabel = result.medal !== "none" ? result.medal.charAt(0).toUpperCase() + result.medal.slice(1) : null

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
              <BreadcrumbPage>{t.breadcrumb || "Result"}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Main result info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {result.rank && (
                      <span className={`text-4xl font-black ${result.rank <= 3 ? "text-yellow-500" : ""}`}>
                        #{result.rank}
                      </span>
                    )}
                    <div>
                      <CardTitle className="text-xl">{result.athlete?.name || "Unknown"}</CardTitle>
                      {result.event && (
                        <p className="text-sm text-muted-foreground">{result.event.name}</p>
                      )}
                    </div>
                  </div>
                  <MedalBadge medal={result.medal} size={48} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="rounded-lg bg-muted p-4 text-center">
                    <p className="text-3xl font-bold">{result.value}</p>
                    <p className="text-sm text-muted-foreground">{result.unit}</p>
                  </div>
                  {medalLabel && (
                    <Badge variant="secondary" className="text-sm">
                      <Award className="mr-1 h-3 w-3" />
                      {medalLabel}
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-sm">
                    {t.version || "Version"} {result.version}
                  </Badge>
                </div>
                <div className="mt-4">
                  <LastModified name={result.lastModifiedBy} date={result.lastModifiedAt} />
                </div>
              </CardContent>
            </Card>

            {/* Event info */}
            {result.event && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t.eventInfo || "Event Information"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      <dt className="text-sm text-muted-foreground">{t.sport || "Sport"}:</dt>
                      <dd className="text-sm font-medium">{result.event.sportName}</dd>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <dt className="text-sm text-muted-foreground">{t.date || "Date"}:</dt>
                      <dd className="text-sm font-medium">{new Date(result.event.date).toLocaleDateString()}</dd>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <dt className="text-sm text-muted-foreground">{t.location || "Location"}:</dt>
                      <dd className="text-sm font-medium">{result.event.location}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            )}

            {/* Related results */}
            {relatedResults.data.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t.relatedResults || "Results from this Event"}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ResultsTable
                    results={relatedResults.data}
                    total={relatedResults.total}
                    page={currentPage}
                    pageSize={10}
                    locale={locale}
                    dictionary={dictionary}
                    showSport={false}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Athlete sidebar */}
          <div className="space-y-6">
            {result.athlete && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                      {result.athlete.photoUrl ? (
                        <img src={result.athlete.photoUrl} alt={result.athlete.name} className="h-20 w-20 rounded-full object-cover" />
                      ) : (
                        <User className="h-10 w-10 text-muted-foreground" />
                      )}
                    </div>
                    <Link href={`/${locale}/athletes/${result.athlete.id}`} className="text-lg font-bold hover:underline">
                      {result.athlete.name}
                    </Link>
                    <div className="mt-2 flex items-center gap-2">
                      <CountryFlag countryCode={result.athlete.countryCode} size="md" />
                      <span className="text-sm text-muted-foreground">{result.athlete.countryCode}</span>
                    </div>
                    {result.athlete.age && (
                      <p className="mt-1 text-sm text-muted-foreground">{result.athlete.age} years</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
