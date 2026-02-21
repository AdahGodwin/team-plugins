import { useState } from 'react'
import { BellRing, ChevronRight, X } from 'lucide-react'
import { MOCK_NOTIFICATIONS, NOTIFICATION_STYLES } from '../data/mockData'

const NotificationsPanel = () => {
    const [open, setOpen] = useState(false)
    const [read, setRead] = useState<number[]>([])

    const unread = MOCK_NOTIFICATIONS.filter(n => !read.includes(n.id)).length
    const markRead = (id: number) => setRead(r => [...r, id])
    const markAllRead = () => setRead(MOCK_NOTIFICATIONS.map(n => n.id))

    return (
        <>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm ring-1 ring-slate-50">
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-linear-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center text-white shadow-sm shrink-0">
                            <BellRing className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <h2 className="text-base sm:text-lg font-bold text-slate-900">Notifications</h2>
                    </div>
                    {unread > 0 && (
                        <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-200">
                            {unread} new
                        </span>
                    )}
                </div>

                <div className="space-y-3 mb-4">
                    {MOCK_NOTIFICATIONS.slice(0, 3).map(n => {
                        const style = NOTIFICATION_STYLES[n.type as keyof typeof NOTIFICATION_STYLES]
                        const isRead = read.includes(n.id)
                        return (
                            <div key={n.id} className={`flex items-start gap-3 p-4 rounded-2xl border transition-all ${isRead ? 'bg-white border-slate-100 opacity-60' : `${style.bg} ${style.border}`}`}>
                                <BellRing className={`w-4 h-4 mt-0.5 shrink-0 ${style.color}`} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-slate-700 text-sm leading-snug">{n.msg}</p>
                                    <p className="text-slate-400 text-xs mt-1">{n.time}</p>
                                </div>
                                {!isRead && (
                                    <button onClick={() => markRead(n.id)} className="text-slate-300 hover:text-slate-500 shrink-0">
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        )
                    })}
                </div>

                <button
                    onClick={() => setOpen(true)}
                    className="w-full flex items-center justify-center gap-2 bg-slate-50 border border-slate-200 text-slate-600 font-semibold py-3.5 rounded-2xl hover:bg-slate-100 transition-all text-sm"
                >
                    View All Notifications <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            {open && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-xl font-extrabold text-slate-900">All Notifications</h3>
                                <p className="text-slate-400 text-sm">{unread} unread</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={markAllRead} className="text-xs text-blue-500 font-semibold hover:underline">
                                    Mark all read
                                </button>
                                <button onClick={() => setOpen(false)} className="w-9 h-9 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-500 transition-colors ml-2">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {MOCK_NOTIFICATIONS.map(n => {
                                const style = NOTIFICATION_STYLES[n.type as keyof typeof NOTIFICATION_STYLES]
                                const isRead = read.includes(n.id)
                                return (
                                    <div key={n.id} className={`flex items-start gap-3 p-4 rounded-2xl border transition-all ${isRead ? 'bg-white border-slate-100 opacity-60' : `${style.bg} ${style.border}`}`}>
                                        <BellRing className={`w-4 h-4 mt-0.5 shrink-0 ${style.color}`} />
                                        <div className="flex-1">
                                            <p className="text-slate-700 text-sm leading-snug">{n.msg}</p>
                                            <p className="text-slate-400 text-xs mt-1">{n.time}</p>
                                        </div>
                                        {!isRead && (
                                            <button onClick={() => markRead(n.id)} className="text-slate-300 hover:text-slate-500">
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default NotificationsPanel