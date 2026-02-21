import { ShieldCheck, LogOut, Calendar } from 'lucide-react'
import {
    LayoutDashboard, ClipboardList, MessageCircle,
    FileText, Bell, Settings,
} from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { MOCK_PATIENT, RISK_CONFIG } from '../data/mockData'

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

interface SidebarProps {
    unreadCount: number
}

const Sidebar = ({ unreadCount }: SidebarProps) => {
    const navigate  = useNavigate()
    const location  = useLocation()
    const riskCfg   = RISK_CONFIG[MOCK_PATIENT.riskLevel]

    return (
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 shadow-sm shrink-0 fixed top-0 left-0 h-full z-40">

            {/* Brand */}
            <div className="flex items-center gap-2.5 px-6 py-5 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-linear-to-br from-blue-500 to-teal-500 flex items-center justify-center shadow-sm">
                    <ShieldCheck className="w-4 h-4 text-white" />
                </div>
                <span className="font-extrabold text-slate-800 tracking-tight">Aegis</span>
            </div>

            {/* Patient info */}
            <div className="px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                        {MOCK_PATIENT.name[0]}
                    </div>
                    <div>
                        <p className="text-slate-800 font-bold text-sm">{MOCK_PATIENT.fullName}</p>
                        <div className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${riskCfg.dot}`} />
                            <p className={`text-xs font-medium ${riskCfg.text}`}>{riskCfg.label}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {NAV_ITEMS.map(({ label, icon, id, path }) => {
                    const Icon     = ICON_MAP[icon as keyof typeof ICON_MAP]
                    const isActive = location.pathname === path
                    return (
                        <button
                            key={id}
                            onClick={() => navigate(path)}
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

            {/* Next appointment */}
            <div className="mx-3 mb-3 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-500" />
                    <p className="text-blue-700 text-xs font-bold">Next Appointment</p>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed">{MOCK_PATIENT.nextAppointment}</p>
            </div>

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
    )
}

export default Sidebar