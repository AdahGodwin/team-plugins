import {
    LayoutDashboard, ClipboardList, MessageCircle, FileText, Bell,
} from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
    { label: 'Dashboard', icon: LayoutDashboard, id: 'dashboard', path: '/dashboard' },
    { label: 'Daily Log', icon: ClipboardList, id: 'log', path: '/dashboard/log' },
    { label: 'Chat', icon: MessageCircle, id: 'chat', path: '/dashboard/chat' },
    { label: 'Reports', icon: FileText, id: 'reports', path: '/dashboard/reports' },
    { label: 'Notifs', icon: Bell, id: 'notifications', path: '/dashboard/notifications' },
]

interface BottomNavProps {
    unreadCount: number  // ← activeNav & onNavChange removed
}

const BottomNav = ({ unreadCount }: BottomNavProps) => {
    const navigate = useNavigate()
    const location = useLocation()

    return (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-2 z-30 shadow-lg">
            <div className="flex items-center justify-around">
                {NAV_ITEMS.map(({ label, icon: Icon, id, path }) => {
                    const isActive = location.pathname === path
                    return (
                        <button
                            key={id}
                            onClick={() => navigate(path)}
                            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all relative ${isActive ? 'text-emerald-700 font-bold' : 'text-slate-400'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="text-[10px] font-semibold">{label}</span>
                            {label === 'Notifs' && unreadCount > 0 && (
                                <span className="absolute top-0 right-1 w-3.5 h-3.5 bg-amber-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                                    {unreadCount}
                                </span>
                            )}
                            {isActive && (
                                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-500" />
                            )}
                        </button>
                    )
                })}
            </div>
        </nav>
    )
}

export default BottomNav