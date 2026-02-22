import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
    LayoutDashboard,
    Users,
    AlertTriangle,
    ClipboardEdit,
    ChevronRight,
    LogOut,
    Shield,
    AlertCircle,
} from 'lucide-react'
import { useLanguage } from '../../i18n/LanguageContext'
import { useAuth } from '../../context/AuthContext'

interface NavItem {
    label: string
    href: string
    Icon: React.ElementType
}

const navItems: NavItem[] = [
    { label: 'Overview', href: '/portal', Icon: LayoutDashboard },
    { label: 'Patients', href: '/portal/patients', Icon: Users },
    { label: 'Emergencies', href: '/portal/emergencies', Icon: AlertTriangle },
    { label: 'Update Record', href: '/portal/patients/update', Icon: ClipboardEdit },
]

interface AdminSidebarProps {
    onNavClick?: () => void
}

export default function AdminSidebar({ onNavClick }: AdminSidebarProps) {
    const { t } = useLanguage()
    const { pathname } = useLocation()
    const { logout, user } = useAuth()
    const [showLogoutModal, setShowLogoutModal] = useState(false)

    return (
        <aside className="bg-white border-r border-slate-200 w-64 fixed h-full left-0 top-0 z-50 hidden lg:block">
            <div className="flex flex-col h-full bg-white">
                {/* Logo */}
                <div className="px-5 py-6 border-b border-slate-100 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center shadow-sm shrink-0">
                        <Shield className="w-4.5 h-4.5 text-white" />
                    </div>
                    <div>
                        <span className="font-extrabold text-slate-800 text-sm tracking-tight">{t('admin.brand' as any)}</span>
                        <span className="ml-1.5 text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full px-2 py-0.5">
                            Admin
                        </span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 mb-2">
                        Navigation
                    </p>
                    {navItems.map(({ label, href, Icon }) => {
                        const isActive =
                            href === '/portal' ? pathname === '/portal' : pathname.startsWith(href)

                        return (
                            <Link
                                key={href}
                                to={href}
                                onClick={onNavClick}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${isActive
                                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                            >
                                <Icon
                                    className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-500' : 'text-slate-400 group-hover:text-slate-600'
                                        }`}
                                />
                                {label}
                                {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-emerald-400" />}
                            </Link>
                        )
                    })}
                </nav>

                {/* Footer */}
                <div className="px-3 py-4 border-t border-slate-100 space-y-1">
                    {/* User pill */}
                    {user && (
                        <div className="flex items-center gap-2.5 px-3 py-2 mb-1">
                            <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                {user.fullName?.[0]?.toUpperCase() ?? '?'}
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-semibold text-slate-800 truncate">{user.fullName}</p>
                                <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={() => setShowLogoutModal(true)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                    >
                        <LogOut className="w-4 h-4 shrink-0" />
                        Sign out
                    </button>
                </div>
            </div>

            {/* ── Logout confirmation modal ───────────────────────────────────── */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        onClick={() => setShowLogoutModal(false)}
                    />
                    {/* Card */}
                    <div className="relative bg-white rounded-2xl shadow-xl ring-1 ring-slate-200 w-full max-w-sm p-6 flex flex-col gap-5">
                        <div className="flex items-start gap-4">
                            <div className="w-11 h-11 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
                                <AlertCircle className="w-5 h-5 text-rose-500" />
                            </div>
                            <div>
                                <h2 className="font-bold text-slate-900 text-base">Sign out?</h2>
                                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                                    You'll be returned to the login screen. Any unsaved changes will be lost.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={logout}
                                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-sm font-semibold text-white hover:bg-rose-700 transition-colors"
                            >
                                Sign out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </aside>
    )
}
