"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Clock } from "lucide-react"
import {ModeToggle} from "@/components/custom/theme-switcher";
import LanguageSwitcher from "@/components/custom/language-switcher";
import { useTranslation } from "@/lib/locale-context"

export function Footer() {
    const { dictionary, locale } = useTranslation()
    const t = dictionary.common || {}
    const [lastUpdate, setLastUpdate] = useState("")

    // Generate timestamp on client side only to avoid hydration mismatch
    useEffect(() => {
        const timestamp = new Date().toLocaleString(locale === "de" || locale === "de-BA" ? "de-DE" : locale === "fr-FR" ? "fr-FR" : "en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
        setLastUpdate(timestamp)
    }, [locale])

    return (
        <footer className="border-t bg-card">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Top section */}
                <div className="flex flex-col gap-6 border-b pb-6 sm:flex-row sm:items-start sm:justify-between">
                    {/* Last update & disclaimer */}
                    <div className="max-w-xl">
                        {lastUpdate && (
                            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>
                                    {t.lastUpdate}: {lastUpdate}
                                </span>
                            </div>
                        )}
                        <p className="text-sm text-muted-foreground">{t.disclaimer}</p>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-2">
                        <LanguageSwitcher/>
                        <ModeToggle/>
                    </div>
                </div>

                {/* Bottom section */}
                <div className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    {/* Links */}
                    <nav className="flex flex-wrap items-center gap-4 text-sm" aria-label="Footer navigation">
                        <Link
                            href="#"
                            className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {t.privacy}
                        </Link>
                        <span className="text-muted-foreground/50">|</span>
                        <Link
                            href="#"
                            className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {t.imprint}
                        </Link>
                        <span className="text-muted-foreground/50">|</span>
                        <Link
                            href="#"
                            className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {t.accessibility}
                        </Link>
                    </nav>

                    {/* Copyright */}
                    <p className="text-sm text-muted-foreground">{t.copyright}</p>
                </div>

                {/* Olympic rings decoration */}
                <div className="mt-8 flex justify-center">
                    <OlympicRingsSmall />
                </div>
            </div>
        </footer>
    )
}

function OlympicRingsSmall() {
    return (
        <svg
            className="h-6 w-auto opacity-30"
            viewBox="0 0 100 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <circle cx="20" cy="18" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
            <circle cx="50" cy="18" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
            <circle cx="80" cy="18" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
            <circle cx="35" cy="30" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
            <circle cx="65" cy="30" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
    )
}
