import { useState, useRef, useEffect } from 'react'
import { Globe, Check } from 'lucide-react'
import { LANGUAGES } from '../../i18/languages'
import { useLanguage } from '../../i18/LanguageContext'

interface LanguageSwitcherProps {
    dropUp?: boolean
}

export default function LanguageSwitcher({ dropUp = false }: LanguageSwitcherProps) {
    const { locale, setLocale } = useLanguage()
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    const current = LANGUAGES.find(l => l.code === locale)!

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    return (
        <div ref={ref} className="relative z-50">

            {/* Trigger */}
            <button
                onClick={() => setOpen(o => !o)}
                title="Change language"
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-semibold transition-colors ${open
                        ? 'bg-blue-50 border-blue-200 text-blue-600'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
            >
                <Globe className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">{current.flag} {current.native}</span>
                <span className="sm:hidden">{current.flag}</span>
            </button>

            {/* Dropdown — opens up or down depending on position */}
            {open && (
                <div className={`absolute left-0 w-52 bg-white border border-slate-200 rounded-2xl shadow-2xl z-[99999] ${dropUp ? 'bottom-full mb-2' : 'top-12'
                    }`}>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 py-3 border-b border-slate-100">
                        Select Language
                    </p>

                    {LANGUAGES.map(lang => (
                        <button
                            key={lang.code}
                            onClick={() => { setLocale(lang.code); setOpen(false) }}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${locale === lang.code
                                    ? 'bg-blue-50 text-blue-600 font-bold'
                                    : 'text-slate-600 hover:bg-slate-50 font-medium'
                                }`}
                        >
                            <span className="text-lg shrink-0">{lang.flag}</span>
                            <div className="flex-1 text-left">
                                <p className="text-sm leading-none">{lang.native}</p>
                                <p className="text-[11px] text-slate-400 mt-0.5">{lang.label}</p>
                            </div>
                            {locale === lang.code && (
                                <Check className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            )}
                        </button>
                    ))}

                </div>
            )}
        </div>
    )
}