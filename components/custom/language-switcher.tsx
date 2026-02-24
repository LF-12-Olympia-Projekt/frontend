"use client"

import {Button} from "@/components/ui/button";
import {CheckIcon, ChevronDownIcon, GlobeIcon, XIcon} from "lucide-react";
import {Drawer, DrawerClose, DrawerContent, DrawerTitle, DrawerTrigger} from "@/components/ui/drawer";
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
        { code: "fr-FR", name: "Français (fr-FR)" },
        { code: "en-GB", name: "English (en-GB)" },
    ];

    const currentLanguageName = languages.find((lang) => lang.code === locale)?.code.toUpperCase() || "EN";

    const handleLocaleChange = (newLocale: Locale) => {
        if (!pathname) return;
        const segments = pathname.split("/");
        segments[1] = newLocale;
        router.push(segments.join("/"));
    };

    return (
        <>
            <Drawer>
                <DrawerTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                        <GlobeIcon className="h-5 w-5" />
                        <span>{currentLanguageName}</span>
                        <ChevronDownIcon className="h-4 w-4" />
                    </Button>
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerTitle className="sr-only">
                        {dictionary.common.selectLanguage}
                    </DrawerTitle>
                    <div className="grid gap-4 p-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium">{dictionary.common.selectLanguage}</h3>
                            <DrawerClose asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <XIcon className="h-5 w-5" />
                                </Button>
                            </DrawerClose>
                        </div>
                        <div className="grid gap-2">
                            {languages.map((lang) => (
                                <Button
                                    key={lang.code}
                                    variant="ghost"
                                    className="justify-start gap-2"
                                    onClick={() => handleLocaleChange(lang.code)}
                                >
                                    <GlobeIcon className="h-5 w-5" />
                                    <span>{lang.name}</span>
                                    {locale === lang.code && <CheckIcon className="h-5 w-5 ml-auto" />}
                                </Button>
                            ))}
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>
        </>
    )
}