import { Link, useLocation } from 'react-router-dom'
import {
    LayoutDashboard,
    Users,
    AlertTriangle,
    ClipboardEdit,
    ChevronRight,
    LogOut,
    Shield,
} from 'lucide-react'
import { useLanguage } from '../../i18n/LanguageContext'

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
                <div className="px-3 py-4 border-t border-slate-100">
                    <Link
                        to="/"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
                    >
                        <LogOut className="w-4 h-4 shrink-0" />
                        Back to site
                    </Link>
                </div>
            </div>
        </aside>
    )
}
