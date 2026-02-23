// app/[locale]/medals/page.tsx | Task: FE-002 | Medal standings page
import { PageWrapper } from "@/components/page-wrapper"
import { CountryFlag } from "@/components/country-flag"
import { Card, CardContent } from "@/components/ui/card"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { getMedalStandings } from "@/lib/api/results"
import { getDictionary, Locale } from "@/lib/dictionaries"
import { Trophy } from "lucide-react"
import Link from "next/link"

export const revalidate = 60

export default async function MedalsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const dictionary = await getDictionary(locale as Locale) as any
  const t = dictionary.medalTable || {}
  const tDetail = dictionary.medalTableDetail || {}

  let standings = { data: [] as any[], total: 0 }
  try {
    standings = await getMedalStandings({ limit: 100, offset: 0 })
  } catch {
    // API not available
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
              <BreadcrumbPage>{t.title || "Medal Table"}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mt-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-400/20">
            <Trophy className="h-5 w-5 text-yellow-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{t.title || "Medal Table"}</h1>
            <p className="text-sm text-muted-foreground">{tDetail.subtitle}</p>
          </div>
        </div>

        <Card className="mt-6 overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50 text-left text-sm font-medium text-muted-foreground">
                    <th className="whitespace-nowrap px-4 py-3 text-center">{t.rank || "Rank"}</th>
                    <th className="whitespace-nowrap px-4 py-3">{t.country || "Country"}</th>
                    <th className="whitespace-nowrap px-4 py-3 text-center">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-yellow-400 text-xs mx-auto">G</span>
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 text-center">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-300 text-xs mx-auto">S</span>
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 text-center">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-600 text-xs text-white mx-auto">B</span>
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 text-center">{t.total || "Total"}</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.data.map((s: any, i: number) => (
                    <tr key={s.country?.countryCode || i} className={`border-b transition-colors hover:bg-muted/50 ${i < 3 ? "bg-muted/30" : ""}`}>
                      <td className="px-4 py-3 text-center">
                        <span className={`text-lg font-bold ${i < 3 ? "text-yellow-500" : ""}`}>{s.rank}</span>
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/${locale}/medals/${s.country?.countryCode || s.country?.countryAbbr}`} className="flex items-center gap-3 hover:underline">
                          <CountryFlag countryCode={s.country?.countryCode} size="sm" />
                          <span className="rounded bg-muted px-2 py-0.5 text-xs font-bold">{s.country?.countryAbbr}</span>
                          <span className="font-medium">{s.country?.name}</span>
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400/20 font-bold">{s.gold}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-300/20 font-bold">{s.silver}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-600/20 font-bold">{s.bronze}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-bold">{s.gold + s.silver + s.bronze}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {standings.data.length === 0 && (
              <div className="py-16 text-center text-muted-foreground">
                {dictionary.common?.noResults || "No data available"}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  )
}
