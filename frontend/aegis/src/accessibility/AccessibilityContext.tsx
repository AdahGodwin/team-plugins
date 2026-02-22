import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { AccessibilityState, TextSize } from './accessibilityTypes'

const AccessibilityContext = createContext<AccessibilityState>({
    textSize:    'normal',
    setTextSize: () => {},
    speak:       () => {},
    isSpeaking:  false,
})

export function AccessibilityProvider({ children }: { children: ReactNode }) {
    const [textSize,   setTextSizeState] = useState<TextSize>(() =>
        (localStorage.getItem('aegis-textsize') as TextSize) || 'normal'
    )
    const [isSpeaking, setIsSpeaking]    = useState(false)

    useEffect(() => {
        const root = document.documentElement
        if (textSize === 'large') {
            root.classList.add('text-lg-mode')
        } else {
            root.classList.remove('text-lg-mode')
        }
        localStorage.setItem('aegis-textsize', textSize)
    }, [textSize])

    const setTextSize = (s: TextSize) => setTextSizeState(s)

    const speak = useCallback((text: string) => {
        if (!window.speechSynthesis) return
        window.speechSynthesis.cancel()

        const utterance        = new SpeechSynthesisUtterance(text)
        utterance.rate         = 0.9
        utterance.pitch        = 1
        utterance.volume       = 1
        utterance.lang         = 'en-GB'
        utterance.onstart      = () => setIsSpeaking(true)
        utterance.onend        = () => setIsSpeaking(false)
        utterance.onerror      = () => setIsSpeaking(false)

        window.speechSynthesis.speak(utterance)
    }, [])

    return (
        <AccessibilityContext.Provider value={{ textSize, setTextSize, speak, isSpeaking }}>
            {children}
        </AccessibilityContext.Provider>
    )
}

export const useAccessibility = () => useContext(AccessibilityContext)