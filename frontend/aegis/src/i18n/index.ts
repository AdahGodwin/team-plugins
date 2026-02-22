import en from './translations/en'
import yo from './translations/yo'
import ha from './translations/ha'
import ig from './translations/ig'
import type { Locale } from './languages'

export const translations = { en, yo, ha, ig }

// Recursive type to get all dot-notated paths of an object
type NestedKeys<T> = T extends (...args: any[]) => any
    ? never
    : {
        [K in keyof T & string]: T[K] extends object
        ? K | `${K}.${NestedKeys<T[K]>}`
        : K
    }[keyof T & string]

export type TranslationKeys = typeof en
export type Path = NestedKeys<TranslationKeys>

/**
 * Resolves a nested key (e.g., 'auth.login') from the translation dictionary.
 */
function getDeep(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj)
}

export function t(locale: Locale, key: Path, ...args: any[]): string {
    const dict = translations[locale] ?? translations['en']
    const enDict = translations['en']

    let val = getDeep(dict, key) || getDeep(enDict, key)

    if (!val) return key as string
    if (typeof val === 'function') return val(...args)
    return val as string
}