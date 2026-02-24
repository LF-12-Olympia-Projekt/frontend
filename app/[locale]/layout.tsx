// frontend/app/[locale]/layout.tsx | Task: BE-FIX-001 | Add AuthProvider for in-memory JWT
import React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Locale, getDictionary } from "@/lib/dictionaries";
import { LocaleProvider } from "@/lib/locale-context";
import { AuthProvider } from "@/lib/auth";
import { AuthProvider as AuthContextProvider } from "@/lib/auth-context";
import { AuthBridge } from "@/components/auth-bridge";

export async function generateStaticParams() {
    return [
        { locale: "de" },
        { locale: "de-BA" },
        { locale: "fr-FR" },
        { locale: "en-GB" },
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
        <AuthProvider>
            <AuthContextProvider>
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
            </AuthContextProvider>
        </AuthProvider>
    );
}
