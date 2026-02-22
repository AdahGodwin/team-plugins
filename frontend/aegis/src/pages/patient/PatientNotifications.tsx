import { useState } from 'react'
import { Check, Trash2 } from 'lucide-react'
import Sidebar from '../../components/patient/layout/Sidebar'
import MobileSidebar from '../../components/patient/layout/MobileSidebar'
import TopBar from '../../components/patient/layout/TopBar'
import BottomNav from '../../components/patient/layout/BottomNav'
import NotifCard from '../../components/patient/notifications/NotifCard'
import NotifFilters from '../../components/patient/notifications/NotifFilters'
import NotifEmptyState from '../../components/patient/notifications/NotifEmptyState'
import {
    INITIAL_NOTIFICATIONS,
    type Notif,
    type Filter,
} from '../../components/patient/notifications/notifTypes'
import { useLanguage } from '../../i18n/LanguageContext'

export default function PatientNotifications() {
    const { t } = useLanguage()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [notifications, setNotifications] = useState<Notif[]>(INITIAL_NOTIFICATIONS)
    const [activeFilter, setActiveFilter] = useState<Filter>('All')
    const [dismissed, setDismissed] = useState<number[]>([])

    const unreadCount = notifications.filter(
        n => !n.read && !dismissed.includes(n.id)
    ).length

    const markAllRead = () =>
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))

    const markRead = (id: number) =>
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        )

    const dismiss = (id: number) => setDismissed(prev => [...prev, id])
    const clearAll = () => setDismissed(INITIAL_NOTIFICATIONS.map(n => n.id))

    const getCount = (f: Filter): number => {
        if (f === 'All') return notifications.filter(n => !dismissed.includes(n.id)).length
        if (f === 'Unread') return notifications.filter(n => !n.read && !dismissed.includes(n.id)).length
        return notifications.filter(
            n => !dismissed.includes(n.id) && n.type === f.toLowerCase()
        ).length
    }

    const filtered = notifications
        .filter(n => !dismissed.includes(n.id))
        .filter(n => {
            if (activeFilter === 'All') return true
            if (activeFilter === 'Unread') return !n.read
            return n.type === activeFilter.toLowerCase()
        })

    const pinned = filtered.filter(n => n.pinned)
    const regular = filtered.filter(n => !n.pinned)

    return (
        <div className="min-h-screen bg-slate-50 flex  ">
            <Sidebar unreadCount={unreadCount} />

            {sidebarOpen && (
                <MobileSidebar
                    onClose={() => setSidebarOpen(false)}
                    unreadCount={unreadCount}
                />
            )}

            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen pb-20 lg:pb-0">
                <TopBar onMenuClick={() => setSidebarOpen(true)} unreadCount={unreadCount} />

                <main className="flex-1 p-4 sm:p-6 max-w-5xl mx-auto w-full space-y-4 sm:space-y-6">

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{t('dashboard.notifications.allTitle' as any)}</h1>
                            <p className="text-slate-400 text-sm mt-1">
                                {unreadCount > 0 ? (
                                    <>
                                        <span className="text-emerald-600 font-semibold">{t('dashboard.notifications.unread' as any).replace('{unread}', unreadCount.toString())}</span>
                                        {' · '}{t('dashboard.notifications.total' as any).replace('{count}', filtered.length.toString())}
                                    </>
                                ) : (
                                    t('dashboard.notifications.caughtUpPage' as any)
                                )}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-auto">
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllRead}
                                    className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-xl hover:bg-emerald-100 transition-colors"
                                >
                                    <Check className="w-3.5 h-3.5" />
                                    {t('dashboard.notifications.markAllRead' as any)}
                                </button>
                            )}
                            {filtered.length > 0 && (
                                <button
                                    onClick={clearAll}
                                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-white border border-slate-200 px-3 py-2 rounded-xl hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition-colors"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    {t('dashboard.notifications.clearAll' as any)}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Filters */}
                    <NotifFilters
                        activeFilter={activeFilter}
                        getCount={getCount}
                        onChange={setActiveFilter}
                    />

                    {/* Empty state */}
                    {filtered.length === 0 && (
                        <NotifEmptyState activeFilter={activeFilter} />
                    )}

                    {/* Pinned */}
                    {pinned.length > 0 && (
                        <div className="space-y-3">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
                                {t('dashboard.notifications.pinned' as any)}
                            </p>
                            {pinned.map(n => (
                                <NotifCard key={n.id} n={n} onRead={markRead} onDismiss={dismiss} />
                            ))}
                        </div>
                    )}

                    {/* Regular */}
                    {regular.length > 0 && (
                        <div className="space-y-3">
                            {pinned.length > 0 && (
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
                                    {t('dashboard.notifications.earlier' as any)}
                                </p>
                            )}
                            {regular.map(n => (
                                <NotifCard key={n.id} n={n} onRead={markRead} onDismiss={dismiss} />
                            ))}
                        </div>
                    )}

                </main>
            </div>

            <BottomNav unreadCount={unreadCount} />
        </div>
    )
}
