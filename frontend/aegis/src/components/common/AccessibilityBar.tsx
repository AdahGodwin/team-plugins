import { Volume2, ALargeSmall } from 'lucide-react'
import { useAccessibility } from '../../accessibility/AccessibilityContext'
import { useLanguage } from '../../i18n/LanguageContext'
import LanguageSwitcher from './LanguageSwitcher'

interface AccessibilityBarProps {
    dropUp?: boolean
}

export default function AccessibilityBar({ dropUp = false }: AccessibilityBarProps) {
    const { textSize, setTextSize, isSpeaking } = useAccessibility()
    const { t } = useLanguage()
    const isLarge = textSize === 'large'

    return (
        <div className="flex items-center gap-2 z-50">
            <LanguageSwitcher dropUp={dropUp} />
            <button
                onClick={() => setTextSize(isLarge ? 'normal' : 'large')}
                title={isLarge ? t('accessibility.switchNormal' as any) : t('accessibility.switchLarge' as any)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-semibold transition-colors ${isLarge
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
            >
                <ALargeSmall className="w-4 h-4" />
                <span className="hidden sm:inline text-xs">{isLarge ? 'A+' : 'A'}</span>
            </button>

            {isSpeaking && (
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-semibold">
                    <Volume2 className="w-4 h-4 animate-pulse" />
                    <span className="hidden sm:inline">{t('accessibility.speaking' as any)}</span>
                </div>
            )}

        </div>
    )
}