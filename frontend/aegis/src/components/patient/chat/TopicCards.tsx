import type { LucideIcon } from 'lucide-react'

interface TopicCard {
    icon: LucideIcon
    color: string
    label: string
    prompt: string
    sub: string
}

interface TopicCardsProps {
    topics: TopicCard[]
    onSelectTopic: (prompt: string) => void
}

export default function TopicCards({ topics, onSelectTopic }: TopicCardsProps) {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
            <p className="text-slate-800 font-bold text-sm mb-4">Ask about a topic</p>
            <div className="grid grid-cols-2 gap-2">
                {topics.map(({ icon: Icon, color, label, prompt, sub }) => (
                    <button
                        key={label}
                        onClick={() => onSelectTopic(prompt)}
                        className="flex flex-col items-start gap-2 p-3 bg-slate-50 border border-slate-100 rounded-xl hover:border-emerald-200 hover:bg-emerald-50 transition-all text-left group"
                    >
                        <div className={`w-8 h-8 ${color} rounded-lg flex items-center justify-center text-white shadow-sm`}>
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
    )
}
