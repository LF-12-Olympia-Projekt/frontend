// frontend/app/[locale]/layout.tsx | Task: BE-FIX-001 | Add AuthProvider for in-memory JWT
import React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Locale, getDictionary } from "@/lib/dictionaries";
import { LocaleProvider } from "@/lib/locale-context";
<<<<<<< HEAD
import { AuthProvider } from "@/lib/auth-context";
=======
import { AuthProvider } from "@/lib/auth";
import { AuthBridge } from "@/components/auth-bridge";
>>>>>>> feature/BE-FIX-001-jwt-memory-storage

export async function generateStaticParams() {
    return [
        { locale: "de" },
        { locale: "de-BA" },
        { locale: "fr" },
        { locale: "fr-FR" },
        { locale: "en" },
        { locale: "en-GB" },
        { locale: "pirate" },
    ];
}

export default async function LocaleLayout({
                                               children,
                                               params,
                                           }: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    const dictionary = await getDictionary(locale as Locale);

    return (
<<<<<<< HEAD
        <LocaleProvider locale={locale as Locale} dictionary={dictionary}>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <AuthProvider>
                    {children}
                </AuthProvider>
            </ThemeProvider>
        </LocaleProvider>
=======
        <AuthProvider>
            <LocaleProvider locale={locale as Locale} dictionary={dictionary}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <AuthBridge />
                    {children}
                </ThemeProvider>
            </LocaleProvider>
        </AuthProvider>
>>>>>>> feature/BE-FIX-001-jwt-memory-storage
    );
}
