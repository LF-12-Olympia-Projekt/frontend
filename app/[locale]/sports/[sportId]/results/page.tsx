// app/[locale]/sports/[sportId]/results/page.tsx | Task: FINAL-002 | Sport-specific results with dynamic template columns
import { notFound } from "next/navigation"
import { PageWrapper } from "@/components/page-wrapper"
import { ResultsTable } from "@/components/results-table"
import { Card, CardContent } from "@/components/ui/card"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { getSportBySlug, getSportResults, getSportTemplate } from "@/lib/api/results"
import { getDictionary, Locale } from "@/lib/dictionaries"
import { Award } from "lucide-react"

export const revalidate = 60

export default async function SportResultsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; sportId: string }>
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const { locale, sportId } = await params
  const sp = await searchParams
  const dictionary = await getDictionary(locale as Locale) as any
  const tCommon = dictionary.common || {}

  const page = parseInt(sp.page || "1", 10)

  let sport
  let results = { data: [] as any[], total: 0, page: 1, pageSize: 20 }
  let templateFields: { name: string; type: string; label?: string; unit?: string }[] | undefined

  try {
    sport = await getSportBySlug(sportId)
    results = await getSportResults(sportId, { page, pageSize: 20 })

    // Fetch sport template for dynamic columns
    const template = await getSportTemplate(sportId)
    if (template?.fields) {
      templateFields = template.fields.map((f) => ({
        name: f.name,
        type: f.type,
        label: f.labels?.[locale] ?? f.label ?? f.name,
        unit: f.unit,
      }))
    }
  } catch {
    notFound()
  }

  if (!sport) notFound()

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
              <BreadcrumbLink href={`/${locale}/sports`}>{dictionary.sports?.title || "Sports"}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{sport.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mt-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Award className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{sport.name}</h1>
            <p className="text-sm text-muted-foreground">{sport.description}</p>
          </div>
        </div>

        <Card className="mt-6 overflow-hidden">
          <CardContent className="p-0">
            <ResultsTable
              results={results.data}
              total={results.total}
              page={page}
              pageSize={20}
              locale={locale}
              dictionary={dictionary}
              showSport={false}
              templateFields={templateFields}
            />
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  )
}
