import "server-only";

export type Locale = "de" | "de-BA" | "fr" | "en" | "pirate";

const dictionaries = {
  de: () => import("./dictionaries/de.json").then((module) => module.default),
  "de-BA": () => import("./dictionaries/de-BA.json").then((module) => module.default),
  fr: () => import("./dictionaries/fr.json").then((module) => module.default),
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  pirate: () => import("./dictionaries/pirate.json").then((module) => module.default),
};

export const getDictionary = async (locale: Locale) =>
  dictionaries[locale]?.() ?? dictionaries.de();
