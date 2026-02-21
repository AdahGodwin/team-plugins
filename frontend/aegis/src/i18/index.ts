import en from './translations/en'
import yo from './translations/yo'
import ha from './translations/ha'
import ig from './translations/ig'
import type { Locale } from './languages'

export const translations = { en, yo, ha, ig }

export type TranslationKeys = typeof en

export function t(locale: Locale, key: keyof TranslationKeys, ...args: any[]): string {
    const dict = translations[locale] ?? translations['en']
    const val  = (dict as any)[key] ?? (translations['en'] as any)[key]
    if (typeof val === 'function') return val(...args)
    return val as string
}