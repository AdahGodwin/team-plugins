import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Locale } from './languages'
import { t as translate, type Path } from './index'

interface LanguageContextType {
    locale: Locale
    language: Locale
    setLocale: (l: Locale) => void
    t: (key: Path, ...args: any[]) => string
}

const LanguageContext = createContext<LanguageContextType>({
    locale: 'en',
    language: 'en',
    setLocale: () => { },
    t: (key) => key as string,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>(() =>
        (localStorage.getItem('aegis-locale') as Locale) || 'en'
    )

    const setLocale = (l: Locale) => {
        setLocaleState(l)
        localStorage.setItem('aegis-locale', l)
    }

    return (
        <LanguageContext.Provider value={{
            locale,
            language: locale,
            setLocale,
            t: (key, ...args) => translate(locale, key, ...args),
        }}>
            {children}
        </LanguageContext.Provider>
    )
}

export const useLanguage = () => useContext(LanguageContext)