import { Volume2, VolumeX } from 'lucide-react'
import { useAccessibility } from '../../accessibility/AccessibilityContext'

interface SpeakButtonProps {
    text: string
    className?: string
}

export default function SpeakButton({ text, className = '' }: SpeakButtonProps) {
    const { speak, isSpeaking } = useAccessibility()

    return (
        <button
            onClick={() => speak(text)}
            title="Read aloud"
            className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-colors ${isSpeaking
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200'
                } ${className}`}
        >
            {isSpeaking
                ? <VolumeX className="w-3.5 h-3.5" />
                : <Volume2 className="w-3.5 h-3.5" />
            }
            <span className="hidden sm:inline">
                {isSpeaking ? 'Stop' : 'Read aloud'}
            </span>
        </button>
    )
}