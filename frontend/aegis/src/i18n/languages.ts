export type Locale = 'en' | 'yo' | 'ha' | 'ig'

export const LANGUAGES: {
    code:   Locale
    label:  string
    native: string
    flag:   string
}[] = [
    { code: 'en', label: 'English', native: 'English', flag: '🇬🇧' },
    { code: 'yo', label: 'Yoruba',  native: 'Yorùbá',  flag: '🇳🇬' },
    { code: 'ha', label: 'Hausa',   native: 'Hausa',   flag: '🇳🇬' },
    { code: 'ig', label: 'Igbo',    native: 'Igbo',    flag: '🇳🇬' },
]