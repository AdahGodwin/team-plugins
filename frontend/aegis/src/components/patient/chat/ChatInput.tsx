import { Send } from 'lucide-react'

interface ChatInputProps {
    value: string
    onChange: (val: string) => void
    onSend: () => void
    isTyping: boolean
    inputRef?: React.RefObject<HTMLInputElement | null>
    quickPrompts: string[]
    onQuickPrompt: (prompt: string) => void
}

export default function ChatInput({
    value,
    onChange,
    onSend,
    isTyping,
    inputRef,
    quickPrompts,
    onQuickPrompt
}: ChatInputProps) {
    return (
        <div className="flex flex-col">
            {/* Quick prompts */}
            <div className="px-5 pb-3 flex flex-wrap gap-2">
                {quickPrompts.map(p => (
                    <button
                        key={p}
                        onClick={() => onQuickPrompt(p)}
                        className="text-xs font-medium bg-slate-50 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-full hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 transition-all"
                    >
                        {p}
                    </button>
                ))}
            </div>

            {/* Input area */}
            <div className="p-4 pt-0">
                <div className="flex gap-2">
                    <input
                        ref={inputRef}
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && onSend()}
                        placeholder="Ask about your blood pressure, diet, medications…"
                        className="flex-1 text-sm border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-slate-50 placeholder:text-slate-300"
                    />
                    <button
                        onClick={onSend}
                        disabled={!value.trim() || isTyping}
                        className="w-11 h-11 bg-emerald-600 rounded-xl flex items-center justify-center text-white hover:opacity-90 transition-all disabled:opacity-40 shadow-sm active:scale-95"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
                <p className="text-slate-300 text-[10px] text-center mt-2">
                    Aegis AI is not a substitute for professional medical advice.
                </p>
            </div>
        </div>
    )
}
