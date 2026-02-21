import { Volume2, ALargeSmall } from 'lucide-react'
import { useAccessibility } from '../../accessibility/AccessibilityContext'
import LanguageSwitcher from './LanguageSwitcher'

interface AccessibilityBarProps {
    dropUp?: boolean
}

export default function AccessibilityBar({ dropUp = false }: AccessibilityBarProps) {
    const { textSize, setTextSize, isSpeaking } = useAccessibility()
    const isLarge = textSize === 'large'

    return (
        <div className="flex items-center gap-2 z-50">
            <LanguageSwitcher dropUp={dropUp} />
            <button
                onClick={() => setTextSize(isLarge ? 'normal' : 'large')}
                title={isLarge ? 'Switch to normal text' : 'Switch to large text'}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-semibold transition-colors ${isLarge
                        ? 'bg-blue-50 border-blue-200 text-blue-600'
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
            >
                <ALargeSmall className="w-4 h-4" />
                <span className="hidden sm:inline text-xs">{isLarge ? 'A+' : 'A'}</span>
            </button>

            {isSpeaking && (
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-50 border border-teal-200 text-teal-600 text-xs font-semibold">
                    <Volume2 className="w-4 h-4 animate-pulse" />
                    <span className="hidden sm:inline">Speaking…</span>
                </div>
            )}

        </div>
    )
}