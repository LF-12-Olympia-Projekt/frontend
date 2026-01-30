"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Globe, User } from "lucide-react"
import {ModeToggle} from "@/components/custom/theme-switcher";
import LanguageSwitcher from "@/components/custom/language-switcher";
import { useTranslation } from "@/lib/locale-context"

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { dictionary, locale } = useTranslation()

    const navItems = [
        { name: dictionary.common?.results, href: `/${locale}#results` },
        { name: dictionary.common?.sports, href: `/${locale}/sports` },
        { name: dictionary.common?.medalTable, href: `/${locale}/medaillenspiegel` },
        { name: dictionary.common?.countries, href: `/${locale}/nations` },
    ]

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link href={`/${locale}`} className="flex items-center gap-2">
                    <OlympicRings className="h-8 w-auto" />
                    <span className="text-xl font-bold tracking-tight">Olympia 2026</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden items-center gap-6 md:flex">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>

                {/* Right side controls */}
                <div className="flex items-center gap-2">
                    {/* Language Switcher */}
                    <div className="hidden sm:block">
                        <LanguageSwitcher />
                    </div>

                    {/* Dark Mode Toggle */}
                    <ModeToggle />
                    {/* Login Button */}
                    <Link href={`/${locale}/login`}>
                        <Button variant="outline" size="sm" className="hidden sm:flex bg-transparent">
                            <User className="mr-1.5 h-4 w-4" />
                            {dictionary.common?.login}
                        </Button>
                    </Link>

                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className="border-t bg-background md:hidden">
                    <nav className="flex flex-col gap-1 px-4 py-3">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <div className="mt-2 flex items-center gap-2 border-t pt-3">
                            <LanguageSwitcher/>
                            <Link href={`/${locale}/login`} className="ml-auto">
                                <Button variant="outline" size="sm" className="bg-transparent">
                                    <User className="mr-1.5 h-4 w-4" />
                                    {dictionary.common?.login}
                                </Button>
                            </Link>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    )
}

function OlympicRings({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 100 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Olympic Rings"
        >
            {/* Top row rings */}
            <circle cx="20" cy="18" r="12" stroke="oklch(0.55 0.2 250)" strokeWidth="3" fill="none" />
            <circle cx="50" cy="18" r="12" stroke="oklch(0.15 0 0)" strokeWidth="3" fill="none" className="dark:stroke-[oklch(0.95_0_0)]" />
            <circle cx="80" cy="18" r="12" stroke="oklch(0.55 0.22 25)" strokeWidth="3" fill="none" />
            {/* Bottom row rings */}
            <circle cx="35" cy="32" r="12" stroke="oklch(0.85 0.18 85)" strokeWidth="3" fill="none" />
            <circle cx="65" cy="32" r="12" stroke="oklch(0.55 0.18 145)" strokeWidth="3" fill="none" />
        </svg>
    )
}
