"use client"

import {Button} from "@/components/ui/button";
import {CheckIcon, ChevronDownIcon, GlobeIcon, XIcon} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "@/lib/locale-context";
import { usePathname, useRouter } from "next/navigation";
import { Locale } from "@/lib/dictionaries";

export default function LanguageSwitcher() {
    const { dictionary, locale } = useTranslation();
    const pathname = usePathname();
    const router = useRouter();

    const languages: { code: Locale; name: string }[] = [
        { code: "de", name: "Deutsch (de-DE)" },
        { code: "de-BA", name: "Deutsch Bairisch (de-BA)" },
        { code: "fr", name: "Français (fr-FR)" },
        { code: "en", name: "English (en-GB)" },
        { code: "pirate", name: "Pirate (arr-GG)" },
    ];

    const currentLanguageName = languages.find((lang) => lang.code === locale)?.code.toUpperCase() || "EN";

    const handleLocaleChange = (newLocale: Locale) => {
        if (!pathname) return;
        const segments = pathname.split("/");
        segments[1] = newLocale;
        router.push(segments.join("/"));
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                    <GlobeIcon className="h-5 w-5" />
                    <span>{currentLanguageName}</span>
                    <ChevronDownIcon className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
                {languages.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        className="flex cursor-pointer items-center gap-2"
                        onClick={() => handleLocaleChange(lang.code)}
                    >
                        <GlobeIcon className="h-4 w-4" />
                        <span>{lang.name}</span>
                        {locale === lang.code && <CheckIcon className="ml-auto h-4 w-4" />}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}