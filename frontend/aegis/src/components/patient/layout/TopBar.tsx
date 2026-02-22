import { useState, useRef, useEffect } from 'react'
import { Bell, Menu, AlertTriangle, Pill, Activity, Calendar, Info, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AccessibilityBar from '../../common/AccessibilityBar'
import { useLanguage } from '../../../i18n/LanguageContext'
import { useAuth } from '../../../context/AuthContext'

interface TopBarProps {
    onMenuClick: () => void
    unreadCount: number
}

type NotifType = 'alert' | 'medication' | 'vitals' | 'appointment' | 'system'

interface QuickNotif {
    id: number
    type: NotifType
    title: string
    body: string
    time: string
    read: boolean
}

const QUICK_NOTIFS: QuickNotif[] = [
    {
        id: 1,
        type: 'alert',
        title: 'High Blood Pressure Detected',
        body: 'Your reading of 148/92 mmHg is above target.',
        time: '10 mins ago',
        read: false,
    },
    {
        id: 2,
        type: 'medication',
        title: 'Medication Reminder',
        body: 'Time to take your Amlodipine 5mg.',
        time: '1 hour ago',
        read: false,
    },
    {
        id: 3,
        type: 'appointment',
        title: 'Upcoming Appointment',
        body: 'Dr Amara Osei · 5 March 2026 at 10:30 AM.',
        time: '3 hours ago',
        read: false,
    },
    {
        id: 4,
        type: 'vitals',
        title: 'Daily Log Reminder',
        body: "You haven't logged your vitals today.",
        time: 'Yesterday',
        read: true,
    },
    {
        id: 5,
        type: 'system',
        title: 'Monthly Report Ready',
        body: 'Your February 2026 summary is available.',
        time: 'Yesterday',
        read: true,
    },
]

const TYPE_CONFIG: Record<NotifType, {
    icon: React.ElementType<{ className?: string }>
    iconBg: string
    iconFg: string
}> = {
    alert: { icon: AlertTriangle, iconBg: 'bg-rose-100', iconFg: 'text-rose-500' },
    medication: { icon: Pill, iconBg: 'bg-emerald-100', iconFg: 'text-emerald-500' },
    vitals: { icon: Activity, iconBg: 'bg-emerald-100', iconFg: 'text-emerald-500' },
    appointment: { icon: Calendar, iconBg: 'bg-slate-100', iconFg: 'text-slate-500' },
    system: { icon: Info, iconBg: 'bg-slate-100', iconFg: 'text-slate-500' },
}

const TopBar = ({ onMenuClick }: TopBarProps) => {
    const navigate = useNavigate()
    const { t, locale } = useLanguage()
    const { user } = useAuth()

    // Derive first name from fullName, fall back gracefully while loading
    const firstName = user?.fullName?.split(' ')[0] ?? '...'
    const avatarLetter = firstName[0]?.toUpperCase() ?? '?'
    const [open, setOpen] = useState(false)
    const [notifs, setNotifs] = useState(QUICK_NOTIFS)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const hour = new Date().getHours()
    const greetingKey = hour < 12 ? 'dashboard.greeting' : hour < 17 ? 'dashboard.greetingAfternoon' : 'dashboard.greetingEvening'
    const greeting = t(greetingKey as any)

    const unread = notifs.filter(n => !n.read).length

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const markRead = (id: number) =>
        setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))

    const dismiss = (id: number) =>
        setNotifs(prev => prev.filter(n => n.id !== id))

    const markAllRead = () =>
        setNotifs(prev => prev.map(n => ({ ...n, read: true })))

    return (
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-2 sticky top-0 z-30 shadow-sm">

            {/* Hamburger — mobile only, always first */}
            <button
                onClick={onMenuClick}
                className="lg:hidden shrink-0 w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Greeting — takes remaining space, truncates */}
            <div className="flex-1 min-w-0">
                <h1 className="text-base sm:text-lg font-extrabold text-slate-900 truncate">
                    {greeting}, {firstName} 👋
                </h1>
                <p className="text-slate-400 text-xs hidden sm:block truncate">
                    {new Date().toLocaleDateString(locale === 'en' ? 'en-GB' : locale, { weekday: 'long', day: 'numeric', month: 'long' })}
                    {' · '}
                    <span className="text-emerald-600 font-semibold">
                        🔥 {t('dashboard.streakMessage' as any, 0)}
                    </span>
                </p>
            </div>

            {/* AccessibilityBar — desktop only */}
            <div className="hidden lg:flex">
                <AccessibilityBar />
            </div>

            {/* Right */}
            <div className="flex items-center gap-2 shrink-0">

                {/* Bell + dropdown */}
                <div ref={dropdownRef} className="relative">
                    <button
                        onClick={() => setOpen(o => !o)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${open ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                    >
                        <Bell className="w-4 h-4" />
                    </button>

                    {/* Unread badge */}
                    {unread > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center pointer-events-none">
                            {unread}
                        </span>
                    )}

                    {/* Dropdown — constrained so it never overflows on xs */}
                    {open && (
                        <div className="absolute right-0 top-12 w-[calc(100vw-2rem)] max-w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50">

                            {/* Header */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <p className="text-slate-800 font-bold text-sm">{t('dashboard.notifications.title' as any)}</p>
                                    {unread > 0 && (
                                        <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                            {unread}
                                        </span>
                                    )}
                                </div>
                                {unread > 0 && (
                                    <button
                                        onClick={markAllRead}
                                        className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                                    >
                                        {t('dashboard.notifications.markAllRead' as any)}
                                    </button>
                                )}
                            </div>

                            {/* List */}
                            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                                {notifs.length === 0 ? (
                                    <div className="px-4 py-8 flex flex-col items-center gap-2">
                                        <Bell className="w-6 h-6 text-slate-300" />
                                        <p className="text-slate-400 text-sm font-medium">{t('dashboard.notifications.caughtUp' as any)}</p>
                                    </div>
                                ) : (
                                    notifs.map(n => {
                                        const cfg = TYPE_CONFIG[n.type]
                                        const Icon = cfg.icon
                                        return (
                                            <div
                                                key={n.id}
                                                onClick={() => markRead(n.id)}
                                                className={`flex items-start gap-3 px-4 py-3 cursor-pointer group transition-colors ${n.read ? 'hover:bg-slate-50' : 'bg-emerald-50 hover:bg-emerald-100/60'
                                                    }`}
                                            >
                                                {/* Icon */}
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${cfg.iconBg}`}>
                                                    <Icon className={`w-4 h-4 ${cfg.iconFg}`} />
                                                </div>

                                                {/* Text */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-1.5">
                                                        {!n.read && (
                                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                                        )}
                                                        <p className={`text-xs font-bold truncate ${n.read ? 'text-slate-600' : 'text-slate-900'}`}>
                                                            {n.title}
                                                        </p>
                                                    </div>
                                                    <p className="text-slate-400 text-[11px] leading-relaxed mt-0.5 line-clamp-2">
                                                        {n.body}
                                                    </p>
                                                    <p className="text-slate-300 text-[10px] mt-1">{n.time}</p>
                                                </div>

                                                {/* Dismiss */}
                                                <button
                                                    onClick={e => { e.stopPropagation(); dismiss(n.id) }}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-rose-400 mt-0.5 shrink-0"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        )
                                    })
                                )}
                            </div>

                            {/* Footer */}
                            <div className="px-4 py-3 border-t border-slate-100">
                                <button
                                    onClick={() => { setOpen(false); navigate('/dashboard/notifications') }}
                                    className="w-full py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-shadow shadow-sm"
                                >
                                    {t('dashboard.notifications.viewAll' as any)}
                                </button>
                            </div>

                        </div>
                    )}
                </div>

                {/* Avatar */}
                <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {avatarLetter}
                </div>
            </div>

        </header>
    )
}

export default TopBar
