import { useState } from 'react'
import { useLocation, Outlet } from 'react-router-dom'
import { Menu, X, ChevronRight } from 'lucide-react'
import AdminSidebar from './AdminSidebar'

export default function AdminLayout() {
    const { pathname } = useLocation()
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    const closeDrawer = () => setIsDrawerOpen(false)

    // Build human-readable breadcrumb from the path, skipping "admin"
    const breadcrumbSegments = pathname.split('/').filter(Boolean).slice(1)

    return (
        <div className="min-h-screen bg-slate-50 flex overflow-x-hidden">
            {/* Desktop sidebar — fixed, hidden on mobile */}
            <aside className="hidden md:flex flex-col w-60 bg-white border-r border-slate-200 fixed inset-y-0 left-0 z-30">
                <AdminSidebar />
            </aside>

            {/* Mobile drawer overlay */}
            {isDrawerOpen && (
                <div className="md:hidden fixed inset-0 z-50 flex">
                    <div className="w-60 bg-white border-r border-slate-200 flex flex-col shrink-0">
                        <AdminSidebar onNavClick={closeDrawer} />
                    </div>
                    <div
                        className="flex-1 bg-slate-900/40 backdrop-blur-sm"
                        onClick={closeDrawer}
                    />
                </div>
            )}

            {/* Main column */}
            <div className="flex-1 md:ml-60 flex flex-col min-h-screen min-w-0">
                {/* Top bar */}
                <header className="sticky top-0 z-20 bg-white border-b border-slate-200 h-14 flex items-center px-3 sm:px-6 gap-2 overflow-hidden">
                    {/* Hamburger — mobile only */}
                    <button
                        className="md:hidden shrink-0 text-slate-500 hover:text-slate-800 transition-colors p-1"
                        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                        aria-label="Toggle sidebar"
                    >
                        {isDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>

                    {/* Breadcrumb — fills available space, truncates */}
                    <div className="flex items-center gap-1 text-sm text-slate-500 flex-1 min-w-0 overflow-hidden">
                        <span className="font-semibold text-slate-800 shrink-0">Admin</span>
                        {breadcrumbSegments.length > 0 && (
                            <>
                                <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                                <span className="truncate capitalize text-slate-600 text-xs sm:text-sm">
                                    {breadcrumbSegments.join(' / ')}
                                </span>
                            </>
                        )}
                    </div>

                    {/* Identity chip — always show avatar, show name only on sm+ */}
                    <div className="flex items-center gap-2 shrink-0">
                        <div className="hidden sm:block text-right">
                            <p className="text-xs font-semibold text-slate-800 leading-none">Dr. Admin</p>
                            <p className="text-[10px] text-slate-400">Clinical Coordinator</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            A
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-3 sm:p-5 lg:p-8 min-w-0">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
