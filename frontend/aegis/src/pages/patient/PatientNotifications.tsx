import { useState } from 'react'
import Sidebar       from '../../components/patient/layout/Sidebar'
import MobileSidebar from '../../components/patient/layout/MobileSidebar'
import TopBar        from '../../components/patient/layout/TopBar'
import BottomNav     from '../../components/patient/layout/BottomNav'
import {
    AlertTriangle, Pill, Activity,
    Calendar, CheckCircle2, Info, X,
    BellOff, ChevronRight, Trash2, Check,
} from 'lucide-react'

type NotifType = 'alert' | 'medication' | 'vitals' | 'appointment' | 'system'

interface Notif {
    id:      number
    type:    NotifType
    title:   string
    body:    string
    time:    string
    read:    boolean
    pinned?: boolean
}

const INITIAL_NOTIFICATIONS: Notif[] = [
    {
        id:     1,
        type:   'alert',
        title:  'High Blood Pressure Detected',
        body:   'Your reading of 148/92 mmHg is above your target range. Please rest and monitor again in 30 minutes.',
        time:   '10 mins ago',
        read:   false,
        pinned: true,
    },
    {
        id:    2,
        type:  'medication',
        title: 'Medication Reminder',
        body:  'Time to take your Amlodipine 5mg. Take with water after a meal.',
        time:  '1 hour ago',
        read:  false,
    },
    {
        id:    3,
        type:  'appointment',
        title: 'Upcoming Appointment',
        body:  'You have a follow-up with Dr Amara Osei on 5 March 2026 at 10:30 AM.',
        time:  '3 hours ago',
        read:  false,
    },
    {
        id:    4,
        type:  'vitals',
        title: 'Daily Log Reminder',
        body:  "You haven't logged your vitals today. Tap here to add today's blood pressure reading.",
        time:  'Yesterday',
        read:  true,
    },
    {
        id:    5,
        type:  'system',
        title: 'Monthly Report Ready',
        body:  'Your February 2026 health summary is now available. View and download it from the Reports page.',
        time:  'Yesterday',
        read:  true,
    },
    {
        id:    6,
        type:  'medication',
        title: 'Medication Streak',
        body:  "Great job! You've taken your Aspirin 75mg for 7 days in a row. Keep it up!",
        time:  '2 days ago',
        read:  true,
    },
    {
        id:    7,
        type:  'vitals',
        title: 'BP Back to Normal',
        body:  'Your latest reading of 128/82 mmHg is within your target range. Well done!',
        time:  '3 days ago',
        read:  true,
    },
    {
        id:    8,
        type:  'system',
        title: 'Care Team Update',
        body:  'Dr Amara Osei has reviewed your last 7-day report and left a note. Check your Reports page.',
        time:  '4 days ago',
        read:  true,
    },
]

type IconComponent = React.ElementType<{ className?: string }>

interface TypeConfig {
    icon:   IconComponent
    iconBg: string
    iconFg: string
    badge:  string
    label:  string
}

const TYPE_CONFIG: Record<NotifType, TypeConfig> = {
    alert: {
        icon:   AlertTriangle,
        iconBg: 'bg-rose-100',
        iconFg: 'text-rose-500',
        badge:  'bg-rose-100 text-rose-600',
        label:  'Alert',
    },
    medication: {
        icon:   Pill,
        iconBg: 'bg-blue-100',
        iconFg: 'text-blue-500',
        badge:  'bg-blue-100 text-blue-600',
        label:  'Medication',
    },
    vitals: {
        icon:   Activity,
        iconBg: 'bg-teal-100',
        iconFg: 'text-teal-500',
        badge:  'bg-teal-100 text-teal-600',
        label:  'Vitals',
    },
    appointment: {
        icon:   Calendar,
        iconBg: 'bg-violet-100',
        iconFg: 'text-violet-500',
        badge:  'bg-violet-100 text-violet-600',
        label:  'Appointment',
    },
    system: {
        icon:   Info,
        iconBg: 'bg-slate-100',
        iconFg: 'text-slate-500',
        badge:  'bg-slate-100 text-slate-600',
        label:  'System',
    },
}

const FILTERS = ['All', 'Unread', 'Alert', 'Medication', 'Vitals', 'Appointment', 'System'] as const
type Filter = typeof FILTERS[number]

/* ─────────────────────────────────────────
   Notification Card
───────────────────────────────────────── */
interface NotifCardProps {
    n:         Notif
    onRead:    (id: number) => void
    onDismiss: (id: number) => void
}

function NotifCard({ n, onRead, onDismiss }: NotifCardProps) {
    const cfg  = TYPE_CONFIG[n.type]
    const Icon = cfg.icon

    return (
        <div
            onClick={() => { if (!n.read) onRead(n.id) }}
            className={[
                'relative flex items-start gap-4 p-5 rounded-2xl border shadow-sm',
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
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cfg.iconBg}`}>
                <Icon className={`w-5 h-5 ${cfg.iconFg}`} />
            </div>

            {/* Body */}
            <div className="flex-1 min-w-0 pr-6">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className={`text-sm font-bold ${n.read ? 'text-slate-700' : 'text-slate-900'}`}>
                        {n.title}
                    </p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}>
                        {cfg.label}
                    </span>
                    {n.pinned && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-600">
                            Pinned
                        </span>
                    )}
                </div>

                <p className="text-slate-500 text-xs leading-relaxed">{n.body}</p>

                <div className="flex items-center gap-3 mt-2.5">
                    <span className="text-slate-400 text-[10px] font-medium">{n.time}</span>

                    {!n.read && (
                        <button
                            onClick={e => { e.stopPropagation(); onRead(n.id) }}
                            className="flex items-center gap-1 text-[10px] font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                        >
                            <CheckCircle2 className="w-3 h-3" />
                            Mark read
                        </button>
                    )}

                    <button
                        onClick={e => { e.stopPropagation(); onDismiss(n.id) }}
                        className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 hover:text-rose-500 ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X className="w-3 h-3" />
                        Dismiss
                    </button>

                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            </div>
        </div>
    )
}

/* ─────────────────────────────────────────
   Page
───────────────────────────────────────── */
export default function PatientNotifications() {
    const [sidebarOpen,   setSidebarOpen]   = useState(false)
    const [notifications, setNotifications] = useState<Notif[]>(INITIAL_NOTIFICATIONS)
    const [activeFilter,  setActiveFilter]  = useState<Filter>('All')
    const [dismissed,     setDismissed]     = useState<number[]>([])

    const unreadCount = notifications.filter(
        n => !n.read && !dismissed.includes(n.id)
    ).length

    const markAllRead = () =>
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))

    const markRead = (id: number) =>
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        )

    const dismiss  = (id: number) => setDismissed(prev => [...prev, id])
    const clearAll = ()            => setDismissed(INITIAL_NOTIFICATIONS.map(n => n.id))

    const getCount = (f: Filter): number => {
        if (f === 'All')    return notifications.filter(n => !dismissed.includes(n.id)).length
        if (f === 'Unread') return notifications.filter(n => !n.read && !dismissed.includes(n.id)).length
        return notifications.filter(
            n => !dismissed.includes(n.id) && n.type === f.toLowerCase()
        ).length
    }

    const filtered = notifications
        .filter(n => !dismissed.includes(n.id))
        .filter(n => {
            if (activeFilter === 'All')    return true
            if (activeFilter === 'Unread') return !n.read
            return n.type === activeFilter.toLowerCase()
        })

    const pinned  = filtered.filter(n =>  n.pinned)
    const regular = filtered.filter(n => !n.pinned)

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            <Sidebar unreadCount={unreadCount} />

            {sidebarOpen && (
                <MobileSidebar
                    onClose={() => setSidebarOpen(false)}
                    unreadCount={unreadCount}
                />
            )}

            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen pb-20 lg:pb-0">
                <TopBar
                    onMenuClick={() => setSidebarOpen(true)}
                    unreadCount={unreadCount}
                />

                <main className="flex-1 p-6 max-w-3xl mx-auto w-full space-y-6">

                    {/* ── Header ── */}
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl font-extrabold text-slate-900">Notifications</h1>
                            <p className="text-slate-400 text-sm mt-1">
                                {unreadCount > 0 ? (
                                    <>
                                        <span className="text-blue-600 font-semibold">{unreadCount} unread</span>
                                        {' · '}{filtered.length} total
                                    </>
                                ) : (
                                    "You're all caught up!"
                                )}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllRead}
                                    className="flex items-center gap-1.5 text-xs font-semibold text-teal-600 bg-teal-50 border border-teal-100 px-3 py-2 rounded-xl hover:bg-teal-100 transition-colors"
                                >
                                    <Check className="w-3.5 h-3.5" />
                                    Mark all read
                                </button>
                            )}
                            {filtered.length > 0 && (
                                <button
                                    onClick={clearAll}
                                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-white border border-slate-200 px-3 py-2 rounded-xl hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition-colors"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Clear all
                                </button>
                            )}
                        </div>
                    </div>

                    {/* ── Filter chips ── */}
                    <div className="flex gap-2 flex-wrap">
                        {FILTERS.map(f => {
                            const count    = getCount(f)
                            const isActive = activeFilter === f
                            return (
                                <button
                                    key={f}
                                    onClick={() => setActiveFilter(f)}
                                    className={[
                                        'flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border transition-all',
                                        isActive
                                            ? 'bg-linear-to-r from-blue-500 to-teal-500 text-white border-transparent shadow-sm'
                                            : 'bg-white text-slate-500 border-slate-200 hover:border-blue-200 hover:text-blue-600',
                                    ].join(' ')}
                                >
                                    {f}
                                    {count > 0 && (
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                                            isActive
                                                ? 'bg-white/20 text-white'
                                                : 'bg-slate-100 text-slate-500'
                                        }`}>
                                            {count}
                                        </span>
                                    )}
                                </button>
                            )
                        })}
                    </div>

                    {/* ── Empty state ── */}
                    {filtered.length === 0 && (
                        <div className="bg-white border border-slate-200 rounded-2xl p-12 shadow-sm flex flex-col items-center justify-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                                <BellOff className="w-6 h-6 text-slate-400" />
                            </div>
                            <div className="text-center">
                                <p className="text-slate-700 font-bold">No notifications</p>
                                <p className="text-slate-400 text-sm mt-1">
                                    {activeFilter === 'All'
                                        ? "You're all caught up!"
                                        : `No ${activeFilter.toLowerCase()} notifications`
                                    }
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ── Pinned ── */}
                    {pinned.length > 0 && (
                        <div className="space-y-3">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
                                Pinned
                            </p>
                            {pinned.map(n => (
                                <NotifCard
                                    key={n.id}
                                    n={n}
                                    onRead={markRead}
                                    onDismiss={dismiss}
                                />
                            ))}
                        </div>
                    )}

                    {/* ── Regular ── */}
                    {regular.length > 0 && (
                        <div className="space-y-3">
                            {pinned.length > 0 && (
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
                                    Earlier
                                </p>
                            )}
                            {regular.map(n => (
                                <NotifCard
                                    key={n.id}
                                    n={n}
                                    onRead={markRead}
                                    onDismiss={dismiss}
                                />
                            ))}
                        </div>
                    )}

                </main>
            </div>

            <BottomNav unreadCount={unreadCount} />
        </div>
    )
}