import {ThemeProvider} from "@/components/theme-provider";
import { Locale, getDictionary } from "@/lib/dictionaries";
import { LocaleProvider } from "@/lib/locale-context";

export async function generateStaticParams() {
  return [{ locale: 'de' }, { locale: 'de-BA' }, { locale: 'fr' }, { locale: 'en' }, { locale: 'pirate' }]
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: Locale }>;
}) {
    const { locale } = await params;
    const dictionary = await getDictionary(locale);

    return (
        <LocaleProvider locale={locale} dictionary={dictionary}>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                {children}
            </ThemeProvider>
        </LocaleProvider>
    );
}
