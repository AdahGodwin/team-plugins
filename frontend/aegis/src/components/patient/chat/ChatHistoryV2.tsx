import { Clock, ChevronRight } from 'lucide-react'

interface ChatHistoryItem {
    label: string
    preview: string
}

interface ChatHistoryV2Props {
    history: ChatHistoryItem[]
}

export default function ChatHistoryV2({ history }: ChatHistoryV2Props) {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
                <p className="text-slate-800 font-bold text-sm">Recent Conversations</p>
            </div>
            <div className="divide-y divide-slate-100">
                {history.map(({ label, preview }) => (
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
    )
}
