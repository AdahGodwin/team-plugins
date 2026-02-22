import { Sparkles } from 'lucide-react'

interface Msg {
    role: 'user' | 'bot'
    text: string
    time: string
}

interface ChatWindowProps {
    messages: Msg[]
    isTyping: boolean
    bottomRef: React.RefObject<HTMLDivElement | null>
    patientName: string
    onClearChat: () => void
}

export default function ChatWindow({
    messages,
    isTyping,
    bottomRef,
    patientName,
    onClearChat
}: ChatWindowProps) {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col">
            {/* Chat header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-sm">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                    </div>
                    <div>
                        <p className="text-slate-800 font-bold text-sm">Aegis AI</p>
                        <p className="text-slate-400 text-xs">Stroke prevention specialist</p>
                    </div>
                </div>
                <button
                    onClick={onClearChat}
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
                            <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm">
                                <Sparkles className="w-3.5 h-3.5" />
                            </div>
                        )}
                        <div className="flex flex-col gap-1 max-w-[78%]">
                            <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${m.role === 'user'
                                ? 'bg-emerald-600 text-white rounded-br-sm'
                                : 'bg-slate-100 text-slate-700 rounded-bl-sm'
                                }`}>
                                {m.text}
                            </div>
                            <span className={`text-[10px] text-slate-400 px-1 ${m.role === 'user' ? 'text-right' : ''}`}>
                                {m.time}
                            </span>
                        </div>
                        {m.role === 'user' && (
                            <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs shrink-0 mt-0.5 shadow-sm">
                                {patientName[0]}
                            </div>
                        )}
                    </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                    <div className="flex gap-2.5 justify-start">
                        <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-sm">
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
        </div>
    )
}
