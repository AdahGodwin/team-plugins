import { Link, useLocation } from 'react-router-dom'
import {
    ShieldCheck,
    LayoutDashboard,
    Users,
    AlertTriangle,
    ClipboardEdit,
    ChevronRight,
    LogOut,
} from 'lucide-react'

interface NavItem {
    label: string
    href: string
    Icon: React.ElementType
}

const navItems: NavItem[] = [
    { label: 'Overview', href: '/admin', Icon: LayoutDashboard },
    { label: 'Patients', href: '/admin/patients', Icon: Users },
    { label: 'Emergencies', href: '/admin/emergencies', Icon: AlertTriangle },
    { label: 'Update Record', href: '/admin/patients/update', Icon: ClipboardEdit },
]

interface AdminSidebarProps {
    onNavClick?: () => void
}

export default function AdminSidebar({ onNavClick }: AdminSidebarProps) {
    const { pathname } = useLocation()

    return (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="px-5 py-5 border-b border-slate-100 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center shadow-sm shrink-0">
                    <ShieldCheck className="w-4 h-4 text-white" />
                </div>
                <div>
                    <span className="font-extrabold text-slate-800 text-sm tracking-tight">Aegis</span>
                    <span className="ml-1.5 text-[10px] font-semibold bg-blue-50 text-blue-600 border border-blue-100 rounded-full px-2 py-0.5">
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
                        href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

                    return (
                        <Link
                            key={href}
                            to={href}
                            onClick={onNavClick}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${isActive
                                    ? 'bg-blue-50 text-blue-700 font-semibold'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <Icon
                                className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-500' : 'text-slate-400 group-hover:text-slate-600'
                                    }`}
                            />
                            {label}
                            {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-blue-400" />}
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
    )
}
