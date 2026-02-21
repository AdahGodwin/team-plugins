import { CheckCircle2, X, ChevronRight } from 'lucide-react'
import { TYPE_CONFIG } from './notifTypes'
import type { Notif } from './notifTypes'

interface NotifCardProps {
    n:         Notif
    onRead:    (id: number) => void
    onDismiss: (id: number) => void
}

export default function NotifCard({ n, onRead, onDismiss }: NotifCardProps) {
    const cfg  = TYPE_CONFIG[n.type]
    const Icon = cfg.icon

    return (
        <div
            onClick={() => { if (!n.read) onRead(n.id) }}
            className={[
                'relative flex items-start gap-4 p-4 sm:p-5 rounded-2xl border shadow-sm',
                'transition-all cursor-pointer group',
                n.read
                    ? 'bg-white border-slate-200 hover:bg-slate-50'
                    : 'bg-blue-50 border-blue-100 hover:bg-blue-100/60',
                n.pinned ? 'ring-1 ring-rose-200' : '',
            ].join(' ')}
        >
            {/* Unread dot */}
            {!n.read && (
                <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-blue-500" />
            )}

            {/* Icon */}
            <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 ${cfg.iconBg}`}>
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${cfg.iconFg}`} />
            </div>

            {/* Body */}
            <div className="flex-1 min-w-0 pr-4 sm:pr-6">
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    {/* Title — larger on desktop */}
                    <p className={`text-sm sm:text-base font-bold ${n.read ? 'text-slate-700' : 'text-slate-900'}`}>
                        {n.title}
                    </p>
                    <span className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${cfg.badge}`}>
                        {cfg.label}
                    </span>
                    {n.pinned && (
                        <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-600 shrink-0">
                            Pinned
                        </span>
                    )}
                </div>

                {/* Body text — larger on desktop */}
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{n.body}</p>

                <div className="flex items-center gap-3 mt-2.5 flex-wrap">
                    {/* Time */}
                    <span className="text-slate-400 text-[10px] sm:text-xs font-medium">{n.time}</span>

                    {!n.read && (
                        <button
                            onClick={e => { e.stopPropagation(); onRead(n.id) }}
                            className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                        >
                            <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            Mark read
                        </button>
                    )}

                    <button
                        onClick={e => { e.stopPropagation(); onDismiss(n.id) }}
                        className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-slate-400 hover:text-rose-500 ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        Dismiss
                    </button>

                    <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            </div>
        </div>
    )
}