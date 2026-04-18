import { createContext, useContext, useState, ReactNode } from "react";
import t, { type LangCode, type Translations } from "../i18n/translations";

interface LanguageContextType {
  language: LangCode;
  setLanguage: (lang: LangCode) => void;
  tr: Translations;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LangCode>(
    () => (localStorage.getItem("language") as LangCode) ?? "en"
  );

  function setLanguage(lang: LangCode) {
    localStorage.setItem("language", lang);
    setLanguageState(lang);
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, tr: t[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
