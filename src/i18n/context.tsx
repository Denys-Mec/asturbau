import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { translations, type Lang, type TranslationKey } from "./translations";

const STORAGE_KEY = "asturbau_lang";
const DEFAULT_LANG: Lang = "es";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Always start with DEFAULT_LANG on both server & first client render to avoid hydration mismatch.
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "es" || stored === "uk") {
        if (stored !== lang) setLangState(stored);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
      document.documentElement.lang = l;
    } catch {}
  }, []);

  useEffect(() => {
    try {
      document.documentElement.lang = lang;
    } catch {}
  }, [lang]);

  const t = useCallback(
    (key: TranslationKey) => {
      const dict = translations[lang] ?? translations[DEFAULT_LANG];
      return dict[key] ?? translations[DEFAULT_LANG][key] ?? String(key);
    },
    [lang],
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    // Fallback: allow use outside provider (returns defaults).
    return {
      lang: DEFAULT_LANG,
      setLang: () => {},
      t: (key: TranslationKey) => translations[DEFAULT_LANG][key] ?? String(key),
    };
  }
  return ctx;
}
