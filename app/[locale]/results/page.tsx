// app/[locale]/results/page.tsx | Task: FE-002 | Results listing page
import { Suspense } from "react"
import { PageWrapper } from "@/components/page-wrapper"
import { ResultsTable } from "@/components/results-table"
import { FilterBar } from "@/components/filter-bar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Skeleton } from "@/components/ui/skeleton"
import { getResults, getSports } from "@/lib/api/results"
import { getDictionary, Locale } from "@/lib/dictionaries"
import { Trophy } from "lucide-react"

export const revalidate = 60

export default async function ResultsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const { locale } = await params
  const sp = await searchParams
  const dictionary = await getDictionary(locale as Locale) as any
  const t = dictionary.resultsPage || {}

  const page = parseInt(sp.page || "1", 10)
  const pageSize = 20

  let results = { data: [] as any[], total: 0, page: 1, pageSize: 20 }
  let sports: any[] = []
  
  try {
    ;[results, sports] = await Promise.all([
      getResults({
        sport: sp.sport,
        country: sp.country,
        date: sp.date,
        athleteName: sp.q,
        page,
        pageSize,
      }),
      getSports(),
    ])
  } catch {
    // API not available, show empty state
  }

  return (
    <PageWrapper>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${locale}`}>{dictionary.common?.home}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{t.breadcrumb || "Results"}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mt-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Trophy className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{t.title || "Results"}</h1>
            <p className="text-sm text-muted-foreground">{t.subtitle}</p>
          </div>
        </div>

        <div className="mt-6">
          <Suspense fallback={<Skeleton className="h-10 w-full" />}>
            <FilterBar
              locale={locale}
              basePath="/results"
              dictionary={dictionary}
              sports={sports.map((s: any) => ({ id: s.id, name: s.name }))}
            />
          </Suspense>
        </div>

        <div className="mt-6 overflow-hidden rounded-lg border bg-card shadow-sm">
          <ResultsTable
            results={results.data}
            total={results.total}
            page={page}
            pageSize={pageSize}
            locale={locale}
            dictionary={dictionary}
          />
        </div>
      </div>
    </PageWrapper>
  )
}
