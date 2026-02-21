import { ShieldCheck, LogOut, X } from 'lucide-react'
import {
    LayoutDashboard, ClipboardList, MessageCircle,
    FileText, Bell, Settings,
} from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

const ICON_MAP = {
    LayoutDashboard, ClipboardList, MessageCircle,
    FileText, Bell, Settings,
}

const NAV_ITEMS = [
    { label: 'Dashboard',     icon: 'LayoutDashboard', id: 'dashboard',     path: '/patient/dashboard'     },
    { label: 'Daily Log',     icon: 'ClipboardList',   id: 'log',           path: '/patient/log'           },
    { label: 'Chat',          icon: 'MessageCircle',   id: 'chat',          path: '/patient/chat'          },
    { label: 'Reports',       icon: 'FileText',        id: 'reports',       path: '/patient/reports'       },
    { label: 'Notifications', icon: 'Bell',            id: 'notifications', path: '/patient/notifications' },
    { label: 'Settings',      icon: 'Settings',        id: 'settings',      path: '/patient/settings'      },
]

interface MobileSidebarProps {
    onClose: () => void      
    unreadCount: number
}

const MobileSidebar = ({ onClose, unreadCount }: MobileSidebarProps) => {
    const navigate = useNavigate()
    const location = useLocation()

    const handleNav = (path: string) => {
        navigate(path)   
        onClose()      
    }

    return (
        <div className="lg:hidden fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            <aside className="absolute left-0 top-0 h-full w-72 bg-white shadow-2xl flex flex-col">

                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-linear-to-br from-blue-500 to-teal-500 flex items-center justify-center shadow-sm">
                            <ShieldCheck className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-extrabold text-slate-800 tracking-tight">Aegis</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
                    >
                        <X className="w-4 h-4 text-slate-500" />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {NAV_ITEMS.map(({ label, icon, id, path }) => {
                        const Icon     = ICON_MAP[icon as keyof typeof ICON_MAP]
                        const isActive = location.pathname === path  
                        return (
                            <button
                                key={id}
                                onClick={() => handleNav(path)}     
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                                    isActive
                                        ? 'bg-blue-50 text-blue-600 border border-blue-100'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                                }`}
                            >
                                <Icon className="w-4 h-4 shrink-0" />
                                {label}
                                {label === 'Notifications' && unreadCount > 0 && (
                                    <span className="ml-auto bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>
                        )
                    })}
                </nav>

                {/* Logout */}
                <div className="px-3 py-4 border-t border-slate-100">
                    <button
                        onClick={() => navigate('/auth/login')}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all"
                    >
                        <LogOut className="w-4 h-4 shrink-0" />
                        Logout
                    </button>
                </div>

            </aside>
        </div>
    )
}

export default MobileSidebar