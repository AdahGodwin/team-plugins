import { useState, useRef, useEffect, useMemo } from 'react'
import { MOCK_NOTIFICATIONS, MOCK_PATIENT, QUICK_PROMPTS, MOCK_CHAT_RESPONSES } from '../../components/patient/data/mockData'
import Sidebar from '../../components/patient/layout/Sidebar'
import MobileSidebar from '../../components/patient/layout/MobileSidebar'
import TopBar from '../../components/patient/layout/TopBar'
import BottomNav from '../../components/patient/layout/BottomNav'
import { useLanguage } from '../../i18n/LanguageContext'

// Modularized Components
import TopicCards from '../../components/patient/chat/TopicCards'
import ChatHistoryV2 from '../../components/patient/chat/ChatHistoryV2'
import ChatWindow from '../../components/patient/chat/ChatWindow'
import ChatInput from '../../components/patient/chat/ChatInput'
import SafetyAlert from '../../components/patient/chat/SafetyAlert'

import {
    ShieldCheck, Heart, Apple, Pill,
    Clock,
} from 'lucide-react'

type Msg = { role: 'user' | 'bot'; text: string; time: string }

const SYMPTOM_WORDS = ['dizzy', 'numb', 'weak', 'headache', 'vision', 'chest', 'pain', 'speech', 'fall']

const CHAT_HISTORY = [
    { label: 'Yesterday', preview: 'What foods help lower blood pressure?' },
    { label: 'Feb 19', preview: 'Should I be worried about my dizziness?' },
    { label: 'Feb 18', preview: 'How much water should I drink daily?' },
]

export default function PatientChat() {
    const { t, locale } = useLanguage()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const unreadCount = MOCK_NOTIFICATIONS.length

    const now = () => new Date().toLocaleTimeString(locale === 'en' ? 'en-GB' : locale, { hour: '2-digit', minute: '2-digit' })

    const TOPIC_CARDS = useMemo(() => [
        {
            icon: Heart, color: 'from-rose-400 to-rose-500',
            label: t('chat.topics.bloodPressure' as any), prompt: 'Why is my risk elevated?',
            sub: 'Understand your readings',
        },
        {
            icon: Apple, color: 'bg-emerald-600',
            label: t('chat.topics.nutrition' as any), prompt: 'What should I eat today?',
            sub: 'DASH diet guidance',
        },
        {
            icon: Pill, color: 'bg-emerald-600',
            label: t('chat.topics.medication' as any), prompt: 'Remind me about medication',
            sub: 'Schedule & dosage',
        },
        {
            icon: ShieldCheck, color: 'from-amber-400 to-amber-500',
            label: t('chat.topics.riskFactors' as any), prompt: 'What are my stroke risk factors?',
            sub: 'Know your risks',
        },
    ], [t])

    const [messages, setMessages] = useState<Msg[]>([{
        role: 'bot',
        text: t('chat.greeting' as any, MOCK_PATIENT.name),
        time: 'Just now',
    }])
    const [input, setInput] = useState('')
    const [safetyAlert, setSafetyAlert] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const [showHistory, setShowHistory] = useState(false)
    const bottomRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, isTyping])

    const sendMessage = (text?: string) => {
        const msg = (text ?? input).trim()
        if (!msg || isTyping) return
        setInput('')

        if (SYMPTOM_WORDS.some(w => msg.toLowerCase().includes(w))) setSafetyAlert(true)

        setMessages(prev => [...prev, { role: 'user', text: msg, time: now() }])
        setIsTyping(true)

        setTimeout(() => {
            setIsTyping(false)
            const reply = MOCK_CHAT_RESPONSES[msg.toLowerCase()] ?? t('chat.genericResponse' as any)
            setMessages(prev => [...prev, { role: 'bot', text: reply, time: now() }])
        }, 1200)
    }

    const clearChat = () => {
        setMessages([{
            role: 'bot',
            text: t('chat.welcomeBack' as any, MOCK_PATIENT.name),
            time: now(),
        }])
        setSafetyAlert(false)
    }

    return (
        <div className="min-h-screen bg-slate-50 flex  ">
            <Sidebar unreadCount={unreadCount} />
            {sidebarOpen && (
                <MobileSidebar onClose={() => setSidebarOpen(false)} unreadCount={unreadCount} />
            )}

            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen pb-20 lg:pb-0">
                <TopBar onMenuClick={() => setSidebarOpen(true)} unreadCount={unreadCount} />

                <main className="flex-1 p-4 sm:p-6 max-w-6xl mx-auto w-full overflow-x-hidden">

                    {/* Header */}
                    <div className="flex items-start justify-between flex-wrap gap-3 mb-4 sm:mb-6">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">{t('chat.title' as any)}</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <p className="text-emerald-600 text-sm font-medium">{t('chat.online' as any)}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowHistory(s => !s)}
                            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                        >
                            <Clock className="w-4 h-4" />
                            {t('chat.history' as any)}
                        </button>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-6">

                        {/* LEFT — Chat panel */}
                        <div className="lg:col-span-2 flex flex-col gap-4">

                            {/* Safety alert */}
                            {safetyAlert && (
                                <SafetyAlert onClose={() => setSafetyAlert(false)} />
                            )}

                            {/* Chat window & Input */}
                            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col overflow-hidden">
                                <ChatWindow
                                    messages={messages}
                                    isTyping={isTyping}
                                    bottomRef={bottomRef}
                                    patientName={MOCK_PATIENT.name}
                                    onClearChat={clearChat}
                                />
                                <ChatInput
                                    value={input}
                                    onChange={setInput}
                                    onSend={() => sendMessage()}
                                    isTyping={isTyping}
                                    inputRef={inputRef}
                                    quickPrompts={QUICK_PROMPTS}
                                    onQuickPrompt={(p) => sendMessage(p)}
                                />
                            </div>
                        </div>

                        {/* RIGHT — Sidebar panels */}
                        <div className="flex flex-col gap-4">

                            {/* Topic cards */}
                            <TopicCards
                                topics={TOPIC_CARDS}
                                onSelectTopic={(p) => { sendMessage(p); inputRef.current?.focus() }}
                            />

                            {/* Chat history */}
                            {showHistory && (
                                <ChatHistoryV2 history={CHAT_HISTORY} />
                            )}

                            {/* Disclaimer */}
                            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
                                <div className="flex items-start gap-2.5">
                                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                    <p className="text-emerald-600 text-xs leading-relaxed">
                                        <span className="font-bold">Medical Disclaimer:</span> {t('chat.disclaimer' as any)}
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                </main>
            </div>

            <BottomNav unreadCount={unreadCount} />
        </div>
    )
}
