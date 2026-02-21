export type TextSize = 'normal' | 'large'

export interface AccessibilityState {
    textSize:    TextSize
    setTextSize: (s: TextSize) => void
    speak:       (text: string) => void
    isSpeaking:  boolean
}