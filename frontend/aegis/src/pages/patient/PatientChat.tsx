import { useState, useRef, useEffect } from 'react'
import { MOCK_NOTIFICATIONS, MOCK_PATIENT, QUICK_PROMPTS, MOCK_CHAT_RESPONSES } from '../../components/patient/data/mockData'
import Sidebar from '../../components/patient/layout/Sidebar'
import MobileSidebar from '../../components/patient/layout/MobileSidebar'
import TopBar from '../../components/patient/layout/TopBar'
import BottomNav from '../../components/patient/layout/BottomNav'
import {
    Sparkles, Send, AlertTriangle, X,
    ShieldCheck, Heart, Apple, Pill,
    Clock, ChevronRight,
} from 'lucide-react'

type Msg = { role: 'user' | 'bot'; text: string; time: string }

const SYMPTOM_WORDS = ['dizzy', 'numb', 'weak', 'headache', 'vision', 'chest', 'pain', 'speech', 'fall']

const TOPIC_CARDS = [
    {
        icon: Heart, color: 'from-rose-400 to-rose-500',
        label: 'Blood Pressure', prompt: 'Why is my risk elevated?',
        sub: 'Understand your readings',
    },
    {
        icon: Apple, color: 'from-teal-400 to-teal-500',
        label: 'Nutrition', prompt: 'What should I eat today?',
        sub: 'DASH diet guidance',
    },
    {
        icon: Pill, color: 'from-blue-400 to-blue-500',
        label: 'Medication', prompt: 'Remind me about medication',
        sub: 'Schedule & dosage',
    },
    {
        icon: ShieldCheck, color: 'from-amber-400 to-amber-500',
        label: 'Risk Factors', prompt: 'What are my stroke risk factors?',
        sub: 'Know your risks',
    },
]

const CHAT_HISTORY = [
    { label: 'Yesterday', preview: 'What foods help lower blood pressure?' },
    { label: 'Feb 19', preview: 'Should I be worried about my dizziness?' },
    { label: 'Feb 18', preview: 'How much water should I drink daily?' },
]

const now = () => new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

export default function PatientChat() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [messages, setMessages] = useState<Msg[]>([{
        role: 'bot',
        text: `Hello ${MOCK_PATIENT.name}! I'm your Aegis AI health assistant. I can help with your blood pressure, medications, diet, and stroke risk. How are you feeling today?`,
        time: 'Just now',
    }])
    const [input, setInput] = useState('')
    const [safetyAlert, setSafetyAlert] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const [showHistory, setShowHistory] = useState(false)
    const bottomRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const unreadCount = MOCK_NOTIFICATIONS.length

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
            const reply = MOCK_CHAT_RESPONSES[msg.toLowerCase()] ??
                'Thank you for your message. Based on your health history, I recommend speaking with your care team. Is there anything else I can help with?'
            setMessages(prev => [...prev, { role: 'bot', text: reply, time: now() }])
        }, 1200)
    }

    const clearChat = () => {
        setMessages([{
            role: 'bot',
            text: `Hello again ${MOCK_PATIENT.name}! How can I help you today?`,
            time: now(),
        }])
        setSafetyAlert(false)
    }

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
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
                            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">AI Health Assistant</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                                <p className="text-teal-600 text-sm font-medium">Online · Always available</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowHistory(s => !s)}
                            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                        >
                            <Clock className="w-4 h-4" />
                            History
                        </button>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-6">

                        {/* LEFT — Chat panel */}
                        <div className="lg:col-span-2 flex flex-col gap-4">

                            {/* Safety alert */}
                            {safetyAlert && (
                                <div className="flex items-start gap-3 bg-rose-50 border border-rose-200 rounded-2xl p-4">
                                    <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-rose-700 text-sm font-bold mb-0.5">Symptom Detected</p>
                                        <p className="text-rose-600 text-xs leading-relaxed">
                                            If this is a medical emergency, use the <strong>Emergency SOS button</strong> on your dashboard or call emergency services immediately.
                                        </p>
                                    </div>
                                    <button onClick={() => setSafetyAlert(false)} className="text-rose-400 hover:text-rose-600">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}

                            {/* Chat window */}
                            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col">

                                {/* Chat header */}
                                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <div className="w-9 h-9 bg-linear-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center text-white shadow-sm">
                                                <Sparkles className="w-4 h-4" />
                                            </div>
                                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-teal-500 rounded-full border-2 border-white" />
                                        </div>
                                        <div>
                                            <p className="text-slate-800 font-bold text-sm">Aegis AI</p>
                                            <p className="text-slate-400 text-xs">Stroke prevention specialist</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={clearChat}
                                        className="text-xs text-slate-400 hover:text-rose-500 font-semibold transition-colors"
                                    >
                                        Clear chat
                                    </button>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-5 space-y-4 max-h-96 min-h-64">
                                    {messages.map((m, i) => (
                                        <div key={i} className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            {m.role === 'bot' && (
                                                <div className="w-7 h-7 rounded-lg bg-linear-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm">
                                                    <Sparkles className="w-3.5 h-3.5" />
                                                </div>
                                            )}
                                            <div className="flex flex-col gap-1 max-w-[78%]">
                                                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${m.role === 'user'
                                                        ? 'bg-linear-to-br from-blue-500 to-teal-500 text-white rounded-br-sm'
                                                        : 'bg-slate-100 text-slate-700 rounded-bl-sm'
                                                    }`}>
                                                    {m.text}
                                                </div>
                                                <span className={`text-[10px] text-slate-400 px-1 ${m.role === 'user' ? 'text-right' : ''}`}>
                                                    {m.time}
                                                </span>
                                            </div>
                                            {m.role === 'user' && (
                                                <div className="w-7 h-7 rounded-lg bg-linear-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white font-bold text-xs shrink-0 mt-0.5 shadow-sm">
                                                    {MOCK_PATIENT.name[0]}
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {/* Typing indicator */}
                                    {isTyping && (
                                        <div className="flex gap-2.5 justify-start">
                                            <div className="w-7 h-7 rounded-lg bg-linear-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white shrink-0 shadow-sm">
                                                <Sparkles className="w-3.5 h-3.5" />
                                            </div>
                                            <div className="bg-slate-100 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
                                                {[0, 1, 2].map(i => (
                                                    <span key={i} className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <div ref={bottomRef} />
                                </div>

                                {/* Quick prompts */}
                                <div className="px-5 pb-3 flex flex-wrap gap-2">
                                    {QUICK_PROMPTS.map(p => (
                                        <button
                                            key={p}
                                            onClick={() => sendMessage(p)}
                                            className="text-xs font-medium bg-slate-50 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-full hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 transition-all"
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>

                                {/* Input */}
                                <div className="p-4 pt-0">
                                    <div className="flex gap-2">
                                        <input
                                            ref={inputRef}
                                            value={input}
                                            onChange={e => setInput(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && sendMessage()}
                                            placeholder="Ask about your blood pressure, diet, medications…"
                                            className="flex-1 text-sm border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-slate-50 placeholder:text-slate-300"
                                        />
                                        <button
                                            onClick={() => sendMessage()}
                                            disabled={!input.trim() || isTyping}
                                            className="w-11 h-11 bg-linear-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center text-white hover:opacity-90 transition-all disabled:opacity-40 shadow-sm active:scale-95"
                                        >
                                            <Send className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-slate-300 text-[10px] text-center mt-2">
                                        Aegis AI is not a substitute for professional medical advice.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT — Sidebar panels */}
                        <div className="flex flex-col gap-4">

                            {/* Topic cards */}
                            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
                                <p className="text-slate-800 font-bold text-sm mb-4">Ask about a topic</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {TOPIC_CARDS.map(({ icon: Icon, color, label, prompt, sub }) => (
                                        <button
                                            key={label}
                                            onClick={() => { sendMessage(prompt); inputRef.current?.focus() }}
                                            className="flex flex-col items-start gap-2 p-3 bg-slate-50 border border-slate-100 rounded-xl hover:border-blue-200 hover:bg-blue-50 transition-all text-left group"
                                        >
                                            <div className={`w-8 h-8 bg-linear-to-br ${color} rounded-lg flex items-center justify-center text-white shadow-sm`}>
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-slate-700 font-bold text-xs">{label}</p>
                                                <p className="text-slate-400 text-[10px]">{sub}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Chat history */}
                            {showHistory && (
                                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                                    <div className="px-5 py-4 border-b border-slate-100">
                                        <p className="text-slate-800 font-bold text-sm">Recent Conversations</p>
                                    </div>
                                    <div className="divide-y divide-slate-100">
                                        {CHAT_HISTORY.map(({ label, preview }) => (
                                            <button
                                                key={label}
                                                className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors text-left"
                                            >
                                                <Clock className="w-4 h-4 text-slate-300 shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-slate-400 text-[10px] font-medium">{label}</p>
                                                    <p className="text-slate-600 text-xs font-medium truncate">{preview}</p>
                                                </div>
                                                <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Disclaimer */}
                            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                                <div className="flex items-start gap-2.5">
                                    <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                                    <p className="text-blue-600 text-xs leading-relaxed">
                                        <span className="font-bold">Medical Disclaimer:</span> Aegis AI provides general health information only. Always consult your doctor for medical decisions.
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