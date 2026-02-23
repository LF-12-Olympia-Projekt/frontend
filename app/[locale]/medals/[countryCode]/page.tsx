// app/[locale]/medals/[countryCode]/page.tsx | Task: FE-002 | Country medal detail page
import { notFound } from "next/navigation"
import { PageWrapper } from "@/components/page-wrapper"
import { MedalBadge } from "@/components/medal-badge"
import { CountryFlag } from "@/components/country-flag"
import { ResultsTable } from "@/components/results-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { getCountryMedals } from "@/lib/api/results"
import { getDictionary, Locale } from "@/lib/dictionaries"

export const revalidate = 60

export default async function CountryMedalsPage({
  params,
}: {
  params: Promise<{ locale: string; countryCode: string }>
}) {
  const { locale, countryCode } = await params
  const dictionary = await getDictionary(locale as Locale) as any
  const t = dictionary.countryMedals || {}
  const tCommon = dictionary.common || {}

  let data
  try {
    data = await getCountryMedals(countryCode)
  } catch {
    notFound()
  }

  if (!data) notFound()

  const total = (data.medals?.gold || 0) + (data.medals?.silver || 0) + (data.medals?.bronze || 0)

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
              <BreadcrumbLink href={`/${locale}/medals`}>{dictionary.medalTable?.title || "Medal Table"}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{data.country?.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Country header */}
        <div className="mt-8 flex items-center gap-4">
          <CountryFlag countryCode={data.country?.countryCode} size="lg" />
          <div>
            <h1 className="text-3xl font-bold">{data.country?.name}</h1>
            <p className="text-muted-foreground">{data.country?.countryAbbr}</p>
          </div>
        </div>

        {/* Medal counts */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Card>
            <CardContent className="flex flex-col items-center p-4">
              <MedalBadge medal="gold" size={36} />
              <span className="mt-2 text-2xl font-bold">{data.medals?.gold || 0}</span>
              <span className="text-sm text-muted-foreground">{t.gold || "Gold"}</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center p-4">
              <MedalBadge medal="silver" size={36} />
              <span className="mt-2 text-2xl font-bold">{data.medals?.silver || 0}</span>
              <span className="text-sm text-muted-foreground">{t.silver || "Silver"}</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center p-4">
              <MedalBadge medal="bronze" size={36} />
              <span className="mt-2 text-2xl font-bold">{data.medals?.bronze || 0}</span>
              <span className="text-sm text-muted-foreground">{t.bronze || "Bronze"}</span>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col items-center p-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                <span className="text-lg font-bold text-primary">#</span>
              </div>
              <span className="mt-2 text-2xl font-bold">{total}</span>
              <span className="text-sm text-muted-foreground">{t.total || "Total"}</span>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{t.results || "Medal-Winning Results"}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ResultsTable
              results={data.results || []}
              total={data.results?.length || 0}
              page={1}
              pageSize={100}
              locale={locale}
              dictionary={dictionary}
            />
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  )
}
