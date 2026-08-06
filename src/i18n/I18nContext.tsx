import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { dictionaries, TranslationKey } from "./translations";

export type Language = "it" | "en";

/** Chiave localStorage: la scelta manuale dell'utente ha la precedenza sul browser. */
const STORAGE_KEY = "ms-lang";

/** Locale completo, usato per date e numeri (toLocaleString). */
export const LOCALES: Record<Language, string> = {
  it: "it-IT",
  en: "en-GB",
};

/**
 * Lingua iniziale: preferenza salvata, altrimenti quella del browser
 * (navigator.language, es. "it-IT" → it). Fallback: inglese.
 * NB: si usa la lingua configurata nel browser, non la posizione geografica:
 * non richiede permessi ed è corretta anche per chi naviga da un altro Paese.
 */
function detectLanguage(): Language {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "it" || saved === "en") return saved;

  const browser = navigator.language || (navigator.languages && navigator.languages[0]);
  return browser?.toLowerCase().startsWith("it") ? "it" : "en";
}

interface I18nContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  /** Traduce una chiave, sostituendo eventuali {segnaposto}. */
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  /** Locale per date/numeri, allineato alla lingua corrente. */
  locale: string;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

/** Chiavi già segnalate: evita di ripetere lo stesso warning a ogni render. */
const warned = new Set<string>();

/**
 * Segnala in console (solo in sviluppo) le chiavi non ancora tradotte,
 * senza interrompere nulla: il testo mostrato ricade sull'italiano.
 * Per l'elenco completo: `npm run i18n:check`.
 */
function warnMissing(lang: Language, key: string) {
  if (!import.meta.env.DEV) return;
  const id = `${lang}:${key}`;
  if (warned.has(id)) return;
  warned.add(id);
  console.warn(`[i18n] traduzione mancante per "${key}" in "${lang}": uso l'italiano.`);
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(detectLanguage);

  // Tiene allineato l'attributo lang del documento (accessibilità, screen reader)
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo<I18nContextValue>(() => {
    const setLang = (next: Language) => {
      localStorage.setItem(STORAGE_KEY, next);
      setLangState(next);
    };

    const t = (key: TranslationKey, params?: Record<string, string | number>) => {
      const translated = dictionaries[lang][key];
      if (translated === undefined && lang !== "it") warnMissing(lang, key);

      const text = translated ?? dictionaries.it[key] ?? key;
      if (!params) return text;
      return Object.entries(params).reduce(
        (acc, [name, val]) => acc.replaceAll(`{${name}}`, String(val)),
        text as string
      );
    };

    return { lang, setLang, t, locale: LOCALES[lang] };
  }, [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n deve essere usato dentro <I18nProvider>");
  return ctx;
}
