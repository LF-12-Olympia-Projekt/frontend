// frontend/lib/dictionaries.ts | Task: FE-FIX-001 | Corrected locale codes with fallback
import "server-only";

export type Locale = "de" | "de-BA" | "fr-FR" | "en-GB";

const dictionaries: Record<string, () => Promise<any>> = {
  de: () => import("./dictionaries/de.json").then((module) => module.default),
  "de-BA": () => import("./dictionaries/de-BA.json").then((module) => module.default),
  "fr-FR": () => import("./dictionaries/fr-FR.json").then((module) => module.default),
  "en-GB": () => import("./dictionaries/en-GB.json").then((module) => module.default),
};

// Fallback chain: de-BA → de → en-GB, fr-FR → en-GB
export const getDictionary = async (locale: Locale) => {
  if (dictionaries[locale]) return dictionaries[locale]();
  if (locale === "de-BA") return dictionaries["de"]();
  return dictionaries["en-GB"]();
};
