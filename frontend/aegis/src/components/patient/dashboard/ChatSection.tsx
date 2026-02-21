import { useState, useRef, useEffect } from 'react'
import { Sparkles, Send, AlertTriangle, X } from 'lucide-react'
import { QUICK_PROMPTS, MOCK_CHAT_RESPONSES, MOCK_PATIENT } from '../data/mockData'

type Msg = { role: 'user' | 'bot'; text: string; time: string }
const SYMPTOM_WORDS = ['dizzy', 'numb', 'weak', 'headache', 'vision', 'chest', 'pain', 'speech', 'fall']
const now = () => new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

const ChatSection = () => {
    const [messages, setMessages] = useState<Msg[]>([{
        role: 'bot',
        text: `Hello ${MOCK_PATIENT.name}! I'm your Aegis AI health assistant. How are you feeling today?`,
        time: 'Just now',
    }])
    const [input, setInput] = useState('')
    const [safetyAlert, setSafetyAlert] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const bottomRef = useRef<HTMLDivElement>(null)

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

    return (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm ring-1 ring-slate-50 flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 sm:p-6 border-b border-slate-100">
                <div className="relative">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-linear-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center text-white shadow-sm">
                        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-teal-500 rounded-full border-2 border-white" />
                </div>
                <div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">Ask Aegis AI</h2>
                    <p className="text-teal-600 text-xs font-medium">Online · Always available</p>
                </div>
            </div>

            {/* Safety alert */}
            {safetyAlert && (
                <div className="mx-4 mt-4 flex items-start gap-3 bg-rose-50 border border-rose-200 rounded-2xl p-4">
                    <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-rose-700 text-sm font-bold mb-0.5">Symptom Detected</p>
                        <p className="text-rose-600 text-xs leading-relaxed">
                            If this is a medical emergency, use the <strong>Emergency SOS button</strong> or call services immediately.
                        </p>
                    </div>
                    <button onClick={() => setSafetyAlert(false)} className="text-rose-400 hover:text-rose-600 shrink-0">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-72 min-h-40">
                {messages.map((m, i) => (
                    <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {m.role === 'bot' && (
                            <div className="w-7 h-7 rounded-lg bg-linear-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm">
                                <Sparkles className="w-3.5 h-3.5" />
                            </div>
                        )}
                        <div className="flex flex-col gap-1">
                            <div className={`max-w-[90%] sm:max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${m.role === 'user'
                                ? 'bg-linear-to-br from-blue-500 to-teal-500 text-white rounded-br-sm'
                                : 'bg-slate-100 text-slate-700 rounded-bl-sm'
                                }`}>
                                {m.text}
                            </div>
                            <span className="text-[10px] text-slate-400 px-1">{m.time}</span>
                        </div>
                    </div>
                ))}
                {/* Typing indicator */}
                {isTyping && (
                    <div className="flex gap-2 justify-start">
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

            <div className="px-4 pb-3 flex flex-wrap gap-2 overflow-x-hidden">
                {QUICK_PROMPTS.map(p => (
                    <button
                        key={p} onClick={() => sendMessage(p)}
                        className="text-[10px] sm:text-xs font-medium bg-slate-50 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-full hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 transition-all whitespace-nowrap"
                    >
                        {p}
                    </button>
                ))}
            </div>

            {/* Input */}
            <div className="p-4 pt-0">
                <div className="flex gap-2">
                    <input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && sendMessage()}
                        placeholder="Ask about your health…"
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
            </div>
        </div>
    )
}

export default ChatSection