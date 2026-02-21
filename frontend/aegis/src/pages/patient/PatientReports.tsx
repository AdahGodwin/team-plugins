import { useState } from 'react'
import { MOCK_NOTIFICATIONS } from '../../components/patient/data/mockData'
import Sidebar          from '../../components/patient/layout/Sidebar'
import MobileSidebar    from '../../components/patient/layout/MobileSidebar'
import TopBar           from '../../components/patient/layout/TopBar'
import BottomNav        from '../../components/patient/layout/BottomNav'
import ReportStatCards  from '../../components/patient/reports/ReportStatCards'
import ReportBPChart    from '../../components/patient/reports/ReportBPChart'
import ReportHighlights from '../../components/patient/reports/ReportHighlights'
import ReportList       from '../../components/patient/reports/ReportList'
import { Activity, FileText, Calendar } from 'lucide-react'

export default function PatientReports() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [activeTab,   setActiveTab]   = useState<'overview' | 'reports'>('overview')
    const unreadCount = MOCK_NOTIFICATIONS.length

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            <Sidebar unreadCount={unreadCount} />
            {sidebarOpen && (
                <MobileSidebar onClose={() => setSidebarOpen(false)} unreadCount={unreadCount} />
            )}

            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen pb-20 lg:pb-0">
                <TopBar onMenuClick={() => setSidebarOpen(true)} unreadCount={unreadCount} />

                <main className="flex-1 p-4 sm:p-6 max-w-5xl mx-auto w-full space-y-4 sm:space-y-6">

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">Health Reports</h1>
                            <p className="text-slate-400 text-xs sm:text-sm mt-1">
                                View, download and share your health summaries
                            </p>
                        </div>
                        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm self-start sm:self-auto">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-600 font-semibold text-sm">Feb 2026</span>
                        </div>
                    </div>

                    {/* Stat cards */}
                    <ReportStatCards />

                    {/* Tab switcher */}
                    <div className="flex gap-1 bg-white border border-slate-200 rounded-2xl p-1.5 shadow-sm">
                        {([
                            { id: 'overview', label: 'Health Overview', icon: Activity  },
                            { id: 'reports',  label: 'All Reports',     icon: FileText  },
                        ] as const).map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                onClick={() => setActiveTab(id)}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                                    activeTab === id
                                        ? 'bg-linear-to-r from-blue-500 to-teal-500 text-white shadow-sm'
                                        : 'text-slate-500 hover:bg-slate-50'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Tab content */}
                    {activeTab === 'overview' && (
                        <div className="space-y-4 sm:space-y-6">
                            <ReportBPChart    />
                            <ReportHighlights />
                        </div>
                    )}

                    {activeTab === 'reports' && <ReportList />}

                </main>
            </div>

            <BottomNav unreadCount={unreadCount} />
        </div>
    )
}